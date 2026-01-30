// ============================================
// CHALADITA CASE-OPS - Hecho Card Expandible
// Tarjeta de hecho con detalle al pulsar
// ============================================

import { useState } from 'react';
import type { HechoCase, Riesgo } from '../types/caseops';

interface HechoCardChaladataProps {
  hecho: HechoCase;
  documentosVinculados?: number;
}

const riesgoConfig: Record<Riesgo, { bg: string; border: string; text: string; label: string }> = {
  bajo: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    label: 'Bajo',
  },
  medio: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    label: 'Medio',
  },
  alto: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    label: 'Alto',
  },
};

const fuerzaStars = (fuerza: number) => {
  return '★'.repeat(fuerza) + '☆'.repeat(5 - fuerza);
};

export function HechoCardChaladitaExpandible({ hecho, documentosVinculados = 0 }: HechoCardChaladataProps) {
  const [expanded, setExpanded] = useState(false);
  const config = riesgoConfig[hecho.riesgo];

  return (
    <div
      className={`
        rounded-2xl border ${config.border} ${config.bg}
        transition-all duration-300 overflow-hidden
        ${expanded ? 'shadow-lg shadow-black/30' : ''}
      `}
    >
      {/* Header - siempre visible, clickeable */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 focus:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badge de riesgo y fecha */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300">
                {hecho.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                Riesgo {config.label}
              </span>
              <span className="text-[10px] text-slate-500">
                {hecho.fecha.includes('/') ? hecho.fecha : hecho.fecha}
              </span>
            </div>

            {/* Título */}
            <h3 className="font-semibold text-white text-sm leading-tight mb-1">
              {hecho.titulo}
            </h3>

            {/* Resumen corto */}
            <p className="text-xs text-slate-400 line-clamp-2">
              {hecho.resumenCorto}
            </p>

            {/* Fuerza */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-500">Fuerza:</span>
              <span className="text-amber-400 text-xs tracking-wider">{fuerzaStars(hecho.fuerza)}</span>
            </div>
          </div>

          {/* Flecha expandir */}
          <span className={`text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Contenido expandido */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50 space-y-4">
          {/* Tesis */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1 font-semibold">
              Tesis (Nuestra posición)
            </h4>
            <p className="text-sm text-slate-200 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">
              {hecho.tesis}
            </p>
          </div>

          {/* Antítesis */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-rose-400 mb-1 font-semibold">
              Antítesis esperada (Contrario)
            </h4>
            <p className="text-sm text-slate-200 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
              {hecho.antitesisEsperada}
            </p>
          </div>

          {/* Pruebas esperadas */}
          {hecho.pruebasEsperadas.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-amber-400 mb-1 font-semibold">
                Pruebas esperadas ({hecho.pruebasEsperadas.length})
              </h4>
              <ul className="space-y-1">
                {hecho.pruebasEsperadas.map((prueba, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="text-amber-400">•</span>
                    {prueba}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {hecho.tags.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {hecho.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documentos vinculados */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <span className="text-[10px] text-slate-500">
              Documentos vinculados: <span className="text-cyan-400 font-semibold">{documentosVinculados}</span>
            </span>
            <span className="text-[10px] text-slate-600">
              Actualizado: {new Date(hecho.updatedAt).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HechoCardChaladitaExpandible;
