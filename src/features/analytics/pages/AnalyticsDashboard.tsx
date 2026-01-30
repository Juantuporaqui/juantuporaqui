import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale, FileText, Clock, CheckSquare, Home,
  ChevronRight, AlertTriangle, Calendar, Gavel,
  Calculator, Users, FileSearch, ListChecks
} from 'lucide-react';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { CourtCard } from '../components/CourtCard';
import { SectionCard } from '../components/SectionCard';
import { Timeline } from '../components/Timeline';
import { HechoBadge } from '../components/HechoCard';
import { useAnalyticsMeta } from '../hooks/useAnalyticsMeta';
import { useAnalyticsComputed } from '../hooks/useAnalyticsComputed';
import { formatMoney, formatNumber } from '../utils/money';
import { hechosReclamados, resumenContador, calcularTotales } from '../../../data/hechosReclamados';
import { resumenAudiencia } from '../../../data/audienciaPrevia';

export function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const { meta } = useAnalyticsMeta();
  const { totalCases } = useAnalyticsComputed();
  const [modoJuicio, setModoJuicio] = useState(false);
  const totales = calcularTotales();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    setModoJuicio(document.documentElement.classList.contains('modo-juicio'));
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('modo-juicio', modoJuicio);
    localStorage.setItem('case-ops:modo-juicio', String(modoJuicio));
  }, [modoJuicio]);

  const countByEstado = {
    prescrito: hechosReclamados.filter(h => h.estado === 'prescrito').length,
    compensable: hechosReclamados.filter(h => h.estado === 'compensable').length,
    disputa: hechosReclamados.filter(h => h.estado === 'disputa').length,
  };

  // Calcular días hasta audiencia
  const diasHastaAudiencia = meta?.diasHastaVista ?? -9;

  return (
    <AnalyticsLayout
      title="Picassent"
      subtitle="Sistema de Soporte a Litigios"
      actions={
        <button
          type="button"
          onClick={() => setModoJuicio((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
        >
          <Gavel className="w-4 h-4" />
          Modo Juicio {modoJuicio ? 'ON' : 'OFF'}
        </button>
      }
    >
      {/* Header con caso principal */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Procedimiento Ordinario 715/2024</h2>
              <p className="text-sm text-slate-400">Juzgado de Primera Instancia nº 4 de Picassent</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Caso Maestro
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Reclamación: {resumenContador.totalReclamado.toLocaleString('es-ES')}€
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Riesgo Real: ~{resumenContador.cifraRiesgoReal.toLocaleString('es-ES')}€
                </span>
              </div>
            </div>
          </div>

          {/* Card de Audiencia Previa */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 min-w-[180px]">
            <div className="text-[10px] uppercase tracking-wider text-amber-300/70">Audiencia Previa</div>
            <div className="text-3xl font-black text-white mt-1">
              {diasHastaAudiencia > 0 ? `${diasHastaAudiencia}d` : 'HOY'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {resumenAudiencia.fecha} • {resumenAudiencia.hora}
            </div>
          </div>
        </div>

        {/* Objetivo procesal */}
        <div className="mt-4 p-3 rounded-xl border border-slate-700/50 bg-slate-900/50">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Objetivo procesal actual</div>
          <p className="text-sm text-slate-200">
            Reducción del <span className="text-emerald-400 font-bold">{resumenContador.reduccionObjetivo}%</span> de la cuantía mediante prescripción (Art. 1964.2 CC) e impugnación documental
          </p>
        </div>
      </div>

      {/* KPIs principales estilo chaladita */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Total Reclamado</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {resumenContador.totalReclamado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Prescrito (~)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {totales.prescrito.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <div className="text-[10px] text-slate-600 mt-1">Art. 1964.2 CC</div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Riesgo Real</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {resumenContador.cifraRiesgoReal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Estrategias</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {meta?.estrategiasActivas ?? 5} activas
          </div>
        </div>
      </section>

      {/* Cards principales: Desglose de Hechos + Audiencia Previa */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Card Desglose de Hechos */}
        <button
          type="button"
          onClick={() => navigate('/analytics/hechos')}
          className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 mb-3">
            <ListChecks className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Desglose de Hechos</h3>
          <p className="text-sm text-slate-400 mb-3">
            {hechosReclamados.length} partidas reclamadas con análisis detallado, oposición y estrategia
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <HechoBadge count={countByEstado.prescrito} estado="prescrito" />
            <HechoBadge count={countByEstado.compensable} estado="compensable" />
            <HechoBadge count={countByEstado.disputa} estado="disputa" />
          </div>
          <div className="flex items-center text-sm text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
            Ver desglose completo <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Card Audiencia Previa */}
        <button
          type="button"
          onClick={() => navigate('/analytics/audiencia')}
          className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
        >
          {/* Badge Urgente */}
          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3 h-3" /> Urgente
            </span>
          </div>

          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 mb-3">
            <Gavel className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Audiencia Previa</h3>
          <p className="text-sm text-slate-400 mb-3">
            Alegaciones complementarias y fijación de hechos controvertidos
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300">
              {resumenAudiencia.totalAlegaciones} Alegaciones
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300">
              {resumenAudiencia.totalHechosControvertidos} Hechos
            </span>
          </div>
          <div className="flex items-center text-sm text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
            Preparar audiencia <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>
      </div>

      {/* Herramientas de Análisis */}
      <SectionCard
        title="Herramientas de Análisis"
        subtitle="Acceso rápido a utilidades del caso"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => navigate('/analytics/prescripcion')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all"
          >
            <Clock className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300 text-center">Prescripción</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/partidas')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all"
          >
            <Calculator className="w-6 h-6 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300 text-center">Nóminas</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-violet-500/30 transition-all"
          >
            <FileSearch className="w-6 h-6 text-violet-400" />
            <span className="text-xs font-medium text-slate-300 text-center">Doc. 25</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all"
          >
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-medium text-slate-300 text-center">Checklist</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-rose-500/30 transition-all"
          >
            <Home className="w-6 h-6 text-rose-400" />
            <span className="text-xs font-medium text-slate-300 text-center">Artur Piera</span>
          </button>
        </div>
      </SectionCard>

      {/* Sección "Qué falta para ir fuerte" */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">Qué falta para ir fuerte</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white">Certificado Bankia completo</div>
              <div className="text-xs text-slate-500">Para contraponer a Doc. 25</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <Home className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white">Tabla gastos reforma Artur Piera</div>
              <div className="text-xs text-slate-500">Leroy Merlin, Bricomart</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <Users className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white">Certificación nóminas 2016-2022</div>
              <div className="text-xs text-slate-500">Para acreditar aportaciones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Frentes judiciales */}
      <SectionCard
        title="Frentes judiciales"
        subtitle="Juzgados prioritarios y su estado"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {(meta?.courts ?? []).map((court) => (
            <CourtCard
              key={court.slug}
              court={court}
              onClick={() => navigate(`/analytics/${court.slug}`)}
            />
          ))}
        </div>
      </SectionCard>

      {/* Timeline */}
      <Timeline
        items={meta?.lineaTemporal ?? []}
        onConfigure={() => navigate('/analytics/admin')}
      />
    </AnalyticsLayout>
  );
}
