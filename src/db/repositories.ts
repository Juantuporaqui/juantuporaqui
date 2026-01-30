// ============================================
// CASE OPS - Database Repositories
// ============================================

import { db, SCHEMA_VERSION } from './schema';
import type {
  Settings,
  Counter,
  Case,
  Document,
  DocFile,
  Span,
  Fact,
  Partida,
  Event,
  Strategy,
  Task,
  Link,
  AuditLog,
  EntityType,
  LinkRole,
} from '../types';
import { generateUUID } from '../utils/id';

// ============================================
// Settings Repository
// ============================================

export const settingsRepo = {
  async get(): Promise<Settings | undefined> {
    return db.settings.get('singleton');
  },

  async init(deviceName: string): Promise<Settings> {
    const existing = await this.get();
    if (existing) return existing;

    const settings: Settings = {
      id: 'singleton',
      vaultId: generateUUID(),
      deviceName,
      schemaVersion: SCHEMA_VERSION,
      theme: 'system',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.settings.add(settings);
    return settings;
  },

  async update(updates: Partial<Settings>): Promise<void> {
    await db.settings.update('singleton', {
      ...updates,
      updatedAt: Date.now(),
    });
  },
};

// ============================================
// Counter Repository (ID Generation)
// ============================================

const ID_PREFIXES: Record<string, string> = {
  cases: 'CAS',
  documents: 'D',
  spans: 'S',
  facts: 'H',
  partidas: 'P',
  events: 'E',
  strategies: 'W',
  tasks: 'T',
};

export const counterRepo = {
  async getNextId(tableName: string): Promise<string> {
    return db.transaction('rw', db.counters, async () =>
      counterRepo.getNextIdInTransaction(tableName)
    );
  },

  async getNextIdInTransaction(tableName: string): Promise<string> {
    const prefix = ID_PREFIXES[tableName];
    if (!prefix) throw new Error(`Unknown table: ${tableName}`);

    const counter = await db.counters.get(tableName);
    const next = (counter?.current ?? 0) + 1;
    await db.counters.put({ id: tableName, prefix, current: next });
    return `${prefix}${String(next).padStart(3, '0')}`;
  },

  async setCounter(tableName: string, value: number): Promise<void> {
    const prefix = ID_PREFIXES[tableName];
    if (!prefix) throw new Error(`Unknown table: ${tableName}`);

    await db.counters.put({
      id: tableName,
      prefix,
      current: value,
    });
  },

  async getAll(): Promise<Counter[]> {
    return db.counters.toArray();
  },
};

// ============================================
// Cases Repository
// ============================================

export const casesRepo = {
  async getAll(): Promise<Case[]> {
    return db.cases.orderBy('updatedAt').reverse().toArray();
  },

  async getById(id: string): Promise<Case | undefined> {
    return db.cases.get(id);
  },

  async create(data: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> {
    return db.transaction('rw', db.counters, db.cases, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('cases');
      const now = Date.now();
      const caseData: Case = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.cases.add(caseData);
      await auditRepo.log('create', 'case', id);
      return caseData;
    });
  },

  async update(id: string, updates: Partial<Case>): Promise<void> {
    await db.cases.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'case', id);
  },

  async delete(id: string): Promise<void> {
    await db.cases.delete(id);
    await auditRepo.log('delete', 'case', id);
  },

  async search(query: string): Promise<Case[]> {
    const lower = query.toLowerCase();
    return db.cases
      .filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.court.toLowerCase().includes(lower) ||
          c.autosNumber.toLowerCase().includes(lower) ||
          c.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },
};

// ============================================
// Claims Repository
// ============================================

const claimsRepo = {
  async getAll(): Promise<Claim[]> {
    return db.claims.orderBy('updatedAt').reverse().toArray();
  },

  async getByCaseId(caseId: string): Promise<Claim[]> {
    return db.claims.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Claim | undefined> {
    return db.claims.get(id);
  },

  async create(data: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<Claim> {
    return db.transaction('rw', db.counters, db.claims, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('claims');
      const now = Date.now();
      const claim: Claim = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.claims.add(claim);
      await auditRepo.log('create', 'claim', id);
      return claim;
    });
  },

  async update(id: string, updates: Partial<Claim>): Promise<void> {
    await db.claims.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'claim', id);
  },

  async delete(id: string): Promise<void> {
    await db.claims.delete(id);
    await auditRepo.log('delete', 'claim', id);
  },
};

