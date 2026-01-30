// ============================================
// CASE OPS - New Document Page
// ============================================

import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { documentsRepo, docFilesRepo } from '../../db/repositories';
import { sha256 } from '../../utils/hash';
import { getCurrentDate } from '../../utils/dates';
import type { DocType } from '../../types';

const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: 'demanda', label: 'Demanda' },
  { value: 'sentencia', label: 'Sentencia' },
  { value: 'prueba', label: 'Prueba' },
  { value: 'otros', label: 'Otro' },
];

export function NewDocumentPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('prueba');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    }
  }

  function handleDropzoneClick() {
    fileInputRef.current?.click();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!selectedFile) {
      alert('Selecciona un archivo');
      return;
    }

    setLoading(true);

    try {
      // Calculate file hash
      const fileHash = await sha256(selectedFile);

      // Check if file already exists (deduplication)
      let existingFile = await docFilesRepo.getByHash(fileHash);
      let fileId: string;

      if (existingFile) {
        fileId = existingFile.id;
      } else {
        // Save the file
        const docFile = await docFilesRepo.create({
          hashSha256: fileHash,
          filename: selectedFile.name,
          mime: selectedFile.type || 'application/octet-stream',
          size: selectedFile.size,
          blob: selectedFile,
        });
        fileId = docFile.id;
      }

      // Create document record
      await documentsRepo.create({
        caseId: '', // Sin caso asociado por defecto
        title: title.trim(),
        docType,
        source: '',
        docDate: getCurrentDate(),
        tags: [],
        hashSha256: fileHash,
        fileId,
        pagesCount: 0,
        notes: '',
      });

      navigate('/documents');
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Error al crear el documento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
        >
          <span>←</span>
          <span>Volver a Documentos</span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-100">Nuevo Documento</h1>
        <p className="text-sm text-slate-400 mt-1">
          Sube un documento al War Room
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Título */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-300"
          >
            Título del Documento *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Contrato de arrendamiento"
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Tipo de Documento */}
        <div className="space-y-2">
          <label
            htmlFor="docType"
            className="block text-sm font-medium text-slate-300"
          >
            Tipo de Documento
          </label>
          <select
            id="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocType)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
          >
            {DOC_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Archivo *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
          />

          <div
            onClick={handleDropzoneClick}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 cursor-pointer transition-all ${
              selectedFile
                ? 'border-blue-500 bg-blue-500/5'
                : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
            }`}
          >
            {selectedFile ? (
              <>
                <div className="text-4xl mb-3">📄</div>
                <p className="text-sm font-medium text-slate-200">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="mt-3 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Quitar archivo
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3 text-slate-600">📎</div>
                <p className="text-sm font-medium text-slate-400">
                  Haz clic para seleccionar un archivo
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  PDF, DOC, DOCX, JPG, PNG, TXT
                </p>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Subiendo...' : 'Subir Documento'}
          </button>
        </div>
      </form>
    </div>
  );
}
