// ============================================
// CASE OPS - Dashboard (DATOS REALES)
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import { formatCurrency } from '../../utils/validators';
import { AlertasPanel } from '../../components/AlertasPanel';
import { hechosReclamados, resumenContador, calcularTotales } from '../../data/hechosReclamados';
import { RefreshCw, Scale, FileText, Gavel, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

// Convertir hechosReclamados a formato de claims para el dashboard
const CLAIMS_REALES = hechosReclamados.map(h => ({
  id: String(h.id),
  shortLabel: `H${String(h.id).padStart(2, '0')}`,
  title: h.titulo,
  amountCents: Math.round(h.cuantia * 100),
  probability: h.estado === 'prescrito' ? 'baja' : h.estado === 'compensable' ? 'media' : 'alta',
  color: h.estado === 'prescrito'
    ? 'border-rose-400/50 bg-rose-500/10 text-rose-200'
    : h.estado === 'compensable'
    ? 'border-amber-400/50 bg-amber-500/10 text-amber-200'
    : 'border-orange-400/50 bg-orange-500/10 text-orange-200',
  thesis: h.estrategia,
  evidence: h.documentosRef || [],
  estado: h.estado,
  año: h.año,
}));

export function DashboardPage() {
  const navigate = useNavigate();
  const activeCasesCount = useLiveQuery(() => db.cases.where('status').equals('open').count(), [], 0);

  const urgentTasks = useLiveQuery(() =>
    db.tasks
      .where('status').equals('pendiente')
      .limit(5)
      .toArray()
  , []);

  const totales = calcularTotales();

  // Agrupar hechos por estado
  const prescritos = CLAIMS_REALES.filter(c => c.estado === 'prescrito');
  const compensables = CLAIMS_REALES.filter(c => c.estado === 'compensable');
  const enDisputa = CLAIMS_REALES.filter(c => c.estado === 'disputa');

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
    }
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 mb-1">
            Panel de Control
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            P.O. 715/2024 · Picassent
          </h1>
        </div>
        <button
          onClick={handleClearCache}
          title="Limpiar caché"
          className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {/* ESTRATEGIA GLOBAL */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
        <div className="text-xs uppercase text-amber-200/70 mb-1">Estrategia Global de Defensa</div>
        <div className="text-sm font-semibold text-amber-100 leading-relaxed">
          Reclamar prescripción de deudas anteriores a 5 años (Art. 1964.2 CC), alegar compensación por los 38.500€ retirados por la actora, y demostrar que las cuotas hipotecarias correspondían a un préstamo solidario para el chalet común.
        </div>
      </div>

      {/* Alertas */}
      <AlertasPanel />

      {/* KPIs PRINCIPALES */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
          <div className="text-[10px] text-rose-300/70 uppercase tracking-wider">Reclamado</div>
          <div className="text-xl font-bold text-rose-400">
            {resumenContador.totalReclamado.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <div className="text-[10px] text-emerald-300/70 uppercase tracking-wider">Prescrito</div>
          <div className="text-xl font-bold text-emerald-400">
            {totales.prescrito.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€
          </div>
          <div className="text-[9px] text-slate-500 mt-1">Art. 1964.2 CC</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="text-[10px] text-amber-300/70 uppercase tracking-wider">Riesgo Real</div>
          <div className="text-xl font-bold text-amber-400">
            {resumenContador.cifraRiesgoReal.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <div className="text-[10px] text-cyan-300/70 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown size={10} /> Reducción
          </div>
          <div className="text-xl font-bold text-cyan-400">{resumenContador.reduccionObjetivo}%</div>
          <div className="text-[9px] text-slate-500 mt-1">Objetivo de defensa</div>
        </Card>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="grid grid-cols-4 gap-2">
        <button
          onClick={() => navigate('/analytics/hechos')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
        >
          <Scale size={22} className="text-emerald-400" />
          <span className="text-[10px] text-slate-300">Hechos</span>
        </button>
        <button
          onClick={() => navigate('/cases/CAS001')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
        >
          <FileText size={22} className="text-blue-400" />
          <span className="text-[10px] text-slate-300">Caso</span>
        </button>
        <button
          onClick={() => navigate('/analytics/audiencia')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
        >
          <Gavel size={22} className="text-amber-400" />
          <span className="text-[10px] text-slate-300">Audiencia</span>
        </button>
        <button
          onClick={() => navigate('/warroom')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
        >
          <AlertTriangle size={22} className="text-rose-400" />
          <span className="text-[10px] text-slate-300">War Room</span>
        </button>
      </section>

      {/* HECHOS POR ESTADO */}
      <section>
        <SectionTitle title="Análisis de Partidas" subtitle={`${CLAIMS_REALES.length} hechos reclamados`} />

        {/* PRESCRITOS */}
        <div className="mt-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase">Prescritos ({prescritos.length})</span>
            <span className="text-xs text-slate-500 ml-auto">{totales.prescrito.toLocaleString('es-ES')}€</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {prescritos.map((claim) => (
              <button
                key={claim.id}
                onClick={() => navigate(`/facts/${claim.id}`)}
                className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 hover:bg-rose-500/10 transition-all text-left"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-rose-400">{claim.shortLabel}</span>
                  <span className="text-[10px] font-mono text-rose-300">{(claim.amountCents/100).toLocaleString('es-ES')}€</span>
                </div>
                <div className="text-xs text-slate-300 line-clamp-1">{claim.title}</div>
                <div className="text-[9px] text-slate-500 mt-1">{claim.año}</div>
              </button>
            ))}
          </div>
        </div>

        {/* COMPENSABLES */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase">Compensables ({compensables.length})</span>
            <span className="text-xs text-slate-500 ml-auto">{totales.compensable.toLocaleString('es-ES')}€</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {compensables.map((claim) => (
              <button
                key={claim.id}
                onClick={() => navigate(`/facts/${claim.id}`)}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 hover:bg-amber-500/10 transition-all text-left"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-amber-400">{claim.shortLabel}</span>
                  <span className="text-[10px] font-mono text-amber-300">{(claim.amountCents/100).toLocaleString('es-ES')}€</span>
                </div>
                <div className="text-xs text-slate-300 line-clamp-1">{claim.title}</div>
                <div className="text-[9px] text-slate-500 mt-1">{claim.año}</div>
              </button>
            ))}
          </div>
        </div>

        {/* EN DISPUTA */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase">En Disputa ({enDisputa.length})</span>
            <span className="text-xs text-slate-500 ml-auto">{totales.disputa.toLocaleString('es-ES')}€</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {enDisputa.map((claim) => (
              <button
                key={claim.id}
                onClick={() => navigate(`/facts/${claim.id}`)}
                className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 hover:bg-orange-500/10 transition-all text-left"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-orange-400">{claim.shortLabel}</span>
                  <span className="text-[10px] font-mono text-orange-300">{(claim.amountCents/100).toLocaleString('es-ES')}€</span>
                </div>
                <div className="text-xs text-slate-300 line-clamp-1">{claim.title}</div>
                <div className="text-[9px] text-slate-500 mt-1">{claim.año}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TAREAS PENDIENTES */}
      <section>
        <div className="flex items-center justify-between mb-2">
           <SectionTitle title="Tareas Pendientes" subtitle="Próximos vencimientos" />
           <Link to="/tasks" className="text-xs text-amber-500 hover:underline">Ver todas</Link>
        </div>

        <div className="mt-3 space-y-2">
          {(!urgentTasks || urgentTasks.length === 0) ? (
             <div className="p-4 text-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-lg">
                No hay tareas pendientes en el sistema.
                <br />
                <span className="text-xs text-slate-600">Las tareas de cada hecho aparecen en su detalle.</span>
             </div>
          ) : (
             urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1">
                    <div className="text-sm text-slate-200 font-medium">{task.title}</div>
                    {task.dueDate && <div className="text-xs text-slate-500">Vence: {new Date(task.dueDate).toLocaleDateString()}</div>}
                  </div>
                </div>
             ))
          )}
        </div>
      </section>

      {/* RESUMEN LEGAL */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h3 className="text-sm font-bold text-slate-200 mb-3">📋 Fundamentos Jurídicos Clave</h3>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex gap-2">
            <span className="text-emerald-400 font-bold shrink-0">Art. 1964.2 CC:</span>
            <span>Prescripción de acciones personales a los 5 años.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-400 font-bold shrink-0">Art. 1196 CC:</span>
            <span>Compensación de créditos recíprocos.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-400 font-bold shrink-0">Art. 1145 CC:</span>
            <span>Solidaridad en el préstamo hipotecario.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-rose-400 font-bold shrink-0">Art. 400 CC:</span>
            <span>División de cosa común - Nos allanamos.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
