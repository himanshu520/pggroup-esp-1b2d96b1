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
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
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
  const csv = XLSX.utils.sheet_to_csv(ws);
  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${name}_${timestamp()}.csv`);
}

export function exportXLSX<T>(
  data: T[],
  cols: ExportColumn<T>[],
  name: string,
  sheetName = "Report",
) {
  const rows = toRows(data, cols);
  const ws = XLSX.utils.json_to_sheet(rows, { header: cols.map((c) => c.header) });
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