// ============================================
// Documents Repository
// ============================================

export const documentsRepo = {
  async getAll(): Promise<Document[]> {
    return db.documents.orderBy('updatedAt').reverse().toArray();
  },

  async getByCaseId(caseId: string): Promise<Document[]> {
    return db.documents.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Document | undefined> {
    return db.documents.get(id);
  },

  async getByHash(hash: string): Promise<Document | undefined> {
    return db.documents.where('hashSha256').equals(hash).first();
  },

  async create(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    return db.transaction('rw', db.counters, db.documents, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('documents');
      const now = Date.now();
      const doc: Document = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.documents.add(doc);
      await auditRepo.log('create', 'document', id);
      return doc;
    });
  },

  async update(id: string, updates: Partial<Document>): Promise<void> {
    await db.documents.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'document', id);
  },

  async delete(id: string): Promise<void> {
    await db.documents.delete(id);
    await auditRepo.log('delete', 'document', id);
  },

  async search(query: string): Promise<Document[]> {
    const lower = query.toLowerCase();
    return db.documents
      .filter(
        (d) =>
          d.title.toLowerCase().includes(lower) ||
          d.notes.toLowerCase().includes(lower) ||
          d.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },
};

// ============================================
// DocFiles Repository (Blob Storage)
// ============================================

export const docFilesRepo = {
  async getById(id: string): Promise<DocFile | undefined> {
    return db.docFiles.get(id);
  },

  async getByHash(hash: string): Promise<DocFile | undefined> {
    return db.docFiles.where('hashSha256').equals(hash).first();
  },

  async create(data: Omit<DocFile, 'id' | 'createdAt'>): Promise<DocFile> {
    // Check if file with same hash already exists (deduplication)
    const existing = await this.getByHash(data.hashSha256);
    if (existing) {
      return existing;
    }

    const id = generateUUID();
    const docFile: DocFile = {
      ...data,
      id,
      createdAt: Date.now(),
    };
    await db.docFiles.add(docFile);
    return docFile;
  },

  async delete(id: string): Promise<void> {
    await db.docFiles.delete(id);
  },

  async getAll(): Promise<DocFile[]> {
    return db.docFiles.toArray();
  },

  async getAllWithoutBlob(): Promise<Omit<DocFile, 'blob'>[]> {
    const files = await db.docFiles.toArray();
    return files.map(({ blob, ...rest }) => rest);
  },
};

// ============================================
// Claim Files Repository (Reclamaciones Attachments)
// ============================================

type ClaimFileLink = {
  id: string;
  claimId: string;
  fileId: string;
  filename: string;
  size: number;
  mime: string;
  createdAt: number;
};

const CLAIM_FILES_STORAGE_KEY = 'case-ops:claim-files';

const readClaimFileLinks = (): ClaimFileLink[] => {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(CLAIM_FILES_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ClaimFileLink[];
  } catch {
    return [];
  }
};

const writeClaimFileLinks = (links: ClaimFileLink[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CLAIM_FILES_STORAGE_KEY, JSON.stringify(links));
};

export const claimFilesRepo = {
  async getByClaimId(claimId: string): Promise<ClaimFileLink[]> {
    return readClaimFileLinks().filter((link) => link.claimId === claimId);
  },

  async addForClaim(data: Omit<ClaimFileLink, 'id' | 'createdAt'>): Promise<ClaimFileLink> {
    const link: ClaimFileLink = {
      ...data,
      id: generateUUID(),
      createdAt: Date.now(),
    };
    const links = readClaimFileLinks();
    writeClaimFileLinks([...links, link]);
    return link;
  },

  async remove(id: string): Promise<void> {
    const links = readClaimFileLinks();
    writeClaimFileLinks(links.filter((link) => link.id !== id));
  },
};

// ============================================
// Spans Repository
// ============================================

export const spansRepo = {
  async getAll(): Promise<Span[]> {
    return db.spans.orderBy('updatedAt').reverse().toArray();
  },

  async getByDocumentId(documentId: string): Promise<Span[]> {
    return db.spans.where('documentId').equals(documentId).toArray();
  },

  async getByCaseId(caseId: string): Promise<Span[]> {
    return db.spans.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Span | undefined> {
    return db.spans.get(id);
  },

  async create(data: Omit<Span, 'id' | 'createdAt' | 'updatedAt'>): Promise<Span> {
    return db.transaction('rw', db.counters, db.spans, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('spans');
      const now = Date.now();
      const span: Span = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.spans.add(span);
      await auditRepo.log('create', 'span', id);
      return span;
    });
  },

  async update(id: string, updates: Partial<Span>): Promise<void> {
    await db.spans.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'span', id);
  },

  async delete(id: string): Promise<void> {
    await db.spans.delete(id);
    await auditRepo.log('delete', 'span', id);
  },

  async search(query: string): Promise<Span[]> {
    const lower = query.toLowerCase();
    return db.spans
      .filter(
        (s) =>
          s.label.toLowerCase().includes(lower) ||
          s.note.toLowerCase().includes(lower) ||
          s.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },
};

