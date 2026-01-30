import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnalyticsCourtMeta, AnalyticsMeta, AnalyticsTimelineItem } from '../../../types';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';
import { useAnalyticsMeta } from '../hooks/useAnalyticsMeta';
import { DEFAULT_ANALYTICS_META } from '../utils/analytics';

const statusOptions = ['ok', 'warn', 'danger', 'info'] as const;

function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatNumberInput(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '';
  }
  return String(value);
}

export function AnalyticsAdminPage() {
  const navigate = useNavigate();
  const { meta, saveMeta } = useAnalyticsMeta();
  const [form, setForm] = useState<AnalyticsMeta>(DEFAULT_ANALYTICS_META);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (meta) {
      setForm(meta);
    }
  }, [meta]);

  const courts = form.courts ?? [];
  const timeline = form.lineaTemporal ?? [];

  const prescripcionHitosValue = useMemo(
    () => (form.prescripcion?.hitos ?? []).join('\n'),
    [form.prescripcion?.hitos],
  );

  const pendientesValue = useMemo(
    () => (form.pendientes ?? []).join('\n'),
    [form.pendientes],
  );

  const handleSave = async () => {
    await saveMeta({
      ...form,
      lineaTemporal: form.lineaTemporal ?? [],
      courts: form.courts ?? [],
      prescripcion: {
        ...form.prescripcion,
        articulo: form.prescripcion?.articulo || 'Art. 1964.2 CC',
        fechaCorte: form.prescripcion?.fechaCorte || '',
        narrativa: form.prescripcion?.narrativa || '',
      },
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const updateCourt = (index: number, patch: Partial<AnalyticsCourtMeta>) => {
    const next = [...courts];
    next[index] = { ...next[index], ...patch };
    setForm({ ...form, courts: next });
  };

  const updateTimeline = (
    index: number,
    patch: Partial<AnalyticsTimelineItem>,
  ) => {
    const next = [...timeline];
    next[index] = { ...next[index], ...patch };
    setForm({ ...form, lineaTemporal: next });
  };

  return (
    <AnalyticsLayout
      title="Analytics Control Panel"
      subtitle="Configura métricas y narrativa estratégica"
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
        title="KPIs globales"
        subtitle="Estos valores no existen en Dexie"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Total reclamado (€)
            <input
              value={formatNumberInput(form.totalReclamado)}
              onChange={(event) =>
                setForm({
                  ...form,
                  totalReclamado: parseNumber(event.target.value),
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Riesgo real (€)
            <input
              value={formatNumberInput(form.riesgoReal)}
              onChange={(event) =>
                setForm({
                  ...form,
                  riesgoReal: parseNumber(event.target.value),
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Objetivo reducción (%)
            <input
              value={formatNumberInput(form.objetivoReduccionPct)}
              onChange={(event) =>
                setForm({
                  ...form,
                  objetivoReduccionPct: parseNumber(event.target.value),
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Audiencia fecha
            <input
              value={form.audienciaFecha ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  audienciaFecha: event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Estrategias activas
            <input
              value={formatNumberInput(form.estrategiasActivas)}
              onChange={(event) =>
                setForm({
                  ...form,
                  estrategiasActivas: parseNumber(event.target.value),
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Días hasta vista
            <input
              value={formatNumberInput(form.diasHastaVista)}
              onChange={(event) =>
                setForm({
                  ...form,
                  diasHastaVista: parseNumber(event.target.value),
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Frentes judiciales" subtitle="Juzgados y fases">
        <div className="space-y-4">
          {courts.map((court, index) => (
            <div
              key={`${court.slug}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm text-slate-300">
                  Slug
                  <input
                    value={court.slug}
                    onChange={(event) =>
                      updateCourt(index, {
                        slug: event.target.value as AnalyticsCourtMeta['slug'],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Título
                  <input
                    value={court.title}
                    onChange={(event) => updateCourt(index, { title: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Procedimiento
                  <input
                    value={court.procedimiento ?? ''}
                    onChange={(event) => updateCourt(index, { procedimiento: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Juzgado
                  <input
                    value={court.juzgado ?? ''}
                    onChange={(event) => updateCourt(index, { juzgado: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Cuantía (€)
                  <input
                    value={formatNumberInput(court.cuantia)}
                    onChange={(event) => updateCourt(index, { cuantia: parseNumber(event.target.value) })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Fase
                  <input
                    value={court.fase ?? ''}
                    onChange={(event) => updateCourt(index, { fase: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Próximo hito
                  <input
                    value={court.proximoHito ?? ''}
                    onChange={(event) => updateCourt(index, { proximoHito: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Tags (separados por coma)
                  <input
                    value={(court.tags ?? []).join(', ')}
                    onChange={(event) =>
                      updateCourt(index, {
                        tags: event.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    courts: courts.filter((_, courtIndex) => courtIndex !== index),
                  })
                }
                className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200"
              >
                Eliminar frente
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              courts: [
                ...courts,
                {
                  slug: 'otros',
                  title: 'Nuevo frente',
                },
              ],
            })
          }
          className="mt-4 rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
        >
          Añadir frente
        </button>
      </SectionCard>

      <SectionCard title="Línea temporal" subtitle="Hitos y alertas">
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-sm text-slate-300">
                  Etiqueta
                  <input
                    value={item.label}
                    onChange={(event) => updateTimeline(index, { label: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Fecha
                  <input
                    value={item.date}
                    onChange={(event) => updateTimeline(index, { date: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Estado
                  <select
                    value={item.status ?? 'info'}
                    onChange={(event) =>
                      updateTimeline(index, {
                        status: event.target.value as AnalyticsTimelineItem['status'],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    lineaTemporal: timeline.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
                className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200"
              >
                Eliminar hito
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              lineaTemporal: [
                ...timeline,
                {
                  label: 'Nuevo hito',
                  date: '',
                  status: 'info',
                },
              ],
            })
          }
          className="mt-4 rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
        >
          Añadir hito
        </button>
      </SectionCard>

      <SectionCard title="Prescripción" subtitle="Configura el marco legal">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Artículo
            <input
              value={form.prescripcion?.articulo ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  prescripcion: {
                    ...form.prescripcion,
                    articulo: event.target.value,
                    fechaCorte: form.prescripcion?.fechaCorte ?? '',
                    narrativa: form.prescripcion?.narrativa ?? '',
                  },
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Fecha corte
            <input
              value={form.prescripcion?.fechaCorte ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  prescripcion: {
                    ...form.prescripcion,
                    fechaCorte: event.target.value,
                    articulo: form.prescripcion?.articulo ?? 'Art. 1964.2 CC',
                    narrativa: form.prescripcion?.narrativa ?? '',
                  },
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            Impacto (%)
            <input
              value={formatNumberInput(form.prescripcion?.impactoPct)}
              onChange={(event) =>
                setForm({
                  ...form,
                  prescripcion: {
                    ...form.prescripcion,
                    impactoPct: parseNumber(event.target.value),
                    articulo: form.prescripcion?.articulo ?? 'Art. 1964.2 CC',
                    fechaCorte: form.prescripcion?.fechaCorte ?? '',
                    narrativa: form.prescripcion?.narrativa ?? '',
                  },
                })
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300 md:col-span-2">
            Narrativa
            <textarea
              value={form.prescripcion?.narrativa ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  prescripcion: {
                    ...form.prescripcion,
                    narrativa: event.target.value,
                    articulo: form.prescripcion?.articulo ?? 'Art. 1964.2 CC',
                    fechaCorte: form.prescripcion?.fechaCorte ?? '',
                  },
                })
              }
              rows={4}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
          <label className="text-sm text-slate-300 md:col-span-2">
            Hitos (uno por línea)
            <textarea
              value={prescripcionHitosValue}
              onChange={(event) =>
                setForm({
                  ...form,
                  prescripcion: {
                    ...form.prescripcion,
                    hitos: event.target.value
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean),
                    articulo: form.prescripcion?.articulo ?? 'Art. 1964.2 CC',
                    fechaCorte: form.prescripcion?.fechaCorte ?? '',
                    narrativa: form.prescripcion?.narrativa ?? '',
                  },
                })
              }
              rows={4}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Pendientes" subtitle="Qué falta para ir fuerte">
        <label className="text-sm text-slate-300">
          Lista (uno por línea)
          <textarea
            value={pendientesValue}
            onChange={(event) =>
              setForm({
                ...form,
                pendientes: event.target.value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
          />
        </label>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full border border-emerald-400/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
        >
          Guardar
        </button>
        {saved ? (
          <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">
            Guardado
          </span>
        ) : null}
      </div>
    </AnalyticsLayout>
  );
}
