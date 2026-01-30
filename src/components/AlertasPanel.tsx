// ============================================
// CHALADITA CASE-OPS - Panel de Alertas
// Muestra hechos sin prueba, partidas sin soporte, tareas vencidas
// ============================================

import {
  useHechosSinPrueba,
  usePartidasSinSoporte,
  useTareasVencidas,
} from '../db/chaladitaRepos';

interface AlertasPanelProps {
  caseId?: string;
}

export function AlertasPanel({ caseId }: AlertasPanelProps) {
  const hechosSinPrueba = useHechosSinPrueba(caseId);
  const partidasSinSoporte = usePartidasSinSoporte(caseId);
  const tareasVencidas = useTareasVencidas(caseId);

  const totalAlertas =
    hechosSinPrueba.length + partidasSinSoporte.length + tareasVencidas.length;

  // Si no hay alertas, no renderizar nada
  if (totalAlertas === 0) {
    return null;
  }

  return (
    <div className="alertas-panel" style={styles.container}>
      <h3 style={styles.title}>
        Alertas ({totalAlertas})
      </h3>

      <div style={styles.grid}>
        {/* Hechos sin prueba */}
        {hechosSinPrueba.length > 0 && (
          <div style={{ ...styles.card, ...styles.cardWarning }}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>⚠️</span>
              <span style={styles.cardTitle}>
                Hechos sin prueba ({hechosSinPrueba.length})
              </span>
            </div>
            <ul style={styles.list}>
              {hechosSinPrueba.slice(0, 5).map((h) => (
                <li key={h.id} style={styles.listItem}>
                  <span style={styles.itemId}>{h.id}</span>
                  <span style={styles.itemText}>{h.titulo}</span>
                  <span style={styles.riesgo} data-riesgo={h.riesgo}>
                    {h.riesgo}
                  </span>
                </li>
              ))}
              {hechosSinPrueba.length > 5 && (
                <li style={styles.more}>
                  +{hechosSinPrueba.length - 5} más...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Partidas sin soporte */}
        {partidasSinSoporte.length > 0 && (
          <div style={{ ...styles.card, ...styles.cardInfo }}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>📄</span>
              <span style={styles.cardTitle}>
                Partidas sin soporte ({partidasSinSoporte.length})
              </span>
            </div>
            <ul style={styles.list}>
              {partidasSinSoporte.slice(0, 5).map((p) => (
                <li key={p.id} style={styles.listItem}>
                  <span style={styles.itemId}>{p.id}</span>
                  <span style={styles.itemText}>{p.concepto}</span>
                  <span style={styles.importe}>
                    {(p.importe / 100).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </li>
              ))}
              {partidasSinSoporte.length > 5 && (
                <li style={styles.more}>
                  +{partidasSinSoporte.length - 5} más...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Tareas vencidas */}
        {tareasVencidas.length > 0 && (
          <div style={{ ...styles.card, ...styles.cardDanger }}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>🔴</span>
              <span style={styles.cardTitle}>
                Tareas vencidas ({tareasVencidas.length})
              </span>
            </div>
            <ul style={styles.list}>
              {tareasVencidas.slice(0, 5).map((t) => (
                <li key={t.id} style={styles.listItem}>
                  <span style={styles.itemId}>{t.id}</span>
                  <span style={styles.itemText}>{t.titulo}</span>
                  <span style={styles.fecha}>{t.fechaLimite}</span>
                </li>
              ))}
              {tareasVencidas.length > 5 && (
                <li style={styles.more}>
                  +{tareasVencidas.length - 5} más...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos inline para no depender de Tailwind
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: 'var(--color-bg-secondary, #1e293b)',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-border, #334155)',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-primary, #f1f5f9)',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  grid: {
    display: 'grid',
    gap: '0.75rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  card: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: 'var(--color-bg-tertiary, #0f172a)',
  },
  cardWarning: {
    borderLeft: '3px solid #f59e0b',
  },
  cardInfo: {
    borderLeft: '3px solid #3b82f6',
  },
  cardDanger: {
    borderLeft: '3px solid #ef4444',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  icon: {
    fontSize: '1rem',
  },
  cardTitle: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--color-text-primary, #f1f5f9)',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary, #94a3b8)',
    padding: '0.25rem 0',
  },
  itemId: {
    fontFamily: 'monospace',
    fontSize: '0.6875rem',
    color: 'var(--color-text-muted, #64748b)',
    minWidth: '60px',
  },
  itemText: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  riesgo: {
    fontSize: '0.625rem',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    textTransform: 'uppercase',
  },
  importe: {
    fontSize: '0.6875rem',
    fontWeight: 500,
    color: '#3b82f6',
  },
  fecha: {
    fontSize: '0.6875rem',
    color: '#ef4444',
  },
  more: {
    fontSize: '0.6875rem',
    color: 'var(--color-text-muted, #64748b)',
    fontStyle: 'italic',
    paddingTop: '0.25rem',
  },
};

export default AlertasPanel;
