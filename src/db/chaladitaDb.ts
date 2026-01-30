// ============================================
// CHALADITA CASE-OPS - Dexie Database (Aislada)
// NO interfiere con CaseOpsDB existente
// ============================================

import Dexie, { type EntityTable } from 'dexie';
import type {
  ProcedimientoCase,
  HechoCase,
  DocumentoCase,
  PartidaEconomica,
  HitoProc,
  TareaProc,
  LinkProc,
  TimelineItem,
  SeedData,
  // FASE 2
  ReclamacionVisual,
  DocumentoSubido,
  SeccionAudiencia,
} from '../types/caseops';

// ============================================
// Database Schema
// ============================================

class ChaladitaDB extends Dexie {
  // FASE 1 - Tablas base
  procedimientos!: EntityTable<ProcedimientoCase, 'id'>;
  hechos!: EntityTable<HechoCase, 'id'>;
  documentos!: EntityTable<DocumentoCase, 'id'>;
  partidas!: EntityTable<PartidaEconomica, 'id'>;
  hitos!: EntityTable<HitoProc, 'id'>;
  tareas!: EntityTable<TareaProc, 'id'>;
  links!: EntityTable<LinkProc, 'id'>;
  timeline!: EntityTable<TimelineItem, 'id'>;
  // FASE 2 - Tablas nuevas
  reclamacionesVisuales!: EntityTable<ReclamacionVisual, 'id'>;
  documentosSubidos!: EntityTable<DocumentoSubido, 'id'>;
  seccionesAudiencia!: EntityTable<SeccionAudiencia, 'id'>;

  constructor() {
    // Nombre único para no interferir con CaseOpsDB
    super('ChaladitaDB');

    // Version 1: Schema base FASE 1
    this.version(1).stores({
      procedimientos: 'id, estado',
      hechos: 'id, procedimientoId, riesgo, fuerza',
      documentos: 'id, procedimientoId, tipo, fecha',
      partidas: 'id, procedimientoId, estado, prescripcion, importe',
      hitos: 'id, procedimientoId, fecha',
      tareas: 'id, procedimientoId, prioridad, estado, fechaLimite',
      links: 'id, fromId, toId, relationType',
      timeline: 'id, procedimientoId, fecha, tipo',
    });

    // Version 2: FASE 2 - Añade nuevas tablas
    this.version(2).stores({
      // Redeclara stores v1 (requerido por Dexie)
      procedimientos: 'id, estado',
      hechos: 'id, procedimientoId, riesgo, fuerza',
      documentos: 'id, procedimientoId, tipo, fecha',
      partidas: 'id, procedimientoId, estado, prescripcion, importe',
      hitos: 'id, procedimientoId, fecha',
      tareas: 'id, procedimientoId, prioridad, estado, fechaLimite',
      links: 'id, fromId, toId, relationType',
      timeline: 'id, procedimientoId, fecha, tipo',
      // Nuevas tablas FASE 2
      reclamacionesVisuales: 'id, procedimientoId, ganabilidad',
      documentosSubidos: 'id, procedimientoId, fecha',
      seccionesAudiencia: 'id, procedimientoId, orden',
    });
  }
}

// Instancia singleton
export const chaladitaDb = new ChaladitaDB();

// ============================================
// Utilidades de la DB
// ============================================

/**
 * Verifica si la DB está vacía (sin procedimientos)
 */
export async function isDbEmpty(): Promise<boolean> {
  const count = await chaladitaDb.procedimientos.count();
  return count === 0;
}

/**
 * Importa datos de seed en una transacción
 */
