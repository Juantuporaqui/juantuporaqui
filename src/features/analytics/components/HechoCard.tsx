import { ChevronRight } from 'lucide-react';

export type HechoEstado = 'prescrito' | 'compensable' | 'disputa';

interface HechoCardProps {
  id: number;
  titulo: string;
  cuantia: number;
  estado: HechoEstado;
  año: number;
  estrategia?: string;
  onClick?: () => void;
}

const estadoConfig: Record<HechoEstado, { bg: string; border: string; text: string; label: string; icon: string }> = {
  prescrito: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    label: 'Prescrito',
    icon: '⏰',
  },
  compensable: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    label: 'Compensable',
    icon: '⚖️',
  },
  disputa: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    label: 'En disputa',
    icon: '⚔️',
  },
};

export function HechoCard({ id, titulo, cuantia, estado, año, estrategia, onClick }: HechoCardProps) {
  const config = estadoConfig[estado];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl border ${config.border} ${config.bg}
        p-4 transition-all duration-200
        hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-emerald-400/50
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header con número y badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-xs font-bold text-slate-300">
              {id}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
              {config.icon} {config.label}
            </span>
            <span className="text-[10px] text-slate-500 ml-auto">
              {año}
            </span>
          </div>

          {/* Título */}
          <h3 className="font-semibold text-white text-sm leading-tight mb-1 truncate">
            {titulo}
          </h3>

          {/* Estrategia resumida */}
          {estrategia && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-2">
              {estrategia}
            </p>
          )}

          {/* Cuantía */}
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold ${config.text}`}>
              {cuantia.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500">€</span>
          </div>
        </div>

        {/* Flecha */}
        <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}

// Badge pequeño para resúmenes
interface HechoBadgeProps {
  count: number;
  estado: HechoEstado;
}

export function HechoBadge({ count, estado }: HechoBadgeProps) {
  const config = estadoConfig[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
      {count} {config.label}
    </span>
  );
}
