import type {
  AnalyticsCourtMeta,
  AnalyticsCourtSlug,
  AnalyticsMeta,
  AnalyticsTimelineItem,
} from '../../../types';

export const DEFAULT_COURTS: AnalyticsCourtMeta[] = [
  {
    slug: 'picassent',
    title: 'Picassent',
  },
  {
    slug: 'quart',
    title: 'Quart',
  },
  {
    slug: 'mislata',
    title: 'Mislata',
  },
  {
    slug: 'otros',
    title: 'Otros',
  },
];

export const DEFAULT_TIMELINE: AnalyticsTimelineItem[] = [];

export const DEFAULT_ANALYTICS_META: AnalyticsMeta = {
  id: 'global',
  totalReclamado: null,
  riesgoReal: null,
  objetivoReduccionPct: null,
  audienciaFecha: null,
  estrategiasActivas: null,
  diasHastaVista: null,
  lineaTemporal: DEFAULT_TIMELINE,
  courts: DEFAULT_COURTS,
  prescripcion: {
    articulo: 'Art. 1964.2 CC',
    fechaCorte: '',
    narrativa: '',
    impactoPct: null,
    hitos: [],
  },
  pendientes: [],
  updatedAt: new Date().toISOString(),
};

export function getCourtMeta(
  meta: AnalyticsMeta | undefined,
  slug: AnalyticsCourtSlug,
): AnalyticsCourtMeta | undefined {
  return meta?.courts.find((court) => court.slug === slug);
}
