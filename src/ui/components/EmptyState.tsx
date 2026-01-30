import type { ReactNode } from 'react';
import { textMuted } from '../tokens';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-2 text-left">
      <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
      {description ? <p className={`text-sm ${textMuted}`}>{description}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
