// ============================================
// CASE OPS - Document Form Page (Create/Edit)
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsRepo, docFilesRepo, casesRepo } from '../../db/repositories';
import { sha256 } from '../../utils/hash';
import { formatBytes, isPDF } from '../../utils/validators';
import { getCurrentDate } from '../../utils/dates';
import type { Document, Case, DocType } from '../../types';
import * as pdfjsLib from 'pdfjs-dist';

const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: 'demanda', label: 'Demanda' },
  { value: 'contestacion', label: 'Contestación' },
  { value: 'prueba', label: 'Prueba' },
  { value: 'sentencia', label: 'Sentencia' },
  { value: 'auto', label: 'Auto' },
  { value: 'escrito', label: 'Escrito' },
  { value: 'comunicacion', label: 'Comunicación' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'factura', label: 'Factura' },
  { value: 'extracto', label: 'Extracto bancario' },
  { value: 'informe', label: 'Informe' },
  { value: 'otros', label: 'Otros' },
];

export function DocumentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!id;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    caseId: '',
    title: '',
    docType: 'prueba' as DocType,
    source: '',
    docDate: getCurrentDate(),
    annexCode: '',
    notes: '',
    tags: '',
  });

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [pagesCount, setPagesCount] = useState(0);
  const [existingFileId, setExistingFileId] = useState('');

  useEffect(() => {
    loadInitialData();
  }, [id]);

  async function loadInitialData() {
    setLoading(true);
    try {
      // Load cases
      const allCases = await casesRepo.getAll();
      setCases(allCases);

      // Set default case if only one
      if (allCases.length === 1) {
        setFormData((prev) => ({ ...prev, caseId: allCases[0].id }));
      }

      // Load document if editing
      if (id) {
        const doc = await documentsRepo.getById(id);
        if (doc) {
          setFormData({
            caseId: doc.caseId,
            title: doc.title,
            docType: doc.docType,
            source: doc.source,
            docDate: doc.docDate,
            annexCode: doc.annexCode || '',
            notes: doc.notes,
            tags: doc.tags.join(', '),
          });
          setFileHash(doc.hashSha256);
          setPagesCount(doc.pagesCount);
          setExistingFileId(doc.fileId);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPDF(file)) {
      alert('Solo se permiten archivos PDF');
      return;
    }

    setUploading(true);
    setUploadProgress('Calculando hash...');

    try {
      // Calculate hash
      const hash = await sha256(file);
      setFileHash(hash);
      setSelectedFile(file);

      // Check if file already exists
      const existingFile = await docFilesRepo.getByHash(hash);
      if (existingFile) {
        setUploadProgress('Archivo ya existe (se reutilizará)');
        setExistingFileId(existingFile.id);
      } else {
        setUploadProgress('Contando páginas...');
      }

      // Count pages
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPagesCount(pdf.numPages);

      // Set title from filename if empty
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
        setFormData((prev) => ({ ...prev, title: nameWithoutExt }));
      }

      setUploadProgress(`${pdf.numPages} páginas · ${formatBytes(file.size)}`);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error al procesar el archivo PDF');
      setSelectedFile(null);
      setFileHash('');
      setPagesCount(0);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.caseId) {
      alert('Selecciona un caso');
      return;
    }

    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!isEditing && !selectedFile && !existingFileId) {
      alert('Selecciona un archivo PDF');
      return;
    }

    setLoading(true);

    try {
      let fileId = existingFileId;

      // Upload file if new
      if (selectedFile && !existingFileId) {
        setUploadProgress('Guardando archivo...');
        const docFile = await docFilesRepo.create({
          hashSha256: fileHash,
          filename: selectedFile.name,
          mime: 'application/pdf',
          size: selectedFile.size,
          blob: selectedFile,
        });
        fileId = docFile.id;
      }

      const documentData = {
        caseId: formData.caseId,
        title: formData.title.trim(),
        docType: formData.docType,
        source: formData.source.trim(),
        docDate: formData.docDate,
        annexCode: formData.annexCode.trim() || undefined,
        notes: formData.notes.trim(),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        hashSha256: fileHash,
        fileId,
        pagesCount,
      };

      if (isEditing) {
        await documentsRepo.update(id!, documentData);
      } else {
        await documentsRepo.create(documentData);
      }

      navigate('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Error al guardar el documento');
    } finally {
      setLoading(false);
    }
  }

  if (loading && isEditing) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1 }}>
          {isEditing ? 'Editar documento' : 'Nuevo documento'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* File Upload (only for new documents) */}
        {!isEditing && (
          <div className="card mb-md">
            <div className="card-body">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {!selectedFile && !existingFileId ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-block btn-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  📎 Seleccionar PDF
                </button>
              ) : (
                <div className="flex items-center gap-md">
                  <span style={{ fontSize: '2rem' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <p className="font-bold">
                      {selectedFile?.name || 'Archivo existente'}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {uploadProgress}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => {
                      setSelectedFile(null);
                      setFileHash('');
                      setPagesCount(0);
                      setExistingFileId('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="card">
          <div className="card-body">
            {/* Case */}
            <div className="form-group">
              <label className="form-label">Caso *</label>
              <select
                className="form-select"
                value={formData.caseId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, caseId: e.target.value }))
                }
                required
              >
                <option value="">Seleccionar caso...</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ej: Escritura de compraventa vivienda"
                required
              />
            </div>

            {/* Doc Type */}
            <div className="form-group">
              <label className="form-label">Tipo de documento</label>
              <select
                className="form-select"
                value={formData.docType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    docType: e.target.value as DocType,
                  }))
                }
              >
                {DOC_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Annex Code */}
            <div className="form-group">
              <label className="form-label">Código de anexo</label>
              <input
                type="text"
                className="form-input"
                value={formData.annexCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, annexCode: e.target.value }))
                }
                placeholder="Ej: A-1, Doc. 3..."
              />
              <p className="form-hint">
                Referencia para el procedimiento (A-1, Doc. 3...)
              </p>
            </div>

            {/* Source */}
            <div className="form-group">
              <label className="form-label">Fuente</label>
              <input
                type="text"
                className="form-input"
                value={formData.source}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, source: e.target.value }))
                }
                placeholder="Ej: Notaría García, AEAT, Cliente..."
              />
            </div>

            {/* Doc Date */}
            <div className="form-group">
              <label className="form-label">Fecha del documento</label>
              <input
                type="date"
                className="form-input"
                value={formData.docDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, docDate: e.target.value }))
                }
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <input
                type="text"
                className="form-input"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Separadas por comas: hipoteca, chalet, 2020"
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Observaciones sobre el documento..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-lg">
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading || uploading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear documento'}
          </button>
        </div>
      </form>
    </div>
  );
}
