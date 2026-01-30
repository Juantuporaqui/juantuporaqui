// ============================================
// CHALADITA CASE-OPS - HECHOS PAGE (FUSIÓN COMPLETA)
// ============================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Scale, Clock, AlertTriangle, RefreshCw, Eye, List, Grid3X3 } from 'lucide-react';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';
import { HechoCard, HechoBadge, type HechoEstado } from '../components/HechoCard';
import { HechoExpandible } from '../components/HechoExpandible';
// Importamos el componente de los botones de colores
import { ReclamacionesTiles } from '../../../components/ReclamacionesTiles';
import { hechosReclamados, resumenContador, calcularTotales } from '../../../data/hechosReclamados';

type FilterKey = 'todos' | 'prescrito' | 'compensable' | 'disputa';

const filters: { key: FilterKey; label: string; icon: typeof Clock }[] = [
  { key: 'todos', label: 'Todos', icon: FileText },
  { key: 'prescrito', label: 'Prescritos', icon: Clock },
  { key: 'compensable', label: 'Compensables', icon: Scale },
  { key: 'disputa', label: 'En disputa', icon: AlertTriangle },
];

export function HechosPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [viewMode, setViewMode] = useState<'expandible' | 'compact'>('expandible');
  const totales = calcularTotales();

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
    }
    window.location.reload();
  };

  const filteredHechos = useMemo(() => {
    if (activeFilter === 'todos') return hechosReclamados;
    return hechosReclamados.filter((h) => h.estado === activeFilter);
  }, [activeFilter]);

  const countByEstado = {
    prescrito: hechosReclamados.filter(h => h.estado === 'prescrito').length,
    compensable: hechosReclamados.filter(h => h.estado === 'compensable').length,
    disputa: hechosReclamados.filter(h => h.estado === 'disputa').length,
  };

  return (
    <AnalyticsLayout
      title="Desglose de Hechos"
      subtitle="10 partidas reclamadas con análisis detallado"
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Vista */}
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('expandible')}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'expandible'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Vista detallada expandible"
            >
              <List size={14} />
              <span className="hidden sm:inline">Detalle</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'compact'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Vista compacta en grid"
            >
              <Grid3X3 size={14} />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Botón Caché */}
          <button
            type="button"
            onClick={handleClearCache}
            title="Limpiar caché y recargar"
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
          >
            <RefreshCw size={16} />
          </button>

          {/* Volver */}
          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:bg-white/5 transition"
          >
            ← Dashboard
          </button>
        </div>
      }
    >
      {/* 1. KPIs principales - Optimizado para móvil */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="rounded-xl sm:rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs text-rose-300/70 uppercase tracking-wider mb-1">Total Reclamado</div>
          <div className="text-lg sm:text-2xl font-bold text-rose-400">
            {resumenContador.totalReclamado.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs text-emerald-300/70 uppercase tracking-wider mb-1">Prescrito (~)</div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-400">
            {totales.prescrito.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1 hidden sm:block">Art. 1964.2 CC</div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs text-amber-300/70 uppercase tracking-wider mb-1">Riesgo Real</div>
          <div className="text-lg sm:text-2xl font-bold text-amber-400">
            {resumenContador.cifraRiesgoReal.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs text-cyan-300/70 uppercase tracking-wider mb-1">Reducción</div>
          <div className="text-lg sm:text-2xl font-bold text-cyan-400">
            {resumenContador.reduccionObjetivo}%
          </div>
        </div>
      </section>

      {/* 2. Resumen con badges (Tu código original) */}
      <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/30">
        <span className="text-sm text-slate-400 mr-2">Clasificación:</span>
        <HechoBadge count={countByEstado.prescrito} estado="prescrito" />
        <HechoBadge count={countByEstado.compensable} estado="compensable" />
        <HechoBadge count={countByEstado.disputa} estado="disputa" />
      </div>

      {/* 3. NUEVO: BOTONES DE COLORES (ReclamacionesTiles) */}
      {/* Insertado aquí para que conviva con lo demás */}
      <ReclamacionesTiles procedimientoId="picassent-715-2024" />

      {/* 4. Filtros tipo app Android - Optimizado móvil */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0 mt-3 sm:mt-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`
                flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap
                transition-all duration-200 shrink-0
                ${isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.key === 'todos' ? 'Todo' : filter.key === 'prescrito' ? 'Presc.' : filter.key === 'compensable' ? 'Comp.' : 'Disp.'}</span>
              {filter.key !== 'todos' && (
                <span className={`text-[10px] sm:text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  ({countByEstado[filter.key as HechoEstado] || 0})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Lista de hechos - VISTA EXPANDIBLE o COMPACTA */}
      <SectionCard
        title={`${filteredHechos.length} hechos encontrados`}
        subtitle={viewMode === 'expandible' ? "Toca para expandir y ver análisis completo" : "Toca para navegar al detalle"}
      >
        {viewMode === 'expandible' ? (
          /* VISTA EXPANDIBLE - Toda la información en acordeón */
          <div className="space-y-3">
            {filteredHechos.map((hecho) => (
              <HechoExpandible key={hecho.id} hecho={hecho} />
            ))}
          </div>
        ) : (
          /* VISTA COMPACTA - Grid de tarjetas */
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredHechos.map((hecho) => (
              <HechoCard
                key={hecho.id}
                id={hecho.id}
                titulo={hecho.titulo}
                cuantia={hecho.cuantia}
                estado={hecho.estado}
                año={hecho.año}
                estrategia={hecho.estrategia}
                onClick={() => navigate(`/facts/${hecho.id}`)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* 6. Acciones rápidas - Optimizado móvil */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
        <button
          type="button"
          onClick={() => navigate('/analytics/prescripcion')}
          className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all"
        >
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          <span className="text-[10px] sm:text-xs font-medium text-slate-300">Prescr.</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/analytics/audiencia')}
          className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all"
        >
          <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          <span className="text-[10px] sm:text-xs font-medium text-slate-300">Audiencia</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/partidas')}
          className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          <span className="text-[10px] sm:text-xs font-medium text-slate-300">Partidas</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/warroom')}
          className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-rose-500/30 transition-all"
        >
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
          <span className="text-[10px] sm:text-xs font-medium text-slate-300">War Room</span>
        </button>
      </div>
    </AnalyticsLayout>
  );
}
