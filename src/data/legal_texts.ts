// ==========================================
// BASE DE DATOS DOCUMENTAL (TEXTO LLANO + HTML)
// ==========================================
// Este archivo contiene la transcripción de los escritos procesales
// para su lectura directa en la aplicación.

// ------------------------------------------------------------------
// 1. CASO PICASSENT (P.O. 715/2024)
// ------------------------------------------------------------------

export const DEMANDA_PICASSENT_HTML = `
<div class="legal-doc space-y-6">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-amber-500 font-serif tracking-wide">DEMANDA DE JUICIO ORDINARIO</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>JUZGADO DE PRIMERA INSTANCIA E INSTRUCCIÓN Nº 1 DE PICASSENT</p>
      <p>P.O. 715/2024 • Cuantía: 212.677,08 €</p>
    </div>
  </div>

  <div class="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 text-sm">
    <p><strong>AL JUZGADO:</strong></p>
    <p class="mt-2">Dña. <strong>ISABEL LUZZY AGUILAR</strong>, Procuradora, en nombre de <strong>Dña. VICENTA JIMÉNEZ VERA</strong>, ante el Juzgado comparezco y DIGO:</p>
    <p class="mt-2">Que interpongo demanda ejercitando acumuladamente:</p>
    <ul class="list-disc list-inside mt-1 ml-2 text-slate-300">
      <li>Acción de DIVISIÓN DE COSA COMÚN (Art. 400 CC).</li>
      <li>Acción de REEMBOLSO de cantidades (Art. 1.158 y 1.164 CC).</li>
    </ul>
  </div>

  <h3 class="text-lg font-bold text-slate-200 border-l-4 border-amber-500 pl-3 mt-8">FUNDAMENTOS DE HECHO</h3>
  
  <div class="space-y-4 text-slate-300 leading-relaxed text-justify">
    <p><strong>PRIMERO.- Régimen Económico.</strong> Las partes contrajeron matrimonio el 9 de agosto de 2013 en régimen de separación de bienes.</p>

    <p><strong>CUARTO.- Del derecho de crédito (El núcleo de la reclamación).</strong><br>
    Mi mandante ha soportado en solitario cargas que correspondían a la sociedad o al demandado, generando un crédito de <strong>212.677,08 EUROS</strong>:</p>
    
    <div class="pl-4 border-l-2 border-slate-700 space-y-3 mt-2 text-sm">
      <div>
        <strong class="text-amber-400 block">A) Préstamos Personales (2008)</strong>
        <p>Importe: <strong>20.085 €</strong>. Cancelados con dinero privativo de la venta de su vivienda en Mislata.</p>
      </div>
      <div>
        <strong class="text-amber-400 block">B) Vehículo SEAT LEÓN (2014)</strong>
        <p>Importe: <strong>13.000 €</strong>. Abonado íntegramente por la actora pese a ser titularidad del demandado.</p>
      </div>
      <div>
        <strong class="text-amber-400 block">C) Venta Piso Artur Piera (2022)</strong>
        <p>Importe: <strong>32.000 €</strong>. El demandado se transfirió indebidamente esta cantidad de la cuenta común tras la venta.</p>
      </div>
      <div>
        <strong class="text-amber-400 block">D) Hipoteca Vivienda Lope de Vega</strong>
        <p>Importe: <strong>122.282,28 €</strong>. La actora abonó las cuotas de la hipoteca que grava la vivienda PRIVATIVA del demandado durante años.</p>
      </div>
    </div>
  </div>

  <div class="bg-amber-900/10 p-5 rounded-lg border border-amber-900/30 text-slate-300 mt-8">
    <h4 class="font-bold text-amber-500 mb-2">SUPLICO AL JUZGADO</h4>
    <ol class="list-decimal list-outside ml-5 space-y-2">
      <li>Declarar la disolución de la comunidad de bienes.</li>
      <li><strong>CONDENAR</strong> a D. Juan Rodríguez Crespo a abonar <strong>212.677,08 €</strong> más intereses legales.</li>
      <li>Imposición de costas a la parte demandada.</li>
    </ol>
  </div>
</div>
`;

