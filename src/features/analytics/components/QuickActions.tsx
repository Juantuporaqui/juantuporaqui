import { useNavigate } from 'react-router-dom';

const actions = [
  { label: 'Checklist Audiencia', to: '/analytics/prescripcion' },
  { label: 'Doc. 25', to: '/documents' },
  { label: 'Calculadora', to: '/analytics/hechos' },
  { label: 'Evidencias', to: '/facts' },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => navigate(action.to)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
