import type { ReactNode } from 'react';

type AmountPillProps = {
  label: string;
  value: string;
  icon?: ReactNode;
};

export function AmountPill({ label, value, icon }: AmountPillProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-300">
      <span className="flex items-center gap-2">
        {icon ? <span className="text-emerald-300">{icon}</span> : null}
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
