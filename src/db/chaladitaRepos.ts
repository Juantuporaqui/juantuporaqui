// ============================================
// CHALADITA CASE-OPS - Repositories + Hooks
// Selectores async + hooks reactivos con useLiveQuery
// ============================================

import { useLiveQuery } from 'dexie-react-hooks';
import { chaladitaDb } from './chaladitaDb';
import type {
  ProcedimientoCase,
  HechoCase,
  DocumentoCase,
  PartidaEconomica,
  TareaProc,
  HitoProc,
  TimelineItem,
  TimelineItemAgg,
} from '../types/caseops';

// ============================================
// PROCEDIMIENTOS
// ============================================

export async function getProcedimientos(): Promise<ProcedimientoCase[]> {
  return chaladitaDb.procedimientos.toArray();
}

export function useProcedimientos(): ProcedimientoCase[] {
  return useLiveQuery(() => chaladitaDb.procedimientos.toArray(), []) ?? [];
}

export async function getProcedimientoById(id: string): Promise<ProcedimientoCase | undefined> {
  return chaladitaDb.procedimientos.get(id);
}

export function useProcedimientoById(id: string): ProcedimientoCase | undefined {
  return useLiveQuery(() => chaladitaDb.procedimientos.get(id), [id]);
}

// ============================================
// HECHOS
// ============================================

export async function getHechosByProcedimiento(procedimientoId: string): Promise<HechoCase[]> {
  return chaladitaDb.hechos.where('procedimientoId').equals(procedimientoId).toArray();
}

export function useHechosByProcedimiento(procedimientoId: string): HechoCase[] {
  return useLiveQuery(
    () => chaladitaDb.hechos.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  ) ?? [];
}

/**
 * Hechos sin prueba: tienen pruebasEsperadas pero no hay documentos vinculados
 * Criterio: pruebasEsperadas.length > 0 pero no hay docs con ese hecho en hechosIds
 */
export async function getHechosSinPrueba(caseId?: string): Promise<HechoCase[]> {
  const [hechos, documentos] = await Promise.all([
    caseId
      ? chaladitaDb.hechos.where('procedimientoId').equals(caseId).toArray()
      : chaladitaDb.hechos.toArray(),
    chaladitaDb.documentos.toArray(),
  ]);

  // Set de hechos que tienen al menos un documento vinculado
  const hechosConDoc = new Set<string>();
  for (const doc of documentos) {
    for (const hId of doc.hechosIds) {
      hechosConDoc.add(hId);
    }
  }

  // Filtrar hechos que esperan pruebas pero no tienen docs
  return hechos.filter(
    (h) => h.pruebasEsperadas.length > 0 && !hechosConDoc.has(h.id)
  );
}

export function useHechosSinPrueba(caseId?: string): HechoCase[] {
  return useLiveQuery(
    async () => {
      const [hechos, documentos] = await Promise.all([
        caseId
          ? chaladitaDb.hechos.where('procedimientoId').equals(caseId).toArray()
          : chaladitaDb.hechos.toArray(),
        chaladitaDb.documentos.toArray(),
      ]);

      const hechosConDoc = new Set<string>();
      for (const doc of documentos) {
        for (const hId of doc.hechosIds) {
          hechosConDoc.add(hId);
        }
      }

      return hechos.filter(
        (h) => h.pruebasEsperadas.length > 0 && !hechosConDoc.has(h.id)
      );
    },
    [caseId]
  ) ?? [];
}

// ============================================
// DOCUMENTOS
// ============================================

export async function getDocumentosByProcedimiento(procedimientoId: string): Promise<DocumentoCase[]> {
  return chaladitaDb.documentos.where('procedimientoId').equals(procedimientoId).toArray();
}

export function useDocumentosByProcedimiento(procedimientoId: string): DocumentoCase[] {
  return useLiveQuery(
    () => chaladitaDb.documentos.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  ) ?? [];
}

// ============================================
// PARTIDAS ECONÓMICAS
// ============================================

