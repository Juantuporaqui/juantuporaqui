// ============================================
// AUDIENCIA PREVIA - P.O. 715/2024 Picassent
// Alegaciones y Hechos Controvertidos
// Fuente: Rama claude/setup-litigation-system-yDgIX
// ============================================

/**
 * Alegación complementaria para audiencia previa
 */
export interface Alegacion {
  id: number;
  titulo: string;
  contenido: string;
  fundamentoLegal?: string;
  notas?: string;
}

/**
 * Tipo de prueba requerida
 */
export type TipoPrueba = 'documental' | 'pericial' | 'testifical' | 'interrogatorio';

/**
 * Estado del hecho controvertido
 */
export type EstadoHechoControvertido = 'pendiente' | 'propuesto' | 'admitido';

/**
 * Hecho controvertido a fijar en audiencia
 */
export interface HechoControvertido {
  id: number;
  titulo: string;
  descripcion: string;
  tipoPrueba: TipoPrueba;
  estado: EstadoHechoControvertido;
  notas?: string;
}

/**
 * Las 12 alegaciones complementarias para la audiencia previa
 */
export const alegacionesComplementarias: Alegacion[] = [
  {
    id: 1,
    titulo: 'Objeto del litigio y posicion procesal',
    contenido: 'Esta parte se muestra conforme con la division de cosa comun de los inmuebles litigiosos, y se opone a la pretension de reembolso/reintegro formulada por la actora en cuanto no se acredite con liquidacion integra, trazabilidad bancaria y depuracion contable completa.',
    fundamentoLegal: 'Art. 400 CC - Division de cosa comun',
  },
  {
    id: 2,
    titulo: 'Prestamo y garantia hipotecaria',
    contenido: 'Se distingue entre la obligacion personal derivada del prestamo (deudores frente a la entidad) y la garantia real (hipoteca). La pretension no puede construirse como pago de deuda ajena sin fijar previamente la condicion obligacional de cada parte en el contrato y en su subrogacion posterior.',
    fundamentoLegal: 'Art. 1822 CC - Fianza / Art. 104 LH - Hipoteca',
  },
  {
    id: 3,
    titulo: 'Condicion de la actora en el contrato',
    contenido: 'Resulta controvertida y debe precisarse la condicion de la actora en el prestamo y en la subrogacion (prestataria/deudora solidaria, fiadora u otra), pues de ello depende el alcance de cualquier repeticion: en su caso, solo por pagos en exceso y no por el total de cuotas.',
    fundamentoLegal: 'Art. 1145 CC - Solidaridad / Art. 1838 CC - Accion de reembolso',
  },
  {
    id: 4,
    titulo: 'Destino del prestamo de 310.000 EUR',
    contenido: 'Debe determinarse el destino real del capital: adquisicion de parcelas y construccion del chalet, frente a la tesis de financiacion de un bien privativo. La calificacion del destino condiciona la causalidad del supuesto credito de reembolso.',
    fundamentoLegal: 'Art. 1347 CC - Bienes gananciales',
  },
  {
    id: 5,
    titulo: 'Cuentas comunes y fondos mixtos',
    contenido: 'La tesis de que las cuentas se nutrian exclusivamente de nomina/pension de la actora se discute. Se interesa depurar si existieron ingresos relevantes ajenos a nomina/pension (ingresos extraordinarios, transferencias, operaciones patrimoniales y/o ingresos agrarios), lo que impide atribuir pagos como si fueran realizados con capital privativo sin una depuracion completa.',
    fundamentoLegal: 'Art. 1361 CC - Presuncion de ganancialidad',
  },
  {
    id: 6,
    titulo: 'Depuracion contable integral',
    contenido: 'Se interesa depuracion completa de ingresos, gastos, disposiciones y transferencias entre cuentas, con identificacion de ordenante y cuenta de cargo en cada apunte relevante. La seleccion parcial de movimientos no permite fijar un saldo a favor con rigor.',
    fundamentoLegal: 'Art. 217 LEC - Carga de la prueba',
  },
  {
    id: 7,
    titulo: 'Movimientos de septiembre 2022 (32.000 y 38.500 EUR)',
    contenido: 'Se controvierte el tratamiento aislado de disposiciones puntuales sin encuadre en el saldo global de las cuentas comunes. Se sostiene que dichos movimientos pueden responder a un ajuste provisional de liquidez y saldos entre las partes en un contexto de ruptura, lo que exige analizar su finalidad y su impacto en cualquier pretendido credito de reembolso.',
  },
  {
    id: 8,
    titulo: 'Origen del ingreso de 32.000 EUR (venta Arturo Piera)',
    contenido: 'La actora atribuye el origen del ingreso de 32.000 EUR a la venta del inmueble de Arturo Piera. Para fijar la naturaleza del importe (y su eventual caracter privativo) resulta necesario depurar la titularidad y amortizacion del prestamo de adquisicion del inmueble, asi como la existencia de reformas o inversiones y quien las financio.',
  },
  {
    id: 9,
    titulo: 'Liquidacion del pasivo antes del reparto del activo',
    contenido: 'Se expone que la division del activo sin considerar el pasivo vivo asociado al proyecto patrimonial comun genera un reparto parcial. Se plantea que, en caso de venta/realizacion, se contemple la cancelacion o cobertura preferente del pasivo y, en su caso, la consignacion del precio para atenderlo antes del reparto.',
    fundamentoLegal: 'Art. 1404 CC - Liquidacion de gananciales',
  },
  {
    id: 10,
    titulo: 'Posible exceso reclamatorio por doble computo',
    contenido: 'Se controvierte la acumulacion de partidas que pueden producir doble imputacion: reclamacion de conceptos vinculados a principal/cancelaciones y, simultaneamente, reclamacion de cuotas como si fueran integramente repetibles, sin cuantificar solapamientos ni depurar la amortizacion de principal ya computada.',
  },
  {
    id: 11,
    titulo: 'Maquinaria agricola: naturaleza e ingresos',
    contenido: 'En cuanto a la maquinaria agricola, se interesa fijar si su adquisicion responde a un gasto necesario para la explotacion agricola y si fue financiada con ingresos de dicha explotacion. Asimismo, se controvierte la reclamacion aislada del gasto sin depurar los beneficios obtenidos y percibidos por cada parte.',
    fundamentoLegal: 'Art. 1347.5 CC - Frutos y ganancias',
  },
  {
    id: 12,
    titulo: 'Delimitacion temporal y pagos post-separacion',
    contenido: 'Se fija como relevante la cronologia (matrimonio en 09/08/2013; separacion de hecho en agosto 2022) y la razon de los pagos posteriores: si fueron realizados por obligacion propia frente a la entidad y si existio reclamacion fehaciente o reserva del derecho de repeticion en esas fechas.',
    fundamentoLegal: 'Art. 1964.2 CC - Prescripcion',
  },
];

