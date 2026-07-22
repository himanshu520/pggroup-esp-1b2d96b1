// Client-side export helpers for reports (Excel, CSV, PDF)
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportColumn<T> = {
  key: keyof T | string;
  header: string;
  format?: (row: T) => string | number;
};

function timestamp() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let hours = d.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${pad(d.getDate())}-${months[d.getMonth()]}-${d.getFullYear()}_${pad(hours)}-${pad(d.getMinutes())}${ampm}`;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function toRows<T>(data: T[], cols: ExportColumn<T>[]): Record<string, string | number>[] {
  return data.map((row) => {
    const out: Record<string, string | number> = {};
    for (const c of cols) {
      const val = c.format ? c.format(row) : (row as any)[c.key as string];
      out[c.header] = val === null || val === undefined ? "" : (val as string | number);
    }
    return out;
  });
}

export function exportCSV<T>(data: T[], cols: ExportColumn<T>[], name: string) {
  const rows = toRows(data, cols);
  const ws = XLSX.utils.json_to_sheet(rows, { header: cols.map((c) => c.header) });
  let csv = XLSX.utils.sheet_to_csv(ws);
  
  const headerText = `"Report: ${name}"\n"Downloaded On: ${new Date().toLocaleString()}"\n\n`;
  csv = headerText + csv;

  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${name}_${timestamp()}.csv`);
}

export function exportXLSX<T>(
  data: T[],
  cols: ExportColumn<T>[],
  name: string,
  sheetName = "Report",
) {
  const rows = toRows(data, cols);
  const ws = XLSX.utils.json_to_sheet(rows, { header: cols.map((c) => c.header), origin: "A3" });
  
  // Add title and date at the top
  XLSX.utils.sheet_add_aoa(ws, [
    [`Report: ${name}`],
    [`Downloaded On: ${new Date().toLocaleString()}`],
  ], { origin: "A1" });

  // Auto width
  const colWidths = cols.map((c) => ({
    wch: Math.min(60, Math.max(c.header.length + 2, ...rows.map((r) => String(r[c.header] ?? "").length + 2))),
  }));
  (ws as any)["!cols"] = colWidths;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  XLSX.writeFile(wb, `${name}_${timestamp()}.xlsx`);
}

export function exportPDF<T>(
  data: T[],
  cols: ExportColumn<T>[],
  name: string,
  opts: { title?: string; subtitle?: string; orientation?: "portrait" | "landscape" } = {},
) {
  const doc = new jsPDF({ orientation: opts.orientation ?? "landscape", unit: "pt", format: "a4" });
  const title = opts.title ?? name;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 40, 40);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(110);
  const meta = [opts.subtitle, `Generated ${new Date().toLocaleString()}`, `${data.length} rows`].filter(Boolean).join("  ·  ");
  doc.text(meta, 40, 56);
  doc.setTextColor(0);

  const rows = toRows(data, cols);
  autoTable(doc, {
    startY: 72,
    head: [cols.map((c) => c.header)],
    body: rows.map((r) => cols.map((c) => String(r[c.header] ?? ""))),
    styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [37, 63, 122], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [246, 248, 252] },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${name}_${timestamp()}.pdf`);
}

export type ExportFormat = "xlsx" | "csv" | "pdf";

export function exportAny<T>(
  format: ExportFormat,
  data: T[],
  cols: ExportColumn<T>[],
  name: string,
  pdfOpts?: Parameters<typeof exportPDF>[3],
) {
  if (format === "xlsx") return exportXLSX(data, cols, name);
  if (format === "csv") return exportCSV(data, cols, name);
  return exportPDF(data, cols, name, pdfOpts);
}

export function exportOverviewMultiSheetXLSX(
  summaryData: any[],
  suggestionsData: any[],
  suggestionsCols: ExportColumn<any>[],
  performanceData: any[],
  performanceCols: ExportColumn<any>[],
  name: string
) {
  const wb = XLSX.utils.book_new();
  const summaryCols: ExportColumn<any>[] = [
    { key: "metric", header: "Metric" },
    { key: "value", header: "Value" },
  ];

  // 1. Summary Sheet
  const wsSummary = XLSX.utils.json_to_sheet(toRows(summaryData, summaryCols), { header: summaryCols.map(c => c.header), origin: "A3" });
  XLSX.utils.sheet_add_aoa(wsSummary, [[`Overview Summary`], [`Downloaded On: ${new Date().toLocaleString()}`]], { origin: "A1" });
  const summaryColWidths = summaryCols.map((c) => ({
    wch: Math.min(60, Math.max(c.header.length + 2, ...toRows(summaryData, summaryCols).map((r) => String(r[c.header] ?? "").length + 2))),
  }));
  (wsSummary as any)["!cols"] = summaryColWidths;
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // 2. Suggestions Sheet
  const wsSug = XLSX.utils.json_to_sheet(toRows(suggestionsData, suggestionsCols), { header: suggestionsCols.map(c => c.header), origin: "A3" });
  XLSX.utils.sheet_add_aoa(wsSug, [[`Suggestions Data`], [`Downloaded On: ${new Date().toLocaleString()}`]], { origin: "A1" });
  const sugColWidths = suggestionsCols.map((c) => ({
    wch: Math.min(60, Math.max(c.header.length + 2, ...toRows(suggestionsData, suggestionsCols).map((r) => String(r[c.header] ?? "").length + 2))),
  }));
  (wsSug as any)["!cols"] = sugColWidths;
  XLSX.utils.book_append_sheet(wb, wsSug, "Suggestions");

  // 3. Performance Sheet
  const wsPerf = XLSX.utils.json_to_sheet(toRows(performanceData, performanceCols), { header: performanceCols.map(c => c.header), origin: "A3" });
  XLSX.utils.sheet_add_aoa(wsPerf, [[`Department Performance`], [`Downloaded On: ${new Date().toLocaleString()}`]], { origin: "A1" });
  const perfColWidths = performanceCols.map((c) => ({
    wch: Math.min(60, Math.max(c.header.length + 2, ...toRows(performanceData, performanceCols).map((r) => String(r[c.header] ?? "").length + 2))),
  }));
  (wsPerf as any)["!cols"] = perfColWidths;
  XLSX.utils.book_append_sheet(wb, wsPerf, "Performance");

  XLSX.writeFile(wb, `${name}_${timestamp()}.xlsx`);
}
