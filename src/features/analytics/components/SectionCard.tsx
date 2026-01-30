import type { ReactNode } from 'react';

type SectionCardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-slate-300">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
