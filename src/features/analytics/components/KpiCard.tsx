import type { ReactNode } from 'react';

type KpiCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export function KpiCard({ label, value, helper, icon, onClick }: KpiCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left transition hover:border-emerald-400/40 hover:bg-slate-900/80"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <span>{label}</span>
        {icon ? (
          <span className="text-lg text-emerald-300 group-hover:text-emerald-200">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {helper ? <div className="text-xs text-slate-400">{helper}</div> : null}
    </button>
  );
}
