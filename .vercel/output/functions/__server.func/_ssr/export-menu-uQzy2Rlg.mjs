import { o as __toESM } from "../_runtime.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { $ as Download, J as FileText, X as FileSpreadsheet, q as FileType } from "../_libs/lucide-react.mjs";
import { _ as DropdownMenu, b as DropdownMenuTrigger, v as DropdownMenuContent, y as DropdownMenuItem } from "./app-shell-D3p4__nB.mjs";
import { n as writeFileSync, t as utils } from "../_libs/xlsx.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-menu-uQzy2Rlg.js
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
function timestamp() {
	const d = /* @__PURE__ */ new Date();
	const pad = (n) => n.toString().padStart(2, "0");
	return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}
function download(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 0);
}
function toRows(data, cols) {
	return data.map((row) => {
		const out = {};
		for (const c of cols) {
			const val = c.format ? c.format(row) : row[c.key];
			out[c.header] = val === null || val === void 0 ? "" : val;
		}
		return out;
	});
}
function exportCSV(data, cols, name) {
	const rows = toRows(data, cols);
	const ws = utils.json_to_sheet(rows, { header: cols.map((c) => c.header) });
	const csv = utils.sheet_to_csv(ws);
	download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${name}_${timestamp()}.csv`);
}
function exportXLSX(data, cols, name, sheetName = "Report") {
	const rows = toRows(data, cols);
	const ws = utils.json_to_sheet(rows, { header: cols.map((c) => c.header) });
	ws["!cols"] = cols.map((c) => ({ wch: Math.min(60, Math.max(c.header.length + 2, ...rows.map((r) => String(r[c.header] ?? "").length + 2))) }));
	const wb = utils.book_new();
	utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
	writeFileSync(wb, `${name}_${timestamp()}.xlsx`);
}
function exportPDF(data, cols, name, opts = {}) {
	const doc = new import_jspdf_node_min.default({
		orientation: opts.orientation ?? "landscape",
		unit: "pt",
		format: "a4"
	});
	const title = opts.title ?? name;
	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.text(title, 40, 40);
	doc.setFontSize(9);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(110);
	const meta = [
		opts.subtitle,
		`Generated ${(/* @__PURE__ */ new Date()).toLocaleString()}`,
		`${data.length} rows`
	].filter(Boolean).join("  ·  ");
	doc.text(meta, 40, 56);
	doc.setTextColor(0);
	const rows = toRows(data, cols);
	autoTable(doc, {
		startY: 72,
		head: [cols.map((c) => c.header)],
		body: rows.map((r) => cols.map((c) => String(r[c.header] ?? ""))),
		styles: {
			fontSize: 8,
			cellPadding: 4,
			overflow: "linebreak"
		},
		headStyles: {
			fillColor: [
				37,
				63,
				122
			],
			textColor: 255,
			fontStyle: "bold"
		},
		alternateRowStyles: { fillColor: [
			246,
			248,
			252
		] },
		margin: {
			left: 40,
			right: 40
		}
	});
	doc.save(`${name}_${timestamp()}.pdf`);
}
function exportAny(format, data, cols, name, pdfOpts) {
	if (format === "xlsx") return exportXLSX(data, cols, name);
	if (format === "csv") return exportCSV(data, cols, name);
	return exportPDF(data, cols, name, pdfOpts);
}
function ExportMenu({ data, columns, filename, title, subtitle, label = "Export", disabled }) {
	const run = (format) => exportAny(format, data, columns, filename, {
		title: title ?? filename,
		subtitle
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			disabled: disabled || data.length === 0,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 mr-1.5" }), label]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => run("xlsx"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4 mr-2 text-emerald-600" }), "Excel (.xlsx)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => run("csv"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileType, { className: "w-4 h-4 mr-2 text-blue-600" }), "CSV (.csv)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => run("pdf"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 mr-2 text-red-600" }), "PDF (.pdf)"]
			})
		]
	})] });
}
//#endregion
export { ExportMenu as t };
