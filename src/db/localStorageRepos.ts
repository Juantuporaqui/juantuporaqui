// ============================================
// CASE OPS - LocalStorage Persistence Layer
// Motor de persistencia alternativo basado en localStorage
// Compatible con IndexedDB (Dexie) como fallback/sync
// ============================================

import type {
  Case,
  CaseStatus,
  CaseType,
  Document,
  DocType,
  Strategy,
  Task,
  TaskPriority,
  TaskStatus,
} from '../types';

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEYS = {
  cases: 'case-ops:cases',
  documents: 'case-ops:documents',
  strategies: 'case-ops:strategies',
  tasks: 'case-ops:tasks',
  counters: 'case-ops:counters',
  initialized: 'case-ops:initialized',
} as const;

// ============================================
// Seed Data (Datos de ejemplo iniciales)
// ============================================

const SEED_CASES: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Procedimiento Ordinario Civil',
    court: 'JPII nº 1 de Picassent (Valencia)',
    autosNumber: '715/2024',
    type: 'ordinario',
    status: 'activo',
    notes: `Objeto:
- División de la cosa común
- Reclamación económica entre ex-cónyuges

Estado actual: Audiencia Previa pendiente
Señalamiento inicial: 24/10/2025

Partes:
- Actora: Vicenta Jiménez Vera
- Demandado: Juan Rodríguez

Riesgo procesal: ALTO`,
    tags: ['principal', 'division', 'hipoteca'],
  },
  {
    title: 'Ejecución de sentencia (familia)',
    court: 'Juzgado de Mislata',
    autosNumber: '',
    type: 'ejecucion',
    status: 'activo',
    notes: 'Ejecución por cantidades (≈3.500 € embargados)',
    tags: ['ejecucion', 'pension'],
  },
  {
    title: 'Mediación ICAV',
    court: 'ICAV',
    autosNumber: '',
    type: 'mediacion',
    status: 'cerrado',
    notes: 'Fecha: 17/04/2025 - Estado: Fracasada',
    tags: ['mediacion', 'buena_fe'],
  },
];

const SEED_STRATEGIES: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    caseId: 'CAS001',
    attack: 'La parte actora alegará que el piso de Madrid era bien ganancial.',
    risk: 'Alto: Podría afectar a la trazabilidad de fondos.',
    rebuttal: 'Aportar escritura de propiedad anterior al matrimonio y declaración IRPF.',
    evidencePlan: 'Escritura notarial + Resolución AEAT 2012',
    questions: '¿Cuándo adquirió el demandado el piso de Madrid?',
    tags: ['propiedad', 'fondos'],
  },
  {
    caseId: 'CAS001',
    attack: 'Actora negará haber dejado de pagar la hipoteca.',
    risk: 'Medio: Sin documentación, difícil de rebatir.',
    rebuttal: 'Solicitar extractos bancarios de la cuenta hipotecaria.',
    evidencePlan: 'Extractos cuenta hipotecaria Oct 2023 - presente',
    questions: '¿Puede aportar justificantes de los pagos alegados?',
    tags: ['impago', 'hipoteca'],
  },
];

const SEED_TASKS: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    caseId: 'CAS001',
    title: 'Preparar documentación para Audiencia Previa',
    dueDate: '2025-10-20',
    priority: 'alta',
    status: 'pendiente',
    notes: 'Recopilar escrituras, extractos y resolución AEAT',
    links: [],
  },
  {
    caseId: 'CAS001',
    title: 'Revisar estrategia de refutación',
    dueDate: '2025-10-15',
    priority: 'media',
    status: 'pendiente',
    notes: 'Actualizar plan de evidencia según últimos documentos',
    links: [],
  },
  {
    caseId: '',
    title: 'Backup semanal de expedientes',
    priority: 'baja',
    status: 'pendiente',
    notes: 'Exportar y guardar copia de seguridad',
    links: [],
  },
];