// ============================================
// Facts Repository
// ============================================

export const factsRepo = {
  async getAll(): Promise<Fact[]> {
    return db.facts.orderBy('updatedAt').reverse().toArray();
  },

  async getByCaseId(caseId: string): Promise<Fact[]> {
    return db.facts.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Fact | undefined> {
    return db.facts.get(id);
  },

  async getControvertidos(caseId?: string): Promise<Fact[]> {
    let query = db.facts.where('status').anyOf(['controvertido', 'a_probar']);
    if (caseId) {
      const results = await query.toArray();
      return results.filter((f) => f.caseId === caseId);
    }
    return query.toArray();
  },

  async create(data: Omit<Fact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fact> {
    return db.transaction('rw', db.counters, db.facts, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('facts');
      const now = Date.now();
      const fact: Fact = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.facts.add(fact);
      await auditRepo.log('create', 'fact', id);
      return fact;
    });
  },

  async update(id: string, updates: Partial<Fact>): Promise<void> {
    await db.facts.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'fact', id);
  },

  async delete(id: string): Promise<void> {
    await db.facts.delete(id);
    await auditRepo.log('delete', 'fact', id);
  },

  async search(query: string): Promise<Fact[]> {
    const lower = query.toLowerCase();
    return db.facts
      .filter(
        (f) =>
          f.title.toLowerCase().includes(lower) ||
          f.narrative.toLowerCase().includes(lower) ||
          f.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },
};

// ============================================
// Partidas Repository
// ============================================

export const partidasRepo = {
  async getAll(): Promise<Partida[]> {
    return db.partidas.orderBy('date').toArray();
  },

  async getByCaseId(caseId: string): Promise<Partida[]> {
    return db.partidas.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Partida | undefined> {
    return db.partidas.get(id);
  },

  async getDiscutidas(caseId?: string): Promise<Partida[]> {
    let query = db.partidas.where('state').equals('discutida');
    if (caseId) {
      const results = await query.toArray();
      return results.filter((p) => p.caseId === caseId);
    }
    return query.toArray();
  },

  async create(data: Omit<Partida, 'id' | 'createdAt' | 'updatedAt'>): Promise<Partida> {
    return db.transaction('rw', db.counters, db.partidas, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('partidas');
      const now = Date.now();
      const partida: Partida = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.partidas.add(partida);
      await auditRepo.log('create', 'partida', id);
      return partida;
    });
  },

  async update(id: string, updates: Partial<Partida>): Promise<void> {
    await db.partidas.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'partida', id);
  },

  async delete(id: string): Promise<void> {
    await db.partidas.delete(id);
    await auditRepo.log('delete', 'partida', id);
  },

  async search(query: string): Promise<Partida[]> {
    const lower = query.toLowerCase();
    return db.partidas
      .filter(
        (p) =>
          p.concept.toLowerCase().includes(lower) ||
          p.notes.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },

  async getTotalByCaseId(caseId: string): Promise<number> {
    const partidas = await this.getByCaseId(caseId);
    return partidas.reduce((sum, p) => sum + p.amountCents, 0);
  },
};

// ============================================
// Events Repository
// ============================================

export const eventsRepo = {
  async getAll(): Promise<Event[]> {
    return db.events.orderBy('date').toArray();
  },

  async getByCaseId(caseId: string): Promise<Event[]> {
    return db.events.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Event | undefined> {
    return db.events.get(id);
  },

  async create(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return db.transaction('rw', db.counters, db.events, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('events');
      const now = Date.now();
      const event: Event = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.events.add(event);
      await auditRepo.log('create', 'event', id);
      return event;
    });
  },

  async update(id: string, updates: Partial<Event>): Promise<void> {
    await db.events.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'event', id);
  },

  async delete(id: string): Promise<void> {
    await db.events.delete(id);
    await auditRepo.log('delete', 'event', id);
  },

  async search(query: string): Promise<Event[]> {
    const lower = query.toLowerCase();
    return db.events
      .filter(
        (e) =>
          e.title.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower) ||
          e.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },
};

