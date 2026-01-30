// ============================================
// CHALADITA CASE-OPS - Seed Data MUY RICO (FUSIONADO)
// Incluye: 3 Procedimientos + Datos Estratégicos Nuevos + Docs HTML
// ============================================

import type {
  SeedData,
  ProcedimientoCase,
  HechoCase,
  DocumentoCase,
  PartidaEconomica,
  HitoProc,
  TareaProc,
  LinkProc,
  TimelineItem,
  TipoDocumento,
  Riesgo,
  EstadoPartida,
  TipoPrescripcion,
  PrioridadTarea,
  EstadoTarea,
  TipoTimeline,
  // FASE 2
  ReclamacionVisual,
  GanabilidadReclamacion,
  DocumentoSubido,
  SeccionAudiencia,
} from '../types/caseops';

// ============================================
// Helpers para crear entidades
// ============================================

const now = Date.now();
const nowISO = new Date().toISOString();

// Helper para crear blobs de texto (simula tus HTMLs de demanda/contestación)
const mkBlob = (txt: string) => new Blob([txt], { type: 'text/html;charset=utf-8' });

function doc(
  id: string,
  procedimientoId: string,
  tipo: TipoDocumento,
  fecha: string,
  fuente: string,
  descripcion: string,
  tags: string[],
  hechosIds: string[]
): DocumentoCase {
  return {
    id,
    procedimientoId,
    tipo,
    fecha,
    fuente,
    descripcion,
    tags,
    hechosIds,
    createdAt: now,
    updatedAt: now,
  };
}

function hecho(
  id: string,
  procedimientoId: string,
  titulo: string,
  fecha: string,
  tesis: string,
  antitesisEsperada: string,
  riesgo: Riesgo,
  fuerza: number,
  resumenCorto: string,
  tags: string[],
  pruebasEsperadas: string[]
): HechoCase {
  return {
    id,
    procedimientoId,
    titulo,
    fecha,
    tesis,
    antitesisEsperada,
    riesgo,
    fuerza,
    resumenCorto,
    tags,
    pruebasEsperadas,
    createdAt: now,
    updatedAt: now,
  };
}

function partida(
  id: string,
  procedimientoId: string,
  concepto: string,
  importe: number,
  estado: EstadoPartida,
  prescripcion: TipoPrescripcion,
  soportes: string[],
  resumen: string
): PartidaEconomica {
  return {
    id,
    procedimientoId,
    concepto,
    importe,
    estado,
    prescripcion,
    soportes,
    resumen,
    createdAt: now,
    updatedAt: now,
  };
}

function tarea(
  id: string,
  procedimientoId: string,
  titulo: string,
  detalle: string,
  prioridad: PrioridadTarea,
  fechaLimite: string,
  estado: EstadoTarea,
  tags: string[]
): TareaProc {
  return {
    id,
    procedimientoId,
    titulo,
    detalle,
    prioridad,
    fechaLimite,
    estado,
    tags,
    createdAt: now,
    updatedAt: now,
  };
}

function hitoFn(
  id: string,
  procedimientoId: string,
  fecha: string,
  titulo: string,
  detalle: string
): HitoProc {
  return {
    id,
    procedimientoId,
    fecha,
    titulo,
    detalle,
    createdAt: now,
    updatedAt: now,
  };
}

function link(
  id: string,
  fromId: string,
  toId: string,
  relationType: string
): LinkProc {
  return {
    id,
    fromId,
    toId,
    relationType,
    createdAt: now,
    updatedAt: now,
  };
}

