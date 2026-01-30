import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/schema';
import type { CaseStatus, PartidaState } from '../../../types';

const emptyCounts: Record<string, number> = {};

export function useAnalyticsComputed() {
  const stats = useLiveQuery(async () => {
    const [cases, documentsCount, factsCount, partidas, events, tasks] =
      await Promise.all([
        db.cases.toArray(),
        db.documents.count(),
        db.facts.count(),
        db.partidas.toArray(),
        db.events.toArray(),
        db.tasks.toArray(),
      ]);

    const casesByStatus = cases.reduce<Record<string, number>>((acc, item) => {
      const key = item.status || 'sin_estado';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const partidasSumCents = partidas.reduce(
      (acc, item) => acc + (item.amountCents ?? 0),
      0,
    );

    const partidasByState = partidas.reduce<Record<string, number>>((acc, item) => {
      const key = item.state || 'sin_clasificar';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const nowIso = new Date().toISOString();
    const upcomingEvents = events
      .filter((event) => event.date >= nowIso)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);

    return {
      totalCases: cases.length,
      casesByStatus,
      documentsCount,
      factsCount,
      partidasCount: partidas.length,
      partidasSumCents,
      partidasByState,
      eventsCount: events.length,
      upcomingEvents,
      tasksCount: tasks.length,
      cases,
      partidas,
    };
  }, []);

  return {
    totalCases: stats?.totalCases ?? 0,
    casesByStatus: stats?.casesByStatus ?? emptyCounts,
    documentsCount: stats?.documentsCount ?? 0,
    factsCount: stats?.factsCount ?? 0,
    partidasCount: stats?.partidasCount ?? 0,
    partidasSumCents: stats?.partidasSumCents ?? 0,
    partidasByState: stats?.partidasByState ?? emptyCounts,
    eventsCount: stats?.eventsCount ?? 0,
    upcomingEvents: stats?.upcomingEvents ?? [],
    tasksCount: stats?.tasksCount ?? 0,
    cases: stats?.cases ?? [],
    partidas: stats?.partidas ?? [],
  };
}

export function getStatusLabel(status: CaseStatus | string): string {
  switch (status) {
    case 'activo':
      return 'Activo';
    case 'suspendido':
      return 'Suspendido';
    case 'archivado':
      return 'Archivado';
    case 'cerrado':
      return 'Cerrado';
    default:
      return 'Sin estado';
  }
}

export function getPartidaLabel(state: PartidaState | string): string {
  switch (state) {
    case 'prescrita_interna':
      return 'Prescrito';
    case 'reclamable':
      return 'Compensable';
    case 'discutida':
      return 'En disputa';
    case 'neutral':
      return 'Neutral';
    default:
      return 'Sin clasificar';
  }
}
