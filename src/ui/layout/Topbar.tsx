import type { ReactNode } from 'react';
import { accent, appMaxWidth, textMuted } from '../tokens';

type TopbarProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function Topbar({ title = 'Case Ops', subtitle = 'Legal-tech workspace', actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/90 backdrop-blur">
      <div
        className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-4 md:px-8"
        style={{ maxWidth: appMaxWidth }}
      >
        <div>
          <div className={`text-lg font-semibold ${accent}`}>{title}</div>
          <div className={`text-xs uppercase tracking-[0.2em] ${textMuted}`}>
            {subtitle}
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
