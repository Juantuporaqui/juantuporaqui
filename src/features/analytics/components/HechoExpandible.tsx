// ============================================
// HECHO EXPANDIBLE - Muestra toda la información detallada
// ============================================

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Shield, Sword, Scale, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { HechoReclamado, EstadoHecho } from '../../../data/hechosReclamados';

interface HechoExpandibleProps {
  hecho: HechoReclamado;
}

const estadoConfig: Record<EstadoHecho, { bg: string; border: string; text: string; label: string; icon: typeof Clock }> = {
  prescrito: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    label: 'Prescrito',
    icon: Clock,
  },
  compensable: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    label: 'Compensable',
    icon: Scale,
  },
  disputa: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    label: 'En disputa',
    icon: AlertTriangle,
  },
};

export function HechoExpandible({ hecho }: HechoExpandibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = estadoConfig[hecho.estado];
  const EstadoIcon = config.icon;

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden transition-all duration-300`}>
      {/* HEADER - Siempre visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-start gap-3 hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 text-sm font-bold text-slate-300 shrink-0">
          {hecho.id}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border} flex items-center gap-1`}>
              <EstadoIcon size={10} />
              {config.label}
            </span>
            <span className="text-[10px] text-slate-500">{hecho.año}</span>
          </div>

          <h3 className="font-semibold text-white text-sm leading-tight mb-1">
            {hecho.titulo}
          </h3>

          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold ${config.text}`}>
              {hecho.cuantia.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500">€</span>
          </div>
        </div>

        <div className="shrink-0 mt-1">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* CONTENIDO EXPANDIDO - Optimizado móvil */}
      {isExpanded && (
        <div className="px-3 sm:px-4 pb-4 space-y-3 sm:space-y-4 border-t border-slate-700/30 pt-3 sm:pt-4 animate-in slide-in-from-top-2 duration-200">

          {/* LO QUE DICE LA ACTORA */}
          <div className="rounded-lg sm:rounded-xl bg-rose-950/30 border border-rose-500/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sword size={14} className="text-rose-400 sm:w-4 sm:h-4" />
              <h4 className="text-xs sm:text-sm font-bold text-rose-400 uppercase tracking-wider">Demandante</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {hecho.hechoActora}
            </p>
          </div>

          {/* REALIDAD DE LOS HECHOS */}
          <div className="rounded-lg sm:rounded-xl bg-emerald-950/30 border border-emerald-500/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-emerald-400 sm:w-4 sm:h-4" />
              <h4 className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">Realidad</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {hecho.realidadHechos}
            </p>
          </div>

          {/* ARGUMENTOS DE OPOSICIÓN */}
          {hecho.oposicion && hecho.oposicion.length > 0 && (
            <div className="rounded-lg sm:rounded-xl bg-blue-950/30 border border-blue-500/20 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Scale size={14} className="text-blue-400 sm:w-4 sm:h-4" />
                <h4 className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">Defensa</h4>
              </div>
              <ul className="space-y-2">
                {hecho.oposicion.map((arg, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 size={12} className="text-blue-400 shrink-0 mt-0.5 sm:w-3.5 sm:h-3.5" />
                    <span>{arg}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ESTRATEGIA DE DEFENSA */}
          <div className="rounded-lg sm:rounded-xl bg-amber-950/30 border border-amber-500/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-amber-400 sm:w-4 sm:h-4" />
              <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">Estrategia</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {hecho.estrategia}
            </p>
          </div>

          {/* DOCUMENTOS DE PRUEBA */}
          {hecho.documentosRef && hecho.documentosRef.length > 0 && (
            <div className="rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <FileText size={14} className="text-cyan-400 sm:w-4 sm:h-4" />
                <h4 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">Documentos</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {hecho.documentosRef.map((doc, i) => (
                  <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-700/50 text-[10px] sm:text-xs text-slate-300 font-mono border border-slate-600/50">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAREAS PENDIENTES */}
          {hecho.tareas && hecho.tareas.length > 0 && (
            <div className="rounded-lg sm:rounded-xl bg-purple-950/30 border border-purple-500/20 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <CheckCircle2 size={14} className="text-purple-400 sm:w-4 sm:h-4" />
                <h4 className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider">Tareas</h4>
              </div>
              <ul className="space-y-2">
                {hecho.tareas.map((tarea, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-purple-500/50 flex items-center justify-center text-[9px] sm:text-[10px] text-purple-400 shrink-0">
                      {i + 1}
                    </span>
                    <span>{tarea}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* VINCULACIÓN */}
          {hecho.vinculadoA && (
            <div className="text-xs text-slate-500 italic">
              Vinculado al Hecho #{hecho.vinculadoA}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
