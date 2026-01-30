// ============================================
// CASE OPS - Seed Data (CASO REAL: PICASSENT 715/2024 - VERSIÓN EXTENDIDA)
// ============================================

import {
  settingsRepo,
  counterRepo,
  casesRepo,
  factsRepo,
  partidasRepo,
  eventsRepo,
  strategiesRepo,
  documentsRepo
} from './repositories';
import { eurosToCents } from '../utils/validators';
import { nanoid } from 'nanoid';

export async function seedDatabase(): Promise<boolean> {
  const settings = await settingsRepo.get();
  if (settings) {
    console.log('Database already initialized');
    return false;
  }

  console.log('Seeding database with EXTENDED REAL CASE DATA...');

  try {
    // 1. Configuración Inicial
    await settingsRepo.init('Desktop');
    const counters = ['cases', 'documents', 'spans', 'facts', 'partidas', 'events', 'strategies', 'tasks'];
    for (const c of counters) await counterRepo.setCounter(c, 0);

    // =====================================================================
    // 1. CASO PRINCIPAL
    // =====================================================================
    const mainCase = await casesRepo.create({
      title: 'P.O. 715/2024 · División Cosa Común y Reclamación',
      court: 'JPI nº 1 de Picassent',
      autosNumber: '715/2024',
      type: 'ordinario',
      status: 'activo',
      clientRole: 'demandado',
      judge: '[Pendiente]',
      opposingCounsel: 'Isabel Luzzy Aguilar',
      notes: 'Reclamación de 212.677€ por Vicenta. Defensa basada en Prescripción (71% cuantía), Naturaleza de Hipoteca y Compensación de saldos.',
      tags: ['familia', 'civil', 'complejo', 'prescripcion']
    });

    // =====================================================================
    // 2. CASOS SECUNDARIOS
    // =====================================================================
    const quartCase = await casesRepo.create({
      title: 'P.O. 362/2023 · Ejecución Familia',
      court: 'JPI nº 2 de Quart de Poblet',
      autosNumber: '362/2023',
      type: 'ejecucion',
      status: 'activo',
      clientRole: 'ejecutante',
      judge: '[Pendiente]',
      opposingCounsel: 'Mª Carmen Gómez',
      notes: 'Ejecución de sentencia de divorcio. Liquidación de gananciales pendiente.',
      tags: ['familia', 'ejecucion', 'gananciales']
    });

    const mislataCase = await casesRepo.create({
      title: 'Hipoteca Mislata · Cláusulas Abusivas',
      court: 'JPI nº 1 de Mislata',
      autosNumber: '128/2024',
      type: 'ordinario',
      status: 'suspendido',
      clientRole: 'demandante',
      judge: '[Pendiente]',
      opposingCounsel: 'Banco Santander, S.A.',
      notes: 'Reclamación de cláusulas abusivas en préstamo hipotecario. Gastos de constitución y comisión de apertura.',
      tags: ['bancario', 'hipoteca', 'clausulas_abusivas']
    });

    // Eventos básicos para Quart
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2023-06-15',
      type: 'procesal',
      title: 'Sentencia Divorcio Firme',
      description: 'Sentencia de divorcio con liquidación de gananciales pendiente.'
    } as any);
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2024-03-20',
      type: 'procesal',
      title: 'Demanda de Ejecución',
      description: 'Inicio del procedimiento de ejecución.'
    } as any);

    // Eventos básicos para Mislata
    await eventsRepo.create({
      caseId: mislataCase.id,
      date: '2024-02-10',
      type: 'procesal',
      title: 'Presentación Demanda Hipotecaria',
      description: 'Demanda por cláusulas abusivas.'
    } as any);
    await eventsRepo.create({
      caseId: mislataCase.id,
      date: '2024-05-15',
      type: 'procesal',
      title: 'Suspensión por Prejudicialidad',
      description: 'Suspendido a la espera de TJUE.'
    } as any);

    // =====================================================================
    // 4. DOCUMENTOS CLAVE (MOCK) - PICASSENT
    // Para probar la vinculación Hecho <-> Documento
    // =====================================================================
    const docsData = [
      { title: 'Doc. 25 - Recibos Oficiales CaixaBank', docType: 'prueba', description: 'Recibos íntegros que identifican a Juan como ordenante real.' },
      { title: 'Doc. 26 - Cuadro Comparativo Visual', docType: 'prueba', description: 'Gráfico enfrentando captura recortada vs recibo real.' },
      { title: 'Escritura Compraventa Piso Madrid (2000)', docType: 'prueba', description: 'Prueba del carácter privativo y origen de fondos.' },
      { title: 'Resolución AEAT 2012 Reinversión', docType: 'sentencia', description: 'Prueba oficial del destino de los fondos a la obra común.' },
      { title: 'Demanda Contraria', docType: 'demanda', description: 'Escrito inicial de la actora.' },
      { title: 'Extracto Cuenta Común (Retirada 38.500)', docType: 'prueba', description: 'Doc. 3 Contestación. Acredita la retirada de fondos de ella.' },
      { title: 'STS 458/2025 (Doctrina Cuentas)', docType: 'sentencia', description: 'Jurisprudencia sobre caja única familiar.' }
    ];

    const docIds: Record<string, string> = {}; // Para vincular luego
    for (const d of docsData) {
      const doc = await documentsRepo.create({
        caseId: mainCase.id,
        title: d.title,
        docType: d.docType as any,
        mime: 'application/pdf',
        size: 1024 * 500, // Fake size
        path: 'mock/path',
        tags: ['importante']
      });
      docIds[d.title] = doc.id;
    }

    // =====================================================================
    // 3. HECHOS CONTROVERTIDOS (FACTS) - AMPLIADO
    // Fuentes: FIJAR.docx, APORTACIÓN DE TESTIGOS.docx
    // =====================================================================
    const factsData = [
      {
        title: 'Manipulación de Pruebas (Recortes BBVA)',
        narrative: 'La actora aporta capturas de pantalla recortadas (Doc. adverso) eliminando el campo "Ordenante". El Doc. 25 y 26 demuestran que el pagador fue Juan.',
        status: 'a_probar', burden: 'demandado', risk: 'bajo', strength: 5,
        tags: ['mala_fe', 'documental'],
        linkedDocIds: [docIds['Doc. 25 - Recibos Oficiales CaixaBank'], docIds['Doc. 26 - Cuadro Comparativo Visual']]
      },
      {
        title: 'Naturaleza Solidaria del Préstamo',
        narrative: 'No existe "Hipoteca del demandado". Es un préstamo solidario (ambos titulares) con garantía real sobre vivienda privativa. El destino fue la obra común.',
        status: 'controvertido', burden: 'mixta', risk: 'alto', strength: 5,
        tags: ['hipoteca', 'juridico']
      },
      {
        title: 'Retirada de Fondos: 38.500€ (Ella) vs 32.000€ (Él)',
        narrative: 'En la ruptura, Juan retiró 32.000€ (que se reclaman) pero Vicenta retiró 38.500€ de la cuenta común. Se opone compensación.',
        status: 'a_probar', burden: 'demandado', risk: 'medio', strength: 5,
        tags: ['compensacion', 'cuentas'],
        linkedDocIds: [docIds['Extracto Cuenta Común (Retirada 38.500)']]
      },
      {
        title: 'Caja Única Familiar (Doctrina STS 458/2025)',
        narrative: 'Existían dos cuentas conjuntas indistintas donde se cruzaban nóminas y gastos. No cabe liquidación retroactiva de partidas de consumo.',
        status: 'controvertido', burden: 'demandado', risk: 'medio', strength: 4,
        tags: ['jurisprudencia', 'sts_458_2025'],
        linkedDocIds: [docIds['STS 458/2025 (Doctrina Cuentas)']]
      },
      {
        title: 'Financiación Vehículo Seat León',
        narrative: 'La actora reclama 13.000€ del vehículo (2014). El vehículo es bien común y fue pagado con fondos de la sociedad de gananciales/comunidad tácita.',
        status: 'controvertido', burden: 'demandado', risk: 'medio', strength: 3,
        tags: ['vehiculo', 'bienes_muebles']
      }
    ];

    for (const f of factsData) {
      await factsRepo.create({ caseId: mainCase.id, ...f } as any);
    }

    // =====================================================================
    // 4. ESTRATEGIAS (WAR ROOM)
    // Fuentes: PRESCRIPCIÓN.docx, DEFENSA ARTURO PIERA.docx
    // =====================================================================
    const strategiesData = [
      {
        attack: 'Reclamación de deudas de 2008-2019 (150.502€)',
        risk: 'Alto',
        rebuttal: 'Excepción de PRESCRIPCIÓN (Art. 1964 CC). Falta de reclamación previa interruptiva (Art. 1973 CC). "Arqueología contable".',
        evidencePlan: 'Calendario de plazos + Ausencia de burofaxes.',
        tags: ['prescripcion', 'defensa_total']
      },
      {
        attack: 'Aportación de Perito de Parte (Vínculo personal)',
        risk: 'Medio',
        rebuttal: 'TACHA DE PERITO. El perito tiene relación de amistad/familiaridad con la actora. Solicitar perito judicial insaculado.',
        evidencePlan: 'Interrogatorio sobre imparcialidad (Art. 343 LEC).',
        tags: ['procesal', 'peritos']
      },
      {
        attack: 'Negativa de la actora a la retirada de 38.500€',
        risk: 'Bajo',
        rebuttal: 'Solicitar OFICIO A CAIXABANK si no reconoce el Doc. 3. El rastro bancario es indeleble.',
        evidencePlan: 'Documental bancaria + Oficio judicial subsidiario.',
        tags: ['prueba_judicial']
      }
    ];

    for (const s of strategiesData) {
      await strategiesRepo.create({ caseId: mainCase.id, ...s } as any);
    }

    // =====================================================================
    // 5. PARTIDAS ECONÓMICAS (DESGLOSE COMPLETO)
    // Fuente: FIJAR.docx, Defensa_STS_458_2025.docx
    // =====================================================================
    const partidasList = [
      // Bloque Prescrito
      { date: '2008-09-01', concepto: 'Préstamos Personales 2008', importe: 20085, estado: 'prescrita', notas: 'Prescrito (16 años)' },
      { date: '2006-08-22', concepto: 'Cancelación Hipoteca Previa', importe: 16979, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2014-10-01', concepto: 'Compra Vehículo Seat León', importe: 13000, estado: 'prescrita', notas: 'Prescrito (10 años)' },
      
      // IBI (Ejemplo de serie)
      { date: '2013-01-01', concepto: 'IBI 2013-2019 (Acumulado)', importe: 1063, estado: 'prescrita', notas: 'Prescrito' },

      // Hipoteca (Desglose por tramos de Defensa_STS...)
      { date: '2009-12-31', concepto: 'Hipoteca 2009 (Jul-Dic)', importe: 5996, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2010-12-31', concepto: 'Hipoteca 2010 (Anual)', importe: 11534, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2011-12-31', concepto: 'Hipoteca 2011 (Anual)', importe: 11856, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2012-12-31', concepto: 'Hipoteca 2012 (Anual)', importe: 12000, estado: 'prescrita', notas: 'Prescrito' },
      
      // Bloque Compensable
      { date: '2023-11-01', concepto: 'Retirada Juan (Objeto Demanda)', importe: -32000, estado: 'reclamada', notas: 'Reclamado por actora' },
      { date: '2023-11-02', concepto: 'Retirada Vicenta (A Compensar)', importe: 38500, estado: 'reclamable', notas: 'Crédito a nuestro favor' }
    ];

    for (const p of partidasList) {
      await partidasRepo.create({
        caseId: mainCase.id,
        date: p.date,
        amountCents: eurosToCents(p.importe),
        concept: p.concepto,
        payer: 'N/A',
        beneficiary: 'N/A',
        state: p.estado as any, // 'reclamada', 'pagada', etc.
        theory: 'Desglose Demanda',
        notes: p.notas,
        tags: ['financiero', p.estado === 'prescrita' ? 'prescripcion' : 'fondo']
      });
    }

    // =====================================================================
    // 6. CRONOLOGÍA (EVENTS)
    // Fuente: INFORME_ESTRATEGICO.pdf
    // =====================================================================
    const eventsData = [
      { date: '2006-08-22', type: 'factico', title: 'Cancelación Carga Previa', description: 'Origen de la reclamación de 16.979€.' },
      { date: '2012-01-15', type: 'factico', title: 'Venta Piso Madrid', description: 'Venta bien privativo Juan. Reinversión en obra.' },
      { date: '2023-10-01', type: 'factico', title: 'Ruptura Convivencia', description: 'Inicio de la separación de hecho y retiradas de fondos.' },
      { date: '2023-11-01', type: 'factico', title: 'Inicio Pago Hipoteca Exclusivo', description: 'Juan asume el 100% de la cuota (850€/mes).' },
      { date: '2024-01-20', type: 'procesal', title: 'Presentación Demanda', description: 'Vicenta reclama 212.677€.' },
      { date: '2025-02-19', type: 'procesal', title: 'Contestación Demanda', description: 'Presentación del escrito de defensa.' },
      { date: '2025-10-24', type: 'procesal', title: 'Señalamiento Audiencia Previa', description: 'Fecha prevista para la vista preliminar.' }
    ];

    for (const e of eventsData) {
      await eventsRepo.create({ caseId: mainCase.id, ...e } as any);
    }

    // =====================================================================
    // PARTIDAS DE LOS 10 HECHOS RECLAMADOS
    // Fuente: hechosReclamados.ts (extraído de rama claude/setup-litigation-system-yDgIX)
    // =====================================================================

    // Hecho 1: Préstamos Personales BBVA (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2008-09-05',
      amountCents: eurosToCents(20085),
      concept: 'Préstamos Personales BBVA - Cancelación',
      payer: 'Vicenta (alega)',
      beneficiary: 'BBVA',
      state: 'prescrita_interna',
      theory: 'Prescrito +15 años. Art. 1964 CC. Sin justificante de ingreso.',
      notes: 'Docs. 13, 11, 4. Contradicción AEAT: préstamos para chalet común.',
      tags: ['prescrito', 'bbva', 'prestamo']
    });

    // Hecho 2: Vehículo Seat León (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2014-01-01',
      amountCents: eurosToCents(13000),
      concept: 'Vehículo Seat León',
      payer: 'Cuenta Barclays Común',
      beneficiary: 'Concesionario',
      state: 'prescrita_interna',
      theory: 'Prescrito +10 años. Liberalidad familiar. Juan pagó Renault Scenic 4.500€.',
      notes: 'Docs. 2, 17, 16. Doble rasero: reclama 100% sin mencionar Scenic.',
      tags: ['prescrito', 'vehiculo', 'liberalidad']
    });

    // Hecho 3: Venta Vivienda Artur Piera (DISPUTA)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2022-09-01',
      amountCents: eurosToCents(32000),
      concept: 'Retirada Juan - Venta Artur Piera',
      payer: 'Cuenta Común',
      beneficiary: 'Juan (Privativo)',
      state: 'discutida',
      theory: 'Compensación: Vicenta retiró 38.500€ (6.500€ más). Inversión común en subasta.',
      notes: 'Docs. 20, 3, 22. Juan hizo reforma física. Mala fe de actora al omitir su retirada mayor.',
      tags: ['disputa', 'artur_piera', 'compensacion']
    });

    // Hecho 4: Hipoteca Vivienda Lope de Vega (PRESCRITO parcial)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2009-07-01',
      amountCents: eurosToCents(122282.28),
      concept: 'Cuotas Hipoteca Lope de Vega (2009-2024)',
      payer: 'Cuentas Comunes',
      beneficiary: 'Entidad Bancaria',
      state: 'prescrita_interna',
      theory: 'Pre-2019 prescrito. Préstamo 310K para terrenos comunes, no para vivienda privativa.',
      notes: 'Doc. 6. Lope de Vega solo fue garantía, no destino. Ella pide 50% terrenos.',
      tags: ['prescrito', 'hipoteca', 'lope_de_vega']
    });

    // Hecho 5: IBI Lope de Vega (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2013-01-01',
      amountCents: eurosToCents(1826.91),
      concept: 'IBI Lope de Vega (2013-2019)',
      payer: 'Cuenta BBVA 9397',
      beneficiary: 'Ayuntamiento Quart',
      state: 'prescrita_interna',
      theory: 'Prescrito pre-2019. Cuenta nutrida por nómina de Juan 16 años.',
      notes: 'Doc. 12. Vincular recibos a historial nóminas Juan.',
      tags: ['prescrito', 'ibi', 'quart']
    });

    // Hecho 6: IBI Chalet Montroy (DISPUTA)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2020-02-12',
      amountCents: eurosToCents(530.85),
      concept: 'IBI Chalet Montroy (50%)',
      payer: 'Cuenta Común BBVA',
      beneficiary: 'Ayuntamiento',
      state: 'discutida',
      theory: 'Fondos comunes para bienes comunes. No cabe reembolso.',
      notes: 'Doc. 1. Extracto BBVA 12/02/2021 muestra cargo directo.',
      tags: ['disputa', 'ibi', 'montroy']
    });

    // Hecho 7: IBI Fincas Rústicas (COMPENSABLE)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2020-01-01',
      amountCents: eurosToCents(151.81),
      concept: 'IBI Fincas Rústicas',
      payer: 'Vicenta (Privativo)',
      beneficiary: 'Ayuntamiento',
      state: 'reclamable',
      theory: 'Compensación Art. 1196 CC. Juan pagó fitosanitarios 308,24€.',
      notes: 'Doc. 27. Deuda ella > este IBI.',
      tags: ['compensable', 'ibi', 'rusticas']
    });

    // Hecho 8: Comunidad Loma de los Caballeros (COMPENSABLE)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2023-10-01',
      amountCents: eurosToCents(19.39),
      concept: 'Comunidad Loma Caballeros Q4/2023',
      payer: 'Vicenta',
      beneficiary: 'Comunidad',
      state: 'reclamable',
      theory: 'Compensación. Juan pagó Q1/2024 (36,06€).',
      notes: 'Doc. 28. Compensación directa.',
      tags: ['compensable', 'comunidad']
    });

    // Hecho 9: Amortización Hipoteca Previa (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2006-08-22',
      amountCents: eurosToCents(16979.59),
      concept: 'Amortización Hipoteca Previa Juan',
      payer: 'Fondos Comunes',
      beneficiary: 'Entidad Bancaria',
      state: 'prescrita_interna',
      theory: 'Prescrito 19 años. Condición banco para préstamo 310K terrenos comunes.',
      notes: 'Vicenta aceptó en 2006 para comprar Montroy. Vinculado a Hecho 4.',
      tags: ['prescrito', 'hipoteca', 'amortizacion']
    });

    // Hecho 10: Maquinaria Agrícola (DISPUTA)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2018-01-01',
      amountCents: eurosToCents(5801.25),
      concept: 'Maquinaria Agrícola Olivar',
      payer: 'Fondos Comunes',
      beneficiary: 'Proveedor',
      state: 'discutida',
      theory: 'Inversión negocio olivos. Vicenta cobró 10.887,57€ beneficios 2023.',
      notes: 'Doc. 29. Factura Oleos Dels Alforins a nombre Vicenta.',
      tags: ['disputa', 'maquinaria', 'olivar']
    });

    console.log('Database seeded successfully with REAL DATA + 10 HECHOS RECLAMADOS');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
