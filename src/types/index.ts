// ============================================
// CASE OPS - Type Definitions
// ============================================

// Entity Types for Links
export type EntityType =
  | 'case'
  | 'fact'
  | 'partida'
  | 'document'
  | 'span'
  | 'event'
  | 'strategy'
  | 'task';

// Link Role Types
export type LinkRole = 'evidence' | 'supports' | 'mentions' | 'contradicts' | 'related';

// Fact Status
export type FactStatus = 'pacifico' | 'controvertido' | 'admitido' | 'a_probar';

// Burden of Proof
export type Burden = 'actora' | 'demandado' | 'mixta';

// Risk Level
export type RiskLevel = 'alto' | 'medio' | 'bajo';

// Partida State
export type PartidaState = 'reclamable' | 'discutida' | 'prescrita_interna' | 'neutral';

// Event Type
export type EventType = 'procesal' | 'factico';

// Task Priority
export type TaskPriority = 'alta' | 'media' | 'baja';

// Task Status
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';

// Case Status
export type CaseStatus = 'activo' | 'suspendido' | 'archivado' | 'cerrado';

// Case Type
export type CaseType = 'ordinario' | 'ejecucion' | 'incidente' | 'administrativo' | 'mediacion' | 'potencial';

// Document Type
export type DocType =
  | 'demanda'
  | 'contestacion'
  | 'prueba'
  | 'sentencia'
  | 'auto'
  | 'escrito'
  | 'comunicacion'
  | 'contrato'
  | 'factura'
  | 'extracto'
  | 'informe'
  | 'otros';

// ============================================
// Analytics Types
// ============================================

export type AnalyticsTimelineStatus = 'ok' | 'warn' | 'danger' | 'info';

export type AnalyticsCourtSlug = 'picassent' | 'quart' | 'mislata' | 'otros';

export interface AnalyticsTimelineItem {
  label: string;
  date: string;
  status?: AnalyticsTimelineStatus;
}

export interface AnalyticsCourtMeta {
  slug: AnalyticsCourtSlug;
  title: string;
  procedimiento?: string;
  juzgado?: string;
  cuantia?: number | null;
  fase?: string | null;
  proximoHito?: string | null;
  tags?: string[];
}

export interface AnalyticsPrescripcionMeta {
  articulo: string;
  fechaCorte: string;
  narrativa: string;
  impactoPct?: number | null;
  hitos?: string[];
}

export interface AnalyticsMeta {
  id: string;
  totalReclamado: number | null;
  riesgoReal: number | null;
  objetivoReduccionPct: number | null;
  audienciaFecha: string | null;
  estrategiasActivas: number | null;
  diasHastaVista: number | null;
  lineaTemporal: AnalyticsTimelineItem[];
  courts: AnalyticsCourtMeta[];
  prescripcion: AnalyticsPrescripcionMeta;
  pendientes?: string[];
  updatedAt: string;
}

// ============================================
// Database Interfaces
// ============================================

export interface Settings {
  id: string; // 'singleton'
  vaultId: string;
  deviceName: string;
  schemaVersion: number;
  pinHash?: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: number;
  updatedAt: number;
}

export interface Counter {
  id: string; // table name
  prefix: string;
  current: number;
}

export interface Case {
  id: string; // CAS001
  title: string;
  court: string;
  autosNumber: string;
  type: CaseType;
  status: CaseStatus;
  notes: string;
  tags: string[];
  parentCaseId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Document {
  id: string; // D001
  caseId: string;
  title: string;
  docType: DocType;
  source: string;
  docDate: string; // ISO date
  tags: string[];
  hashSha256: string;
  fileId: string;
  pagesCount: number;
  annexCode?: string; // A-1, A-2...
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface DocFile {
  id: string; // fileId
  hashSha256: string;
  filename: string;
  mime: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

export interface Span {
  id: string; // S001
  documentId: string;
  caseId: string;
  pageStart: number;
  pageEnd: number;
  label: string;
  note: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Fact {
  id: string; // H001
  caseId: string;
  title: string;
  narrative: string;
  status: FactStatus;
  burden: Burden;
  risk: RiskLevel;
  strength: number; // 1-5
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Partida {
  id: string; // P001
  caseId: string;
  date: string; // ISO date
  amountCents: number;
  currency: string;
  concept: string;
  accountFrom?: string;
  accountTo?: string;
  payer?: string;
  beneficiary?: string;
  theory?: string;
  state: PartidaState;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Event {
  id: string; // E001
  caseId: string;
  date: string; // ISO date
  type: EventType;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Strategy {
  id: string; // W001
  caseId: string;
  attack: string;
  risk: string;
  rebuttal: string;
  evidencePlan: string;
  questions: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string; // T001
  caseId: string;
  title: string;
  dueDate?: string; // ISO date
  priority: TaskPriority;
  status: TaskStatus;
  notes: string;
  links: string[]; // Array of entity IDs
  createdAt: number;
  updatedAt: number;
}

export interface Link {
  id: string; // UUID
  fromType: EntityType;
  fromId: string;
  toType: EntityType;
  toId: string;
  meta: {
    role: LinkRole;
    comment?: string;
    pin?: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  at: number;
  action: 'create' | 'update' | 'delete' | 'import' | 'export';
  entityType: EntityType | 'settings' | 'docFile';
  entityId: string;
  payload?: string; // JSON stringified changes
}

// ============================================
// Export/Import Types
// ============================================

export interface ExportManifest {
  schemaVersion: number;
  vaultId: string;
  exportedAt: number;
  deviceName: string;
  counts: {
    cases: number;
    documents: number;
    docFiles: number;
    spans: number;
    facts: number;
    partidas: number;
    events: number;
    strategies: number;
    tasks: number;
    links: number;
    analyticsMeta: number;
  };
  fileHashes: string[];
}

export interface ExportData {
  settings: Settings;
  counters: Counter[];
  cases: Case[];
  documents: Document[];
  spans: Span[];
  facts: Fact[];
  partidas: Partida[];
  events: Event[];
  strategies: Strategy[];
  tasks: Task[];
  links: Link[];
  auditLogs: AuditLog[];
  analyticsMeta: AnalyticsMeta[];
}

// ============================================
// UI Types
// ============================================

export interface SearchResult {
  type: EntityType;
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  score?: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  entityType?: EntityType;
  entityId?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
