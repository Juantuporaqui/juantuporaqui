// ============================================
// CHALADITA CASE-OPS - VISTA DE DETALLE ESTRATÉGICA (FINAL)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Chips, Modal } from '../../components';
import { factsRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import { chaladitaDb } from '../../db/chaladitaDb';
import { formatDateTime } from '../../utils/dates';
import { hechosReclamados, type HechoReclamado } from '../../data/hechosReclamados';

// Mapeo de etiquetas para que se vean bonitas
const STATUS_LABELS: Record<string, string> = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const RISK_LABELS: Record<string, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

const BURDEN_LABELS: Record<string, string> = {
  actora: 'Actora',
  demandado: 'Demandado',
  mixta: 'Mixta',
};

export function FactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estado local
  const [fact, setFact] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) loadFact(id);
  }, [id]);

  async function loadFact(factId: string) {
    try {
      setLoading(true);

      // PASO 0: Si es un ID numérico simple (1-10), buscar en hechosReclamados (datos del caso Picassent)
      const numericId = parseInt(factId);
      if (!isNaN(numericId) && numericId >= 1 && numericId <= 10) {
        const hechoReclamado = hechosReclamados.find(h => h.id === numericId);
        if (hechoReclamado) {
          const factFromHechos = {
            id: String(hechoReclamado.id),
            title: hechoReclamado.titulo,
            narrative: hechoReclamado.realidadHechos,
            status: hechoReclamado.estado === 'disputa' ? 'controvertido' :
                    hechoReclamado.estado === 'prescrito' ? 'admitido' : 'a_probar',
            burden: 'actora',
            risk: hechoReclamado.cuantia > 50000 ? 'alto' : hechoReclamado.cuantia > 20000 ? 'medio' : 'bajo',
            strength: hechoReclamado.estado === 'prescrito' ? 5 : hechoReclamado.estado === 'compensable' ? 4 : 2,
            tags: [hechoReclamado.estado, `${hechoReclamado.año}`],
            caseId: 'CAS001',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // DATOS ESTRATÉGICOS COMPLETOS
            tesis: hechoReclamado.realidadHechos,
            antitesis: hechoReclamado.hechoActora,
            pruebasText: hechoReclamado.oposicion || [],
            customAmount: `${hechoReclamado.cuantia.toLocaleString('es-ES')}€`,
            // DATOS ADICIONALES DEL HECHO
            estrategia: hechoReclamado.estrategia,
            documentosRef: hechoReclamado.documentosRef,
            tareas: hechoReclamado.tareas,
            vinculadoA: hechoReclamado.vinculadoA,
            hechoActora: hechoReclamado.hechoActora,
            estado: hechoReclamado.estado,
            año: hechoReclamado.año,
            cuantia: hechoReclamado.cuantia,
          };
          setFact(factFromHechos);
          setEvidence([]); // Los documentos se mostrarán de otra forma
          setLoading(false);
          return;
        }
      }

      // PASO 1: Buscar en el sistema antiguo
      let factData = await factsRepo.getById(factId);
      let isFromNewDb = false;

      // PASO 2: Si no está, buscar en el sistema nuevo (chaladitaDb)
      if (!factData) {
        const newFact = await chaladitaDb.hechos.get(factId);
        if (newFact) {
          isFromNewDb = true;
          // Transformamos los datos nuevos para usarlos en la vista
          factData = {
            id: newFact.id,
            title: newFact.titulo,
            narrative: newFact.resumenCorto,
            status: 'controvertido', // Default
            burden: 'mixta',         // Default
            risk: newFact.riesgo,
            strength: newFact.fuerza,
            tags: newFact.tags || [],
            caseId: newFact.procedimientoId,
            createdAt: new Date(newFact.createdAt).getTime(),
            updatedAt: new Date(newFact.updatedAt).getTime(),

            // --- DATOS DEL DESGLOSE ESTRATÉGICO ---
            tesis: newFact.tesis,
            antitesis: newFact.antitesisEsperada,
            pruebasText: newFact.pruebasEsperadas || [],
            customAmount: newFact.titulo.includes('€') ? newFact.titulo.match(/\d+(?:[.,]\d+)?€/)?.[0] : null
          };
        }
      }

      if (!factData) {
        setFact(null);
        return;
      }

      setFact(factData);

      // PASO 3: Cargar Evidencias / Documentos
      const evidenceData = [];
      if (!isFromNewDb) {
        // Lógica antigua (enlaces manuales)
        const evidenceLinks = await linksRepo.getEvidenceForFact(factId);
        for (const link of evidenceLinks) {
          const span = await spansRepo.getById(link.fromId);
          if (span) {
            const doc = await documentsRepo.getById(span.documentId);
            if (doc) evidenceData.push({ link, span, document: doc });
          }
        }
      } else {
        // Lógica nueva (documentos por procedimiento)
        if (factData.caseId) {
             const docs = await chaladitaDb.documentos
                .where('procedimientoId').equals(factData.caseId)
                .limit(10)
                .toArray();
            
            // Filtramos para mostrar lo relevante
            const relevantDocs = docs.filter(d => 
                d.hechosIds?.includes(factData.id) || d.tipo === 'demanda' || d.tipo === 'contestacion'
            );
            // Si no hay específicos, mostramos algunos generales para no dejarlo vacío
            const docsToShow = relevantDocs.length > 0 ? relevantDocs : docs.slice(0, 3);

            for (const doc of docsToShow) {
                evidenceData.push({
                    link: { id: `lnk-virt-${doc.id}` },
                    span: { label: 'Documento relacionado', pageStart: 1, pageEnd: 1 },
                    document: { id: doc.id, title: doc.descripcion || doc.tipo }
                });
            }
        }
      }
      setEvidence(evidenceData);

    } catch (error) {
      console.error('Error cargando hecho:', error);
    } finally {
      setLoading(false);
    }
  }

  // Borrar hecho
  async function handleDelete() {
    if (!fact) return;
    try {
      await linksRepo.deleteByEntity('fact', fact.id);
      await factsRepo.delete(fact.id);
      if (fact.id) await chaladitaDb.hechos.delete(fact.id); // Borrar también de nueva DB
      navigate('/facts');
    } catch (error) { console.error(error); }
  }

  // Quitar evidencia de la lista
  async function handleRemoveEvidence(linkId: string) {
    try {
        if (linkId.startsWith('lnk-virt-')) {
             setEvidence(evidence.filter((e) => e.link.id !== linkId));
             return;
        }
      await linksRepo.delete(linkId);
      setEvidence(evidence.filter((e) => e.link.id !== linkId));
    } catch (error) { console.error(error); }
  }

  // --- RENDERIZADO VISUAL ---

  if (loading) return <div className="page"><div className="flex justify-center p-md"><div className="spinner" /></div></div>;
  if (!fact) return <div className="page"><div className="p-md text-muted">Hecho no encontrado ({id})</div></div>;

  const needsEvidence = fact.status === 'controvertido' || fact.status === 'a_probar';
  const hasEvidence = evidence.length > 0;

  return (
    <div className="page">
      {/* 1. CABECERA */}
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {fact.customAmount && <span style={{ color: '#10b981', marginRight: '8px', fontFamily: 'monospace' }}>{fact.customAmount}</span>}
          {fact.title}
        </h1>
        <Link to={`/facts/${fact.id}/edit`} className="btn btn-ghost btn-icon">✏️</Link>
      </div>

      {needsEvidence && !hasEvidence && (
        <div className="alert alert-warning mb-md">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <div className="alert-title">Sin evidencia</div>
            <div className="alert-description">Este hecho no tiene documentos vinculados.</div>
          </div>
        </div>
      )}

      {/* 2. DATOS PRINCIPALES Y RESUMEN */}
      <div className="card mb-md">
        <div className="card-body">
          <div className="flex flex-wrap gap-sm mb-md">
            <span className={`chip ${['controvertido','a_probar'].includes(fact.status)?'chip-danger':'chip-success'}`}>
              {STATUS_LABELS[fact.status] || fact.status}
            </span>
            <span className="chip">{BURDEN_LABELS[fact.burden] || fact.burden}</span>
            <span className={`chip ${fact.risk==='alto'?'chip-danger':fact.risk==='medio'?'chip-warning':'chip-success'}`}>
              Riesgo {RISK_LABELS[fact.risk] || fact.risk}
            </span>
            <span className="chip">Fuerza: {fact.strength}/5</span>
          </div>

          <div className="mt-md">
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600 }}>RELATO DE HECHOS:</p>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '4px', fontSize: '1rem', lineHeight: '1.6' }}>
              {fact.narrative || "Sin descripción disponible."}
            </p>
          </div>
          
          {fact.tags?.length > 0 && <div className="mt-md"><Chips items={fact.tags} /></div>}
        </div>
      </div>

      {/* 3. DESGLOSE ESTRATÉGICO (TESIS vs ANTÍTESIS) */}
      {(fact.tesis || fact.antitesis) && (
        <div className="mb-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Tarjeta Verde: Tesis */}
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="card-body">
                    <h3 style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        🛡️ Nuestra Tesis
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {fact.tesis || "No definida."}
                    </p>
                </div>
            </div>
            {/* Tarjeta Roja: Antítesis */}
            <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div className="card-body">
                    <h3 style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        ⚔️ Antítesis / Riesgo
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {fact.antitesis || "No definida."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* 4. ESTRATEGIA DE DEFENSA */}
      {fact.estrategia && (
          <div className="card mb-md" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#f59e0b' }}>⚡ Estrategia de Defensa</h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', fontWeight: 500 }}>{fact.estrategia}</p>
              </div>
          </div>
      )}

      {/* 5. ARGUMENTOS DE OPOSICIÓN */}
      {fact.pruebasText && fact.pruebasText.length > 0 && (
          <div className="card mb-md" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div className="card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#3b82f6' }}>📋 Argumentos de Oposición</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {fact.pruebasText.map((p: string, i: number) => (
                          <li key={i} style={{ marginBottom: '8px', lineHeight: '1.5' }}>
                            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>•</span> {p}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}

      {/* 6. DOCUMENTOS DE REFERENCIA */}
      {fact.documentosRef && fact.documentosRef.length > 0 && (
          <div className="card mb-md" style={{ borderLeft: '4px solid #06b6d4' }}>
              <div className="card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#06b6d4' }}>📁 Documentos de Prueba</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {fact.documentosRef.map((doc: string, i: number) => (
                          <span key={i} style={{
                            padding: '6px 12px',
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            color: '#06b6d4'
                          }}>{doc}</span>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* 7. TAREAS PENDIENTES */}
      {fact.tareas && fact.tareas.length > 0 && (
          <div className="card mb-md" style={{ borderLeft: '4px solid #a855f7' }}>
              <div className="card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#a855f7' }}>✅ Tareas Pendientes</h3>
                  <ul style={{ paddingLeft: '0', margin: 0, listStyle: 'none' }}>
                      {fact.tareas.map((tarea: string, i: number) => (
                          <li key={i} style={{
                            marginBottom: '10px',
                            padding: '10px 14px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid rgba(168, 85, 247, 0.2)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              border: '2px solid #a855f7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              color: '#a855f7',
                              flexShrink: 0
                            }}>{i + 1}</span>
                            <span>{tarea}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}

      {/* 8. VINCULACIÓN */}
      {fact.vinculadoA && (
          <div className="card mb-md" style={{ background: 'rgba(100, 100, 100, 0.1)' }}>
              <div className="card-body">
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    🔗 Vinculado al Hecho #{fact.vinculadoA} —{' '}
                    <Link to={`/facts/${fact.vinculadoA}`} style={{ color: '#60a5fa' }}>Ver hecho relacionado →</Link>
                  </p>
              </div>
          </div>
      )}

      {/* 5. LISTADO DE DOCUMENTOS */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Documentos ({evidence.length})</h2>
        </div>
        {evidence.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted">
              <p>No hay documentos vinculados.</p>
            </div>
          </div>
        ) : (
          <div className="card">
            {evidence.map(({ link, span, document }) => (
              <div key={link.id} className="list-item">
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <Link to={`/documents/${document.id}/view`} className="list-item-content" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="list-item-title">{span.label}</div>
                  <div className="list-item-subtitle">{document.title}</div>
                </Link>
                {!link.id.toString().startsWith('lnk-virt-') && (
                     <button className="btn btn-ghost btn-icon-sm" onClick={() => handleRemoveEvidence(link.id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER: METADATOS Y BORRADO */}
      <section className="section">
        <div className="card mb-md">
            <div className="card-body text-muted" style={{ fontSize: '0.75rem' }}>
                <p><strong>Actualizado:</strong> {formatDateTime(fact.updatedAt)}</p>
            </div>
        </div>
        <button className="btn btn-danger btn-block" onClick={() => setShowDeleteModal(true)}>
          Eliminar hecho
        </button>
      </section>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar hecho"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        }
      >
        <p>¿Seguro que quieres eliminar <strong>{fact.title}</strong>?</p>
      </Modal>
    </div>
  );
}
