// ============================================
// CASE OPS - List Item Component
// ============================================

import type { ReactNode } from 'react';

interface ListItemProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  icon,
  title,
  subtitle,
  action,
  onClick,
  className = '',
}: ListItemProps) {
  return (
    <div
      className={`list-item ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <div className="list-item-icon">{icon}</div>}
      <div className="list-item-content">
        <div className="list-item-title">{title}</div>
        {subtitle && <div className="list-item-subtitle">{subtitle}</div>}
      </div>
      {action && <div className="list-item-action">{action}</div>}
    </div>
  );
}