export async function getPartidasByProcedimiento(procedimientoId: string): Promise<PartidaEconomica[]> {
  return chaladitaDb.partidas.where('procedimientoId').equals(procedimientoId).toArray();
}

export function usePartidasByProcedimiento(procedimientoId: string): PartidaEconomica[] {
  return useLiveQuery(
    () => chaladitaDb.partidas.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  ) ?? [];
}

/**
 * Partidas sin soporte: soportes vacíos o sin documentos
 */
export async function getPartidasSinSoporte(caseId?: string): Promise<PartidaEconomica[]> {
  const partidas = caseId
    ? await chaladitaDb.partidas.where('procedimientoId').equals(caseId).toArray()
    : await chaladitaDb.partidas.toArray();

  return partidas.filter((p) => !p.soportes || p.soportes.length === 0);
}

export function usePartidasSinSoporte(caseId?: string): PartidaEconomica[] {
  return useLiveQuery(
    async () => {
      const partidas = caseId
        ? await chaladitaDb.partidas.where('procedimientoId').equals(caseId).toArray()
        : await chaladitaDb.partidas.toArray();

      return partidas.filter((p) => !p.soportes || p.soportes.length === 0);
    },
    [caseId]
  ) ?? [];
}

/**
 * Total reclamado: suma de partidas con estado 'reclamada'
 */
export async function getTotalReclamado(caseId?: string): Promise<number> {
  const partidas = caseId
    ? await chaladitaDb.partidas.where('procedimientoId').equals(caseId).toArray()
    : await chaladitaDb.partidas.toArray();

  return partidas
    .filter((p) => p.estado === 'reclamada')
    .reduce((sum, p) => sum + p.importe, 0);
}

export function useTotalReclamado(caseId?: string): number {
  return useLiveQuery(
    async () => {
      const partidas = caseId
        ? await chaladitaDb.partidas.where('procedimientoId').equals(caseId).toArray()
        : await chaladitaDb.partidas.toArray();

      return partidas
        .filter((p) => p.estado === 'reclamada')
        .reduce((sum, p) => sum + p.importe, 0);
    },
    [caseId]
  ) ?? 0;
}

/**
 * Total prescrito: suma de partidas con prescripcion 'si' o 'parcial' (parcial cuenta 50%)
 */
export async function getTotalPrescrito(caseId?: string): Promise<number> {
  const partidas = caseId
    ? await chaladitaDb.partidas.where('procedimientoId').equals(caseId).toArray()
    : await chaladitaDb.partidas.toArray();

  return partidas.reduce((sum, p) => {
    if (p.prescripcion === 'si') return sum + p.importe;
    if (p.prescripcion === 'parcial') return sum + Math.floor(p.importe * 0.5);
    return sum;
  }, 0);
}

export function useTotalPrescrito(caseId?: string): number {
  return useLiveQuery(
    async () => {
      const partidas = caseId
        ? await chaladitaDb.partidas.where('procedimientoId').equals(caseId).toArray()
        : await chaladitaDb.partidas.toArray();

      return partidas.reduce((sum, p) => {
        if (p.prescripcion === 'si') return sum + p.importe;
        if (p.prescripcion === 'parcial') return sum + Math.floor(p.importe * 0.5);
        return sum;
      }, 0);
    },
    [caseId]
  ) ?? 0;
}

// ============================================
// TAREAS
// ============================================

export async function getTareasByProcedimiento(procedimientoId: string): Promise<TareaProc[]> {
  return chaladitaDb.tareas.where('procedimientoId').equals(procedimientoId).toArray();
}

export function useTareasByProcedimiento(procedimientoId: string): TareaProc[] {
  return useLiveQuery(
    () => chaladitaDb.tareas.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  ) ?? [];
}

/**
 * Tareas vencidas: estado 'pendiente' y fechaLimite < hoy
 */
