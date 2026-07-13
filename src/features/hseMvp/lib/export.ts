import * as XLSX from 'xlsx';

const escapeCsv = (value: unknown) => {
  const normalized = value === null || value === undefined ? '' : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
};

export const rowsToCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(',')
    ),
  ].join('\n');
};

const downloadBlob = (content: BlobPart, fileName: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadCsv = (
  rows: Record<string, unknown>[],
  fileName = 'hse-results.csv'
) => {
  const csv = `\uFEFF${rowsToCsv(rows)}`;
  downloadBlob(csv, fileName, 'text/csv;charset=utf-8');
};

export const downloadXlsx = (
  rows: Record<string, unknown>[],
  fileName = 'hse-results.xlsx',
  sheetName = 'Отчёт'
) => {
  if (!rows.length) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
};

export const downloadXlsxFallback = (
  rows: Record<string, unknown>[],
  fileName = 'hse-results.xls'
) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const html = `
    <html><head><meta charset="utf-8" /></head><body>
    <table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
    <tbody>${rows
      .map(
        (row) =>
          `<tr>${headers.map((header) => `<td>${row[header] ?? ''}</td>`).join('')}</tr>`
      )
      .join('')}</tbody></table>
    </body></html>`;
  downloadBlob(html, fileName, 'application/vnd.ms-excel;charset=utf-8');
};
