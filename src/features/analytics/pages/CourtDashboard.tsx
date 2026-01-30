import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AnalyticsCourtSlug } from '../../../types';
import { AmountPill } from '../components/AmountPill';
import { SectionCard } from '../components/SectionCard';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { useAnalyticsMeta } from '../hooks/useAnalyticsMeta';
import { formatMoney, formatNumber } from '../utils/money';
import { getCourtMeta } from '../utils/analytics';

export function CourtDashboard() {
  const { court } = useParams();
  const navigate = useNavigate();
  const { meta } = useAnalyticsMeta();

  const slug = (court || 'otros') as AnalyticsCourtSlug;
  const courtMeta = useMemo(() => getCourtMeta(meta, slug), [meta, slug]);

  const totalReclamado = courtMeta?.cuantia ?? meta?.totalReclamado ?? null;
  const prescritoEstimado =
    meta?.totalReclamado && meta?.objetivoReduccionPct
      ? (meta.totalReclamado * meta.objetivoReduccionPct) / 100
      : null;

  return (
    <AnalyticsLayout
      title={courtMeta?.title ?? 'Frente Judicial'}
      subtitle={courtMeta?.procedimiento || 'Detalle operativo del juzgado'}
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
        title="Objetivo procesal actual"
        subtitle="Fase y foco inmediato"
      >
        <p className="text-sm text-slate-200">
          {courtMeta?.fase || courtMeta?.proximoHito || 'Define la fase en el panel de analítica.'}
        </p>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AmountPill label="Total reclamado" value={formatMoney(totalReclamado)} />
        <AmountPill label="Prescrito estimado" value={formatMoney(prescritoEstimado)} />
        <AmountPill label="Riesgo real" value={formatMoney(meta?.riesgoReal)} />
        <AmountPill label="Estrategias" value={formatNumber(meta?.estrategiasActivas)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Desglose de hechos"
          subtitle="Contador de la verdad"
          action={
            <button
              type="button"
              onClick={() => navigate('/analytics/hechos')}
              className="rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
            >
              Ver hechos
            </button>
          }
        >
          <p className="text-sm text-slate-300">
            Accede al desglose económico y a las partidas para reforzar la narrativa del caso.
          </p>
        </SectionCard>

        <SectionCard title="Audiencia previa" subtitle="Checklist y preparación">
          <div className="space-y-2 text-sm text-slate-300">
            <div>• Identificar contradicciones críticas.</div>
            <div>• Actualizar líneas de tiempo y evidencias.</div>
            <div>• Revisar estrategia de prescripción.</div>
          </div>
        </SectionCard>

        <SectionCard title="Herramientas" subtitle="Atajos de operación">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Documentos clave
            </button>
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Casos relacionados
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="Qué falta para ir fuerte"
          subtitle="Checklist editable"
          action={
            <button
              type="button"
              onClick={() => navigate('/analytics/admin')}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
            >
              Editar
            </button>
          }
        >
          {meta?.pendientes && meta.pendientes.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              {meta.pendientes.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Añade los pendientes desde el panel de configuración.
            </div>
          )}
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
