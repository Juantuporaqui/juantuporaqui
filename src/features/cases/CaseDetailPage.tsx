// ============================================
// CASE OPS - Case Detail Page (MASTER FINAL)
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Scale, FileText, Calendar, Gavel, ChevronRight, Upload, ListChecks, RefreshCw, Eye, AlertTriangle
} from 'lucide-react';
import {
  casesRepo, documentsRepo, eventsRepo, factsRepo, partidasRepo, strategiesRepo
} from '../../db/repositories';
import type { Case, Document, Event, Fact, Partida, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { calcularTotales, resumenContador, hechosReclamados } from '../../data/hechosReclamados';
import { TextReader } from '../../ui/components/TextReader';
import { LEGAL_DOCS_MAP } from '../../data/legal_texts';

// Hechos más relevantes para mostrar en el resumen (los 3 de mayor cuantía en disputa)
const hechosRelevantes = hechosReclamados
  .filter(h => h.estado === 'disputa' || h.cuantia > 15000)
  .sort((a, b) => b.cuantia - a.cuantia)
  .slice(0, 4);

// ============================================
// 1. DASHBOARD EJECUTIVO (Tab Resumen)
// ============================================
function TabResumen({ caseData, strategies, events, facts, navigate, setActiveTab }: any) {
  const isPicassent = caseData.title.toLowerCase().includes('picassent') || caseData.autosNumber?.includes('715');
  
  // Calcular totales reales basados en el seed si es posible, o usar estáticos
  const totalReclamado = facts.length > 0 ? facts.length * 15000 : resumenContador.totalReclamado; // Estimación simple si no hay partidas
  
  const nextEvent = events
    .filter((e: Event) => new Date(e.date).getTime() >= Date.now())
    .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (isPicassent || facts.length > 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* KPIs GUERRA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Total en Disputa</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">
               {/* Mostramos cifra real o fallback */}
               {(isPicassent ? resumenContador.totalReclamado : totalReclamado).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Hechos Clave</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{facts.length}</div>
            <div className="text-[10px] text-slate-600">Puntos de conflicto</div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Documentos</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{caseData.tags?.length || 0}</div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Estrategias</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{strategies.length} activas</div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS - BOTONES TIPO APP MÓVIL */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
          {/* TARJETA DESGLOSE DE HECHOS */}
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4 sm:p-5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><ListChecks size={20} /></div>
              <div>
                <h3 className="font-bold text-white text-sm">Desglose de Hechos</h3>
                <p className="text-[10px] text-slate-500">{isPicassent ? '10' : facts.length} partidas analizadas</p>
              </div>
            </div>

            {/* HECHOS RELEVANTES - GRID TIPO APP */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {hechosRelevantes.slice(0, 4).map((hecho) => (
                <button
                  key={hecho.id}
                  onClick={() => navigate(`/facts/${hecho.id}`)}
                  className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                    hecho.estado === 'disputa'
                      ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/60'
                      : hecho.estado === 'prescrito'
                      ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60'
                      : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                  }`}
                >
                  <span className={`text-base sm:text-xl font-bold ${
                    hecho.estado === 'disputa' ? 'text-orange-400' :
                    hecho.estado === 'prescrito' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    #{hecho.id}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 text-center leading-tight line-clamp-2">
                    {hecho.titulo.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className="text-[8px] text-slate-600 font-mono">
                    {(hecho.cuantia / 1000).toFixed(0)}k€
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/analytics/hechos')}
              className="w-full text-xs text-emerald-400 font-medium py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <ListChecks size={14} />
              Ver los 10 hechos →
            </button>
          </div>

          {/* TARJETA AUDIENCIA PREVIA */}
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4 sm:p-5 hover:border-amber-500/30 transition-all relative">
            <div className="absolute top-3 right-3"><span className="bg-rose-500/20 text-rose-300 text-[9px] px-2 py-0.5 rounded-full border border-rose-500/30 animate-pulse">URGENTE</span></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Gavel size={20} /></div>
              <div>
                <h3 className="font-bold text-white text-sm">Audiencia Previa</h3>
                <p className="text-[10px] text-slate-500">Puntos clave de defensa</p>
              </div>
            </div>

            {/* PUNTOS CLAVE - GRID TIPO APP */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => navigate('/facts/4')}
                className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/60 transition-all hover:scale-105 active:scale-95"
              >
                <AlertTriangle size={20} className="text-rose-400" />
                <span className="text-[8px] sm:text-[10px] text-slate-400 text-center leading-tight">Hipoteca</span>
                <span className="text-[8px] text-rose-400 font-bold">122k€</span>
              </button>
              <button
                onClick={() => navigate('/facts/3')}
                className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105 active:scale-95"
              >
                <Scale size={20} className="text-amber-400" />
                <span className="text-[8px] sm:text-[10px] text-slate-400 text-center leading-tight">Compensa</span>
                <span className="text-[8px] text-amber-400 font-bold">38.5k€</span>
              </button>
              <button
                onClick={() => navigate('/facts/10')}
                className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all hover:scale-105 active:scale-95"
              >
                <FileText size={20} className="text-cyan-400" />
                <span className="text-[8px] sm:text-[10px] text-slate-400 text-center leading-tight">Agrícola</span>
                <span className="text-[8px] text-cyan-400 font-bold">10.8k€</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/analytics/audiencia')}
              className="w-full text-xs text-amber-400 font-medium py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <Gavel size={14} />
              Modo juicio →
            </button>
          </div>
        </div>

        {/* ACCESO RÁPIDO A DOCUMENTOS - CON NAVEGACIÓN DIRECTA */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Eye size={18} /></div>
            <h3 className="font-bold text-white text-sm">Documentos del Procedimiento</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => navigate(`/cases/${caseData.id}?tab=docs&doc=demanda-picassent`)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-xl sm:text-2xl">📜</span>
              <span className="text-[9px] sm:text-[10px] text-amber-400 font-medium">Demanda</span>
            </button>
            <button
              onClick={() => navigate(`/cases/${caseData.id}?tab=docs&doc=contestacion-picassent`)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-xl sm:text-2xl">🛡️</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-medium">Contest.</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-xl sm:text-2xl">📂</span>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-medium">Todos</span>
            </button>
            <button
              onClick={() => navigate(`/documents/new?caseId=${caseData.id}`)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all hover:scale-105 active:scale-95"
            >
              <Upload size={20} className="text-slate-400 sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Subir</span>
            </button>
          </div>
        </div>

        {/* PRÓXIMO EVENTO */}
        {nextEvent && (
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><Calendar size={20} /></div>
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase">Próximo Hito</div>
                <div className="text-slate-200">{nextEvent.title}</div>
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-400">{formatDate(nextEvent.date)}</div>
          </div>
        )}
      </div>
    );
  }

  // Vista Genérica (Otros casos)
  return (
    <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
      <p>Resumen general del caso no disponible.</p>
      {nextEvent && <p className="mt-2 text-white">Próximo: {nextEvent.title} ({formatDate(nextEvent.date)})</p>}
    </div>
  );
}

// ============================================
// 2. TAB DOCUMENTOS (El Lector Inteligente)
// ============================================
function TabDocs({ documents, caseId, caseData, initialDocKey }: any) {
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>(initialDocKey || null);
  const isPicassent = caseData.title.toLowerCase().includes('picassent');
  const isMislata = caseData.title.toLowerCase().includes('mislata');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-240px)] min-h-[600px]">
      {/* SIDEBAR DOCUMENTOS */}
      <div className="space-y-6 lg:col-span-1 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Botón Subir */}
        <Link to={`/documents/new?caseId=${caseId}`} className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Upload size={16} /> Subir Nuevo
        </Link>

        {/* Escritos Procesales (Textos Limpios) */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Scale size={14} /> Autos y Escritos
          </h3>
          <div className="space-y-1">
            {isPicassent && (
              <>
                <button onClick={() => setSelectedDocKey('demanda-picassent')} className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'demanda-picassent' ? 'bg-amber-900/40 border-amber-500/50 text-amber-100' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  📜 Demanda Contraria
                </button>
                <button onClick={() => setSelectedDocKey('contestacion-picassent')} className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'contestacion-picassent' ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  🛡️ Contestación
                </button>
              </>
            )}
            {isMislata && (
              <>
                <button onClick={() => setSelectedDocKey('recurso-reposicion-mislata')} className={`w-full text-left p-3 rounded-lg text-sm border mb-1 transition-all ${selectedDocKey === 'recurso-reposicion-mislata' ? 'bg-rose-900/40 border-rose-500 text-rose-100' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>🚨 Recurso Contrario</button>
                <button onClick={() => setSelectedDocKey('oposicion-mislata')} className={`w-full text-left p-3 rounded-lg text-sm border mb-1 transition-all ${selectedDocKey === 'oposicion-mislata' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>✅ Nuestra Oposición</button>
                <button onClick={() => setSelectedDocKey('contestacion-mislata')} className={`w-full text-left p-3 rounded-lg text-sm border mb-1 transition-all ${selectedDocKey === 'contestacion-mislata' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>⚖️ Contestación</button>
                <button onClick={() => setSelectedDocKey('prueba-juan-mislata')} className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'prueba-juan-mislata' ? 'bg-blue-900/40 border-blue-500 text-blue-100' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>🔍 Nuestra Prueba</button>
              </>
            )}
            {!isPicassent && !isMislata && (
                 <div className="text-xs text-slate-600 p-2 italic">No hay escritos predefinidos para este caso.</div>
            )}
          </div>
        </div>

        {/* Archivos PDF Subidos */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 mt-6">
            <Upload size={14} /> Archivo Digital
          </h3>
          {documents.length === 0 && <p className="text-xs text-slate-600 italic">No hay archivos adjuntos.</p>}
          {documents.map((doc: Document) => (
            <div key={doc.id} className="p-3 mb-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-600 cursor-pointer transition-colors truncate">
              {doc.title}
            </div>
          ))}
        </div>
      </div>
      
      {/* VISOR CENTRAL */}
      <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full shadow-2xl relative flex flex-col">
        {selectedDocKey && LEGAL_DOCS_MAP[selectedDocKey] ? (
          <TextReader content={LEGAL_DOCS_MAP[selectedDocKey]} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 bg-slate-900/20">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Selecciona un documento para lectura inmersiva</p>
            <p className="text-xs opacity-50 mt-2">Formatos optimizados para War Room</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 3. TAB ECONÓMICO (CON ACCESO A WAR ROOM)
// ============================================
// AHORA USA LOS DATOS REALES DE LA BASE DE DATOS
function TabEconomico({ caseId, facts }: { caseId: string, facts: Fact[] }) {
  const navigate = useNavigate();

  // Helper para sacar un importe estimado del texto si existe
  const extractAmount = (text: string) => {
    const match = text.match(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s?€/);
    return match ? match[0] : null;
  };

  return (
    <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end mb-2">
         <Link to={`/facts/new?caseId=${caseId}`} className="text-xs bg-emerald-600/80 text-emerald-100 px-3 py-1.5 rounded hover:bg-emerald-500 transition-colors flex items-center gap-2">
            <span>+</span> Nuevo Hecho / Partida
         </Link>
      </div>

      {facts.length === 0 && (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded text-slate-500">
              No hay hechos registrados para este caso.
          </div>
      )}

      {facts.map((fact) => {
        // Intentamos obtener el importe del título o resumen
        const amountDisplay = extractAmount(fact.titulo) || extractAmount(fact.resumenCorto || '') || '--- €';
        const hasConflict = fact.tesis || fact.antitesisEsperada;

        return (
            <div 
            key={fact.id} 
            onClick={() => navigate(`/facts/${fact.id}`)}
            className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden group hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all cursor-pointer relative"
            >
            {/* Indicador de Click */}
            <div className="absolute top-4 right-4 text-slate-600 group-hover:text-blue-400 transition-colors">
                <ChevronRight size={20} />
            </div>

            <div className="p-4 pr-12">
                <div className="flex justify-between items-start">
                <div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        fact.riesgo === 'alto' ? 'bg-rose-900/30 text-rose-400' : 
                        fact.riesgo === 'bajo' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
                    }`}>
                    RIESGO {fact.riesgo}
                    </span>
                    <h4 className="text-white font-medium mt-2 text-lg group-hover:text-blue-200 transition-colors">
                    {fact.titulo}
                    </h4>
                </div>
                <div className="text-right mt-1 mr-6">
                    <div className="text-xl font-bold text-slate-200 tabular-nums">{amountDisplay}</div>
                    <div className="text-xs text-slate-500 font-mono">ESTIMADO</div>
                </div>
                </div>
            </div>
            
            {/* Preview Estratégica */}
            {hasConflict && (
                <div className="px-4 pb-4 pt-0 text-sm grid md:grid-cols-2 gap-4 text-slate-400 border-t border-slate-800/50 mt-2 pt-3 bg-slate-950/30">
                    <div className="flex gap-2">
                    <span className="text-rose-400 text-xs uppercase font-bold shrink-0 mt-0.5">Antítesis:</span>
                    <span className="line-clamp-2 text-xs">{fact.antitesisEsperada || "Sin definir"}</span>
                    </div>
                    <div className="flex gap-2">
                    <span className="text-emerald-400 text-xs uppercase font-bold shrink-0 mt-0.5">Tesis:</span>
                    <span className="line-clamp-2 text-xs">{fact.tesis || "Sin definir"}</span>
                    </div>
                </div>
            )}
            </div>
        );
      })}
    </div>
  );
}

function TabEstrategia({ strategies, caseId }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white">Estrategias Activas</h3>
        <Link to={`/warroom/new?caseId=${caseId}`} className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-500">+ Nueva</Link>
      </div>
      {strategies.map((s: Strategy, i: number) => (
        <div key={s.id} className="p-5 rounded-xl border border-slate-700 bg-slate-900">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold text-white flex items-center gap-2"><span className="bg-slate-700 text-xs px-2 py-0.5 rounded">#{i+1}</span> Estrategia</h4>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase">{s.risk} Risk</span>
          </div>
          <p className="text-rose-400 text-sm mb-2">⚠️ <strong>Ataque:</strong> {s.attack}</p>
          <p className="text-emerald-400 text-sm">🛡️ <strong>Defensa:</strong> {s.rebuttal}</p>
        </div>
      ))}
      {strategies.length === 0 && <div className="text-center text-slate-500 py-10 border border-dashed border-slate-800 rounded">Sin estrategias definidas.</div>}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const docParam = searchParams.get('doc');
  const [activeTab, setActiveTab] = useState(tabParam || 'resumen');
  const [initialDoc, setInitialDoc] = useState<string | null>(docParam);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]); // Nuevo estado para Hechos Reales

  useEffect(() => {
    if (!id) return;
    casesRepo.getById(id).then(c => c ? setCurrentCase(c) : navigate('/cases'));
    documentsRepo.getAll().then(all => setDocs(all.filter(d => d.caseId === id)));
    eventsRepo.getAll().then(all => setEvents(all.filter(e => e.caseId === id)));
    strategiesRepo.getAll().then(all => setStrategies(all.filter(s => s.caseId === id)));
    partidasRepo.getAll().then(all => setPartidas(all.filter(p => p.caseId === id)));
    // Cargar hechos reales
    factsRepo.getAll().then(all => setFacts(all.filter(f => f.caseId === id)));
  }, [id, navigate]);

  if (!currentCase) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Cargando War Room...</div>;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 font-sans">
      {/* HEADER - Optimizado para móvil */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-0">
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
            <div className="min-w-0 flex-1">
              <Link to="/cases" className="text-xs text-slate-500 hover:text-white mb-1 block transition-colors">← Volver</Link>
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight truncate">{currentCase.title}</h1>
              <div className="flex gap-2 mt-2 items-center flex-wrap">
                <span className="text-[10px] sm:text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{currentCase.autosNumber}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${currentCase.status === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{currentCase.status}</span>
              </div>
            </div>
            {/* Acciones Globales - Compactas en móvil */}
            <div className="flex gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => {
                  if ('caches' in window) {
                    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
                  }
                  window.location.reload();
                }}
                title="Limpiar caché y recargar"
                className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded-lg border border-slate-700 transition-colors"
              >
                <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <Link to={`/events/new?caseId=${id}`} className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 hidden sm:flex"><Calendar size={18} /></Link>
              <Link to={`/documents/new?caseId=${id}`} className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-900/20"><Upload size={16} className="sm:w-[18px] sm:h-[18px]" /></Link>
            </div>
          </div>

          {/* TABS - Scroll horizontal en móvil */}
          <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {[
              { id: 'resumen', label: '📊 Resumen', shortLabel: '📊' },
              { id: 'economico', label: '💰 Económico', shortLabel: '💰' },
              { id: 'estrategia', label: '♟️ Estrategia', shortLabel: '♟️' },
              { id: 'docs', label: '📂 Documentos', shortLabel: '📂' },
              { id: 'actuaciones', label: '📅 Actuaciones', shortLabel: '📅' },
            ].map(tab => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 sm:pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel} {tab.id === 'resumen' ? 'Resumen' : tab.id === 'economico' ? 'Eco.' : tab.id === 'estrategia' ? 'Estr.' : tab.id === 'docs' ? 'Docs' : 'Actu.'}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'resumen' && <TabResumen caseData={currentCase} strategies={strategies} events={events} facts={facts} navigate={navigate} setActiveTab={setActiveTab} />}
        {activeTab === 'economico' && <TabEconomico caseId={id!} facts={facts} />}
        {activeTab === 'docs' && <TabDocs documents={docs} caseId={id} caseData={currentCase} initialDocKey={initialDoc} />}
        {activeTab === 'estrategia' && <TabEstrategia strategies={strategies} caseId={id} />}
        {activeTab === 'actuaciones' && (
          <div className="space-y-4">
            {events.map(e => (
              <div key={e.id} className="flex gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-colors">
                <div className="text-center min-w-[60px] pt-1">
                  <div className="text-xl font-bold text-slate-200">{new Date(e.date).getDate()}</div>
                  <div className="text-xs text-slate-500 uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</div>
                </div>
                <div>
                  <h4 className="font-medium text-white">{e.title}</h4>
                  <p className="text-sm text-slate-400">{e.description}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && <div className="text-center text-slate-500 py-10">No hay actuaciones registradas.</div>}
          </div>
        )}
      </main>
    </div>
  );
}
