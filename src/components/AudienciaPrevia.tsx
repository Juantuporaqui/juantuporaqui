// ============================================
// CHALADITA CASE-OPS - Audiencia Previa
// Secciones ordenadas para preparar audiencia
// ============================================

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { chaladitaDb } from '../db/chaladitaDb';
import type { SeccionAudiencia } from '../types/caseops';

interface AudienciaPreviaProps {
  procedimientoId: string;
  editable?: boolean;
}

export function AudienciaPrevia({ procedimientoId, editable = false }: AudienciaPreviaProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBullets, setEditBullets] = useState<string>('');

  const secciones = useLiveQuery(
    async () => {
      const data = await chaladitaDb.seccionesAudiencia
        .where('procedimientoId')
        .equals(procedimientoId)
        .toArray();
      return data.sort((a, b) => a.orden - b.orden);
    },
    [procedimientoId]
  );

  function handleEdit(seccion: SeccionAudiencia) {
    setEditingId(seccion.id);
    setEditBullets(seccion.bullets.join('\n'));
  }

  async function handleSave(seccion: SeccionAudiencia) {
    const newBullets = editBullets
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    await chaladitaDb.seccionesAudiencia.update(seccion.id, {
      bullets: newBullets,
      updatedAt: new Date().toISOString(),
    });

    setEditingId(null);
    setEditBullets('');
  }

  function handleCancel() {
    setEditingId(null);
    setEditBullets('');
  }

  if (!secciones || secciones.length === 0) {
    return (
      <div style={styles.empty}>
        No hay secciones de audiencia previa para este procedimiento.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.mainTitle}>Audiencia Previa</h3>

      <div style={styles.secciones}>
        {secciones.map((seccion, index) => (
          <div key={seccion.id} style={styles.seccion}>
            <div style={styles.seccionHeader}>
              <span style={styles.seccionNumero}>{index + 1}</span>
              <h4 style={styles.seccionTitulo}>{seccion.titulo}</h4>
              {editable && editingId !== seccion.id && (
                <button
                  onClick={() => handleEdit(seccion)}
                  style={styles.editBtn}
                  title="Editar"
                >
                  ✏️
                </button>
              )}
            </div>

            {editingId === seccion.id ? (
              <div style={styles.editArea}>
                <textarea
                  value={editBullets}
                  onChange={(e) => setEditBullets(e.target.value)}
                  style={styles.textarea}
                  rows={6}
                  placeholder="Un punto por línea..."
                />
                <div style={styles.editActions}>
                  <button onClick={handleCancel} style={styles.btnCancel}>
                    Cancelar
                  </button>
                  <button onClick={() => handleSave(seccion)} style={styles.btnSave}>
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <ul style={styles.bullets}>
                {seccion.bullets.map((bullet, i) => (
                  <li key={i} style={styles.bullet}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
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
  mainTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-primary, #f1f5f9)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--color-border, #334155)',
  },
  secciones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  seccion: {
    padding: '0.75rem',
    backgroundColor: 'var(--color-bg-tertiary, #0f172a)',
    borderRadius: '0.375rem',
    border: '1px solid var(--color-border, #334155)',
  },
  seccionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  seccionNumero: {
    width: '1.5rem',
    height: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: '#f59e0b',
    color: '#000',
    borderRadius: '50%',
  },
  seccionTitulo: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-primary, #f1f5f9)',
    margin: 0,
  },
  editBtn: {
    padding: '0.25rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    opacity: 0.7,
  },
  bullets: {
    margin: 0,
    paddingLeft: '1.25rem',
    listStyleType: 'disc',
  },
  bullet: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary, #94a3b8)',
    lineHeight: 1.6,
    marginBottom: '0.25rem',
  },
  editArea: {
    marginTop: '0.5rem',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '0.8125rem',
    backgroundColor: 'var(--color-bg-primary, #0f172a)',
    border: '1px solid var(--color-border, #334155)',
    borderRadius: '0.25rem',
    color: 'var(--color-text-primary, #f1f5f9)',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  editActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  btnCancel: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    backgroundColor: 'transparent',
    color: 'var(--color-text-muted, #64748b)',
    border: '1px solid var(--color-border, #334155)',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  btnSave: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    backgroundColor: '#22c55e',
    color: '#000',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--color-text-muted, #64748b)',
    fontSize: '0.875rem',
    backgroundColor: 'var(--color-bg-secondary, #1e293b)',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-border, #334155)',
  },
};

export default AudienciaPrevia;
