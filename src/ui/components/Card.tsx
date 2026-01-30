import type { ReactNode } from 'react';
import { border, card, radius, shadowCard } from '../tokens';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`${card} ${border} ${shadowCard} ${className ?? ''}`}
      style={{ borderRadius: radius }}
    >
      {children}
    </div>
  );
}
