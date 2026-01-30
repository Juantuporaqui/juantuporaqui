import { textMuted, textPrimary } from '../tokens';

type StatProps = {
  label: string;
  value: string | number;
  delta?: string;
};

export default function Stat({ label, value, delta }: StatProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${textMuted}`}>
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
          {value}
        </span>
        {delta ? (
          <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-400 border border-slate-700/50">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
