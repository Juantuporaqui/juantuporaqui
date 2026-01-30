// ============================================
// CASE OPS - Chip/Tag Component
// ============================================

interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  onRemove?: () => void;
}

export function Chip({ label, variant = 'default', onRemove }: ChipProps) {
  const className = variant === 'default' ? 'chip' : `chip chip-${variant}`;

  return (
    <span className={className}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '4px',
            opacity: 0.7,
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
}

interface ChipsProps {
  items: string[];
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  onRemove?: (item: string) => void;
}

export function Chips({ items, variant = 'default', onRemove }: ChipsProps) {
  if (items.length === 0) return null;

  return (
    <div className="chips">
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          variant={variant}
          onRemove={onRemove ? () => onRemove(item) : undefined}
        />
      ))}
    </div>
  );
}
