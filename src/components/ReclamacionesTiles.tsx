// ============================================
// CHALADITA CASE-OPS - Reclamaciones Tiles
// Visualización de reclamaciones en grid
// ============================================

import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { chaladitaDb } from '../db/chaladitaDb';
import type { GanabilidadReclamacion } from '../types/caseops';

interface ReclamacionesTilesProps {
  procedimientoId: string | number; // Aceptamos string o número para evitar errores
}

const ganabilidadColors: Record<GanabilidadReclamacion, { bg: string; text: string; border: string }> = {
  alta: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: '#22c55e' },
  media: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' },
  baja: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: '#ef4444' },
};

export function ReclamacionesTiles({ procedimientoId }: ReclamacionesTilesProps) {
  const navigate = useNavigate();

  const reclamaciones = useLiveQuery(
    () =>
      chaladitaDb.reclamacionesVisuales
        .where('procedimientoId')
        .equals(procedimientoId)
        .toArray(),
    [procedimientoId]
  );

  if (!reclamaciones || reclamaciones.length === 0) {
    return (
      <div style={styles.empty}>
        No hay reclamaciones visuales para este procedimiento.
      </div>
    );
  }

  const total = reclamaciones.reduce((sum, r) => sum + r.cantidad, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Reclamaciones (Hechos)</h3>
        <span style={styles.total}>
          Total: {(total / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </span>
      </div>

      <div style={styles.grid}>
        {reclamaciones.map((rec) => {
          const colors = ganabilidadColors[rec.ganabilidad];
          return (
            <div
              key={rec.id}
              style={{
                ...styles.tile,
                borderColor: colors.border,
                backgroundColor: colors.bg,
              }}
              // Navegación al detalle del hecho
              onClick={() => navigate(`/facts/${rec.id}`)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.tileLabel}>{rec.label}</div>
              <div style={styles.tileCantidad}>
                {(rec.cantidad / 100).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                })}
              </div>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {rec.ganabilidad}
              </span>
            </div>
          );
        })}
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
    marginTop: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-primary, #f1f5f9)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  total: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#22c55e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '0.75rem',
  },
  tile: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    userSelect: 'none',
  },
  tileLabel: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary, #94a3b8)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tileCantidad: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--color-text-primary, #f1f5f9)',
    marginBottom: '0.5rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.625rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    border: '1px solid',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--color-text-muted, #64748b)',
    fontSize: '0.875rem',
    border: '1px dashed #334155',
    borderRadius: '0.5rem',
    marginTop: '1rem',
  },
};

export default ReclamacionesTiles;
