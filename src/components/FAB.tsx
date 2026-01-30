// ============================================
// CASE OPS - Floating Action Button
// ============================================

interface FABProps {
  onClick: () => void;
  icon?: string;
  label?: string;
}

export function FAB({ onClick, icon = '+', label }: FABProps) {
  return (
    <button className="fab" onClick={onClick} aria-label={label || 'Añadir'}>
      {icon}
    </button>
  );
}