// ============================================
// Strategies Repository
// ============================================

export const strategiesRepo = {
  async getAll(): Promise<Strategy[]> {
    return db.strategies.orderBy('updatedAt').reverse().toArray();
  },

  async getByCaseId(caseId: string): Promise<Strategy[]> {
    return db.strategies.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Strategy | undefined> {
    return db.strategies.get(id);
  },

  async create(data: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Strategy> {
    return db.transaction('rw', db.counters, db.strategies, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('strategies');
      const now = Date.now();
      const strategy: Strategy = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.strategies.add(strategy);
      await auditRepo.log('create', 'strategy', id);
      return strategy;
    });
  },

  async update(id: string, updates: Partial<Strategy>): Promise<void> {
    await db.strategies.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'strategy', id);
  },

  async delete(id: string): Promise<void> {
    await db.strategies.delete(id);
    await auditRepo.log('delete', 'strategy', id);
  },

  async search(query: string): Promise<Strategy[]> {
    const lower = query.toLowerCase();
    return db.strategies
      .filter(
        (s) =>
          s.attack.toLowerCase().includes(lower) ||
          s.rebuttal.toLowerCase().includes(lower) ||
          s.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .toArray();
  },
};

// ============================================
// Tasks Repository
// ============================================

export const tasksRepo = {
  async getAll(): Promise<Task[]> {
    return db.tasks.orderBy('dueDate').toArray();
  },

  async getByCaseId(caseId: string): Promise<Task[]> {
    return db.tasks.where('caseId').equals(caseId).toArray();
  },

  async getById(id: string): Promise<Task | undefined> {
    return db.tasks.get(id);
  },

  async getPending(): Promise<Task[]> {
    return db.tasks.where('status').anyOf(['pendiente', 'en_progreso']).toArray();
  },

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return db.transaction('rw', db.counters, db.tasks, db.auditLogs, async () => {
      const id = await counterRepo.getNextIdInTransaction('tasks');
      const now = Date.now();
      const task: Task = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      await db.tasks.add(task);
      await auditRepo.log('create', 'task', id);
      return task;
    });
  },

  async update(id: string, updates: Partial<Task>): Promise<void> {
    await db.tasks.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    await auditRepo.log('update', 'task', id);
  },

  async delete(id: string): Promise<void> {
    await db.tasks.delete(id);
    await auditRepo.log('delete', 'task', id);
  },

  async search(query: string): Promise<Task[]> {
    const lower = query.toLowerCase();
    return db.tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(lower) || t.notes.toLowerCase().includes(lower)
      )
      .toArray();
  },
};

// ============================================
// Links Repository
// ============================================

