// ============================================
// HECHOS RECLAMADOS - P.O. 715/2024 Picassent
// Fuente: Rama claude/setup-litigation-system-yDgIX
// ============================================

/**
 * Estado del hecho reclamado desde perspectiva de defensa
 */
export type EstadoHecho = 'prescrito' | 'compensable' | 'disputa';

/**
 * Estructura detallada de cada hecho reclamado por la actora
 */
export interface HechoReclamado {
  id: number;
  titulo: string;
  cuantia: number; // En euros
  año: number;
  hechoActora: string;
  realidadHechos: string;
  oposicion: string[];
  estrategia: string;
  estado: EstadoHecho;
  documentosRef: string[];
  tareas: string[];
  vinculadoA?: number;
}

/**
 * Resumen contable del caso
 */
export const resumenContador = {
  totalReclamado: 212677.08,
  cifraRiesgoReal: 62000.00,
  reduccionObjetivo: 70, // porcentaje
  fundamentoLegal: 'Art. 1964.2 CC',
};

/**
 * Los 10 hechos reclamados por la actora con análisis de defensa
 */
export const hechosReclamados: HechoReclamado[] = [
  {
    id: 1,
    titulo: 'Préstamos Personales BBVA',
    cuantia: 20085.00,
    año: 2008,
    hechoActora: 'Vicenta afirma que se cancelaron con dinero privativo de la venta de su casa en Mislata.',
    realidadHechos: 'El ingreso de 18.000€ en efectivo (05/09/2008) lo realizó Juan (Doc. 13). Vicenta usó su dinero para gastos de su propia transmisión de vivienda.',
    oposicion: [
      'Prescripción: Han transcurrido más de 15 años. Acción personal extinguida (Art. 1964 CC).',
      'Falta de Prueba: Vicenta no aporta justificante de ingreso, solo un apunte en libreta que Juan no puede verificar por la cancelación unilateral de la cuenta (Doc. 11).',
    ],
    estrategia: 'Resaltar la contradicción ante la AEAT (Doc. 4) donde ella reconoció que eran préstamos para la construcción del chalet común.',
    estado: 'prescrito',
    documentosRef: ['Doc. 13', 'Doc. 11', 'Doc. 4'],
    tareas: ['Localizar extracto bancario que identifique a Juan como ordenante de los 18.000€'],
  },
  {
    id: 2,
    titulo: 'Vehículo Seat León',
    cuantia: 13000.00,
    año: 2014,
    hechoActora: 'Dice que se pagó desde la cuenta Barclays que "solo se nutría de sus nóminas".',
    realidadHechos: 'La cuenta tenía ingresos extra de Juan por más de 100.000€ (Doc. 2). Juan pagó el otro coche familiar (Renault Scenic) por 4.500€ (Doc. 17).',
    oposicion: [
      'Prescripción: Acción de más de 10 años.',
      'Acto de Liberalidad: Compra familiar de mutuo acuerdo. Uso exclusivo de Vicenta durante los últimos 2 años.',
    ],
    estrategia: '"Doble Rasero": Ella reclama el 100% de este coche pero oculta que Juan pagó el Scenic que ella también usa.',
    estado: 'prescrito',
    documentosRef: ['Doc. 2', 'Doc. 17', 'Doc. 16'],
    tareas: ['Aportar informe DGT del Renault Scenic (Doc. 16)'],
  },
  {
    id: 3,
    titulo: 'Venta Vivienda Artur Piera',
    cuantia: 32000.00,
    año: 2022,
    hechoActora: 'Transferencia de Juan a su cuenta privativa sin consentimiento.',
    realidadHechos: 'Inversión común (Subasta). Juan hizo la reforma físicamente (Doc. 20). Tras la venta, Vicenta retiró 38.500€ (Doc. 3), superando en 6.500€ lo retirado por Juan.',
    oposicion: [
      'Juan necesitaba el dinero para subsistir tras ser expulsado de su casa privativa (Lope de Vega).',
      'Es un reparto de beneficios de una inversión común.',
    ],
    estrategia: 'Destacar la mala fe de Vicenta al omitir que ella retiró una cantidad mayor.',
    estado: 'disputa',
    documentosRef: ['Doc. 20', 'Doc. 3', 'Doc. 22'],
    tareas: ['Cuadrar tabla de gastos de reforma (Leroy Merlin, Bricomart) pagados por Juan (Doc. 22)'],
  },
  {
    id: 4,
    titulo: 'Hipoteca Vivienda Lope de Vega',
    cuantia: 122282.28,
    año: 2009,
    hechoActora: 'Dice que pagó la hipoteca de la casa privativa de Juan.',
    realidadHechos: 'El préstamo de 310.000€ se usó para comprar los terrenos de Montroy y Godelleta. La casa de Lope de Vega fue solo la garantía (aval) (Doc. 6).',
    oposicion: [
      'Prescripción: Todo lo anterior a junio de 2019 está prescrito.',
      'Naturaleza: Es una deuda solidaria para adquirir patrimonio común del que ella ahora pide el 50%.',
    ],
    estrategia: 'Vicenta quiere el 50% de los terrenos sin haber pagado el préstamo con el que se compraron. "Estafa Procesal".',
    estado: 'prescrito',
    documentosRef: ['Doc. 6'],
    tareas: ['Certificación de nóminas de Juan (2016-2022) superiores a las de Vicenta'],
    vinculadoA: 9,
  },
  {
    id: 5,
    titulo: 'IBI Lope de Vega',
    cuantia: 1826.91,
    año: 2013,
    hechoActora: 'Pagados por ella desde la cuenta común.',
    realidadHechos: 'Pagados desde la cuenta BBVA 9397 donde Juan ingresaba su nómina (Doc. 12).',
    oposicion: [
      'Prescripción pre-2019.',
      'Juan es quien ha nutrido esa cuenta durante 16 años.',
    ],
    estrategia: 'Vincular los recibos del Ayuntamiento de Quart al historial de nóminas de Juan.',
    estado: 'prescrito',
    documentosRef: ['Doc. 12'],
    tareas: [],
  },
  {
    id: 6,
    titulo: 'IBI Chalet Montroy',
    cuantia: 530.85,
    año: 2020,
    hechoActora: 'Reclama el 50% de los pagos.',
    realidadHechos: 'Pagados desde la cuenta común del BBVA (Doc. 1).',
    oposicion: [
      'No cabe reembolso de gastos pagados con fondos comunes para el mantenimiento de bienes comunes.',
    ],
    estrategia: 'Presentar el extracto del BBVA del 12/02/2021 que muestra el cargo directo.',
    estado: 'disputa',
    documentosRef: ['Doc. 1'],
    tareas: [],
  },
  {
    id: 7,
    titulo: 'IBI Fincas Rústicas',
    cuantia: 151.81,
    año: 2020,
    hechoActora: 'Pagados desde su cuenta privativa.',
    realidadHechos: 'Cantidad menor comparada con los gastos que Juan ha asumido directamente.',
    oposicion: [
      'Compensación de créditos. Juan pagó facturas de fitosanitarios por 308,24€ (Doc. 27).',
    ],
    estrategia: 'Invocar Art. 1196 CC. La deuda de ella con Juan es mayor que estos 151€.',
    estado: 'compensable',
    documentosRef: ['Doc. 27'],
    tareas: [],
  },
  {
    id: 8,
    titulo: 'Comunidad Loma de los Caballeros',
    cuantia: 19.39,
    año: 2023,
    hechoActora: 'Pago del 4º Trimestre 2023.',
    realidadHechos: 'Juan ha pagado cuotas posteriores que compensan esta cantidad.',
    oposicion: [
      'Compensación. Juan pagó el 1er Trimestre 2024 (36,06€) (Doc. 28).',
    ],
    estrategia: 'Aplicar la misma lógica de compensación del punto 7.',
    estado: 'compensable',
    documentosRef: ['Doc. 28'],
    tareas: [],
  },
  {
    id: 9,
    titulo: 'Amortización Hipoteca Previa',
    cuantia: 16979.59,
    año: 2006,
    hechoActora: 'Dice que se usó dinero común para cancelar la hipoteca previa de Juan.',
    realidadHechos: 'Fue una condición del banco para conceder el préstamo de 310.000€ para los terrenos comunes.',
    oposicion: [
      'Prescripción radical. Hecho de hace 19 años.',
      'Fue una condición del banco para darles el préstamo de 310.000€.',
    ],
    estrategia: 'Ella aceptó esto en 2006 para poder comprar el chalet de Montroy. No puede reclamarlo ahora.',
    estado: 'prescrito',
    documentosRef: [],
    tareas: [],
    vinculadoA: 4,
  },
  {
    id: 10,
    titulo: 'Maquinaria Agrícola',
    cuantia: 5801.25,
    año: 2018,
    hechoActora: 'Comprada con dinero común, pero la tiene Juan.',
    realidadHechos: 'Inversión para el negocio de olivos. Vicenta cobró 10.887,57€ netos de beneficios en 2023 (Doc. 29) gracias a esa maquinaria.',
    oposicion: [
      'No puede cobrar beneficios y no pagar la inversión.',
    ],
    estrategia: 'Presentar la factura de Oleos Dels Alforins a nombre de Vicenta.',
    estado: 'disputa',
    documentosRef: ['Doc. 29'],
    tareas: ['Acreditar el ingreso de los beneficios del olivar en la cuenta privativa de ella'],
  },
];

/**
 * Calcula totales por estado de los hechos reclamados
 */
export const calcularTotales = () => {
  const totales = {
    prescrito: 0,
    compensable: 0,
    disputa: 0,
  };

  hechosReclamados.forEach(h => {
    totales[h.estado] += h.cuantia;
  });

  return totales;
};

/**
 * Obtiene el porcentaje de reducción potencial
 */
export const getPorcentajeReduccion = () => {
  const totales = calcularTotales();
  const reducible = totales.prescrito + totales.compensable;
  return Math.round((reducible / resumenContador.totalReclamado) * 100);
};