export const CONTESTACION_PICASSENT_HTML = `
<div class="legal-doc space-y-6">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-emerald-500 font-serif tracking-wide">CONTESTACIÓN A LA DEMANDA</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>P.O. 715/2024</p>
      <p>Defensa: Oscar Javier Benita Godoy</p>
    </div>
  </div>

  <div class="bg-emerald-900/10 p-4 rounded-lg border border-emerald-900/30 text-sm">
    <p>Dña. <strong>ROSA CALVO BARBER</strong>, en nombre de <strong>D. JUAN RODRÍGUEZ CRESPO</strong>.</p>
    <div class="mt-4 p-3 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r">
      <strong class="text-emerald-400 text-base">ALLANAMIENTO PARCIAL</strong>
      <p class="mt-1 text-slate-300">Esta parte se ALLANA a la división de la cosa común. Queremos liquidar los inmuebles.</p>
    </div>
    <p class="mt-4 font-bold text-rose-400">PERO NOS OPONEMOS A LA RECLAMACIÓN DE 212.000 €.</p>
  </div>

  <h3 class="text-lg font-bold text-slate-200 mt-8">MOTIVOS DE OPOSICIÓN</h3>
  
  <div class="space-y-6 text-slate-300 leading-relaxed text-justify">
    <div class="bg-rose-900/10 p-4 rounded border border-rose-900/30">
      <h4 class="text-rose-400 font-bold text-base mb-2">1. EXCEPCIÓN DE PRESCRIPCIÓN (Art. 1964 CC)</h4>
      <p>La actora realiza "arqueología contable". Reclama deudas de 2008, 2009, 2014... Todo lo anterior a 5 años (Art. 1964) o 15 años (anterior reforma) está PRESCRITO al no haber reclamación previa.</p>
      <ul class="list-disc ml-5 mt-2 text-sm text-slate-400">
        <li>Préstamos 2008: Prescritos (16 años).</li>
        <li>Coche 2014: Prescrito (10 años).</li>
        <li>Hipoteca 2009-2018: Prescrita la mayoría.</li>
      </ul>
    </div>

    <div>
      <h4 class="text-emerald-400 font-bold text-base mb-2">2. NATURALEZA DEL PRÉSTAMO</h4>
      <p>Falso que sea "la hipoteca del demandado". Es un <strong>préstamo solidario</strong> pedido por ambos para construir el chalet común. La casa de Juan solo se puso como garantía real. No hay derecho de reembolso.</p>
    </div>

    <div>
      <h4 class="text-emerald-400 font-bold text-base mb-2">3. COMPENSACIÓN (Art. 1196 CC)</h4>
      <p>Ella reclama 32.000€. Pero ella retiró <strong>38.500 €</strong> de la cuenta común el día de la ruptura. Si echamos cuentas, ELLA nos debe dinero a nosotros.</p>
    </div>
  </div>

  <div class="bg-emerald-900/10 p-5 rounded-lg border border-emerald-900/30 text-slate-300 mt-8">
    <p><strong>SUPLICO:</strong> Se desestime íntegramente la reclamación de cantidad con imposición de costas por temeridad.</p>
  </div>
</div>
`;

// ------------------------------------------------------------------
// 2. CASO MISLATA (JUICIO VERBAL 1185/2025)
// ------------------------------------------------------------------