export const linksRepo = {
  async getAll(): Promise<Link[]> {
    return db.links.toArray();
  },

  async getById(id: string): Promise<Link | undefined> {
    return db.links.get(id);
  },

  async getByFrom(fromType: EntityType, fromId: string): Promise<Link[]> {
    return db.links.where('[fromType+fromId]').equals([fromType, fromId]).toArray();
  },

  async getByTo(toType: EntityType, toId: string): Promise<Link[]> {
    return db.links.where('[toType+toId]').equals([toType, toId]).toArray();
  },

  async getLinksForEntity(entityType: EntityType, entityId: string): Promise<Link[]> {
    const fromLinks = await this.getByFrom(entityType, entityId);
    const toLinks = await this.getByTo(entityType, entityId);
    return [...fromLinks, ...toLinks];
  },

  async getEvidenceForFact(factId: string): Promise<Link[]> {
    return db.links
      .where('[toType+toId]')
      .equals(['fact', factId])
      .filter((l) => l.fromType === 'span' && l.meta.role === 'evidence')
      .toArray();
  },

  async getEvidenceForPartida(partidaId: string): Promise<Link[]> {
    return db.links
      .where('[toType+toId]')
      .equals(['partida', partidaId])
      .filter((l) => l.fromType === 'span' && l.meta.role === 'evidence')
      .toArray();
  },

  async create(
    fromType: EntityType,
    fromId: string,
    toType: EntityType,
    toId: string,
    role: LinkRole,
    comment?: string
  ): Promise<Link> {
    const id = generateUUID();
    const now = Date.now();
    const link: Link = {
      id,
      fromType,
      fromId,
      toType,
      toId,
      meta: {
        role,
        comment,
        pin: false,
      },
      createdAt: now,
      updatedAt: now,
    };
    await db.links.add(link);
    return link;
  },

  async update(id: string, updates: Partial<Link>): Promise<void> {
    await db.links.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async delete(id: string): Promise<void> {
    await db.links.delete(id);
  },

  async deleteByEntity(entityType: EntityType, entityId: string): Promise<void> {
    const links = await this.getLinksForEntity(entityType, entityId);
    await db.links.bulkDelete(links.map((l) => l.id));
  },
};

// ============================================
// Audit Log Repository
// ============================================

export const auditRepo = {
  async log(
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    payload?: unknown
  ): Promise<void> {
    const log: AuditLog = {
      id: generateUUID(),
      at: Date.now(),
      action,
      entityType,
      entityId,
      payload: payload ? JSON.stringify(payload) : undefined,
    };
    await db.auditLogs.add(log);
  },

  async getAll(): Promise<AuditLog[]> {
    return db.auditLogs.orderBy('at').reverse().toArray();
  },

  async getByEntity(entityType: EntityType, entityId: string): Promise<AuditLog[]> {
    return db.auditLogs
      .where('entityType')
      .equals(entityType)
      .filter((l) => l.entityId === entityId)
      .toArray();
  },

  async clear(): Promise<void> {
    await db.auditLogs.clear();
  },
};

// ============================================
// Global Search
// ============================================

export const globalSearch = async (query: string): Promise<{
  cases: Case[];
  documents: Document[];
  spans: Span[];
  facts: Fact[];
  partidas: Partida[];
  events: Event[];
  strategies: Strategy[];
  tasks: Task[];
}> => {
  const [cases, documents, spans, facts, partidas, events, strategies, tasks] =
    await Promise.all([
      casesRepo.search(query),
      documentsRepo.search(query),
      spansRepo.search(query),
      factsRepo.search(query),
      partidasRepo.search(query),
      eventsRepo.search(query),
      strategiesRepo.search(query),
      tasksRepo.search(query),
    ]);

  return { cases, documents, spans, facts, partidas, events, strategies, tasks };
};

// ============================================
// Alerts Generator
// ============================================

export const getAlerts = async () => {
  const alerts: {
    id: string;
    type: 'warning' | 'error' | 'info';
    title: string;
    description: string;
    entityType?: EntityType;
    entityId?: string;
  }[] = [];

  const [controvertidos, discutidas, docs, allSpans, allLinks] =
    await Promise.all([
      factsRepo.getControvertidos(),
      partidasRepo.getDiscutidas(),
      documentsRepo.getAll(),
      spansRepo.getAll(),
      linksRepo.getAll(),
    ]);

  for (const fact of controvertidos) {
    if (!allLinks.some((l) => l.toId === fact.id && l.meta.role === 'evidence')) {
      alerts.push({
        id: `alert-fact-${fact.id}`,
        type: 'warning',
        title: `Sin evidencia: ${fact.title}`,
        description: `Hecho ${fact.status} sin pruebas`,
        entityType: 'fact',
        entityId: fact.id,
      });
    }
  }

  for (const partida of discutidas) {
    if (!allLinks.some((l) => l.toId === partida.id && l.meta.role === 'evidence')) {
      alerts.push({
        id: `alert-partida-${partida.id}`,
        type: 'warning',
        title: `Sin evidencia: ${partida.concept}`,
        description: `Partida discutida sin pruebas`,
        entityType: 'partida',
        entityId: partida.id,
      });
    }
  }

  for (const doc of docs) {
    if (!allSpans.some((span) => span.documentId === doc.id)) {
      alerts.push({
        id: `alert-doc-${doc.id}`,
        type: 'info',
        title: `Documento sin spans: ${doc.title}`,
        description: `El documento ${doc.id} no tiene spans marcados`,
        entityType: 'document',
        entityId: doc.id,
      });
    }
  }

  for (const span of allSpans) {
    if (!allLinks.some((link) => link.fromType === 'span' && link.fromId === span.id)) {
      alerts.push({
        id: `alert-span-${span.id}`,
        type: 'info',
        title: `Span sin enlaces: ${span.label}`,
        description: `El span ${span.id} no está enlazado a ningún hecho o partida`,
        entityType: 'span',
        entityId: span.id,
      });
    }
  }

  return alerts;
};

export { claimsRepo };