/**
 * Los 18 hechos controvertidos a fijar en audiencia
 */
export const hechosControvertidos: HechoControvertido[] = [
  {
    id: 1,
    titulo: 'Cuantia exacta reclamada',
    descripcion: 'Determinar la cuantia exacta objeto de pretension, ante posibles discordancias entre importe global, desglose por partidas y formulacion del suplico.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 2,
    titulo: 'Condicion obligacional en el prestamo',
    descripcion: 'Determinar si ambos litigantes figuran como prestatarios/deudores solidarios (o en que condicion) en el prestamo de 22/08/2006 y en la subrogacion de 18/09/2009, asi como la entidad acreedora actual y el saldo vivo en el periodo relevante.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 3,
    titulo: 'Destino del capital del prestamo',
    descripcion: 'Determinar si el capital se destino principalmente a compra de parcelas y construccion del chalet (y deudas vinculadas) o a otras finalidades, y su cuantificacion por tramos/partidas en la medida de lo posible.',
    tipoPrueba: 'pericial',
    estado: 'pendiente',
  },
  {
    id: 4,
    titulo: 'Naturaleza de las cuentas e ingresos extraordinarios',
    descripcion: 'Determinar si las cuentas utilizadas para pagos se nutrieron exclusivamente de nomina/pension de la actora o si existieron ingresos relevantes ajenos a tales conceptos (ingresos extraordinarios, operaciones patrimoniales, ingresos agrarios u otros).',
    tipoPrueba: 'pericial',
    estado: 'propuesto',
  },
  {
    id: 5,
    titulo: 'Ordenante real de transferencias 2019-2022',
    descripcion: 'Determinar quien fue el ordenante material de transferencias y movimientos entre cuentas vinculados a cuotas y pagos 2019-2022, y si la atribucion de tales pagos a una sola parte es correcta.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 6,
    titulo: 'Integridad de documentos bancarios 2019-2022',
    descripcion: 'Determinar si las capturas aportadas por la actora son completas e integras (sin recortes/ediciones) y si permiten identificar ordenante, cuenta de cargo, concepto y trazabilidad, o si resultan parciales/sesgadas.',
    tipoPrueba: 'pericial',
    estado: 'propuesto',
  },
  {
    id: 7,
    titulo: 'Disposiciones sept. 2022: origen y destino',
    descripcion: 'Determinar la efectividad de las disposiciones de 32.000 EUR y 38.500 EUR, su origen (cuenta de procedencia), destino (cuenta receptora) y concepto, y su encaje en el saldo global de cuentas comunes.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 8,
    titulo: 'Disposiciones sept. 2022: finalidad economica',
    descripcion: 'Determinar si los movimientos de 32.000 EUR y 38.500 EUR responden a un ajuste provisional de liquidez/saldos entre las partes en el contexto de ruptura, y si fueron considerados o aceptados por ambas partes como distribucion parcial de fondos comunes.',
    tipoPrueba: 'interrogatorio',
    estado: 'pendiente',
  },
  {
    id: 9,
    titulo: 'Piso Arturo Piera: prestamo de adquisicion',
    descripcion: 'Determinar si el prestamo con el que se adquirio el inmueble era de titularidad exclusiva de la actora o de titularidad conjunta, y como se amortizo (cuotas/cancelacion) y con que fondos.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 10,
    titulo: 'Piso Arturo Piera: reformas e inversiones',
    descripcion: 'Determinar si el inmueble, en el momento de su adquisicion, se encontraba habitable sin necesidad de obras o si requirio reforma/rehabilitacion y, en su caso, quien la acometi y financio.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 11,
    titulo: 'IBI 2013-2019: pago efectivo y ordenante',
    descripcion: 'Determinar si, para los ejercicios 2013-2019, existe justificante de pago (cargo identificable) y quien figura como ordenante/medio de pago, pues la mera aportacion del recibo no acredita el abono.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 12,
    titulo: 'Pagos post-separacion: causa y reserva',
    descripcion: 'Determinar si tras la separacion de hecho (agosto 2022) la actora continuo abonando cuotas hasta octubre 2023 por obligacion propia frente a la entidad, y si efectuo reclamacion fehaciente o reserva del derecho de repeticion.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 13,
    titulo: 'Cumplimiento del 50% desde octubre 2023',
    descripcion: 'Determinar si la actora ceso el pago de su 50% a partir de octubre 2023 y cuantificar el importe asumido unilateralmente por el demandado desde entonces.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 14,
    titulo: 'Doble imputacion de conceptos',
    descripcion: 'Determinar si las partidas reclamadas incluyen solapamientos (p.ej. computo de principal/cancelacion y, simultaneamente, cuotas que incorporan amortizacion del mismo principal) y cuantificar el eventual exceso.',
    tipoPrueba: 'pericial',
    estado: 'pendiente',
  },
  {
    id: 15,
    titulo: 'Maquinaria agricola: adquisicion y financiacion',
    descripcion: 'Determinar la existencia y adquisicion de la maquinaria agricola reclamada, su necesidad/utilidad para la explotacion, y su financiacion (si se realizo con ingresos de la explotacion o con fondos comunes/privativos).',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 16,
    titulo: 'Explotacion agricola: ingresos percibidos',
    descripcion: 'Determinar si la actora percibio ingresos o beneficios de la explotacion agricola (rendimientos, ventas de cosecha, reparto de beneficios u otros) en el periodo relevante, y su cuantificacion.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 17,
    titulo: 'Muebles y enseres de Lope de Vega',
    descripcion: 'Determinar la existencia y contenido del pacto previo (convenio/sentencia) sobre devolucion/entrega de muebles y enseres de la vivienda de Lope de Vega, el inventario minimo afectado y el estado de cumplimiento.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 18,
    titulo: 'Prescripcion: actos interruptivos',
    descripcion: 'Determinar si existieron actos interruptivos de la prescripcion (reclamaciones fehacientes, reconocimiento de deuda u otros) respecto de las partidas anteriores al plazo legal aplicable.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
];

/**
 * Resumen para el panel de control de audiencia
 */
export const resumenAudiencia = {
  fecha: '2026-01-24',
  hora: '10:00',
  sala: 'Sala de Vistas 2',
  juzgado: 'Juzgado de Primera Instancia e Instruccion n 1 de Picassent',
  totalAlegaciones: alegacionesComplementarias.length,
  totalHechosControvertidos: hechosControvertidos.length,
  hechosPendientes: hechosControvertidos.filter(h => h.estado === 'pendiente').length,
  hechosPropuestos: hechosControvertidos.filter(h => h.estado === 'propuesto').length,
};

/**
 * Obtiene hechos por tipo de prueba
 */
export const getHechosPorTipoPrueba = (tipo: TipoPrueba): HechoControvertido[] => {
  return hechosControvertidos.filter(h => h.tipoPrueba === tipo);
};

/**
 * Obtiene hechos por estado
 */
export const getHechosPorEstado = (estado: EstadoHechoControvertido): HechoControvertido[] => {
  return hechosControvertidos.filter(h => h.estado === estado);
};