export const RECURSO_REPOSICION_MISLATA_HTML = `
<div class="legal-doc space-y-6 text-justify">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-rose-500 font-serif tracking-wide">RECURSO DE REPOSICIÓN (CONTRARIO)</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>AL TRIBUNAL DE INSTANCIA DE MISLATA</p>
      <p>J.V. 1185/2025 • Procuradora: Isabel Luzzy</p>
    </div>
  </div>

  <div class="bg-rose-900/10 p-4 rounded-lg border border-rose-900/30 text-sm">
    <p><strong>DIGO:</strong> Que interpongo RECURSO DE REPOSICIÓN contra la admisión de la demanda, por infracción del artículo 43 de la LEC (Prejudicialidad Civil).</p>
  </div>

  <h3 class="text-lg font-bold text-rose-400 mt-4">ALEGACIONES</h3>

  <p><strong>ÚNICO.- Prejudicialidad Civil (Art. 43 LEC).</strong><br>
  El actor reclama cuotas de una hipoteca. Pero la "naturaleza" de esa hipoteca y la liquidación de la sociedad conyugal se están discutiendo YA en <strong>Picassent (P.O. 715/2024)</strong>.</p>
  
  <p>Hasta que Picassent no diga quién debe a quién, aquí no se puede condenar a pagar cuotas sueltas. Si en Picassent sale que Juan le debe 200.000€ a Vicenta, estas cuotas de 8.000€ quedarían compensadas.</p>

  <h3 class="text-lg font-bold text-rose-400 mt-4">SUPLICO</h3>
  <p>Que se revoque la admisión y se acuerde la <strong>SUSPENSIÓN</strong> del juicio hasta que haya sentencia firme en Picassent.</p>
</div>
`;

export const OPOSICION_RECURSO_MISLATA_HTML = `
<div class="legal-doc space-y-6 text-justify">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-emerald-500 font-serif tracking-wide">OPOSICIÓN AL RECURSO</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>Defensa: Oscar Javier Benita Godoy</p>
      <p>Argumento: Autonomía de la deuda</p>
    </div>
  </div>

  <p><strong>AL JUZGADO:</strong> Nos oponemos al recurso de reposición por los siguientes motivos:</p>

  <h3 class="text-lg font-bold text-emerald-400 mt-4">MOTIVOS</h3>

  <p><strong>1. Objetos Diferentes.</strong><br>
  En Picassent se liquida el PASADO (hasta el divorcio). Aquí reclamamos el PRESENTE (cuotas impagadas desde Octubre 2023). Son deudas nuevas.</p>

  <p><strong>2. Riesgo de Ejecución.</strong><br>
  Si suspendemos este juicio, el banco no cobra (o paga solo Juan). Si no se paga la hipoteca, el banco ejecuta la casa. No podemos esperar 3 años a la sentencia de Picassent.</p>

  <div class="bg-emerald-900/10 p-4 rounded-lg border-l-4 border-emerald-500 my-4">
    <p class="font-bold text-emerald-400">ARGUMENTO CLAVE</p>
    <p>La obligación de pago al banco es solidaria y mensual. Vicenta ha dejado de pagar unilateralmente. Es una deuda líquida, vencida y exigible HOY.</p>
  </div>

  <h3 class="text-lg font-bold text-emerald-400 mt-4">SUPLICO</h3>
  <p>Que se desestime el recurso y continúe el juicio verbal.</p>
</div>
`;

export const CONTESTACION_MISLATA_HTML = `
<div class="legal-doc space-y-6 text-justify">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-slate-200 font-serif tracking-wide">CONTESTACIÓN A LA DEMANDA</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>Parte Demandada: Vicenta Jiménez Vera</p>
    </div>
  </div>

  <p><strong>DIGO:</strong> Que me opongo a la demanda de reclamación de <strong>8.550 €</strong>.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-4">MOTIVOS DE FONDO</h3>

  <p><strong>1. Litispendencia.</strong><br>
  Insistimos: esto ya está en Picassent.</p>

  <p><strong>2. Falta de Legitimación.</strong><br>
  Juan no puede pedirme el 50% de la hipoteca si él está usando la casa (o tiene otros bienes). Todo debe ir a la "bolsa común" de liquidación.</p>

  <p><strong>3. Negación de la Deuda.</strong><br>
  Niego deber nada. Mis aportaciones pasadas cubren de sobra estas cuotas.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-4">SUPLICO</h3>
  <p>Desestimación íntegra y costas al actor.</p>
</div>
`;

