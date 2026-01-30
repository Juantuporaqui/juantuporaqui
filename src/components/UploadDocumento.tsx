// ============================================
// CHALADITA CASE-OPS - Upload Documento
// Subida REAL de archivos con Blob (offline)
// ============================================

import { useState, useRef } from 'react';
import { chaladitaDb } from '../db/chaladitaDb';
import { generateUUID } from '../utils/id';
import type { DocumentoSubido } from '../types/caseops';

interface UploadDocumentoProps {
  procedimientoId: string;
  onSuccess?: (doc: DocumentoSubido) => void;
  onCancel?: () => void;
}

export function UploadDocumento({ procedimientoId, onSuccess, onCancel }: UploadDocumentoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }

  async function handleSave() {
    if (!file) {
      setError('Selecciona un archivo');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const docSubido: DocumentoSubido = {
        id: `docup-${generateUUID().slice(0, 8)}`,
        procedimientoId,
        nombre: file.name,
        tipoMime: file.type || 'application/octet-stream',
        tamano: file.size,
        fecha: now.split('T')[0],
        descripcion: descripcion.trim() || undefined,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        blob: file, // File extiende Blob
        createdAt: now,
      };

      await chaladitaDb.documentosSubidos.add(docSubido);

      // Reset form
      setFile(null);
      setDescripcion('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onSuccess?.(docSubido);
    } catch (err) {
      console.error('Error guardando documento:', err);
      setError('Error al guardar el documento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Subir Documento</h4>

      <div style={styles.formGroup}>
        <label style={styles.label}>Archivo *</label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        {file && (
          <div style={styles.fileInfo}>
            <span style={styles.fileName}>{file.name}</span>
            <span style={styles.fileSize}>
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Descripción</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Breve descripción del documento..."
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tags (separados por comas)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="extracto, banco, 2024..."
          style={styles.input}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.actions}>
        {onCancel && (
          <button onClick={onCancel} style={styles.btnSecondary} disabled={saving}>
            Cancelar
          </button>
        )}
        <button onClick={handleSave} style={styles.btnPrimary} disabled={saving || !file}>
          {saving ? 'Guardando...' : 'Guardar Documento'}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '1rem',
    backgroundColor: 'var(--color-bg-secondary, #1e293b)',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-border, #334155)',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-primary, #f1f5f9)',
    margin: 0,
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '0.75rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary, #94a3b8)',
    marginBottom: '0.25rem',
  },
  fileInput: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'var(--color-bg-primary, #0f172a)',
    border: '1px solid var(--color-border, #334155)',
    borderRadius: '0.375rem',
    color: 'var(--color-text-primary, #f1f5f9)',
  },
  fileInfo: {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted, #64748b)',
  },
  fileName: {
    color: '#22c55e',
    marginRight: '0.5rem',
  },
  fileSize: {
    color: 'var(--color-text-muted, #64748b)',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    backgroundColor: 'var(--color-bg-primary, #0f172a)',
    border: '1px solid var(--color-border, #334155)',
    borderRadius: '0.375rem',
    color: 'var(--color-text-primary, #f1f5f9)',
    outline: 'none',
  },
  error: {
    padding: '0.5rem',
    marginBottom: '0.75rem',
    fontSize: '0.75rem',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '0.25rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    backgroundColor: '#f59e0b',
    color: '#000',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary, #94a3b8)',
    border: '1px solid var(--color-border, #334155)',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  },
};

export default UploadDocumento;