export async function importSeed(seed: SeedData): Promise<void> {
  await chaladitaDb.transaction(
    'rw',
    [
      chaladitaDb.procedimientos,
      chaladitaDb.hechos,
      chaladitaDb.documentos,
      chaladitaDb.partidas,
      chaladitaDb.hitos,
      chaladitaDb.tareas,
      chaladitaDb.links,
      chaladitaDb.timeline,
      // FASE 2
      chaladitaDb.reclamacionesVisuales,
      chaladitaDb.documentosSubidos,
      chaladitaDb.seccionesAudiencia,
    ],
    async () => {
      // Insertar en orden para mantener integridad referencial
      await chaladitaDb.procedimientos.bulkPut(seed.procedimientos);
      await chaladitaDb.hechos.bulkPut(seed.hechos);
      await chaladitaDb.documentos.bulkPut(seed.documentos);
      await chaladitaDb.partidas.bulkPut(seed.partidas);
      await chaladitaDb.hitos.bulkPut(seed.hitos);
      await chaladitaDb.tareas.bulkPut(seed.tareas);
      await chaladitaDb.links.bulkPut(seed.links);
      await chaladitaDb.timeline.bulkPut(seed.timeline);
      // FASE 2 - con fallback a [] si no existe
      if (seed.reclamacionesVisuales?.length) {
        await chaladitaDb.reclamacionesVisuales.bulkPut(seed.reclamacionesVisuales);
      }
      if (seed.documentosSubidos?.length) {
        await chaladitaDb.documentosSubidos.bulkPut(seed.documentosSubidos);
      }
      if (seed.seccionesAudiencia?.length) {
        await chaladitaDb.seccionesAudiencia.bulkPut(seed.seccionesAudiencia);
      }
    }
  );
}

/**
 * Exporta todos los datos de la DB
 */
export async function exportAll(): Promise<SeedData> {
  return chaladitaDb.transaction(
    'r',
    [
      chaladitaDb.procedimientos,
      chaladitaDb.hechos,
      chaladitaDb.documentos,
      chaladitaDb.partidas,
      chaladitaDb.hitos,
      chaladitaDb.tareas,
      chaladitaDb.links,
      chaladitaDb.timeline,
      // FASE 2
      chaladitaDb.reclamacionesVisuales,
      chaladitaDb.documentosSubidos,
      chaladitaDb.seccionesAudiencia,
    ],
    async () => {
      const [
        procedimientos,
        hechos,
        documentos,
        partidas,
        hitos,
        tareas,
        links,
        timeline,
        reclamacionesVisuales,
        documentosSubidos,
        seccionesAudiencia,
      ] = await Promise.all([
        chaladitaDb.procedimientos.toArray(),
        chaladitaDb.hechos.toArray(),
        chaladitaDb.documentos.toArray(),
        chaladitaDb.partidas.toArray(),
        chaladitaDb.hitos.toArray(),
        chaladitaDb.tareas.toArray(),
        chaladitaDb.links.toArray(),
        chaladitaDb.timeline.toArray(),
        chaladitaDb.reclamacionesVisuales.toArray(),
        chaladitaDb.documentosSubidos.toArray(),
        chaladitaDb.seccionesAudiencia.toArray(),
      ]);

      return {
        procedimientos,
        hechos,
        documentos,
        partidas,
        hitos,
        tareas,
        links,
        timeline,
        reclamacionesVisuales,
        documentosSubidos,
        seccionesAudiencia,
      };
    }
  );
}

/**
 * Resetea la DB (borra todo)
 */
export async function resetDb(): Promise<void> {
  await chaladitaDb.transaction(
    'rw',
    [
      chaladitaDb.procedimientos,
      chaladitaDb.hechos,
      chaladitaDb.documentos,
      chaladitaDb.partidas,
      chaladitaDb.hitos,
      chaladitaDb.tareas,
      chaladitaDb.links,
      chaladitaDb.timeline,
      // FASE 2
      chaladitaDb.reclamacionesVisuales,
      chaladitaDb.documentosSubidos,
      chaladitaDb.seccionesAudiencia,
    ],
    async () => {
      await chaladitaDb.procedimientos.clear();
      await chaladitaDb.hechos.clear();
      await chaladitaDb.documentos.clear();
      await chaladitaDb.partidas.clear();
      await chaladitaDb.hitos.clear();
      await chaladitaDb.tareas.clear();
      await chaladitaDb.links.clear();
      await chaladitaDb.timeline.clear();
      // FASE 2
      await chaladitaDb.reclamacionesVisuales.clear();
      await chaladitaDb.documentosSubidos.clear();
      await chaladitaDb.seccionesAudiencia.clear();
    }
  );
}

// Alias para compatibilidad
export const db = chaladitaDb;
