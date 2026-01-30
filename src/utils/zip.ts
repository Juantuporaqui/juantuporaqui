// ============================================
// CASE OPS - ZIP Export/Import Utilities
// ============================================

import JSZip from 'jszip';
import { db, SCHEMA_VERSION } from '../db/schema';
import {
  settingsRepo,
  counterRepo,
  casesRepo,
  documentsRepo,
  docFilesRepo,
  spansRepo,
  factsRepo,
  partidasRepo,
  eventsRepo,
  strategiesRepo,
  tasksRepo,
  linksRepo,
  auditRepo,
} from '../db/repositories';
import type { ExportManifest, ExportData, DocFile } from '../types';

export interface ExportProgress {
  stage: 'preparing' | 'exporting_data' | 'exporting_files' | 'compressing' | 'done';
  current: number;
  total: number;
  message: string;
}

export interface ImportProgress {
  stage: 'reading' | 'validating' | 'importing_data' | 'importing_files' | 'done';
  current: number;
  total: number;
  message: string;
}

export interface ImportResult {
  success: boolean;
  errors: string[];
  stats: {
    casesImported: number;
    documentsImported: number;
    filesImported: number;
    filesSkipped: number;
    spansImported: number;
    factsImported: number;
    partidasImported: number;
    eventsImported: number;
    strategiesImported: number;
    tasksImported: number;
    linksImported: number;
  };
}

/**
 * Export entire database to ZIP file
 */
export async function exportToZip(
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  const zip = new JSZip();

  // Stage 1: Prepare data
  onProgress?.({
    stage: 'preparing',
    current: 0,
    total: 100,
    message: 'Preparando exportación...',
  });

  const settings = await settingsRepo.get();
  const counters = await counterRepo.getAll();
  const cases = await casesRepo.getAll();
  const documents = await documentsRepo.getAll();
  const spans = await spansRepo.getAll();
  const facts = await factsRepo.getAll();
  const partidas = await partidasRepo.getAll();
  const events = await eventsRepo.getAll();
  const strategies = await strategiesRepo.getAll();
  const tasks = await tasksRepo.getAll();
  const links = await linksRepo.getAll();
  const auditLogs = await auditRepo.getAll();
  const analyticsMeta = await db.analytics_meta.toArray();

  // Stage 2: Export data (without blobs)
  onProgress?.({
    stage: 'exporting_data',
    current: 20,
    total: 100,
    message: 'Exportando datos...',
  });

  const exportData: ExportData = {
    settings: settings!,
    counters,
    cases,
    documents,
    spans,
    facts,
    partidas,
    events,
    strategies,
    tasks,
    links,
    auditLogs,
    analyticsMeta,
  };

  zip.file('db.json', JSON.stringify(exportData, null, 2));

  // Stage 3: Export files
  const docFiles = await docFilesRepo.getAll();
  const fileHashes: string[] = [];

  onProgress?.({
    stage: 'exporting_files',
    current: 40,
    total: 100,
    message: `Exportando ${docFiles.length} archivos...`,
  });

  const docsFolder = zip.folder('docs');
  for (let i = 0; i < docFiles.length; i++) {
    const file = docFiles[i];
    const ext = file.filename.split('.').pop() || 'pdf';
    docsFolder?.file(`${file.hashSha256}.${ext}`, file.blob);
    fileHashes.push(file.hashSha256);

    onProgress?.({
      stage: 'exporting_files',
      current: 40 + Math.floor((i / docFiles.length) * 40),
      total: 100,
      message: `Exportando archivo ${i + 1} de ${docFiles.length}...`,
    });
  }

  // Stage 4: Create manifest
  const manifest: ExportManifest = {
    schemaVersion: SCHEMA_VERSION,
    vaultId: settings?.vaultId || 'unknown',
    exportedAt: Date.now(),
    deviceName: settings?.deviceName || 'unknown',
    counts: {
      cases: cases.length,
      documents: documents.length,
      docFiles: docFiles.length,
      spans: spans.length,
      facts: facts.length,
      partidas: partidas.length,
      events: events.length,
      strategies: strategies.length,
      tasks: tasks.length,
      links: links.length,
      analyticsMeta: analyticsMeta.length,
    },
    fileHashes,
  };

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Stage 5: Compress
  onProgress?.({
    stage: 'compressing',
    current: 90,
    total: 100,
    message: 'Comprimiendo ZIP...',
  });

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  onProgress?.({
    stage: 'done',
    current: 100,
    total: 100,
    message: 'Exportación completada',
  });

  return blob;
}

/**
 * Import database from ZIP file
 * Uses last-write-wins strategy for merging
 */
