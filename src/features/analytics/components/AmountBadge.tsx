import type { ReactNode } from 'react';

type AmountBadgeProps = {
  children: ReactNode;
};

export function AmountBadge({ children }: AmountBadgeProps) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
      {children}
    </span>
  );
}