export async function getTareasVencidas(caseId?: string): Promise<TareaProc[]> {
  const hoy = new Date().toISOString().split('T')[0];
  const tareas = caseId
    ? await chaladitaDb.tareas.where('procedimientoId').equals(caseId).toArray()
    : await chaladitaDb.tareas.toArray();

  return tareas.filter((t) => t.estado === 'pendiente' && t.fechaLimite < hoy);
}

// IMPORTANTE: Este hook DEBE existir para que no falle el build
export function useTareasVencidas(caseId?: string): TareaProc[] {
  return useLiveQuery(
    async () => {
      const hoy = new Date().toISOString().split('T')[0];
      const tareas = caseId
        ? await chaladitaDb.tareas.where('procedimientoId').equals(caseId).toArray()
        : await chaladitaDb.tareas.toArray();

      return tareas.filter((t) => t.estado === 'pendiente' && t.fechaLimite < hoy);
    },
    [caseId]
  ) ?? [];
}

/**
 * Tareas próximas: pendientes con fecha en los próximos N días
 */
export async function getTareasProximas(dias: number = 7, caseId?: string): Promise<TareaProc[]> {
  const hoy = new Date();
  const limite = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
  const hoyStr = hoy.toISOString().split('T')[0];
  const limiteStr = limite.toISOString().split('T')[0];

  const tareas = caseId
    ? await chaladitaDb.tareas.where('procedimientoId').equals(caseId).toArray()
    : await chaladitaDb.tareas.toArray();

  return tareas.filter(
    (t) => t.estado === 'pendiente' && t.fechaLimite >= hoyStr && t.fechaLimite <= limiteStr
  );
}

export function useTareasProximas(dias: number = 7, caseId?: string): TareaProc[] {
  return useLiveQuery(
    async () => {
      const hoy = new Date();
      const limite = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
      const hoyStr = hoy.toISOString().split('T')[0];
      const limiteStr = limite.toISOString().split('T')[0];

      const tareas = caseId
        ? await chaladitaDb.tareas.where('procedimientoId').equals(caseId).toArray()
        : await chaladitaDb.tareas.toArray();

      return tareas.filter(
        (t) => t.estado === 'pendiente' && t.fechaLimite >= hoyStr && t.fechaLimite <= limiteStr
      );
    },
    [dias, caseId]
  ) ?? [];
}

// ============================================
// HITOS
// ============================================

export async function getHitosByProcedimiento(procedimientoId: string): Promise<HitoProc[]> {
  return chaladitaDb.hitos.where('procedimientoId').equals(procedimientoId).toArray();
}

export function useHitosByProcedimiento(procedimientoId: string): HitoProc[] {
  return useLiveQuery(
    () => chaladitaDb.hitos.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  ) ?? [];
}

// ============================================
// TIMELINE / CRONOLOGÍA
// ============================================

export async function getTimelineByProcedimiento(procedimientoId: string): Promise<TimelineItem[]> {
  return chaladitaDb.timeline
    .where('procedimientoId')
    .equals(procedimientoId)
    .sortBy('fecha');
}

export function useTimelineByProcedimiento(procedimientoId: string): TimelineItem[] {
  return useLiveQuery(
    () =>
      chaladitaDb.timeline
        .where('procedimientoId')
        .equals(procedimientoId)
        .sortBy('fecha'),
    [procedimientoId]
  ) ?? [];
}

/**
 * Cronología automática: combina hechos, hitos, documentos en un array ordenado
 */