const SEED_DOCUMENTS: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    caseId: 'CAS001',
    title: 'Escritura de propiedad - Piso Madrid',
    docType: 'contrato',
    source: 'Notaría',
    docDate: '2008-03-15',
    tags: ['privativo', 'madrid'],
    hashSha256: '',
    fileId: '',
    pagesCount: 12,
    notes: 'Acredita propiedad privativa anterior al matrimonio',
  },
  {
    caseId: 'CAS001',
    title: 'Resolución AEAT reinversión',
    docType: 'otros',
    source: 'AEAT',
    docDate: '2012-12-01',
    tags: ['fiscal', 'reinversion'],
    hashSha256: '',
    fileId: '',
    pagesCount: 3,
    notes: 'Resolución firme que valida destino de fondos',
  },
];

// ============================================
// Helper Functions
// ============================================

function generateId(prefix: string, counter: number): string {
  return `${prefix}${String(counter).padStart(3, '0')}`;
}

function getCounters(): Record<string, number> {
  if (typeof localStorage === 'undefined') return {};
  const raw = localStorage.getItem(STORAGE_KEYS.counters);
  if (!raw) return { cases: 0, documents: 0, strategies: 0, tasks: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { cases: 0, documents: 0, strategies: 0, tasks: 0 };
  }
}

function setCounters(counters: Record<string, number>): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.counters, JSON.stringify(counters));
}

function getNextId(type: 'cases' | 'documents' | 'strategies' | 'tasks'): string {
  const prefixes: Record<string, string> = {
    cases: 'CAS',
    documents: 'D',
    strategies: 'W',
    tasks: 'T',
  };

  const counters = getCounters();
  const next = (counters[type] || 0) + 1;
  counters[type] = next;
  setCounters(counters);

  return generateId(prefixes[type], next);
}

async function delay(ms: number = 10): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// Generic CRUD Operations
// ============================================

