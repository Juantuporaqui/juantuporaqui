import type { AnalyticsTimelineItem } from '../../../types';
import { SectionCard } from './SectionCard';

type TimelineProps = {
  items: AnalyticsTimelineItem[];
  onConfigure?: () => void;
};

const statusStyles: Record<string, string> = {
  ok: 'bg-emerald-400/80',
  warn: 'bg-amber-400/80',
  danger: 'bg-rose-400/80',
  info: 'bg-sky-400/80',
};

export function Timeline({ items, onConfigure }: TimelineProps) {
  if (!items.length) {
    return (
      <SectionCard
        title="Línea temporal del caso"
        subtitle="Añade hitos procesales y estratégicos"
        action={
          <button
            type="button"
            onClick={onConfigure}
            className="rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
          >
            Configurar
          </button>
        }
      >
        <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
          Sin hitos registrados. Configura la línea temporal para reflejar el avance del caso.
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Línea temporal del caso" subtitle="Hitos y alertas críticas">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  statusStyles[item.status ?? 'info'] || statusStyles.info
                }`}
              />
              {index < items.length - 1 ? (
                <div className="mt-1 h-full w-px flex-1 bg-white/10" />
              ) : null}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">{item.label}</div>
              <div className="text-xs text-slate-400">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
