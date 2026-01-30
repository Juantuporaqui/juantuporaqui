import { useNavigate } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { AmountPill } from '../components/AmountPill';
import { SectionCard } from '../components/SectionCard';
import { useAnalyticsMeta } from '../hooks/useAnalyticsMeta';
import { formatMoney } from '../utils/money';

const fixedHitos = [
  'Detección de vencimientos previos a 2019.',
  'Revisión de comunicaciones fehacientes.',
  'Verificación de interrupciones de plazo.',
];

export function PrescripcionPage() {
  const navigate = useNavigate();
  const { meta } = useAnalyticsMeta();

  const prescripcion = meta?.prescripcion;
  const impactoEstimado =
    prescripcion?.impactoPct && meta?.totalReclamado
      ? (meta.totalReclamado * prescripcion.impactoPct) / 100
      : null;

  return (
    <AnalyticsLayout
      title="Estrategia de prescripción"
      subtitle="Marco legal y cálculo de impacto"
      actions={
        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Volver al dashboard
        </button>
      }
    >
      <SectionCard
        title={prescripcion?.articulo || 'Art. 1964.2 CC'}
        subtitle="Estrategia de prescripción"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <AmountPill
            label="Fecha límite"
            value={prescripcion?.fechaCorte || 'Configurar'}
          />
          <AmountPill
            label="Impacto estimado"
            value={impactoEstimado ? formatMoney(impactoEstimado) : 'Configurar'}
          />
          <AmountPill
            label="% reducción"
            value={prescripcion?.impactoPct ? `${prescripcion.impactoPct}%` : '—'}
          />
        </div>
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {prescripcion?.narrativa
            ? prescripcion.narrativa
            : 'Añade la narrativa de cálculo del plazo en el panel de analítica.'}
        </div>
      </SectionCard>

      <SectionCard title="Hitos a marcar" subtitle="Checklist esencial">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          {fixedHitos.map((item) => (
            <li key={item}>{item}</li>
          ))}
          {prescripcion?.hitos?.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Impacto de prescripción"
        subtitle="Configura impacto y cuantías"
        action={
          <button
            type="button"
            onClick={() => navigate('/analytics/admin')}
            className="rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
          >
            Configurar analítica
          </button>
        }
      >
        <p className="text-sm text-slate-300">
          {impactoEstimado
            ? `Impacto estimado sobre ${formatMoney(meta?.totalReclamado)}: ${formatMoney(
                impactoEstimado,
              )}.`
            : 'Define el impacto para calcular la reducción estimada.'}
        </p>
      </SectionCard>
    </AnalyticsLayout>
  );
}