export const PRUEBA_JUAN_MISLATA_HTML = `
<div class="legal-doc space-y-6">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-emerald-500 font-serif tracking-wide">NUESTRA PROPOSICIÓN DE PRUEBA</h2>
  </div>

  <div class="space-y-6">
    <div class="border-l-4 border-emerald-500 pl-4">
      <h4 class="font-bold text-emerald-400 mb-1">A) DOCUMENTAL (Oficio a CaixaBank)</h4>
      <p class="text-slate-300 text-sm">Oficio a la oficina de Aldaya para que certifique:</p>
      <ul class="list-disc pl-5 text-slate-400 text-sm">
        <li>Que desde Octubre 2023, las cuotas se pagan SOLO desde la cuenta de Juan.</li>
        <li>Que Vicenta no ha aportado nada.</li>
      </ul>
    </div>

    <div class="border-l-4 border-emerald-500 pl-4">
      <h4 class="font-bold text-emerald-400 mb-1">B) TESTIFICAL</h4>
      <p class="text-slate-300 text-sm">Declaración de <strong>Dña. SILVIA TORRENTÍ JIMÉNEZ</strong> (Empleada de CaixaBank).</p>
      <p class="text-xs text-slate-500 mt-1">Para que explique al juez quién va físicamente a pagar para evitar el embargo.</p>
    </div>

    <div class="border-l-4 border-emerald-500 pl-4">
      <h4 class="font-bold text-emerald-400 mb-1">C) PATRIMONIAL</h4>
      <p class="text-slate-300 text-sm">Consulta al PNJ (Punto Neutro Judicial) de los bienes de Vicenta.</p>
      <p class="text-xs text-slate-500 mt-1">Para demostrar que es solvente y no paga por mala fe.</p>
    </div>
  </div>
</div>
`;

export const PRUEBA_VICENTA_MISLATA_HTML = `
<div class="legal-doc space-y-6">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-rose-500 font-serif tracking-wide">PRUEBA DE LA CONTRARIA</h2>
  </div>

  <div class="space-y-6">
    <div class="border-l-4 border-rose-500 pl-4">
      <h4 class="font-bold text-rose-400 mb-1">REQUERIMIENTO A JUAN</h4>
      <p class="text-slate-300 text-sm">Pide que Juan aporte:</p>
      <ul class="list-disc pl-5 text-slate-400 text-sm mt-1">
        <li><strong>Contratos de Alquiler</strong> de la vivienda de Aldaia (Av. Dos de Mayo).</li>
        <li>Extractos de cobro de rentas.</li>
      </ul>
      <p class="text-xs text-rose-300 mt-2 italic">Intenta demostrar que Juan tiene ingresos extra para pagar la hipoteca él solo.</p>
    </div>
  </div>
</div>
`;

// ==========================================
// MAPA DE ACCESO (VINCULACIÓN)
// ==========================================
export const LEGAL_DOCS_MAP: Record<string, string> = {
  // PICASSENT
  'demanda-picassent': DEMANDA_PICASSENT_HTML,
  'contestacion-picassent': CONTESTACION_PICASSENT_HTML,
  
  // MISLATA
  'recurso-reposicion-mislata': RECURSO_REPOSICION_MISLATA_HTML,
  'oposicion-mislata': OPOSICION_RECURSO_MISLATA_HTML,
  'contestacion-mislata': CONTESTACION_MISLATA_HTML,
  'prueba-juan-mislata': PRUEBA_JUAN_MISLATA_HTML,
  'prueba-vicenta-mislata': PRUEBA_VICENTA_MISLATA_HTML,
};
