// ============================================
// CASE OPS - Cases List (Dark Mode Fusion)
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components';
import {
  casesRepo,
  documentsRepo,
  eventsRepo,
  factsRepo,
  partidasRepo,
  strategiesRepo,
} from '../../db/repositories';
import type { Case, Document, Event, Fact, Partida, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

const STATUS_LABELS: Record<string, string> = {
  activo: 'Activo',
  suspendido: 'Suspendido',
  archivado: 'Archivado',
  cerrado: 'Cerrado',
};

const STATUS_BADGES: Record<string, string> = {
  activo: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  suspendido: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  archivado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
  cerrado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
};

const CARD_STYLES = [
  {
    accent: 'from-blue-900/70 via-slate-900/70 to-slate-950/90',
    border: 'border-blue-500/30 hover:border-blue-400/50',
    icon: '⚖️',
  },
  {
    accent: 'from-amber-900/40 via-slate-900/70 to-slate-950/90',
    border: 'border-amber-400/30 hover:border-amber-300/50',
    icon: '📌',
  },
  {
    accent: 'from-purple-900/50 via-slate-900/70 to-slate-950/90',
    border: 'border-purple-400/30 hover:border-purple-300/50',
    icon: '🛡️',
  },
  {
    accent: 'from-slate-800/60 via-slate-900/70 to-slate-950/90',
    border: 'border-slate-600/40 hover:border-slate-500/60',
    icon: '🧭',
  },
];

function getNextEvent(events: Event[]) {
  const now = Date.now();
  const upcoming = events
    .map((event) => ({ event, time: new Date(event.date).getTime() }))
    .filter(({ time }) => !Number.isNaN(time))
    .filter(({ time }) => time >= now)
    .sort((a, b) => a.time - b.time)[0];

  return upcoming?.event ?? null;
}

export function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      const [casesData, documentsData, factsData, partidasData, eventsData, strategiesData] =
        await Promise.all([
          casesRepo.getAll(),
          documentsRepo.getAll(),
          factsRepo.getAll(),
          partidasRepo.getAll(),
          eventsRepo.getAll(),
          strategiesRepo.getAll(),
        ]);

      setCases(casesData);
      setDocuments(documentsData);
      setFacts(factsData);
      setPartidas(partidasData);
      setEvents(eventsData);
      setStrategies(strategiesData);
      setLoading(false);
    }

    loadCases().catch((error) => {
      console.error('Error loading cases:', error);
      setLoading(false);
    });
  }, []);

  // Ordenar para que Picassent aparezca primero
  const mainCases = useMemo(() => {
    const filtered = cases.filter((caseItem) => !caseItem.parentCaseId);
    return filtered.sort((a, b) => {
      // Picassent siempre primero
      const aIsPicassent = a.title.toLowerCase().includes('picassent') || a.autosNumber?.includes('715/2024');
      const bIsPicassent = b.title.toLowerCase().includes('picassent') || b.autosNumber?.includes('715/2024');
      if (aIsPicassent && !bIsPicassent) return -1;
      if (!aIsPicassent && bIsPicassent) return 1;
      return 0;
    });
  }, [cases]);
  const childCases = useMemo(() => cases.filter((caseItem) => caseItem.parentCaseId), [cases]);

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando casos...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Procedimientos principales
          </p>
          <h1 className="text-3xl font-semibold text-white">Mapa de frentes judiciales</h1>
          <p className="mt-1 text-sm text-slate-400">
            {mainCases.length} procedimientos activos con su documentación, hechos y estrategia.
          </p>
        </div>
        <Link
          to="/analytics"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400/40"
        >
          Ver tablero ejecutivo
        </Link>
      </div>

      {cases.length === 0 ? (
        <EmptyState title="Sin casos" description="Crea tu primer procedimiento judicial." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {mainCases.map((caseItem, index) => {
            const accent = CARD_STYLES[index % CARD_STYLES.length];
            const docs = documents.filter((doc) => doc.caseId === caseItem.id);
            const caseFacts = facts.filter((fact) => fact.caseId === caseItem.id);
            const caseStrategies = strategies.filter((strategy) => strategy.caseId === caseItem.id);
            const casePartidas = partidas.filter((partida) => partida.caseId === caseItem.id);
            const caseEvents = events.filter((event) => event.caseId === caseItem.id);
            const pendingFacts = caseFacts.filter(
              (fact) => fact.status === 'controvertido' || fact.status === 'a_probar'
            );
            const totalAmount = casePartidas.reduce((sum, partida) => sum + partida.amountCents, 0);
            const nextEvent = getNextEvent(caseEvents);
            const children = childCases.filter((child) => child.parentCaseId === caseItem.id);

            return (
              <Link
                key={caseItem.id}
                to={`/cases/${caseItem.id}`}
                className="group flex h-full"
              >
                <div
                  className={`flex h-full w-full flex-col gap-6 rounded-2xl border bg-gradient-to-br ${accent.accent} ${accent.border} p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl">
                        {accent.icon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold text-white">{caseItem.title}</h2>
                          <span
                            className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${
                              STATUS_BADGES[caseItem.status] || 'border-white/10 bg-white/5 text-slate-300'
                            }`}
                          >
                            {STATUS_LABELS[caseItem.status] || caseItem.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                          {caseItem.type} · {caseItem.autosNumber || 'Sin autos'}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">{caseItem.court}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Documentos
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">{docs.length}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Hechos clave
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">{pendingFacts.length}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Estrategias
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">{caseStrategies.length}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      {casePartidas.length} partidas
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      {caseEvents.length} eventos
                    </span>
                    {children.length > 0 && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {children.length} procedimientos vinculados
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Próximo hito
                      </div>
                      <div className="text-sm text-slate-200">
                        {nextEvent ? `${nextEvent.title} · ${formatDate(nextEvent.date)}` : 'Sin eventos próximos'}
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                      Ver dossier →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
