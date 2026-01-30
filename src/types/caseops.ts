// ============================================
// CHALADITA CASE-OPS - Type Definitions
// Nueva DB aislada para Chaladita
// ============================================

// Estados de Procedimiento
export type EstadoProcedimiento =
  | 'Preparación'
  | 'En trámite'
  | 'Señalado'
  | 'Ejecución'
  | 'Cerrado';

// Nivel de Riesgo
export type Riesgo = 'bajo' | 'medio' | 'alto';

// Tipos de Documento
export type TipoDocumento =
  | 'sentencia'
  | 'convenio'
  | 'demanda'
  | 'contestacion'
  | 'extracto'
  | 'resolucion'
  | 'whatsapp'
  | 'correo'
  | 'escritura'
  | 'recibo'
  | 'otro';

// Estado de Partida Económica
export type EstadoPartida = 'reclamada' | 'discutida' | 'admitida';

// Tipo de Prescripción
export type TipoPrescripcion = 'no' | 'si' | 'parcial' | 'posible';

// Prioridad de Tarea
export type PrioridadTarea = 'baja' | 'media' | 'alta';

// Estado de Tarea
export type EstadoTarea = 'pendiente' | 'hecha' | 'bloqueada';

// Tipo de Timeline
export type TipoTimeline = 'hito' | 'hecho' | 'documento' | 'audiencia' | 'recordatorio';

// ============================================
// Interfaces principales
// ============================================

export interface ProcedimientoCase {
  id: string;
  nombre: string;
  juzgado: string;
  autos: string;
  estado: EstadoProcedimiento;
  objetivoInmediato: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface HechoCase {
  id: string;
  procedimientoId: string;
  titulo: string;
  fecha: string; // ISO date o rango "2023-01-01/2023-06-30"
  tesis: string;
  antitesisEsperada: string;
  riesgo: Riesgo;
  fuerza: number; // 1-5
  resumenCorto: string;
  tags: string[];
  pruebasEsperadas: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentoCase {
  id: string;
  procedimientoId: string;
  tipo: TipoDocumento;
  fecha: string; // ISO date
  fuente: string;
  descripcion: string;
  tags: string[];
  hechosIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface PartidaEconomica {
  id: string;
  procedimientoId: string;
  concepto: string;
  importe: number; // en céntimos
  estado: EstadoPartida;
  prescripcion: TipoPrescripcion;
  soportes: string[]; // IDs de documentos
  resumen: string;
  createdAt: number;
  updatedAt: number;
}

export interface HitoProc {
  id: string;
  procedimientoId: string;
  fecha: string; // ISO date
  titulo: string;
  detalle: string;
  createdAt: number;
  updatedAt: number;
}

export interface TareaProc {
  id: string;
  procedimientoId: string;
  titulo: string;
  detalle?: string;
  prioridad: PrioridadTarea;
  fechaLimite: string; // ISO date
  estado: EstadoTarea;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface LinkProc {
  id: string;
  fromId: string;
  toId: string;
  relationType: string;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineItem {
  id: string;
  procedimientoId: string;
  fecha: string; // ISO date
  tipo: TipoTimeline;
  evento: string;
  refId?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// FASE 2 - Tipos adicionales
// ============================================

// Ganabilidad de reclamación visual
export type GanabilidadReclamacion = 'alta' | 'media' | 'baja';

// Reclamación visual (tile)
export interface ReclamacionVisual {
  id: string;
  label: string; // "HIPOTECA", "PRÉSTAMOS", "OBRAS", etc.
  cantidad: number; // en céntimos
  ganabilidad: GanabilidadReclamacion;
  partidaId: string;
  procedimientoId: string;
}

// Documento subido con Blob real (offline)
export interface DocumentoSubido {
  id: string;
  procedimientoId: string;
  nombre: string;
  tipoMime: string;
  tamano: number;
  fecha: string; // ISO
  descripcion?: string;
  tags: string[];
  blob: Blob; // CLAVE: contenido real offline
  createdAt: string;
}

// Sección de audiencia previa
export interface SeccionAudiencia {
  id: string;
  procedimientoId: string;
  titulo: string; // "Hechos controvertidos", "Prueba documental", etc.
  bullets: string[];
  orden: number;
  updatedAt: string;
}

// ============================================
// Seed Data Interface (compatible FASE 1 + FASE 2)
// ============================================

export interface SeedData {
  procedimientos: ProcedimientoCase[];
  hechos: HechoCase[];
  documentos: DocumentoCase[];
  partidas: PartidaEconomica[];
  hitos: HitoProc[];
  tareas: TareaProc[];
  links: LinkProc[];
  timeline: TimelineItem[];
  // FASE 2 - opcionales para compatibilidad
  reclamacionesVisuales?: ReclamacionVisual[];
  documentosSubidos?: DocumentoSubido[];
  seccionesAudiencia?: SeccionAudiencia[];
}

// ============================================
// Timeline Agregado (para cronología)
// ============================================

export interface TimelineItemAgg {
  id: string;
  procedimientoId: string;
  fecha: string;
  tipo: TipoTimeline | 'partida' | 'tarea';
  evento: string;
  refId?: string;
  color?: string;
  importancia?: number;
}