export async function importFromZip(
  zipBlob: Blob,
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    errors: [],
    stats: {
      casesImported: 0,
      documentsImported: 0,
      filesImported: 0,
      filesSkipped: 0,
      spansImported: 0,
      factsImported: 0,
      partidasImported: 0,
      eventsImported: 0,
      strategiesImported: 0,
      tasksImported: 0,
      linksImported: 0,
    },
  };

  try {
    // Stage 1: Read ZIP
    onProgress?.({
      stage: 'reading',
      current: 0,
      total: 100,
      message: 'Leyendo archivo ZIP...',
    });

    const zip = await JSZip.loadAsync(zipBlob);

    // Stage 2: Validate
    onProgress?.({
      stage: 'validating',
      current: 10,
      total: 100,
      message: 'Validando contenido...',
    });

    const manifestFile = zip.file('manifest.json');
    const dbFile = zip.file('db.json');

    if (!manifestFile || !dbFile) {
      throw new Error('Archivo ZIP inválido: falta manifest.json o db.json');
    }

    const manifest: ExportManifest = JSON.parse(await manifestFile.async('string'));
    const importData: ExportData = JSON.parse(await dbFile.async('string'));

    if (manifest.schemaVersion > SCHEMA_VERSION) {
      throw new Error(
        `Versión de esquema incompatible: archivo tiene v${manifest.schemaVersion}, app tiene v${SCHEMA_VERSION}`
      );
    }

    // Stage 3: Import data with merge
    onProgress?.({
      stage: 'importing_data',
      current: 20,
      total: 100,
      message: 'Importando datos...',
    });

    // Import counters (take max value)
    for (const counter of importData.counters) {
      const existing = await db.counters.get(counter.id);
      if (!existing || counter.current > existing.current) {
        await db.counters.put(counter);
      }
    }

    // Import cases (last-write-wins)
    for (const item of importData.cases) {
      const existing = await db.cases.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.cases.put(item);
        result.stats.casesImported++;
      }
    }

    // Import documents
    for (const item of importData.documents) {
      const existing = await db.documents.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.documents.put(item);
        result.stats.documentsImported++;
      }
    }

    // Import spans
    for (const item of importData.spans) {
      const existing = await db.spans.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.spans.put(item);
        result.stats.spansImported++;
      }
    }

    // Import facts
    for (const item of importData.facts) {
      const existing = await db.facts.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.facts.put(item);
        result.stats.factsImported++;
      }
    }

    // Import partidas
    for (const item of importData.partidas) {
      const existing = await db.partidas.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.partidas.put(item);
        result.stats.partidasImported++;
      }
    }

    // Import events
    for (const item of importData.events) {
      const existing = await db.events.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.events.put(item);
        result.stats.eventsImported++;
      }
    }

    // Import strategies
    for (const item of importData.strategies) {
      const existing = await db.strategies.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.strategies.put(item);
        result.stats.strategiesImported++;
      }
    }

    // Import tasks
    for (const item of importData.tasks) {
      const existing = await db.tasks.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.tasks.put(item);
        result.stats.tasksImported++;
      }
    }

    // Import links
    for (const item of importData.links) {
      const existing = await db.links.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.links.put(item);
        result.stats.linksImported++;
      }
    }

    // Import analytics meta
    for (const item of importData.analyticsMeta ?? []) {
      const existing = await db.analytics_meta.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        await db.analytics_meta.put(item);
      }
    }

    // Stage 4: Import files (deduplicate by hash)
    onProgress?.({
      stage: 'importing_files',
      current: 60,
      total: 100,
      message: 'Importando archivos...',
    });

    const docsFolder = zip.folder('docs');
    if (docsFolder) {
      const fileEntries = Object.keys(zip.files).filter((f) => f.startsWith('docs/'));
      let processed = 0;

      for (const filePath of fileEntries) {
        const file = zip.file(filePath);
        if (!file || file.dir) continue;

        const filename = filePath.replace('docs/', '');
        const hashMatch = filename.match(/^([a-f0-9]{64})\./);
        if (!hashMatch) continue;

        const hash = hashMatch[1];

        // Check if file already exists (deduplication)
        const existing = await docFilesRepo.getByHash(hash);
        if (existing) {
          result.stats.filesSkipped++;
        } else {
          const blob = await file.async('blob');
          const docFile: Omit<DocFile, 'id' | 'createdAt'> = {
            hashSha256: hash,
            filename,
            mime: 'application/pdf',
            size: blob.size,
            blob,
          };
          await docFilesRepo.create(docFile);
          result.stats.filesImported++;
        }

        processed++;
        onProgress?.({
          stage: 'importing_files',
          current: 60 + Math.floor((processed / fileEntries.length) * 30),
          total: 100,
          message: `Importando archivo ${processed} de ${fileEntries.length}...`,
        });
      }
    }

    // Verify document-file references
    const allDocs = await documentsRepo.getAll();
    for (const doc of allDocs) {
      if (doc.fileId) {
        const file = await docFilesRepo.getById(doc.fileId);
        if (!file) {
          // Try to find by hash
          const fileByHash = await docFilesRepo.getByHash(doc.hashSha256);
          if (fileByHash) {
            await documentsRepo.update(doc.id, { fileId: fileByHash.id });
          } else {
            result.errors.push(
              `Documento ${doc.id} referencia archivo inexistente (hash: ${doc.hashSha256.substring(0, 8)}...)`
            );
          }
        }
      }
    }

    onProgress?.({
      stage: 'done',
      current: 100,
      total: 100,
      message: 'Importación completada',
    });

    result.success = result.errors.length === 0;
    return result;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Error desconocido');
    return result;
  }
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get export filename with timestamp
 */
export function getExportFilename(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `case-ops-backup-${date}-${time}.zip`;
}
