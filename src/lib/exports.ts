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

export function exportComprehensiveExecutiveDashboard(
  format: "xlsx" | "csv" | "pdf",
  suggestions: any[],
  filename: string = "ESP_Executive_Analytics_Report"
) {
  // 1. Calculate KPI Metrics
  const totalCount = suggestions.length;
  const implementedCount = suggestions.filter((s) => s.status === "implemented" || s.status === "closed").length;
  const pendingCount = suggestions.filter((s) => s.status === "pending" || s.status === "under_review").length;
  const inProgressCount = suggestions.filter((s) => s.status === "approved" || s.status === "implementation" || s.status === "evidence_pending").length;
  const rejectedCount = suggestions.filter((s) => s.status === "rejected" || s.status === "dropped").length;
  const fakeClosureCount = suggestions.filter((s) => s.status === "fake_closure").length;
  const totalSavings = suggestions.reduce((acc, s) => acc + (Number(s.savings) || Number(s.expected_saving) || 0), 0);
  const totalPoints = suggestions.reduce((acc, s) => acc + (typeof s.points === "number" ? s.points : 0), 0);
  const implRate = totalCount > 0 ? ((implementedCount / totalCount) * 100).toFixed(1) + "%" : "0%";
  const fakeRate = totalCount > 0 ? ((fakeClosureCount / totalCount) * 100).toFixed(1) + "%" : "0%";

  const summaryRows = [
    { Metric: "Total Suggestions Submitted", Value: totalCount },
    { Metric: "Total Implemented Ideas", Value: implementedCount },
    { Metric: "Pending / Under Review Ideas", Value: pendingCount },
    { Metric: "Approved / In-Progress Ideas", Value: inProgressCount },
    { Metric: "Rejected / Dropped Ideas", Value: rejectedCount },
    { Metric: "Fake Closures", Value: fakeClosureCount },
    { Metric: "Overall Implementation Rate", Value: implRate },
    { Metric: "Overall Fake Closure Rate", Value: fakeRate },
    { Metric: "Total Financial Cost Savings (INR)", Value: `₹${totalSavings.toLocaleString("en-IN")}` },
    { Metric: "Total Points Awarded", Value: totalPoints },
  ];

  // 2. Location-wise aggregation
  const locMap: Record<string, { total: number; impl: number; pending: number; rejected: number; fake: number; savings: number; points: number }> = {};
  suggestions.forEach((s) => {
    const loc = s.location || "Unassigned";
    if (!locMap[loc]) locMap[loc] = { total: 0, impl: 0, pending: 0, rejected: 0, fake: 0, savings: 0, points: 0 };
    locMap[loc].total += 1;
    if (s.status === "implemented" || s.status === "closed") locMap[loc].impl += 1;
    else if (s.status === "pending" || s.status === "under_review") locMap[loc].pending += 1;
    else if (s.status === "fake_closure") locMap[loc].fake += 1;
    else locMap[loc].rejected += 1;
    locMap[loc].savings += Number(s.savings) || Number(s.expected_saving) || 0;
    locMap[loc].points += typeof s.points === "number" ? s.points : 0;
  });

  const locationRows = Object.entries(locMap).map(([location, stat]) => ({
    Location: location,
    "Total Suggestions": stat.total,
    Implemented: stat.impl,
    "Pending Review": stat.pending,
    "Rejected / Dropped": stat.rejected,
    "Fake Closures": stat.fake,
    "Impl Rate (%)": stat.total > 0 ? ((stat.impl / stat.total) * 100).toFixed(1) + "%" : "0%",
    "Cost Savings (INR)": `₹${stat.savings.toLocaleString("en-IN")}`,
    "Total Points": stat.points,
  }));

  // 3. Plant-wise aggregation
  const plantMap: Record<string, { total: number; impl: number; pending: number; rejected: number; fake: number; savings: number; points: number }> = {};
  suggestions.forEach((s) => {
    const plant = s.plant || "Unassigned";
    if (!plantMap[plant]) plantMap[plant] = { total: 0, impl: 0, pending: 0, rejected: 0, fake: 0, savings: 0, points: 0 };
    plantMap[plant].total += 1;
    if (s.status === "implemented" || s.status === "closed") plantMap[plant].impl += 1;
    else if (s.status === "pending" || s.status === "under_review") plantMap[plant].pending += 1;
    else if (s.status === "fake_closure") plantMap[plant].fake += 1;
    else plantMap[plant].rejected += 1;
    plantMap[plant].savings += Number(s.savings) || Number(s.expected_saving) || 0;
    plantMap[plant].points += typeof s.points === "number" ? s.points : 0;
  });

  const plantRows = Object.entries(plantMap).map(([plant, stat]) => ({
    Plant: plant,
    "Total Suggestions": stat.total,
    Implemented: stat.impl,
    "Pending Review": stat.pending,
    "Rejected / Dropped": stat.rejected,
    "Fake Closures": stat.fake,
    "Impl Rate (%)": stat.total > 0 ? ((stat.impl / stat.total) * 100).toFixed(1) + "%" : "0%",
    "Cost Savings (INR)": `₹${stat.savings.toLocaleString("en-IN")}`,
    "Total Points": stat.points,
  }));

  // 4. Department-wise aggregation with Pending, Implemented & Savings
  const deptMap: Record<
    string,
    {
      total: number;
      impl: number;
      pending: number;
      underReview: number;
      rejected: number;
      savings: number;
      points: number;
      employees: Set<string>;
    }
  > = {};

  suggestions.forEach((s: any) => {
    const dept = s.department || "General";
    if (!deptMap[dept]) {
      deptMap[dept] = {
        total: 0,
        impl: 0,
        pending: 0,
        underReview: 0,
        rejected: 0,
        savings: 0,
        points: 0,
        employees: new Set(),
      };
    }
    deptMap[dept].total += 1;
    const cat = s.status ? String(s.status).toLowerCase().trim() : "";
    if (cat === "implemented" || cat === "closed" || cat === "completed") {
      deptMap[dept].impl += 1;
    } else if (cat === "pending") {
      deptMap[dept].pending += 1;
    } else if (cat === "under_review" || cat === "approved" || cat === "pe_review" || cat === "dept_review" || cat === "pe_verification" || cat === "evidence_pending" || cat === "evidence_submitted") {
      deptMap[dept].underReview += 1;
    } else if (cat === "rejected" || cat === "dropped" || cat === "fake_closure") {
      deptMap[dept].rejected += 1;
    } else {
      deptMap[dept].pending += 1;
    }

    deptMap[dept].savings += Number(s.savings) || Number(s.expectedSaving) || Number(s.expected_saving) || 0;
    deptMap[dept].points += typeof s.points === "number" ? s.points : 0;
    if (s.employeeName) deptMap[dept].employees.add(s.employeeName);
  });

  const deptRows = Object.entries(deptMap).map(([dept, stat]) => ({
    Department: dept,
    "Active Contributors": stat.employees.size,
    "Total Ideas Submitted": stat.total,
    "Implemented Ideas": stat.impl,
    "Pending Review Ideas": stat.pending,
    "Under Evaluation Ideas": stat.underReview,
    "Rejected / Dropped": stat.rejected,
    "Implementation Rate (%)": stat.total > 0 ? ((stat.impl / stat.total) * 100).toFixed(1) + "%" : "0.0%",
    "Cost Savings (INR)": `₹${stat.savings.toLocaleString("en-IN")}`,
    "Total Points": stat.points,
  }));

  // 5. Dedicated Implemented Suggestions Details (Top Management POV)
  const implementedSuggestions = suggestions.filter((s: any) => {
    const st = String(s.status || "").toLowerCase().trim();
    return st === "implemented" || st === "closed" || st === "completed";
  });

  const implementedRows = implementedSuggestions.map((s: any) => {
    const created = s.createdDate ? new Date(s.createdDate) : null;
    const completed = s.completedDate ? new Date(s.completedDate) : null;
    const turnaroundDays =
      created && completed && !isNaN(created.getTime()) && !isNaN(completed.getTime())
        ? Math.max(0, Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)))
        : "—";

    return {
      "Suggestion Code": s.code || s.id,
      "Idea Title": s.title || s.suggestionTitle || "—",
      "Problem / Description": s.description || s.problem || "—",
      "Employee Name": s.employeeName || "Unknown",
      "Employee Code": s.employeeId || "—",
      "Submitting Department": s.department || "—",
      "Implementing Department": s.current_departments?.name || s.current_department || s.department || "—",
      "Plant Unit": s.plant || "—",
      Location: s.location || "—",
      Category: s.category || s.suggestionType || "—",
      "Cost Type": s.costType || "No Cost",
      "Submitted Date": s.createdDate || "—",
      "Implemented Date": s.completedDate || s.createdDate || "—",
      "Turnaround (Days)": turnaroundDays,
      "Verified Savings (INR)": s.savings ? `₹${Number(s.savings).toLocaleString("en-IN")}` : "₹0",
      "Points Awarded": typeof s.points === "number" ? s.points : 5,
      Award: s.award || "Recognition",
    };
  });

  // 6. Dedicated Pending Suggestions Aging Analysis (Top Management POV)
  const now = new Date();
  const pendingSuggestions = suggestions.filter((s: any) => {
    const st = String(s.status || "").toLowerCase().trim();
    return st !== "implemented" && st !== "closed" && st !== "completed" && st !== "rejected" && st !== "dropped" && st !== "fake_closure";
  });

  const pendingRows = pendingSuggestions.map((s: any) => {
    const created = s.createdDate ? new Date(s.createdDate) : new Date();
    const agingDays = !isNaN(created.getTime())
      ? Math.max(0, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      "Suggestion Code": s.code || s.id,
      "Idea Title": s.title || s.suggestionTitle || "—",
      "Problem / Description": s.description || s.problem || "—",
      "Employee Name": s.employeeName || "Unknown",
      "Employee Code": s.employeeId || "—",
      "Submitting Department": s.department || "—",
      "Pending At Department / Level": s.current_departments?.name || s.current_department || s.department || "—",
      "Plant Unit": s.plant || "—",
      Location: s.location || "—",
      Category: s.category || s.suggestionType || "—",
      Priority: s.priority || "Medium",
      "Submitted Date": s.createdDate || "—",
      "Pending Aging (Days)": agingDays,
      "Current Status": s.status || "pending",
      "Expected Savings (INR)": s.expectedSaving || s.savings ? `₹${Number(s.expectedSaving || s.savings).toLocaleString("en-IN")}` : "₹0",
    };
  });

  // 7. Suggestions Complete Master Detail
  const suggestionRows = suggestions.map((s: any) => ({
    "Idea Code": s.code || s.id,
    "Idea Title": s.title || s.suggestionTitle || "—",
    Employee: s.employeeName || "Unknown",
    "Employee Code": s.employeeId || "—",
    "Submitting Department": s.department || "—",
    "Current / Implementing Dept": s.current_departments?.name || s.current_department || s.department || "—",
    Plant: s.plant || "—",
    Location: s.location || "—",
    Category: s.category || "—",
    Status: s.status,
    Priority: s.priority || "Medium",
    "Savings (INR)": s.savings ? `₹${Number(s.savings).toLocaleString("en-IN")}` : "₹0",
    Points: typeof s.points === "number" ? s.points : 0,
    "Submitted Date": s.createdDate || "—",
    "Completed Date": s.completedDate || "—",
  }));

  if (format === "xlsx") {
    const wb = XLSX.utils.book_new();

    // 1. Executive Summary Sheet
    const wsSum = XLSX.utils.json_to_sheet(summaryRows, { origin: "A3" });
    XLSX.utils.sheet_add_aoa(wsSum, [["PG GROUP - EXECUTIVE OVERVIEW KPI SUMMARY"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsSum as any)["!cols"] = [{ wch: 38 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsSum, "Executive Overview");

    // 2. Department Breakdown Sheet (with Pending count, Implemented count, Savings)
    const wsDept = XLSX.utils.json_to_sheet(deptRows.length > 0 ? deptRows : [{ Status: "No Departments In Active Data" }], { origin: "A3" });
    XLSX.utils.sheet_add_aoa(wsDept, [["DEPARTMENT PERFORMANCE & PENDING BREAKDOWN"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsDept as any)["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 24 }, { wch: 22 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsDept, "Department Breakdown");

    // 3. Implemented Suggestions Detailed Sheet
    const wsImpl = XLSX.utils.json_to_sheet(
      implementedRows.length > 0 ? implementedRows : [{ "Status": "No Implemented Suggestions In Active Filter" }],
      { origin: "A3" }
    );
    XLSX.utils.sheet_add_aoa(wsImpl, [["IMPLEMENTED SUGGESTIONS DETAILED AUDIT REGISTRY"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsImpl as any)["!cols"] = [
      { wch: 25 }, { wch: 35 }, { wch: 40 }, { wch: 22 }, { wch: 16 }, { wch: 22 }, { wch: 24 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 16 }, { wch: 18 }, { wch: 22 }, { wch: 15 }, { wch: 20 }
    ];
    XLSX.utils.book_append_sheet(wb, wsImpl, "Implemented Ideas");

    // 4. Pending Suggestions Detailed Sheet (with Aging Days)
    const wsPending = XLSX.utils.json_to_sheet(
      pendingRows.length > 0 ? pendingRows : [{ "Status": "No Pending Suggestions In Active Filter" }],
      { origin: "A3" }
    );
    XLSX.utils.sheet_add_aoa(wsPending, [["PENDING & IN-REVIEW SUGGESTIONS AGING REPORT"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsPending as any)["!cols"] = [
      { wch: 25 }, { wch: 35 }, { wch: 40 }, { wch: 22 }, { wch: 16 }, { wch: 22 }, { wch: 28 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 22 }
    ];
    XLSX.utils.book_append_sheet(wb, wsPending, "Pending Suggestions");

    // 5. Plant Performance Sheet
    const wsPlant = XLSX.utils.json_to_sheet(plantRows, { origin: "A3" });
    XLSX.utils.sheet_add_aoa(wsPlant, [["PLANT UNIT PERFORMANCE ANALYSIS"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsPlant as any)["!cols"] = [{ wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsPlant, "Plant Performance");

    // 6. Location Performance Sheet
    const wsLoc = XLSX.utils.json_to_sheet(locationRows, { origin: "A3" });
    XLSX.utils.sheet_add_aoa(wsLoc, [["LOCATION PERFORMANCE ANALYSIS"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsLoc as any)["!cols"] = [{ wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsLoc, "Location Performance");

    // 7. All Suggestions Master Registry
    const wsSug = XLSX.utils.json_to_sheet(suggestionRows, { origin: "A3" });
    XLSX.utils.sheet_add_aoa(wsSug, [["ALL SUGGESTIONS COMPLETE AUDIT REGISTRY"], [`Generated On: ${new Date().toLocaleString()}`]], { origin: "A1" });
    (wsSug as any)["!cols"] = [
      { wch: 25 }, { wch: 35 }, { wch: 22 }, { wch: 16 }, { wch: 22 }, { wch: 24 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 15 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsSug, "All Suggestions Master");

    XLSX.writeFile(wb, `${filename}_${timestamp()}.xlsx`);
  } else if (format === "csv") {
    let csvContent = `"PG GROUP - ESP EXECUTIVE AUDIT REPORT"\n"Generated On: ${new Date().toLocaleString()}"\n\n`;

    // 1. KPI Summary
    csvContent += `"=== 1. EXECUTIVE OVERVIEW KPI SUMMARY ==="\n`;
    csvContent += XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(summaryRows)) + "\n\n";

    // 2. Department Breakdown
    csvContent += `"=== 2. DEPARTMENT PERFORMANCE & PENDING BREAKDOWN ==="\n`;
    csvContent += XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(deptRows)) + "\n\n";

    // 3. Implemented Suggestions Registry
    csvContent += `"=== 3. IMPLEMENTED SUGGESTIONS DETAILED REGISTRY ==="\n`;
    csvContent += XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(implementedRows.length > 0 ? implementedRows : [{ Status: "No Implemented Ideas" }])) + "\n\n";

    // 4. Pending Suggestions Aging Report
    csvContent += `"=== 4. PENDING SUGGESTIONS AGING REPORT ==="\n`;
    csvContent += XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(pendingRows.length > 0 ? pendingRows : [{ Status: "No Pending Ideas" }])) + "\n\n";

    // 5. Plant Performance
    csvContent += `"=== 5. PLANT PERFORMANCE ANALYSIS ==="\n`;
    csvContent += XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(plantRows)) + "\n\n";

    // 6. Master Registry
    csvContent += `"=== 6. MASTER SUGGESTIONS REGISTRY ==="\n`;
    csvContent += XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(suggestionRows)) + "\n";

    download(new Blob([csvContent], { type: "text/csv;charset=utf-8" }), `${filename}_${timestamp()}.csv`);
  } else if (format === "pdf") {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ESP Executive Analytics & Performance Presentation Report", 40, 40);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated On: ${new Date().toLocaleString()}  |  Total Ideas Evaluated: ${totalCount}  |  Total Cost Savings: ₹${totalSavings.toLocaleString("en-IN")}`, 40, 55);

    // Section 1: KPI Summary Table
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 63, 122);
    doc.text("1. Executive Summary KPIs", 40, 75);

    autoTable(doc, {
      startY: 85,
      head: [["Metric Name", "Value"]],
      body: summaryRows.map((r) => [r.Metric, String(r.Value)]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [37, 63, 122], textColor: 255 },
      margin: { left: 40, right: 400 },
    });

    // Section 2: Department Performance & Pending Breakdown
    const finalY1 = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 63, 122);
    doc.text("2. Department Performance & Pending Breakdown", 40, finalY1);

    autoTable(doc, {
      startY: finalY1 + 10,
      head: [["Department", "Contributors", "Total Ideas", "Implemented", "Pending", "Impl Rate", "Savings (INR)", "Points"]],
      body: deptRows.map((r) => [
        r.Department,
        String(r["Active Contributors"]),
        String(r["Total Ideas Submitted"]),
        String(r["Implemented Ideas"]),
        String(r["Pending Review Ideas"]),
        r["Implementation Rate (%)"],
        r["Cost Savings (INR)"],
        String(r["Total Points"]),
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [37, 63, 122], textColor: 255 },
      margin: { left: 40, right: 40 },
    });

    // Section 3: Implemented Suggestions Table
    doc.addPage();
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 63, 122);
    doc.text("3. Implemented Suggestions Registry", 40, 40);

    autoTable(doc, {
      startY: 50,
      head: [["Code", "Title", "Employee", "Submitting Dept", "Implementing Dept", "Plant", "Turnaround", "Savings"]],
      body: implementedRows.slice(0, 50).map((r) => [
        r["Suggestion Code"],
        r["Idea Title"].slice(0, 22),
        r["Employee Name"],
        r["Submitting Department"],
        r["Implementing Department"],
        r["Plant Unit"],
        String(r["Turnaround (Days)"]),
        r["Verified Savings (INR)"],
      ]),
      styles: { fontSize: 7, cellPadding: 3 },
      headStyles: { fillColor: [37, 63, 122], textColor: 255 },
      margin: { left: 40, right: 40 },
    });

    // Section 4: Pending Suggestions Table
    doc.addPage();
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 63, 122);
    doc.text("4. Pending Suggestions Aging Report", 40, 40);

    autoTable(doc, {
      startY: 50,
      head: [["Code", "Title", "Employee", "Submitting Dept", "Pending At Dept", "Plant", "Priority", "Aging Days", "Status"]],
      body: pendingRows.slice(0, 50).map((r) => [
        r["Suggestion Code"],
        r["Idea Title"].slice(0, 22),
        r["Employee Name"],
        r["Submitting Department"],
        r["Pending At Department / Level"],
        r["Plant Unit"],
        r.Priority,
        String(r["Pending Aging (Days)"]),
        r["Current Status"],
      ]),
      styles: { fontSize: 7, cellPadding: 3 },
      headStyles: { fillColor: [37, 63, 122], textColor: 255 },
      margin: { left: 40, right: 40 },
    });

    doc.save(`${filename}_${timestamp()}.pdf`);
  }
}