function readStorage<T>(key: string): T[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeStorage<T>(key: string, data: T[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================
// Cases Repository (localStorage)
// ============================================

export const localCasesRepo = {
  async getAll(): Promise<Case[]> {
    await delay();
    return readStorage<Case>(STORAGE_KEYS.cases).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  },

  async getById(id: string): Promise<Case | undefined> {
    await delay();
    const cases = readStorage<Case>(STORAGE_KEYS.cases);
    return cases.find((c) => c.id === id);
  },

  async create(data: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> {
    await delay();
    const now = Date.now();
    const newCase: Case = {
      ...data,
      id: getNextId('cases'),
      createdAt: now,
      updatedAt: now,
    };

    const cases = readStorage<Case>(STORAGE_KEYS.cases);
    cases.push(newCase);
    writeStorage(STORAGE_KEYS.cases, cases);

    return newCase;
  },

  async update(id: string, updates: Partial<Case>): Promise<Case | undefined> {
    await delay();
    const cases = readStorage<Case>(STORAGE_KEYS.cases);
    const index = cases.findIndex((c) => c.id === id);

    if (index === -1) return undefined;

    cases[index] = {
      ...cases[index],
      ...updates,
      updatedAt: Date.now(),
    };

    writeStorage(STORAGE_KEYS.cases, cases);
    return cases[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const cases = readStorage<Case>(STORAGE_KEYS.cases);
    const filtered = cases.filter((c) => c.id !== id);

    if (filtered.length === cases.length) return false;

    writeStorage(STORAGE_KEYS.cases, filtered);
    return true;
  },

  async search(query: string): Promise<Case[]> {
    await delay();
    const lower = query.toLowerCase();
    const cases = readStorage<Case>(STORAGE_KEYS.cases);

    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.court.toLowerCase().includes(lower) ||
        c.autosNumber.toLowerCase().includes(lower) ||
        c.tags.some((t) => t.toLowerCase().includes(lower))
    );
  },
};

// ============================================
// Documents Repository (localStorage)
// ============================================

export const localDocumentsRepo = {
  async getAll(): Promise<Document[]> {
    await delay();
    return readStorage<Document>(STORAGE_KEYS.documents).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  },

  async getByCaseId(caseId: string): Promise<Document[]> {
    await delay();
    return readStorage<Document>(STORAGE_KEYS.documents).filter(
      (d) => d.caseId === caseId
    );
  },

  async getById(id: string): Promise<Document | undefined> {
    await delay();
    const docs = readStorage<Document>(STORAGE_KEYS.documents);
    return docs.find((d) => d.id === id);
  },

  async create(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    await delay();
    const now = Date.now();
    const newDoc: Document = {
      ...data,
      id: getNextId('documents'),
      createdAt: now,
      updatedAt: now,
    };

    const docs = readStorage<Document>(STORAGE_KEYS.documents);
    docs.push(newDoc);
    writeStorage(STORAGE_KEYS.documents, docs);

    return newDoc;
  },

  async update(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    await delay();
    const docs = readStorage<Document>(STORAGE_KEYS.documents);
    const index = docs.findIndex((d) => d.id === id);

    if (index === -1) return undefined;

    docs[index] = {
      ...docs[index],
      ...updates,
      updatedAt: Date.now(),
    };

    writeStorage(STORAGE_KEYS.documents, docs);
    return docs[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const docs = readStorage<Document>(STORAGE_KEYS.documents);
    const filtered = docs.filter((d) => d.id !== id);

    if (filtered.length === docs.length) return false;

    writeStorage(STORAGE_KEYS.documents, filtered);
    return true;
  },
};

// ============================================
// Strategies Repository (localStorage)
// ============================================

export const localStrategiesRepo = {
  async getAll(): Promise<Strategy[]> {
    await delay();
    return readStorage<Strategy>(STORAGE_KEYS.strategies).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  },

  async getByCaseId(caseId: string): Promise<Strategy[]> {
    await delay();
    return readStorage<Strategy>(STORAGE_KEYS.strategies).filter(
      (s) => s.caseId === caseId
    );
  },

  async getById(id: string): Promise<Strategy | undefined> {
    await delay();
    const strategies = readStorage<Strategy>(STORAGE_KEYS.strategies);
    return strategies.find((s) => s.id === id);
  },

  async create(data: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Strategy> {
    await delay();
    const now = Date.now();
    const newStrategy: Strategy = {
      ...data,
      id: getNextId('strategies'),
      createdAt: now,
      updatedAt: now,
    };

    const strategies = readStorage<Strategy>(STORAGE_KEYS.strategies);
    strategies.push(newStrategy);
    writeStorage(STORAGE_KEYS.strategies, strategies);

    return newStrategy;
  },

  async update(id: string, updates: Partial<Strategy>): Promise<Strategy | undefined> {
    await delay();
    const strategies = readStorage<Strategy>(STORAGE_KEYS.strategies);
    const index = strategies.findIndex((s) => s.id === id);

    if (index === -1) return undefined;

    strategies[index] = {
      ...strategies[index],
      ...updates,
      updatedAt: Date.now(),
    };

    writeStorage(STORAGE_KEYS.strategies, strategies);
    return strategies[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const strategies = readStorage<Strategy>(STORAGE_KEYS.strategies);
    const filtered = strategies.filter((s) => s.id !== id);

    if (filtered.length === strategies.length) return false;

    writeStorage(STORAGE_KEYS.strategies, filtered);
    return true;
  },
};

// ============================================
// Tasks Repository (localStorage)
// ============================================

export const localTasksRepo = {
  async getAll(): Promise<Task[]> {
    await delay();
    return readStorage<Task>(STORAGE_KEYS.tasks).sort((a, b) => {
      // Sort by due date, then by priority
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  },

  async getByCaseId(caseId: string): Promise<Task[]> {
    await delay();
    return readStorage<Task>(STORAGE_KEYS.tasks).filter((t) => t.caseId === caseId);
  },

  async getById(id: string): Promise<Task | undefined> {
    await delay();
    const tasks = readStorage<Task>(STORAGE_KEYS.tasks);
    return tasks.find((t) => t.id === id);
  },

  async getPending(): Promise<Task[]> {
    await delay();
    return readStorage<Task>(STORAGE_KEYS.tasks).filter(
      (t) => t.status === 'pendiente' || t.status === 'en_progreso'
    );
  },

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await delay();
    const now = Date.now();
    const newTask: Task = {
      ...data,
      id: getNextId('tasks'),
      createdAt: now,
      updatedAt: now,
    };

    const tasks = readStorage<Task>(STORAGE_KEYS.tasks);
    tasks.push(newTask);
    writeStorage(STORAGE_KEYS.tasks, tasks);

    return newTask;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    await delay();
    const tasks = readStorage<Task>(STORAGE_KEYS.tasks);
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) return undefined;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: Date.now(),
    };

    writeStorage(STORAGE_KEYS.tasks, tasks);
    return tasks[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const tasks = readStorage<Task>(STORAGE_KEYS.tasks);
    const filtered = tasks.filter((t) => t.id !== id);

    if (filtered.length === tasks.length) return false;

    writeStorage(STORAGE_KEYS.tasks, filtered);
    return true;
  },

  async toggleComplete(id: string): Promise<Task | undefined> {
    const task = await this.getById(id);
    if (!task) return undefined;

    const newStatus: TaskStatus =
      task.status === 'completada' ? 'pendiente' : 'completada';

    return this.update(id, { status: newStatus });
  },
};

// ============================================
// Initialization & Seeding
// ============================================

export async function initLocalStorage(): Promise<boolean> {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage not available');
    return false;
  }

  const isInitialized = localStorage.getItem(STORAGE_KEYS.initialized);

  if (isInitialized) {
    console.log('LocalStorage already initialized');
    return false;
  }

  console.log('Initializing localStorage with seed data...');

  // Initialize counters
  setCounters({ cases: 0, documents: 0, strategies: 0, tasks: 0 });

  // Seed cases
  for (const caseData of SEED_CASES) {
    await localCasesRepo.create(caseData);
  }

  // Seed strategies
  for (const strategyData of SEED_STRATEGIES) {
    await localStrategiesRepo.create(strategyData);
  }

  // Seed tasks
  for (const taskData of SEED_TASKS) {
    await localTasksRepo.create(taskData);
  }

  // Seed documents
  for (const docData of SEED_DOCUMENTS) {
    await localDocumentsRepo.create(docData);
  }

  // Mark as initialized
  localStorage.setItem(STORAGE_KEYS.initialized, 'true');

  console.log('LocalStorage initialized successfully');
  return true;
}

export function clearLocalStorage(): void {
  if (typeof localStorage === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log('LocalStorage cleared');
}

// ============================================
// Global Search (localStorage)
// ============================================

export async function localGlobalSearch(query: string): Promise<{
  cases: Case[];
  documents: Document[];
  strategies: Strategy[];
  tasks: Task[];
}> {
  const lower = query.toLowerCase();

  const [cases, documents, strategies, tasks] = await Promise.all([
    localCasesRepo.search(query),
    localDocumentsRepo.getAll().then((docs) =>
      docs.filter(
        (d) =>
          d.title.toLowerCase().includes(lower) ||
          d.notes.toLowerCase().includes(lower) ||
          d.tags.some((t) => t.toLowerCase().includes(lower))
      )
    ),
    localStrategiesRepo.getAll().then((strats) =>
      strats.filter(
        (s) =>
          s.attack.toLowerCase().includes(lower) ||
          s.rebuttal.toLowerCase().includes(lower) ||
          s.tags.some((t) => t.toLowerCase().includes(lower))
      )
    ),
    localTasksRepo.getAll().then((tasks) =>
      tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.notes.toLowerCase().includes(lower)
      )
    ),
  ]);

  return { cases, documents, strategies, tasks };
}

// ============================================
// Export unified interface
// ============================================

export const localRepos = {
  cases: localCasesRepo,
  documents: localDocumentsRepo,
  strategies: localStrategiesRepo,
  tasks: localTasksRepo,
  init: initLocalStorage,
  clear: clearLocalStorage,
  search: localGlobalSearch,
};

export default localRepos;