function timeline(
  id: string,
  procedimientoId: string,
  fecha: string,
  tipo: TipoTimeline,
  evento: string,
  refId?: string
): TimelineItem {
  return {
    id,
    procedimientoId,
    fecha,
    tipo,
    evento,
    refId,
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================
// PROCEDIMIENTOS (3)
// ============================================

const procedimientos: ProcedimientoCase[] = [
  {
    id: 'picassent-715-2024',
    nombre: 'División cosa común + Reclamación económica',
    juzgado: 'Juzgado Primera Instancia nº3 Picassent',
    autos: '715/2024',
    estado: 'Señalado',
    objetivoInmediato: 'Preparar audiencia previa - reunir pruebas de disposiciones',
    tags: ['familia', 'division', 'reclamacion', 'propiedad'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'quart-362-2023',
    nombre: 'Ejecución familia: cuenta escolar / ayudas',
    juzgado: 'Juzgado Primera Instancia nº2 Quart de Poblet',
    autos: '362/2023',
    estado: 'En trámite',
    objetivoInmediato: 'Obtener resolución sobre pagos escolares pendientes',
    tags: ['familia', 'ejecucion', 'menores', 'pension'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'mislata-hipoteca',
    nombre: 'Reclamación deuda hipotecaria',
    juzgado: 'Juzgado Primera Instancia nº1 Mislata',
    autos: '89/2024',
    estado: 'Preparación',
    objetivoInmediato: 'Completar documentación y calcular intereses',
    tags: ['hipoteca', 'deuda', 'banco', 'reclamacion'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// HECHOS - Picassent (8 hechos)
// ============================================

const hechosPicassent: HechoCase[] = [
  hecho(
    'h-pic-001',
    'picassent-715-2024',
    'Adquisición propiedad conjunta',
    '2015-03-15',
    'La adquisición fue conjunta y al 50%, independientemente de la procedencia de los fondos iniciales.',
    'Demandado alegará aportación mayor al precio y crédito a su favor.',
    'bajo',
    5,
    'Compra escritura pública 50/50',
    ['propiedad', 'adquisicion'],
    ['Escritura compraventa', 'Nota simple registro']
  ),
  hecho(
    'h-pic-002',
    'picassent-715-2024',
    'Ruptura convivencia',
    '2022-06-01',
    'Las partes cesaron la convivencia en junio 2022',
    'Discusión sobre fecha exacta',
    'bajo',
    4,
    'Fin convivencia junio 2022',
    ['convivencia', 'ruptura'],
    ['Empadronamiento', 'Testigos']
  ),
  // HECHO ENRIQUECIDO PARA LA DEMO
  hecho(
    'h-pic-003',
    'picassent-715-2024',
    'Disposiciones unilaterales (45.000€)',
    '2022-06-01/2023-12-31',
    'TESIS DEFENSA: Las salidas de fondos carecen de causa justificada en el sostenimiento familiar. Se realizaron masivamente días antes de la ruptura para vaciar la cuenta. Constituyen un alzamiento de bienes de facto.',
    'ANTÍTESIS: Alegará que se destinaron a pagar deudas de la sociedad de gananciales o gastos ordinarios de los hijos.',
    'alto',
    5,
    'Retiradas 45.000€ sin consentimiento ni justificación.',
    ['disposiciones', 'cuenta', 'fraude'],
    ['Extractos bancarios (Doc 3 y 4)', 'Interrogatorio de parte', 'Ausencia de facturas']
  ),
  // HECHO ENRIQUECIDO PARA LA DEMO
  hecho(
    'h-pic-004',
    'picassent-715-2024',
    'Pago hipoteca exclusivo Actora (15.600€)',
    '2022-07-01/2024-06-30',
    'TESIS DEFENSA: La actora ha soportado la carga hipotecaria en solitario tras la ruptura. Procede el reembolso del 50% (art. 1158 CC).',
    'ANTÍTESIS: Alegará compensación con el uso de la vivienda o que los pagos se hicieron con dinero ganancial no liquidado.',
    'medio',
    4,
    'Actora pagó 15.600€ hipoteca sola',
    ['hipoteca', 'pagos'],
    ['Recibos hipoteca', 'Extractos cuenta']
  ),
  // HECHO ENRIQUECIDO PARA LA DEMO
  hecho(
    'h-pic-005',
    'picassent-715-2024',
    'Uso exclusivo vivienda por Demandado',
    '2022-06-15/2024-06-30',
    'TESIS DEFENSA: Existe enriquecimiento injusto. Al privar a la copropietaria del uso, nace el derecho a indemnización (mercado de alquiler) desde el requerimiento fehaciente.',
    'ANTÍTESIS: Dirá que el uso fue tolerado ("precario") y que la actora abandonó el domicilio voluntariamente.',
    'medio',
    4,
    'Uso exclusivo sin compensar',
    ['vivienda', 'uso'],
    ['Burofax requerimiento', 'Testifical vecinos', 'Certificado empadronamiento']
  ),
  hecho(
    'h-pic-006',
    'picassent-715-2024',
    'Valoración pericial vivienda',
    '2024-01-15',
    'Tasación oficial valora la vivienda en 185.000€',
    'Demandado impugnará valoración',
    'bajo',
    5,
    'Tasación: 185.000€',
    ['tasacion', 'valoracion'],
    ['Informe tasador', 'Comparables mercado']
  ),
  hecho(
    'h-pic-007',
    'picassent-715-2024',
    'Requerimiento extrajudicial',
    '2023-09-01',
    'Se remitió burofax requiriendo liquidación amistosa sin respuesta',
    'Demandado negará recepción',
    'bajo',
    5,
    'Burofax sin respuesta',
    ['requerimiento', 'burofax'],
    ['Burofax', 'Acuse recibo']
  ),
  hecho(
    'h-pic-008',
    'picassent-715-2024',
    'Ocultación bienes muebles',
    '2022-06-20',
    'Demandado retiró enseres valorados en 8.000€ del domicilio común',
    'Demandado alegará propiedad exclusiva',
    'alto',
    2,
    'Retirada muebles 8.000€',
    ['muebles', 'ocultacion'],
    ['Fotos', 'Facturas compra', 'Testigos']
  ),
];

// ============================================
// HECHOS - Quart (7 hechos)
// ============================================

const hechosQuart: HechoCase[] = [
  hecho('h-qrt-001', 'quart-362-2023', 'Sentencia divorcio', '2021-05-20', 'Sentencia estableció pensión 400€', 'Ninguna', 'bajo', 5, 'Sentencia fija obligaciones', ['sentencia', 'divorcio'], ['Sentencia firme']),
  hecho('h-qrt-002', 'quart-362-2023', 'Impago gastos escolares 2022-2023', '2022-09-01/2023-06-30', 'Deudor no abonó su 50% de gastos escolares: matrícula, libros, material', 'Alegará que no son gastos extraordinarios', 'medio', 4, 'Impago escolar 1.850€', ['escolar', 'impago'], ['Facturas colegio', 'Recibos', 'Transferencias']),
  hecho('h-qrt-003', 'quart-362-2023', 'Impago gastos médicos', '2022-01-01/2023-12-31', 'Deudor no abonó 50% gastos médicos no cubiertos: ortodoncista, gafas', 'Alegará falta de consentimiento previo', 'medio', 3, 'Impago médico 2.400€', ['medico', 'impago'], ['Facturas', 'Prescripciones', 'WhatsApps']),
  hecho('h-qrt-004', 'quart-362-2023', 'Beca comedor no declarada', '2022-09-01/2024-06-30', 'Los menores tienen beca comedor 100% que deudor no comunicó', 'Deudor alegará desconocimiento', 'alto', 4, 'Beca comedor ocultada', ['beca', 'ocultacion'], ['Resolución beca', 'Extractos ayuntamiento']),
  hecho('h-qrt-005', 'quart-362-2023', 'Ayuda libros percibida', '2022-09-01/2024-06-30', 'Deudor percibió ayudas de libros sin comunicar ni descontar', 'Alegará que las gastó en los menores', 'medio', 3, 'Ayudas libros no comunicadas', ['ayudas', 'libros'], ['Resolución ayuda', 'Justificantes']),
  hecho('h-qrt-006', 'quart-362-2023', 'Comunicaciones ignoradas', '2023-01-01/2024-06-30', 'Múltiples WhatsApps solicitando abono fueron ignorados', 'Alegará no recepción', 'bajo', 5, 'WhatsApps ignorados', ['comunicacion', 'whatsapp'], ['Capturas WhatsApp']),
  hecho('h-qrt-007', 'quart-362-2023', 'Actividades extraescolares 2023-2024', '2023-09-01/2024-06-30', 'Gastos de actividades extraescolares acordadas: natación y música', 'Alegará que no consintió actividades', 'medio', 4, 'Extraescolares 1.200€', ['extraescolar', 'actividades'], ['Facturas', 'Matrículas', 'WhatsApps acuerdo']),
];

// ============================================
// HECHOS - Mislata (6 hechos)
// ============================================

const hechosMislata: HechoCase[] = [
  hecho('h-mis-001', 'mislata-hipoteca', 'Préstamo hipotecario original', '2008-04-15', 'Préstamo hipotecario de 180.000€ a 30 años, interés variable EURIBOR+1,5%', 'Ninguna', 'bajo', 5, 'Hipoteca 180.000€ 2008', ['hipoteca', 'prestamo'], ['Escritura préstamo', 'Nota simple']),
  hecho('h-mis-002', 'mislata-hipoteca', 'Cláusula suelo abusiva', '2008-04-15', 'El préstamo contenía cláusula suelo al 3,5% declarada nula', 'Banco alegará que fue negociada individualmente', 'medio', 4, 'Cláusula suelo 3,5%', ['clausula-suelo', 'abusiva'], ['Escritura', 'Sentencias similares']),
  hecho('h-mis-003', 'mislata-hipoteca', 'Pagos durante vigencia cláusula suelo', '2008-04-15/2017-01-15', 'Durante 9 años se pagó con suelo activo: diferencia calculada 18.500€', 'Banco discutirá cálculos', 'medio', 4, 'Sobrecoste cláusula suelo 18.500€', ['sobrecoste', 'calculo'], ['Extractos', 'Cuadro amortización', 'Recibos']),
  hecho('h-mis-004', 'mislata-hipoteca', 'Gastos de constitución', '2008-04-15', 'Cliente abonó íntegramente gastos: notaría 850€, registro 420€, gestoría 380€, tasación 350€', 'Banco alegará práctica habitual', 'bajo', 5, 'Gastos constitución 2.000€', ['gastos', 'constitucion'], ['Facturas', 'Escritura']),
  hecho('h-mis-005', 'mislata-hipoteca', 'Comisión apertura', '2008-04-15', 'Se cobró comisión de apertura del 1% (1.800€)', 'Banco alegará servicio efectivo', 'alto', 3, 'Comisión apertura 1.800€', ['comision', 'apertura'], ['Escritura', 'Extracto']),
  hecho('h-mis-006', 'mislata-hipoteca', 'Intereses de demora abusivos', '2008-04-15', 'Interés de demora pactado del 25% anual, claramente abusivo', 'Banco alegará que nunca se aplicó', 'bajo', 5, 'Interés demora 25% abusivo', ['demora', 'abusivo'], ['Escritura', 'Jurisprudencia']),
];

const hechos = [...hechosPicassent, ...hechosQuart, ...hechosMislata];

// ============================================
// DOCUMENTOS - Picassent (15 docs)
// ============================================

const docsPicassent: DocumentoCase[] = [
  doc('d-pic-001', 'picassent-715-2024', 'escritura', '2015-03-15', 'Notaría López', 'Escritura compraventa vivienda', ['propiedad'], ['h-pic-001']),
  doc('d-pic-002', 'picassent-715-2024', 'otro', '2015-03-20', 'Registro Propiedad', 'Nota simple actualizada', ['registro'], ['h-pic-001']),
  doc('d-pic-003', 'picassent-715-2024', 'extracto', '2022-06-30', 'Banco X', 'Extracto cuenta común jun-2022', ['banco', 'extracto'], ['h-pic-003']),
  doc('d-pic-004', 'picassent-715-2024', 'extracto', '2022-07-31', 'Banco X', 'Extracto cuenta común jul-2022', ['banco', 'extracto'], ['h-pic-003']),
  doc('d-pic-005', 'picassent-715-2024', 'extracto', '2022-08-31', 'Banco X', 'Extracto cuenta común ago-2022', ['banco', 'extracto'], ['h-pic-003']),
  doc('d-pic-006', 'picassent-715-2024', 'extracto', '2022-09-30', 'Banco X', 'Extracto cuenta común sep-2022', ['banco', 'extracto'], ['h-pic-003']),
  doc('d-pic-007', 'picassent-715-2024', 'extracto', '2022-12-31', 'Banco X', 'Extracto cuenta común oct-dic 2022', ['banco', 'extracto'], ['h-pic-003']),
  doc('d-pic-008', 'picassent-715-2024', 'recibo', '2024-06-01', 'Banco Y', 'Recibos hipoteca 24 meses', ['hipoteca', 'recibos'], ['h-pic-004']),
  doc('d-pic-009', 'picassent-715-2024', 'otro', '2024-01-15', 'Tasador oficial', 'Informe tasación vivienda 185.000€', ['tasacion'], ['h-pic-006']),
  doc('d-pic-010', 'picassent-715-2024', 'correo', '2023-09-01', 'Burofax', 'Burofax requerimiento liquidación', ['burofax', 'requerimiento'], ['h-pic-007']),
  doc('d-pic-011', 'picassent-715-2024', 'otro', '2022-06-20', 'Fotos', 'Fotografías estado vivienda antes salida', ['fotos', 'muebles'], ['h-pic-008']),
  doc('d-pic-012', 'picassent-715-2024', 'recibo', '2018-05-10', 'Tienda muebles', 'Factura sofá y mueble TV', ['facturas', 'muebles'], ['h-pic-008']),
  doc('d-pic-013', 'picassent-715-2024', 'otro', '2022-07-01', 'Ayuntamiento', 'Certificado empadronamiento Actora', ['empadronamiento'], ['h-pic-002', 'h-pic-005']),
  doc('d-pic-014', 'picassent-715-2024', 'demanda', '2024-02-15', 'Juzgado', 'Demanda división cosa común', ['demanda'], []),
  doc('d-pic-015', 'picassent-715-2024', 'contestacion', '2024-04-20', 'Demandado', 'Contestación a la demanda', ['contestacion'], []),
];

// ============================================
// DOCUMENTOS - Quart (12 docs)
// ============================================

const docsQuart: DocumentoCase[] = [
  doc('d-qrt-001', 'quart-362-2023', 'sentencia', '2021-05-20', 'Juzgado Familia', 'Sentencia divorcio', ['sentencia', 'divorcio'], ['h-qrt-001']),
  doc('d-qrt-002', 'quart-362-2023', 'recibo', '2023-06-15', 'Colegio', 'Facturas matrícula y material 2022-2023', ['escolar', 'facturas'], ['h-qrt-002']),
  doc('d-qrt-003', 'quart-362-2023', 'recibo', '2023-01-10', 'Óptica', 'Factura gafas graduadas menor', ['medico', 'gafas'], ['h-qrt-003']),
  doc('d-qrt-004', 'quart-362-2023', 'recibo', '2023-03-20', 'Clínica dental', 'Factura ortodoncista', ['medico', 'ortodoncista'], ['h-qrt-003']),
  doc('d-qrt-005', 'quart-362-2023', 'resolucion', '2022-09-01', 'Ayuntamiento', 'Resolución beca comedor 2022-2023', ['beca', 'comedor'], ['h-qrt-004']),
  doc('d-qrt-006', 'quart-362-2023', 'resolucion', '2023-09-01', 'Ayuntamiento', 'Resolución beca comedor 2023-2024', ['beca', 'comedor'], ['h-qrt-004']),
  doc('d-qrt-007', 'quart-362-2023', 'resolucion', '2022-10-01', 'Conselleria', 'Resolución ayuda libros', ['ayuda', 'libros'], ['h-qrt-005']),
  doc('d-qrt-008', 'quart-362-2023', 'whatsapp', '2024-01-15', 'Capturas', 'Conversación WhatsApp reclamando pagos', ['whatsapp', 'comunicacion'], ['h-qrt-006']),
  doc('d-qrt-009', 'quart-362-2023', 'whatsapp', '2023-09-05', 'Capturas', 'WhatsApp acuerdo extraescolares', ['whatsapp', 'acuerdo'], ['h-qrt-007']),
  doc('d-qrt-010', 'quart-362-2023', 'recibo', '2024-01-15', 'Academia natación', 'Facturas natación curso 2023-2024', ['extraescolar', 'natacion'], ['h-qrt-007']),
  doc('d-qrt-011', 'quart-362-2023', 'recibo', '2024-01-15', 'Escuela música', 'Facturas música curso 2023-2024', ['extraescolar', 'musica'], ['h-qrt-007']),
  doc('d-qrt-012', 'quart-362-2023', 'demanda', '2023-11-10', 'Juzgado', 'Demanda ejecución títulos', ['demanda', 'ejecucion'], []),
];

// ============================================
// DOCUMENTOS - Mislata (13 docs)
// ============================================

const docsMislata: DocumentoCase[] = [
  doc('d-mis-001', 'mislata-hipoteca', 'escritura', '2008-04-15', 'Notaría García', 'Escritura préstamo hipotecario', ['hipoteca', 'escritura'], ['h-mis-001', 'h-mis-002']),
  doc('d-mis-002', 'mislata-hipoteca', 'otro', '2024-01-10', 'Registro', 'Nota simple finca', ['registro'], ['h-mis-001']),
  doc('d-mis-003', 'mislata-hipoteca', 'extracto', '2008-12-31', 'Banco Z', 'Extractos 2008 con cláusula suelo', ['extracto', 'clausula-suelo'], ['h-mis-003']),
  doc('d-mis-004', 'mislata-hipoteca', 'extracto', '2009-12-31', 'Banco Z', 'Extractos 2009', ['extracto'], ['h-mis-003']),
  doc('d-mis-005', 'mislata-hipoteca', 'extracto', '2010-12-31', 'Banco Z', 'Extractos 2010', ['extracto'], ['h-mis-003']),
  doc('d-mis-006', 'mislata-hipoteca', 'extracto', '2015-12-31', 'Banco Z', 'Extractos 2011-2015', ['extracto'], ['h-mis-003']),
  doc('d-mis-007', 'mislata-hipoteca', 'extracto', '2017-01-15', 'Banco Z', 'Extractos 2016-2017', ['extracto'], ['h-mis-003']),
  doc('d-mis-008', 'mislata-hipoteca', 'recibo', '2008-04-20', 'Notaría', 'Factura notaría', ['gastos', 'notaria'], ['h-mis-004']),
  doc('d-mis-009', 'mislata-hipoteca', 'recibo', '2008-04-22', 'Registro', 'Factura registro', ['gastos', 'registro'], ['h-mis-004']),
  doc('d-mis-010', 'mislata-hipoteca', 'recibo', '2008-04-25', 'Gestoría', 'Factura gestoría', ['gastos', 'gestoria'], ['h-mis-004']),
  doc('d-mis-011', 'mislata-hipoteca', 'recibo', '2008-04-10', 'Tasadora', 'Factura tasación', ['gastos', 'tasacion'], ['h-mis-004']),
  doc('d-mis-012', 'mislata-hipoteca', 'otro', '2024-02-01', 'Cálculo', 'Cuadro amortización teórico sin suelo', ['calculo', 'cuadro'], ['h-mis-003']),
  doc('d-mis-013', 'mislata-hipoteca', 'sentencia', '2017-01-21', 'TJUE', 'Sentencia TJUE cláusulas suelo', ['jurisprudencia', 'suelo'], ['h-mis-002']),
];

const documentos = [...docsPicassent, ...docsQuart, ...docsMislata];

// ============================================
// PARTIDAS ECONÓMICAS - Picassent (8)
// ============================================

const partidasPicassent: PartidaEconomica[] = [
  partida('p-pic-001', 'picassent-715-2024', 'Disposición cuenta jun-2022', 1200000, 'reclamada', 'no', ['d-pic-003'], '50% de 24.000€ retirados'),
  partida('p-pic-002', 'picassent-715-2024', 'Disposición cuenta jul-2022', 850000, 'reclamada', 'no', ['d-pic-004'], '50% de 17.000€ retirados'),
  partida('p-pic-003', 'picassent-715-2024', 'Disposición cuenta ago-sep 2022', 200000, 'discutida', 'no', ['d-pic-005', 'd-pic-006'], '50% de 4.000€ en disputa'),
  partida('p-pic-004', 'picassent-715-2024', 'Pagos hipoteca 24 meses', 780000, 'reclamada', 'no', ['d-pic-008'], '50% de 15.600€ (24x650€)'),
  partida('p-pic-005', 'picassent-715-2024', 'Compensación uso exclusivo', 600000, 'discutida', 'posible', [], 'Uso vivienda 24 meses x 500€/mes * 50%'),
  partida('p-pic-006', 'picassent-715-2024', 'Muebles retirados', 400000, 'reclamada', 'no', ['d-pic-011', 'd-pic-012'], '50% de 8.000€ en muebles'),
  partida('p-pic-007', 'picassent-715-2024', 'IBI vivienda 2023', 45000, 'reclamada', 'no', [], '50% de 900€'),
  partida('p-pic-008', 'picassent-715-2024', 'IBI vivienda 2024', 47500, 'reclamada', 'no', [], '50% de 950€'),
];

// ============================================
// PARTIDAS ECONÓMICAS - Quart (7)
// ============================================

const partidasQuart: PartidaEconomica[] = [
  partida('p-qrt-001', 'quart-362-2023', 'Matrícula colegio 2022-2023', 35000, 'reclamada', 'no', ['d-qrt-002'], '50% de 700€'),
  partida('p-qrt-002', 'quart-362-2023', 'Libros y material 2022-2023', 57500, 'reclamada', 'no', ['d-qrt-002'], '50% de 1.150€'),
  partida('p-qrt-003', 'quart-362-2023', 'Gafas graduadas', 22500, 'reclamada', 'no', ['d-qrt-003'], '50% de 450€'),
  partida('p-qrt-004', 'quart-362-2023', 'Ortodoncista tratamiento', 97500, 'discutida', 'no', ['d-qrt-004'], '50% de 1.950€ - discute necesidad'),
  partida('p-qrt-005', 'quart-362-2023', 'Natación curso completo', 36000, 'reclamada', 'no', ['d-qrt-010'], '50% de 720€'),
  partida('p-qrt-006', 'quart-362-2023', 'Música curso completo', 48000, 'reclamada', 'no', ['d-qrt-011'], '50% de 960€'),
  partida('p-qrt-007', 'quart-362-2023', 'Compensación becas no comunicadas', 180000, 'discutida', 'no', ['d-qrt-005', 'd-qrt-006', 'd-qrt-007'], 'Becas ocultadas 2 cursos'),
];

// ============================================
// PARTIDAS ECONÓMICAS - Mislata (6)
// ============================================

const partidasMislata: PartidaEconomica[] = [
  partida('p-mis-001', 'mislata-hipoteca', 'Diferencia cláusula suelo 2008-2012', 950000, 'reclamada', 'parcial', ['d-mis-003', 'd-mis-004', 'd-mis-005'], '4 años afectados'),
  partida('p-mis-002', 'mislata-hipoteca', 'Diferencia cláusula suelo 2013-2017', 900000, 'reclamada', 'no', ['d-mis-006', 'd-mis-007'], '4 años afectados'),
  partida('p-mis-003', 'mislata-hipoteca', 'Gastos notaría', 85000, 'reclamada', 'parcial', ['d-mis-008'], '850€'),
  partida('p-mis-004', 'mislata-hipoteca', 'Gastos registro', 42000, 'reclamada', 'parcial', ['d-mis-009'], '420€'),
  partida('p-mis-005', 'mislata-hipoteca', 'Gastos gestoría', 38000, 'reclamada', 'si', ['d-mis-010'], '380€ - prescrito'),
  partida('p-mis-006', 'mislata-hipoteca', 'Comisión apertura', 180000, 'discutida', 'no', ['d-mis-001'], '1.800€ - TJUE pendiente'),
];

const partidas = [...partidasPicassent, ...partidasQuart, ...partidasMislata];

// ============================================
// HITOS PROCESALES (12)
// ============================================

const hitos: HitoProc[] = [
  hitoFn('hito-pic-001', 'picassent-715-2024', '2024-02-15', 'Presentación demanda', 'Demanda división cosa común + reconvención económica'),
  hitoFn('hito-pic-002', 'picassent-715-2024', '2024-02-28', 'Admisión a trámite', 'Auto admisión y emplazamiento'),
  hitoFn('hito-pic-003', 'picassent-715-2024', '2024-04-20', 'Contestación demanda', 'Demandado contesta oponiéndose'),
  hitoFn('hito-pic-004', 'picassent-715-2024', '2024-05-15', 'Señalamiento audiencia', 'Audiencia previa 15/03/2025'),
  hitoFn('hito-qrt-001', 'quart-362-2023', '2023-11-10', 'Demanda ejecución', 'Ejecución de títulos judiciales'),
  hitoFn('hito-qrt-002', 'quart-362-2023', '2023-11-25', 'Despacho ejecución', 'Auto despachando ejecución'),
  hitoFn('hito-qrt-003', 'quart-362-2023', '2023-12-15', 'Oposición ejecutado', 'Escrito oposición a la ejecución'),
  hitoFn('hito-qrt-004', 'quart-362-2023', '2024-01-20', 'Vista oposición', 'Celebración vista sobre oposición'),
  hitoFn('hito-mis-001', 'mislata-hipoteca', '2024-01-10', 'Recopilación documentos', 'Inicio fase preparatoria'),
  hitoFn('hito-mis-002', 'mislata-hipoteca', '2024-02-01', 'Cálculo importes', 'Cuantificación reclamación'),
  hitoFn('hito-mis-003', 'mislata-hipoteca', '2024-02-15', 'Reclamación extrajudicial', 'Burofax al banco'),
  hitoFn('hito-mis-004', 'mislata-hipoteca', '2024-03-20', 'Respuesta banco', 'Banco rechaza reclamación'),
];

// ============================================
// TAREAS (24 tareas variadas)
// ============================================

const tareas: TareaProc[] = [
  // Picassent - 8 tareas
  tarea('t-pic-001', 'picassent-715-2024', 'Preparar proposición prueba', 'Documental, pericial, testifical', 'alta', '2025-02-15', 'pendiente', ['audiencia', 'prueba']),
  tarea('t-pic-002', 'picassent-715-2024', 'Solicitar extractos 2023', 'Completar serie temporal', 'media', '2025-01-20', 'pendiente', ['banco', 'extractos']),
  tarea('t-pic-003', 'picassent-715-2024', 'Localizar testigo vecino', 'Para acreditar uso exclusivo', 'media', '2025-02-01', 'pendiente', ['testigo']),
  tarea('t-pic-004', 'picassent-715-2024', 'Revisar contestación demanda', 'Analizar puntos débiles', 'alta', '2024-05-01', 'hecha', ['estrategia']),
  tarea('t-pic-005', 'picassent-715-2024', 'Calcular intereses', 'Intereses legales desde disposiciones', 'media', '2025-02-10', 'pendiente', ['calculo']),
  tarea('t-pic-006', 'picassent-715-2024', 'Preparar interrogatorio', 'Preguntas para demandado', 'alta', '2025-03-01', 'pendiente', ['audiencia', 'interrogatorio']),
  tarea('t-pic-007', 'picassent-715-2024', 'Solicitar certificado catastral', 'Valor catastral actualizado', 'baja', '2025-01-30', 'pendiente', ['documentacion']),
  tarea('t-pic-008', 'picassent-715-2024', 'Contactar perito tasador', 'Para ratificación informe', 'media', '2025-02-20', 'pendiente', ['pericial']),

  // Quart - 8 tareas
  tarea('t-qrt-001', 'quart-362-2023', 'Impugnar oposición', 'Escrito contestación oposición', 'alta', '2024-01-10', 'hecha', ['ejecucion']),
  tarea('t-qrt-002', 'quart-362-2023', 'Solicitar cuenta liquidación', 'Al juzgado', 'alta', '2024-02-15', 'hecha', ['ejecucion', 'liquidacion']),
  tarea('t-qrt-003', 'quart-362-2023', 'Obtener certificado becas', 'Ayuntamiento año 2024', 'media', '2025-01-15', 'pendiente', ['becas', 'documentacion']),
  tarea('t-qrt-004', 'quart-362-2023', 'Actualizar liquidación', 'Añadir gastos curso 2024-2025', 'alta', '2025-02-01', 'pendiente', ['liquidacion']),
  tarea('t-qrt-005', 'quart-362-2023', 'Preparar ampliación ejecución', 'Nuevos gastos impagados', 'media', '2025-02-15', 'pendiente', ['ejecucion', 'ampliacion']),
  tarea('t-qrt-006', 'quart-362-2023', 'Recopilar facturas curso actual', 'Todas las facturas 2024-2025', 'media', '2025-01-31', 'pendiente', ['facturas']),
  tarea('t-qrt-007', 'quart-362-2023', 'Revisar cuenta banco beca', 'Extracto cuenta donde ingresan', 'baja', '2025-02-10', 'pendiente', ['banco']),
  tarea('t-qrt-008', 'quart-362-2023', 'Preparar incidente modificación', 'Si cambian circunstancias', 'baja', '2025-03-01', 'bloqueada', ['modificacion']),

  // Mislata - 8 tareas
  tarea('t-mis-001', 'mislata-hipoteca', 'Completar serie extractos', 'Faltan 2014 y 2016', 'alta', '2025-01-20', 'pendiente', ['extractos']),
  tarea('t-mis-002', 'mislata-hipoteca', 'Verificar cálculos perito', 'Revisar hoja de cálculo', 'alta', '2025-01-25', 'pendiente', ['calculo', 'pericial']),
  tarea('t-mis-003', 'mislata-hipoteca', 'Redactar demanda', 'Incluir todas las partidas', 'alta', '2025-02-15', 'pendiente', ['demanda']),
  tarea('t-mis-004', 'mislata-hipoteca', 'Estudiar jurisprudencia comisión apertura', 'TJUE y TS recientes', 'media', '2025-01-30', 'pendiente', ['jurisprudencia']),
  tarea('t-mis-005', 'mislata-hipoteca', 'Solicitar historial préstamo', 'Al banco vía ARCO', 'media', '2025-01-15', 'hecha', ['banco', 'documentacion']),
  tarea('t-mis-006', 'mislata-hipoteca', 'Calcular intereses legales', 'Desde cada pago indebido', 'media', '2025-02-01', 'pendiente', ['calculo', 'intereses']),
  tarea('t-mis-007', 'mislata-hipoteca', 'Preparar burofax ampliación', 'Incluir comisión apertura', 'baja', '2025-02-10', 'pendiente', ['reclamacion']),
  tarea('t-mis-008', 'mislata-hipoteca', 'Revisar prescripción gastos', 'Plazo desde STS', 'alta', '2025-01-18', 'pendiente', ['prescripcion']),
];

// ============================================
// LINKS (relaciones entre entidades)
// ============================================

const links: LinkProc[] = [
  // Picassent: docs -> hechos
  link('lnk-001', 'd-pic-001', 'h-pic-001', 'prueba'),
  link('lnk-002', 'd-pic-002', 'h-pic-001', 'prueba'),
  link('lnk-003', 'd-pic-003', 'h-pic-003', 'prueba'),
  link('lnk-004', 'd-pic-008', 'h-pic-004', 'prueba'),
  link('lnk-005', 'd-pic-009', 'h-pic-006', 'prueba'),
  link('lnk-006', 'd-pic-010', 'h-pic-007', 'prueba'),

  // Picassent: partidas -> docs
  link('lnk-007', 'p-pic-001', 'd-pic-003', 'soporte'),
  link('lnk-008', 'p-pic-004', 'd-pic-008', 'soporte'),
  link('lnk-009', 'p-pic-006', 'd-pic-011', 'soporte'),

  // Picassent: hechos -> partidas
  link('lnk-010', 'h-pic-003', 'p-pic-001', 'fundamenta'),
  link('lnk-010b', 'h-pic-003', 'p-pic-002', 'fundamenta'),
  link('lnk-011', 'h-pic-004', 'p-pic-004', 'fundamenta'),
  link('lnk-012', 'h-pic-008', 'p-pic-006', 'fundamenta'),

  // Quart: docs -> hechos
  link('lnk-013', 'd-qrt-001', 'h-qrt-001', 'prueba'),
  link('lnk-014', 'd-qrt-002', 'h-qrt-002', 'prueba'),
  link('lnk-015', 'd-qrt-005', 'h-qrt-004', 'prueba'),
  link('lnk-016', 'd-qrt-008', 'h-qrt-006', 'prueba'),

  // Quart: partidas -> docs
  link('lnk-017', 'p-qrt-001', 'd-qrt-002', 'soporte'),
  link('lnk-018', 'p-qrt-003', 'd-qrt-003', 'soporte'),
  link('lnk-019', 'p-qrt-007', 'd-qrt-005', 'soporte'),

  // Mislata: docs -> hechos
  link('lnk-020', 'd-mis-001', 'h-mis-001', 'prueba'),
  link('lnk-021', 'd-mis-001', 'h-mis-002', 'prueba'),
  link('lnk-022', 'd-mis-003', 'h-mis-003', 'prueba'),
  link('lnk-023', 'd-mis-008', 'h-mis-004', 'prueba'),
  link('lnk-024', 'd-mis-013', 'h-mis-002', 'jurisprudencia'),

  // Mislata: partidas -> docs
  link('lnk-025', 'p-mis-001', 'd-mis-003', 'soporte'),
  link('lnk-026', 'p-mis-003', 'd-mis-008', 'soporte'),
  link('lnk-027', 'p-mis-006', 'd-mis-001', 'soporte'),
];

// ============================================
// TIMELINE (eventos ordenados cronológicamente)
// ============================================

const timelineData: TimelineItem[] = [
  // Picassent
  timeline('tl-pic-001', 'picassent-715-2024', '2015-03-15', 'hecho', 'Adquisición vivienda conjunta', 'h-pic-001'),
  timeline('tl-pic-002', 'picassent-715-2024', '2022-06-01', 'hecho', 'Ruptura convivencia', 'h-pic-002'),
  timeline('tl-pic-003', 'picassent-715-2024', '2022-06-15', 'hecho', 'Inicio disposiciones unilaterales', 'h-pic-003'),
  timeline('tl-pic-004', 'picassent-715-2024', '2023-09-01', 'documento', 'Burofax requerimiento', 'd-pic-010'),
  timeline('tl-pic-005', 'picassent-715-2024', '2024-01-15', 'documento', 'Tasación vivienda', 'd-pic-009'),
  timeline('tl-pic-006', 'picassent-715-2024', '2024-02-15', 'hito', 'Presentación demanda', 'hito-pic-001'),
  timeline('tl-pic-007', 'picassent-715-2024', '2024-04-20', 'hito', 'Contestación demanda', 'hito-pic-003'),
  timeline('tl-pic-008', 'picassent-715-2024', '2025-03-15', 'audiencia', 'Audiencia previa señalada', 'hito-pic-004'),

  // Quart
  timeline('tl-qrt-001', 'quart-362-2023', '2021-05-20', 'documento', 'Sentencia divorcio', 'd-qrt-001'),
  timeline('tl-qrt-002', 'quart-362-2023', '2022-09-01', 'hecho', 'Inicio curso escolar - impagos', 'h-qrt-002'),
  timeline('tl-qrt-003', 'quart-362-2023', '2022-09-01', 'documento', 'Resolución beca comedor', 'd-qrt-005'),
  timeline('tl-qrt-004', 'quart-362-2023', '2023-11-10', 'hito', 'Demanda ejecución', 'hito-qrt-001'),
  timeline('tl-qrt-005', 'quart-362-2023', '2023-11-25', 'hito', 'Despacho ejecución', 'hito-qrt-002'),
  timeline('tl-qrt-006', 'quart-362-2023', '2024-01-20', 'audiencia', 'Vista oposición', 'hito-qrt-004'),
  timeline('tl-qrt-007', 'quart-362-2023', '2025-02-01', 'recordatorio', 'Actualizar liquidación', 't-qrt-004'),

  // Mislata
  timeline('tl-mis-001', 'mislata-hipoteca', '2008-04-15', 'documento', 'Firma hipoteca', 'd-mis-001'),
  timeline('tl-mis-002', 'mislata-hipoteca', '2017-01-21', 'documento', 'Sentencia TJUE cláusulas suelo', 'd-mis-013'),
  timeline('tl-mis-003', 'mislata-hipoteca', '2024-01-10', 'hito', 'Inicio preparación caso', 'hito-mis-001'),
  timeline('tl-mis-004', 'mislata-hipoteca', '2024-02-01', 'hito', 'Cálculo importes', 'hito-mis-002'),
  timeline('tl-mis-005', 'mislata-hipoteca', '2024-02-15', 'hito', 'Reclamación extrajudicial', 'hito-mis-003'),
  timeline('tl-mis-006', 'mislata-hipoteca', '2024-03-20', 'hito', 'Respuesta negativa banco', 'hito-mis-004'),
  timeline('tl-mis-007', 'mislata-hipoteca', '2025-02-15', 'recordatorio', 'Fecha límite redactar demanda', 't-mis-003'),
];

// ============================================
// FASE 2 - RECLAMACIONES VISUALES (12 tiles)
// ============================================

function reclamacion(
  id: string,
  procedimientoId: string,
  label: string,
  cantidad: number,
  ganabilidad: GanabilidadReclamacion,
  partidaId: string
): ReclamacionVisual {
  return { id, procedimientoId, label, cantidad, ganabilidad, partidaId };
}

const reclamacionesVisuales: ReclamacionVisual[] = [
  // Picassent (4)
  reclamacion('h-pic-003', 'picassent-715-2024', 'DISPOSICIONES', 4500000, 'alta', 'p-pic-001'),
  reclamacion('h-pic-005', 'picassent-715-2024', 'USO VIVIENDA', 1200000, 'media', 'p-pic-005'),
  reclamacion('h-pic-004', 'picassent-715-2024', 'HIPOTECA', 780000, 'alta', 'p-pic-004'),
  reclamacion('h-pic-008', 'picassent-715-2024', 'MUEBLES', 800000, 'baja', 'p-pic-006'),

  // Quart (4)
  reclamacion('rec-qrt-001', 'quart-362-2023', 'ESCOLAR', 92500, 'alta', 'p-qrt-001'),
  reclamacion('rec-qrt-002', 'quart-362-2023', 'MÉDICO', 120000, 'media', 'p-qrt-003'),
  reclamacion('rec-qrt-003', 'quart-362-2023', 'EXTRAESCOLAR', 84000, 'alta', 'p-qrt-005'),
  reclamacion('rec-qrt-004', 'quart-362-2023', 'BECAS', 180000, 'baja', 'p-qrt-007'),

  // Mislata (4)
  reclamacion('rec-mis-001', 'mislata-hipoteca', 'CLÁUSULA SUELO', 1850000, 'alta', 'p-mis-001'),
  reclamacion('rec-mis-002', 'mislata-hipoteca', 'GASTOS NOTARÍA', 85000, 'media', 'p-mis-003'),
  reclamacion('rec-mis-003', 'mislata-hipoteca', 'GASTOS REGISTRO', 42000, 'media', 'p-mis-004'),
  reclamacion('rec-mis-004', 'mislata-hipoteca', 'COMISIÓN APERTURA', 180000, 'baja', 'p-mis-006'),
];

// ============================================
// FASE 2 - DOCUMENTOS SUBIDOS (HTMLS REALES)
// ============================================

const documentosSubidos: DocumentoSubido[] = [
  {
    id: 'doc-demanda-001',
    procedimientoId: 'picassent-715-2024',
    nombre: 'DEMANDA_715_2024.html',
    tipoMime: 'text/html',
    tamano: 15000,
    fecha: '2024-01-15',
    descripcion: 'Escrito principal de Demanda',
    tags: ['demanda', 'rector'],
    createdAt: nowISO,
    blob: mkBlob(`
      <div style="font-family: serif; line-height: 1.6; max-width: 800px; margin: 0 auto; color: #1e293b;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 2rem;">Al Juzgado de Primera Instancia</h2>
        
        <p><strong>DÑA. ACTORA</strong>, mayor de edad, representada por el Procurador...</p>
        
        <h3 style="border-bottom: 1px solid #cbd5e1; margin-top: 2rem; padding-bottom: 0.5rem;">HECHOS</h3>
        
        <p><strong>PRIMERO.- De la copropiedad.</strong><br/>
        Ambas partes son copropietarias al 50% de la vivienda sita en C/ Mayor 12, adquirida mediante escritura pública...</p>
        
        <p><strong>SEGUNDO.- De las disposiciones patrimoniales.</strong><br/>
        Que, en fecha previa a la ruptura, el demandado procedió a realizar transferencias por valor de 45.000€ sin justificación alguna...</p>
        
        <p><strong>TERCERO.- Del uso exclusivo.</strong><br/>
        Desde junio de 2022, D. Demandado impide el acceso a mi mandante, ocupando la vivienda sin abonar compensación...</p>

        <h3 style="border-bottom: 1px solid #cbd5e1; margin-top: 2rem; padding-bottom: 0.5rem;">SUPLICO</h3>
        <p>Se declare la disolución del condominio y se condene al pago de las cantidades reclamadas...</p>
      </div>
    `)
  },
  {
    id: 'doc-contest-001',
    procedimientoId: 'picassent-715-2024',
    nombre: 'CONTESTACION_DEMANDA.html',
    tipoMime: 'text/html',
    tamano: 12000,
    fecha: '2024-03-20',
    descripcion: 'Escrito de Contestación',
    tags: ['contestacion', 'oposicion'],
    createdAt: nowISO,
    blob: mkBlob(`
      <div style="font-family: serif; line-height: 1.6; max-width: 800px; margin: 0 auto; color: #1e293b;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 2rem;">A la atención del Juzgado</h2>
        <p><strong>D. DEMANDADO</strong>, comparece y DIGO:</p>
        
        <h3 style="border-bottom: 1px solid #cbd5e1; margin-top: 2rem; padding-bottom: 0.5rem;">OPOSICIÓN A LOS HECHOS</h3>
        
        <p><strong>AL PRIMERO.-</strong> Se admite la titularidad, pero se impugna la valoración pericial aportada de contrario por excesiva.</p>
        
        <p><strong>AL SEGUNDO.-</strong> Negamos que las disposiciones fueran en beneficio propio. El dinero se destinó a pagar deudas de la empresa familiar que sostenía la economía doméstica.</p>
        
        <h3 style="border-bottom: 1px solid #cbd5e1; margin-top: 2rem; padding-bottom: 0.5rem;">SUPLICO</h3>
        <p>Se desestime íntegramente la demanda en cuanto a las reclamaciones económicas.</p>
      </div>
    `)
  }
];

// ============================================
// FASE 2 - SECCIONES AUDIENCIA PREVIA
// ============================================

function seccion(id: string, procedimientoId: string, titulo: string, bullets: string[], orden: number): SeccionAudiencia {
  return { id, procedimientoId, titulo, bullets, orden, updatedAt: nowISO };
}

const seccionesAudiencia: SeccionAudiencia[] = [
  seccion('sec-pic-001', 'picassent-715-2024', 'Hechos controvertidos', ['Cuantía exacta disposiciones', 'Destino de los fondos', 'Uso vivienda', 'Valor muebles'], 1),
  seccion('sec-pic-002', 'picassent-715-2024', 'Prueba documental', ['Extractos bancarios', 'Recibos hipoteca', 'Escritura', 'Informe tasación', 'Burofax'], 2),
  seccion('sec-pic-003', 'picassent-715-2024', 'Prueba testifical', ['Testigo vecino', 'Testigo familiar'], 3),
];

// ============================================
// EXPORT FINAL
// ============================================

export const seedCaseOps: SeedData = {
  procedimientos,
  hechos,
  documentos,
  partidas,
  hitos,
  tareas,
  links,
  timeline: timelineData,
  reclamacionesVisuales,
  documentosSubidos,
  seccionesAudiencia,
};
