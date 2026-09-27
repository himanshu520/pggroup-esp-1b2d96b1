import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Zap,
  Building2,
  FileSpreadsheet,
  X,
  ExternalLink,
} from "lucide-react";
import { normalizeStatusCategory, type EmployeeSuggestion } from "@/lib/dummy-suggestions";
import { exportXLSX } from "@/lib/exports";

export type KpiCardId =
  | "suggestions"
  | "implemented"
  | "approved"
  | "review"
  | "savings"
  | "participation"
  | "active_emp"
  | "best_dept"
  | "speed";

interface KpiDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiId: KpiCardId | null;
  suggestions: EmployeeSuggestion[];
}

export function KpiDetailDialog({
  open,
  onOpenChange,
  kpiId,
  suggestions,
}: KpiDetailDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Determine modal metadata based on kpiId
  const meta = useMemo(() => {
    switch (kpiId) {
      case "implemented":
        return {
          title: "Implemented Suggestions Details",
          description: "All verified suggestions successfully executed across plants",
          icon: CheckCircle2,
          iconColor: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60",
          filterFn: (s: EmployeeSuggestion) =>
            normalizeStatusCategory(s.status) === "Implemented",
        };
      case "approved":
        return {
          title: "Approved & In-Progress Suggestions",
          description: "Suggestions approved by committees currently undergoing implementation",
          icon: Clock,
          iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-950/60",
          filterFn: (s: EmployeeSuggestion) =>
            normalizeStatusCategory(s.status) === "Approved",
        };
      case "review":
        return {
          title: "Under Review & Evaluation Suggestions",
          description: "Suggestions pending technical evaluation, PE review, or committee decision",
          icon: Search,
          iconColor: "text-sky-600 bg-sky-100 dark:bg-sky-950/60",
          filterFn: (s: EmployeeSuggestion) =>
            normalizeStatusCategory(s.status) === "Under Review" ||
            normalizeStatusCategory(s.status) === "Pending",
        };
      case "savings":
        return {
          title: "Verified Cost Savings & Benefit Breakdown",
          description: "Suggestions with calculated financial ROI and annual cost reduction",
          icon: DollarSign,
          iconColor: "text-teal-600 bg-teal-100 dark:bg-teal-950/60",
          filterFn: (s: EmployeeSuggestion) => (s.savings || 0) > 0 || (s.expectedSaving || 0) > 0,
        };
      case "participation":
        return {
          title: "Department Participation Breakdown",
          description: "Employee engagement and submission distribution across organizational units",
          icon: Users,
          iconColor: "text-purple-600 bg-purple-100 dark:bg-purple-950/60",
          isDepartmentAggregation: true,
        };
      case "active_emp":
        return {
          title: "Active Contributing Employees",
          description: "Directory of team members who generated suggestions with status counts",
          icon: Users,
          iconColor: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60",
          isEmployeeAggregation: true,
        };
      case "best_dept":
        return {
          title: "Department Rankings & Point Matrix",
          description: "Comprehensive leaderboard of all departments based on implementation points",
          icon: Award,
          iconColor: "text-orange-600 bg-orange-100 dark:bg-orange-950/60",
          isDepartmentAggregation: true,
        };
      case "speed":
        return {
          title: "Implementation Speed & Turnaround Analysis",
          description: "Completed suggestions ranked by implementation cycle time (in days)",
          icon: Zap,
          iconColor: "text-rose-600 bg-rose-100 dark:bg-rose-950/60",
          filterFn: (s: EmployeeSuggestion) =>
            normalizeStatusCategory(s.status) === "Implemented",
          sortByDays: true,
        };
      case "suggestions":
      default:
        return {
          title: "Total Suggestions Audit Directory",
          description: "Complete list of ideas matching active dashboard filters",
          icon: FileSpreadsheet,
          iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-950/60",
          filterFn: () => true,
        };
    }
  }, [kpiId]);

  // Filter raw suggestions according to KPI type and search query
  const relevantSuggestions = useMemo(() => {
    let list = suggestions;
    if (meta.filterFn) {
      list = list.filter(meta.filterFn);
    }
    if (statusFilter !== "all") {
      list = list.filter((s) => normalizeStatusCategory(s.status).toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.code?.toLowerCase().includes(q) ||
          s.suggestionTitle?.toLowerCase().includes(q) ||
          s.employeeName?.toLowerCase().includes(q) ||
          s.department?.toLowerCase().includes(q) ||
          s.plant?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }
    if (kpiId === "savings") {
      list = [...list].sort((a, b) => (b.savings || 0) - (a.savings || 0));
    }
    return list;
  }, [suggestions, meta, statusFilter, searchTerm, kpiId]);

  // Aggregation for Employee Directory
  const employeeDirectory = useMemo(() => {
    if (!meta.isEmployeeAggregation) return [];
    const map: Record<
      string,
      {
        id: string;
        name: string;
        code: string;
        department: string;
        plant: string;
        total: number;
        implemented: number;
        savings: number;
        points: number;
      }
    > = {};

    suggestions.forEach((s) => {
      const key = s.employeeId || s.employeeName || "Unknown";
      if (!map[key]) {
        map[key] = {
          id: key,
          name: s.employeeName || "Employee",
          code: s.employeeId || "—",
          department: s.department || "General",
          plant: s.plant || "—",
          total: 0,
          implemented: 0,
          savings: 0,
          points: 0,
        };
      }
      map[key].total += 1;
      if (normalizeStatusCategory(s.status) === "Implemented") {
        map[key].implemented += 1;
      }
      map[key].savings += s.savings || 0;
      map[key].points += s.points || 0;
    });

    let list = Object.values(map);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.plant.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.total - a.total);
  }, [suggestions, meta.isEmployeeAggregation, searchTerm]);

  // Aggregation for Department Breakdown
  const departmentBreakdown = useMemo(() => {
    if (!meta.isDepartmentAggregation) return [];
    const map: Record<
      string,
      {
        name: string;
        total: number;
        implemented: number;
        pending: number;
        underReview: number;
        rejected: number;
        savings: number;
        points: number;
        contributors: Set<string>;
      }
    > = {};

    suggestions.forEach((s) => {
      const d = s.department || "General";
      if (!map[d]) {
        map[d] = {
          name: d,
          total: 0,
          implemented: 0,
          pending: 0,
          underReview: 0,
          rejected: 0,
          savings: 0,
          points: 0,
          contributors: new Set(),
        };
      }
      map[d].total += 1;
      const cat = normalizeStatusCategory(s.status);
      if (cat === "Implemented") map[d].implemented += 1;
      else if (cat === "Pending") map[d].pending += 1;
      else if (cat === "Under Review" || cat === "Approved") map[d].underReview += 1;
      else if (cat === "Rejected") map[d].rejected += 1;

      map[d].savings += s.savings || 0;
      map[d].points += s.points || 0;
      if (s.employeeName) map[d].contributors.add(s.employeeName);
    });

    let list = Object.values(map).map((d) => ({
      ...d,
      activeContributors: d.contributors.size,
      implRate: d.total > 0 ? ((d.implemented / d.total) * 100).toFixed(1) : "0.0",
    }));

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }

    return list.sort((a, b) => b.points - a.points);
  }, [suggestions, meta.isDepartmentAggregation, searchTerm]);

  // KPI Quick Export
  const handleExport = () => {
    if (meta.isEmployeeAggregation) {
      exportXLSX(
        employeeDirectory,
        [
          { key: "code", header: "Employee Code" },
          { key: "name", header: "Employee Name" },
          { key: "department", header: "Department" },
          { key: "plant", header: "Plant" },
          { key: "total", header: "Total Suggestions" },
          { key: "implemented", header: "Implemented Count" },
          {
            key: "savings",
            header: "Total Savings (INR)",
            format: (r) => `₹${r.savings.toLocaleString("en-IN")}`,
          },
          { key: "points", header: "Total Points" },
        ],
        `ESP_Employees_${kpiId || "report"}`
      );
    } else if (meta.isDepartmentAggregation) {
      exportXLSX(
        departmentBreakdown,
        [
          { key: "name", header: "Department" },
          { key: "activeContributors", header: "Active Contributors" },
          { key: "total", header: "Total Suggestions" },
          { key: "implemented", header: "Implemented Count" },
          { key: "pending", header: "Pending Review Count" },
          { key: "underReview", header: "Under Evaluation Count" },
          { key: "rejected", header: "Rejected Count" },
          { key: "implRate", header: "Implementation Rate (%)", format: (r) => `${r.implRate}%` },
          {
            key: "savings",
            header: "Total Cost Savings (INR)",
            format: (r) => `₹${r.savings.toLocaleString("en-IN")}`,
          },
          { key: "points", header: "Total Points" },
        ],
        `ESP_Departments_${kpiId || "report"}`
      );
    } else {
      exportXLSX(
        relevantSuggestions,
        [
          { key: "code", header: "Suggestion Code" },
          { key: "suggestionTitle", header: "Title" },
          { key: "employeeName", header: "Employee Name" },
          { key: "employeeId", header: "Employee Code" },
          { key: "department", header: "Submitting Dept" },
          { key: "plant", header: "Plant Unit" },
          { key: "location", header: "Location" },
          { key: "category", header: "Category" },
          { key: "status", header: "Status" },
          {
            key: "savings",
            header: "Cost Savings (INR)",
            format: (r) => `₹${(r.savings || 0).toLocaleString("en-IN")}`,
          },
          { key: "createdDate", header: "Submitted Date" },
          { key: "completedDate", header: "Completed Date", format: (r) => r.completedDate || "—" },
        ],
        `ESP_KPI_Details_${kpiId || "report"}`
      );
    }
  };

  const Icon = meta.icon;
  const totalCount = meta.isEmployeeAggregation
    ? employeeDirectory.length
    : meta.isDepartmentAggregation
    ? departmentBreakdown.length
    : relevantSuggestions.length;

  const totalSumSavings = useMemo(() => {
    return relevantSuggestions.reduce((acc, s) => acc + (s.savings || 0), 0);
  }, [relevantSuggestions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl! w-[95vw]! max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${meta.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {meta.title}
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {totalCount} Records
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {meta.description}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-xs font-bold gap-1.5 h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" /> Export Excel
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by code, title, employee, department or plant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-9 text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-lg"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!meta.isEmployeeAggregation && !meta.isDepartmentAggregation && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-muted-foreground">Filter:</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                {["all", "implemented", "approved", "under review", "rejected"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-all ${
                      statusFilter === st
                        ? "bg-white dark:bg-slate-700 text-primary shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {totalSumSavings > 0 && !meta.isEmployeeAggregation && !meta.isDepartmentAggregation && (
            <div className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
              Total Savings: ₹{(totalSumSavings / 100000).toFixed(2)} Lacs
            </div>
          )}
        </div>

        {/* Scrollable Table View */}
        <div className="flex-1 overflow-auto p-4 sm:p-5">
          {meta.isEmployeeAggregation ? (
            /* Employee Contributor Table */
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Employee Name</th>
                    <th className="py-2.5 px-3">Employee Code</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Plant Unit</th>
                    <th className="py-2.5 px-3 text-center">Total Ideas</th>
                    <th className="py-2.5 px-3 text-center">Implemented</th>
                    <th className="py-2.5 px-3 text-right">Cost Savings</th>
                    <th className="py-2.5 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {employeeDirectory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                        No active employee contributors found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    employeeDirectory.map((emp, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{emp.name}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">{emp.code}</td>
                        <td className="py-2.5 px-3">{emp.department}</td>
                        <td className="py-2.5 px-3">{emp.plant}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-600">{emp.total}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{emp.implemented}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          {emp.savings > 0 ? `₹${(emp.savings / 100000).toFixed(2)}L` : "₹0"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-amber-600">{emp.points}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : meta.isDepartmentAggregation ? (
            /* Department Breakdown Table */
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Contributors</th>
                    <th className="py-2.5 px-3 text-center">Total Ideas</th>
                    <th className="py-2.5 px-3 text-center">Implemented</th>
                    <th className="py-2.5 px-3 text-center">Pending Review</th>
                    <th className="py-2.5 px-3 text-center">Impl. Rate</th>
                    <th className="py-2.5 px-3 text-right">Cost Savings</th>
                    <th className="py-2.5 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {departmentBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                        No departments found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    departmentBreakdown.map((dept, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{dept.name}</td>
                        <td className="py-2.5 px-3 text-center">{dept.activeContributors}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-600">{dept.total}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{dept.implemented}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-600">{dept.pending}</td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] ${
                              Number(dept.implRate) >= 50
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {dept.implRate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          {dept.savings > 0 ? `₹${(dept.savings / 100000).toFixed(2)}L` : "₹0"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-amber-600">{dept.points}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Suggestions Master Table */
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Suggestion Title</th>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Plant Unit</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Savings (INR)</th>
                    <th className="py-2.5 px-3 text-center">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {relevantSuggestions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-muted-foreground text-xs">
                        No suggestions found matching active criteria.
                      </td>
                    </tr>
                  ) : (
                    relevantSuggestions.map((s, i) => {
                      const statusNorm = normalizeStatusCategory(s.status);
                      const isImpl = statusNorm === "Implemented";
                      const isPending = statusNorm === "Pending" || statusNorm === "Under Review";
                      const isApproved = statusNorm === "Approved";

                      return (
                        <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-primary">{s.code}</td>
                          <td className="py-2.5 px-3 max-w-[200px]">
                            <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                              {s.suggestionTitle}
                            </span>
                            {s.description && (
                              <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {s.description}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-bold block">{s.employeeName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{s.employeeId}</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">{s.department}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">{s.plant}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                              {s.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                                isImpl
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                                  : isApproved
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                                  : isPending
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                            {s.savings > 0 ? `₹${s.savings.toLocaleString("en-IN")}` : "₹0"}
                          </td>
                          <td className="py-2.5 px-3 text-center text-muted-foreground text-[11px] whitespace-nowrap">
                            {s.createdDate}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {totalCount} records from active live database</span>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-7 text-xs font-bold">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
