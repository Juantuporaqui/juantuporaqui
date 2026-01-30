import { Link } from 'react-router-dom';

type ActionButtonProps = {
  label: string;
  to: string;
  tone?: 'primary' | 'ghost';
};

export function ActionButton({ label, to, tone = 'primary' }: ActionButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition';
  const styles =
    tone === 'primary'
      ? 'bg-zinc-900 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]'
      : 'border border-zinc-200/70 bg-white text-slate-700';

  return (
    <Link to={to} className={`${baseClasses} ${styles}`}>
      {label}
    </Link>
  );
}
