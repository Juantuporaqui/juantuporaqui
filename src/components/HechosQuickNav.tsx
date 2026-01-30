// ============================================
// CHALADITA CASE-OPS - Hechos Quick Nav
// Botones estilo app móvil para navegar hechos
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { chaladitaDb } from '../db/chaladitaDb';
import type { HechoCase, Riesgo } from '../types/caseops';

interface HechosQuickNavProps {
  procedimientoId: string;
}

const riesgoConfig: Record<Riesgo, { bg: string; border: string; text: string; icon: string }> = {
  bajo: { bg: '#065f46', border: '#10b981', text: '#6ee7b7', icon: '✓' },
  medio: { bg: '#78350f', border: '#f59e0b', text: '#fcd34d', icon: '!' },
  alto: { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5', icon: '⚠' },
};

const fuerzaStars = (fuerza: number) => '★'.repeat(fuerza) + '☆'.repeat(5 - fuerza);

export function HechosQuickNav({ procedimientoId }: HechosQuickNavProps) {
  const [selectedHecho, setSelectedHecho] = useState<HechoCase | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const hechos = useLiveQuery(
    () => chaladitaDb.hechos.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  );

  // Ordenar por riesgo (alto primero) y luego por fuerza
  const hechosSorted = hechos?.slice().sort((a, b) => {
    const riesgoOrder = { alto: 0, medio: 1, bajo: 2 };
    if (riesgoOrder[a.riesgo] !== riesgoOrder[b.riesgo]) {
      return riesgoOrder[a.riesgo] - riesgoOrder[b.riesgo];
    }
    return b.fuerza - a.fuerza;
  });

  // Scroll al detalle cuando se selecciona
  useEffect(() => {
    if (selectedHecho && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedHecho]);

  if (!hechosSorted || hechosSorted.length === 0) {
    return (
      <div style={styles.empty}>
        No hay hechos para este procedimiento.
      </div>
    );
  }

  // Solo mostrar los más importantes (riesgo alto/medio o fuerza >= 3)
  const hechosDestacados = hechosSorted.filter(
    (h) => h.riesgo === 'alto' || h.riesgo === 'medio' || h.fuerza >= 3
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Reclamaciones</h3>
        <span style={styles.badge}>{hechosDestacados.length} destacados</span>
      </div>

      {/* Grid de botones estilo app móvil */}
      <div style={styles.buttonGrid}>
        {hechosDestacados.map((hecho) => {
          const config = riesgoConfig[hecho.riesgo];
          const isSelected = selectedHecho?.id === hecho.id;
          return (
            <button
              key={hecho.id}
              onClick={() => setSelectedHecho(isSelected ? null : hecho)}
              style={{
                ...styles.navButton,
                backgroundColor: isSelected ? config.border : config.bg,
                borderColor: config.border,
                color: isSelected ? '#000' : config.text,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <span style={styles.buttonIcon}>{config.icon}</span>
              <span style={styles.buttonRef}>{hecho.id}</span>
              <span style={styles.buttonTitle}>{hecho.titulo.slice(0, 25)}{hecho.titulo.length > 25 ? '...' : ''}</span>
              <span style={styles.buttonFuerza}>{fuerzaStars(hecho.fuerza)}</span>
            </button>
          );
        })}
      </div>

      {/* Ver todos */}
      {hechosSorted.length > hechosDestacados.length && (
        <div style={styles.verMas}>
          <span style={styles.verMasText}>
            +{hechosSorted.length - hechosDestacados.length} hechos más
          </span>
        </div>
      )}

      {/* Panel de detalle expandido */}
      {selectedHecho && (
        <div ref={detailRef} style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            <div style={styles.detailBadges}>
              <span style={{
                ...styles.riesgoBadge,
                backgroundColor: riesgoConfig[selectedHecho.riesgo].bg,
                borderColor: riesgoConfig[selectedHecho.riesgo].border,
                color: riesgoConfig[selectedHecho.riesgo].text,
              }}>
                {selectedHecho.riesgo.toUpperCase()}
              </span>
              <span style={styles.fechaBadge}>{selectedHecho.fecha}</span>
              <span style={styles.idBadge}>{selectedHecho.id}</span>
            </div>
            <button onClick={() => setSelectedHecho(null)} style={styles.closeBtn}>✕</button>
          </div>

          <h4 style={styles.detailTitle}>{selectedHecho.titulo}</h4>
          <p style={styles.detailResumen}>{selectedHecho.resumenCorto}</p>

          <div style={styles.detailSection}>
            <h5 style={styles.sectionLabel}>Nuestra Tesis</h5>
            <p style={styles.sectionText}>{selectedHecho.tesis}</p>
          </div>

          <div style={styles.detailSection}>
            <h5 style={{ ...styles.sectionLabel, color: '#f87171' }}>Antítesis Esperada</h5>
            <p style={styles.sectionText}>{selectedHecho.antitesisEsperada}</p>
          </div>

          {selectedHecho.pruebasEsperadas.length > 0 && (
            <div style={styles.detailSection}>
              <h5 style={{ ...styles.sectionLabel, color: '#fbbf24' }}>Pruebas ({selectedHecho.pruebasEsperadas.length})</h5>
              <ul style={styles.pruebasList}>
                {selectedHecho.pruebasEsperadas.map((p, i) => (
                  <li key={i} style={styles.pruebaItem}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={styles.detailFooter}>
            <span style={styles.fuerzaLabel}>Fuerza: </span>
            <span style={styles.fuerzaStars}>{fuerzaStars(selectedHecho.fuerza)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '1rem',
    backgroundColor: '#0f172a',
    borderRadius: '0.75rem',
    border: '1px solid #334155',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#f1f5f9',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: 0,
  },
  badge: {
    fontSize: '0.625rem',
    fontWeight: 600,
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '0.5rem',
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    minHeight: '80px',
  },
  buttonIcon: {
    fontSize: '1rem',
    marginBottom: '0.25rem',
  },
  buttonRef: {
    fontSize: '0.5rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: 0.8,
    marginBottom: '0.125rem',
  },
  buttonTitle: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    lineHeight: 1.3,
    marginBottom: 'auto',
  },
  buttonFuerza: {
    fontSize: '0.5rem',
    marginTop: '0.25rem',
    opacity: 0.7,
  },
  verMas: {
    marginTop: '0.75rem',
    textAlign: 'center',
  },
  verMasText: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  detailPanel: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#1e293b',
    borderRadius: '0.75rem',
    border: '1px solid #475569',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  detailBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  riesgoBadge: {
    fontSize: '0.625rem',
    fontWeight: 700,
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    border: '1px solid',
  },
  fechaBadge: {
    fontSize: '0.625rem',
    fontWeight: 500,
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    backgroundColor: '#334155',
    color: '#94a3b8',
  },
  idBadge: {
    fontSize: '0.625rem',
    fontWeight: 600,
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    backgroundColor: '#0f172a',
    color: '#64748b',
    fontFamily: 'monospace',
  },
  closeBtn: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    color: '#64748b',
    border: 'none',
    cursor: 'pointer',
  },
  detailTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f1f5f9',
    margin: '0 0 0.5rem 0',
  },
  detailResumen: {
    fontSize: '0.8125rem',
    color: '#cbd5e1',
    margin: '0 0 1rem 0',
    lineHeight: 1.5,
  },
  detailSection: {
    marginBottom: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#0f172a',
    borderRadius: '0.5rem',
  },
  sectionLabel: {
    fontSize: '0.625rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#10b981',
    margin: '0 0 0.375rem 0',
  },
  sectionText: {
    fontSize: '0.8125rem',
    color: '#e2e8f0',
    margin: 0,
    lineHeight: 1.5,
  },
  pruebasList: {
    margin: 0,
    paddingLeft: '1rem',
    listStyleType: 'disc',
  },
  pruebaItem: {
    fontSize: '0.75rem',
    color: '#cbd5e1',
    marginBottom: '0.25rem',
  },
  detailFooter: {
    marginTop: '0.75rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #334155',
    textAlign: 'right',
  },
  fuerzaLabel: {
    fontSize: '0.625rem',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  fuerzaStars: {
    fontSize: '0.75rem',
    color: '#fbbf24',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.875rem',
    backgroundColor: '#1e293b',
    borderRadius: '0.5rem',
    border: '1px solid #334155',
  },
};

export default HechosQuickNav;
