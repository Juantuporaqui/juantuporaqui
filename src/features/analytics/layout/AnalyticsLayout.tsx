import type { ReactNode } from 'react';

type AnalyticsLayoutProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AnalyticsLayout({
  title,
  subtitle,
  actions,
  children,
}: AnalyticsLayoutProps) {
  return (
    <div className="space-y-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/80 px-4 py-6 text-white shadow-[0_0_80px_rgba(15,23,42,0.45)] md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-emerald-300/70">
            Chaladita / Soporte a Litigios
          </div>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-slate-300">{subtitle}</p>
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