export async function getCronologiaAutomatica(caseId?: string): Promise<TimelineItemAgg[]> {
  const [hechos, hitos, documentos, timeline] = await Promise.all([
    caseId
      ? chaladitaDb.hechos.where('procedimientoId').equals(caseId).toArray()
      : chaladitaDb.hechos.toArray(),
    caseId
      ? chaladitaDb.hitos.where('procedimientoId').equals(caseId).toArray()
      : chaladitaDb.hitos.toArray(),
    caseId
      ? chaladitaDb.documentos.where('procedimientoId').equals(caseId).toArray()
      : chaladitaDb.documentos.toArray(),
    caseId
      ? chaladitaDb.timeline.where('procedimientoId').equals(caseId).toArray()
      : chaladitaDb.timeline.toArray(),
  ]);

  const items: TimelineItemAgg[] = [];

  // Agregar hechos
  for (const h of hechos) {
    const fecha = h.fecha.includes('/') ? h.fecha.split('/')[0] : h.fecha;
    items.push({
      id: `hecho-${h.id}`,
      procedimientoId: h.procedimientoId,
      fecha,
      tipo: 'hecho',
      evento: h.titulo,
      refId: h.id,
      color: h.riesgo === 'alto' ? 'red' : h.riesgo === 'medio' ? 'yellow' : 'green',
      importancia: h.fuerza,
    });
  }

  // Agregar hitos
  for (const hi of hitos) {
    items.push({
      id: `hito-${hi.id}`,
      procedimientoId: hi.procedimientoId,
      fecha: hi.fecha,
      tipo: 'hito',
      evento: hi.titulo,
      refId: hi.id,
      color: 'blue',
      importancia: 4,
    });
  }

  // Agregar documentos
  for (const d of documentos) {
    items.push({
      id: `doc-${d.id}`,
      procedimientoId: d.procedimientoId,
      fecha: d.fecha,
      tipo: 'documento',
      evento: d.descripcion,
      refId: d.id,
      color: 'gray',
      importancia: 2,
    });
  }

  // Agregar items de timeline existentes
  for (const t of timeline) {
    if (!items.find((i) => i.refId === t.refId && i.tipo === t.tipo)) {
      items.push({
        id: t.id,
        procedimientoId: t.procedimientoId,
        fecha: t.fecha,
        tipo: t.tipo,
        evento: t.evento,
        refId: t.refId,
        color: t.tipo === 'audiencia' ? 'purple' : 'gray',
        importancia: t.tipo === 'audiencia' ? 5 : 3,
      });
    }
  }

  // Ordenar por fecha
  items.sort((a, b) => a.fecha.localeCompare(b.fecha));

  return items;
}

export function useCronologiaAutomatica(caseId?: string): TimelineItemAgg[] {
  return useLiveQuery(() => getCronologiaAutomatica(caseId), [caseId]) ?? [];
}

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================

export interface EstadisticasChaladita {
  totalProcedimientos: number;
  totalHechos: number;
  totalDocumentos: number;
  totalPartidas: number;
  totalTareas: number;
  tareasVencidas: number;
  hechosSinPrueba: number;
  partidasSinSoporte: number;
  totalReclamado: number;
  totalPrescrito: number;
}

export async function getEstadisticas(): Promise<EstadisticasChaladita> {
  const [
    procedimientos,
    hechos,
    documentos,
    partidas,
    tareas,
    tareasVencidas,
    hechosSinPrueba,
    partidasSinSoporte,
    totalReclamado,
    totalPrescrito,
  ] = await Promise.all([
    chaladitaDb.procedimientos.count(),
    chaladitaDb.hechos.count(),
    chaladitaDb.documentos.count(),
    chaladitaDb.partidas.count(),
    chaladitaDb.tareas.count(),
    getTareasVencidas(),
    getHechosSinPrueba(),
    getPartidasSinSoporte(),
    getTotalReclamado(),
    getTotalPrescrito(),
  ]);

  return {
    totalProcedimientos: procedimientos,
    totalHechos: hechos,
    totalDocumentos: documentos,
    totalPartidas: partidas,
    totalTareas: tareas,
    tareasVencidas: tareasVencidas.length,
    hechosSinPrueba: hechosSinPrueba.length,
    partidasSinSoporte: partidasSinSoporte.length,
    totalReclamado,
    totalPrescrito,
  };
}

export function useEstadisticas(): EstadisticasChaladita | undefined {
  return useLiveQuery(() => getEstadisticas(), []);
}
