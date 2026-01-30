// ============================================
// CASE OPS - Export Utilities (Reports)
// ============================================

import type { Fact, Partida, Span, Link, Document, Event } from '../types';
import { formatDate } from './dates';
import { formatCurrency } from './validators';

/**
 * Export facts to CSV
 */
export function factsToCSV(
  facts: Fact[],
  evidence: Map<string, { span: Span; document: Document }[]>
): string {
  const headers = [
    'ID',
    'Título',
    'Estado',
    'Carga Prueba',
    'Riesgo',
    'Fuerza',
    'Relato',
    'Tags',
    'Evidencias',
    'Creado',
    'Actualizado',
  ];

  const rows = facts.map((fact) => {
    const factEvidence = evidence.get(fact.id) || [];
    const evidenceStr = factEvidence
      .map((e) => `${e.document.id}:${e.span.pageStart}-${e.span.pageEnd}`)
      .join('; ');

    return [
      fact.id,
      `"${fact.title.replace(/"/g, '""')}"`,
      fact.status,
      fact.burden,
      fact.risk,
      fact.strength.toString(),
      `"${fact.narrative.replace(/"/g, '""')}"`,
      `"${fact.tags.join(', ')}"`,
      `"${evidenceStr}"`,
      formatDate(fact.createdAt),
      formatDate(fact.updatedAt),
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Export partidas to CSV
 */
export function partidasToCSV(
  partidas: Partida[],
  evidence: Map<string, { span: Span; document: Document }[]>
): string {
  const headers = [
    'ID',
    'Fecha',
    'Importe',
    'Moneda',
    'Concepto',
    'Estado',
    'Pagador',
    'Beneficiario',
    'Teoría',
    'Tags',
    'Evidencias',
    'Notas',
  ];

  const rows = partidas.map((partida) => {
    const partidaEvidence = evidence.get(partida.id) || [];
    const evidenceStr = partidaEvidence
      .map((e) => `${e.document.id}:${e.span.pageStart}-${e.span.pageEnd}`)
      .join('; ');

    return [
      partida.id,
      partida.date,
      (partida.amountCents / 100).toFixed(2),
      partida.currency,
      `"${partida.concept.replace(/"/g, '""')}"`,
      partida.state,
      `"${partida.payer || ''}"`,
      `"${partida.beneficiary || ''}"`,
      `"${partida.theory || ''}"`,
      `"${partida.tags.join(', ')}"`,
      `"${evidenceStr}"`,
      `"${partida.notes.replace(/"/g, '""')}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Export facts to JSON
 */
export function factsToJSON(
  facts: Fact[],
  evidence: Map<string, { span: Span; document: Document }[]>
): string {
  const data = facts.map((fact) => ({
    ...fact,
    evidence: (evidence.get(fact.id) || []).map((e) => ({
      spanId: e.span.id,
      documentId: e.document.id,
      documentTitle: e.document.title,
      pages: `${e.span.pageStart}-${e.span.pageEnd}`,
      label: e.span.label,
    })),
  }));

  return JSON.stringify(data, null, 2);
}

/**
 * Export hechos controvertidos report
 */
export function controversialFactsReport(
  facts: Fact[],
  evidence: Map<string, { span: Span; document: Document }[]>
): string {
  const controversial = facts.filter(
    (f) => f.status === 'controvertido' || f.status === 'a_probar'
  );

  let report = '# HECHOS CONTROVERTIDOS\n\n';
  report += `Fecha del informe: ${formatDate(Date.now())}\n`;
  report += `Total hechos controvertidos: ${controversial.length}\n\n`;
  report += '---\n\n';

  for (const fact of controversial) {
    const factEvidence = evidence.get(fact.id) || [];
    const hasEvidence = factEvidence.length > 0;

    report += `## ${fact.id}: ${fact.title}\n\n`;
    report += `**Estado:** ${fact.status}\n`;
    report += `**Carga de la prueba:** ${fact.burden}\n`;
    report += `**Riesgo:** ${fact.risk}\n`;
    report += `**Fuerza probatoria:** ${fact.strength}/5\n\n`;
    report += `**Relato:**\n${fact.narrative}\n\n`;

    if (hasEvidence) {
      report += '**Evidencias:**\n';
      for (const e of factEvidence) {
        report += `- ${e.document.title} (${e.document.id}), págs. ${e.span.pageStart}-${e.span.pageEnd}: ${e.span.label}\n`;
      }
    } else {
      report += '**⚠️ SIN EVIDENCIAS VINCULADAS**\n';
    }

    report += '\n---\n\n';
  }

  return report;
}

/**
 * Export timeline to Markdown
 */
export function timelineToMarkdown(events: Event[]): string {
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let md = '# CRONOLOGÍA\n\n';

  for (const event of sorted) {
    const icon = event.type === 'procesal' ? '⚖️' : '📅';
    md += `### ${formatDate(event.date)} ${icon} ${event.title}\n\n`;
    if (event.description) {
      md += `${event.description}\n\n`;
    }
    if (event.tags.length > 0) {
      md += `Tags: ${event.tags.join(', ')}\n\n`;
    }
    md += '---\n\n';
  }

  return md;
}

/**
 * Generate summary statistics
 */
export function generateStats(data: {
  cases: number;
  documents: number;
  spans: number;
  facts: number;
  factsControvertidos: number;
  factsWithoutEvidence: number;
  partidas: number;
  partidasDiscutidas: number;
  partidasWithoutEvidence: number;
  totalAmountCents: number;
  events: number;
  strategies: number;
  tasks: number;
  tasksPending: number;
}): string {
  return `
# ESTADÍSTICAS DEL CASO

## Documentación
- Casos: ${data.cases}
- Documentos: ${data.documents}
- Spans marcados: ${data.spans}

## Hechos
- Total: ${data.facts}
- Controvertidos/A probar: ${data.factsControvertidos}
- ⚠️ Sin evidencia: ${data.factsWithoutEvidence}

## Económico
- Total partidas: ${data.partidas}
- Partidas discutidas: ${data.partidasDiscutidas}
- ⚠️ Sin evidencia: ${data.partidasWithoutEvidence}
- Importe total: ${formatCurrency(data.totalAmountCents)}

## Organización
- Eventos en cronología: ${data.events}
- Estrategias en War Room: ${data.strategies}
- Tareas pendientes: ${data.tasksPending} / ${data.tasks}
`;
}

/**
 * Download text as file
 */
export function downloadText(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
