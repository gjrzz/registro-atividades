import type { Ticket } from '../types';

/**
 * Escapa um campo CSV conforme RFC 4180.
 * Campos com vírgula, aspas duplas ou quebra de linha são envolvidos em aspas duplas.
 * Aspas duplas internas são duplicadas ("").
 */
export function escapeCsvField(field: string): string {
  if (field === '') return '';
  const needsQuoting = field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r');
  if (needsQuoting) {
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return field;
}

/**
 * Gera o conteúdo CSV completo com BOM UTF-8 para compatibilidade com Excel brasileiro.
 */
export function generateCsv(tickets: Ticket[]): string {
  const BOM = '\uFEFF';
  const header = 'Summary,Description,Reporter';

  const rows = tickets.map(ticket => {
    const fields = [
      escapeCsvField(ticket.summary),
      escapeCsvField(ticket.description),
      escapeCsvField(ticket.reporter),
    ];
    return fields.join(',');
  });

  return BOM + header + '\n' + rows.join('\n');
}

/**
 * Faz o download do CSV como arquivo.
 */
export function downloadCsv(content: string): void {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const filename = `jira-import-${yyyy}-${mm}-${dd}-${hh}${min}.csv`;

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
