import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession, isSuggestionAccessible } from "@/lib/session";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, ExternalLink, Loader2, LayoutGrid, List, Star, Trophy, Medal, Award, Clock, CheckCircle2, XCircle, Filter, Calendar, X } from "lucide-react";
import { STATUS_LABEL, getRowColorForStatus, getHistoryActionText, getEffectiveHistory } from "@/lib/statuses";
import { ExportMenu } from "@/components/export-menu";
import { EmployeeBadges } from "@/components/employee-badges";
import { cn } from "@/lib/utils";

const getDeptDisplay = (dept: any) => {
  if (!dept) return "—";
  return dept.name + (dept.code ? ` (${dept.code})` : "");
};

const getBestSuggestionIndicator = (bestSuggestions: any) => {
  if (!bestSuggestions) return null;
  const item = Array.isArray(bestSuggestions) ? bestSuggestions[0] : bestSuggestions;
  if (!item) return null;
  
  if (item.category === "month") {
    return { color: "text-emerald-500 fill-emerald-500", title: "Best Suggestion of the Month" };
  } else if (item.category === "year") {
    return { color: "text-amber-500 fill-amber-500", title: "Best Suggestion of the Year" };
  } else if (item.category === "foolproofing") {
    return { color: "text-blue-500 fill-blue-500", title: "Best Foolproofing Suggestion" };
  }
  return { color: "text-amber-500 fill-amber-500", title: "Best Suggestion" };
};

export const Route = createFileRoute("/admin/suggestions/")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "suggestions" } as any }); },
  component: () => null,
});

export function SuggestionsList() {
  const { data: sess } = useSession();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateType, setDateType] = useState<"created_at" | "completed_at">("created_at");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("card");

  const isPEOrAdmin = useMemo(() => {
    if (!sess?.roles) return false;
    return sess.roles.some((r) => r.role === "pe_user" || r.role === "super_admin" || r.role === "corporate_admin" || r.role === "admin");
  }, [sess?.roles]);

  const { data = [] } = useQuery({
    queryKey: ["admin-suggestions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("suggestions")
        .select("*, employees(name, employee_code), categories(name), departments!suggestions_department_id_fkey(name, code), current_departments:departments!suggestions_current_department_id_fkey(name, code), plants(name), best_suggestions(category)")
        .order("created_at", { ascending: false })
        .limit(5000);
      return data ?? [];
    },
  });

  const counts = useMemo(() => {
    const total = data.length;
    const submitted = data.filter((s: any) => !["implemented", "closed", "rejected", "fake_closure"].includes(s.status)).length;
    const implemented = data.filter((s: any) => s.status === "implemented" || s.status === "closed").length;
    const fake = data.filter((s: any) => s.status === "fake_closure" || s.status === "rejected" || s.status === "dropped").length;
    return { total, submitted, implemented, fake };
  }, [data]);

  const isMD = sess?.isMD || sess?.roles?.some(r => r.role === "md");

  const filtered = useMemo(() => {
    return data.filter((s: any) => {
      // MD role can only view implemented / closed suggestions
      if (isMD && s.status !== "implemented" && s.status !== "closed") {
        return false;
      }

      if (q) {
        const lowq = q.toLowerCase();
        const matchesTitle = s.title?.toLowerCase().includes(lowq);
        const matchesCode = s.code?.toLowerCase().includes(lowq);
        const matchesEmp = s.employees?.name?.toLowerCase().includes(lowq);
        const matchesDept = (s.current_departments?.name?.toLowerCase().includes(lowq) || s.departments?.name?.toLowerCase().includes(lowq));
        const matchesDeptCode = (s.current_departments?.code?.toLowerCase().includes(lowq) || s.departments?.code?.toLowerCase().includes(lowq));
        if (!matchesTitle && !matchesCode && !matchesEmp && !matchesDept && !matchesDeptCode) {
          return false;
        }
      }

      if (statusFilter === "submitted") {
        if (["implemented", "closed", "rejected", "fake_closure"].includes(s.status)) return false;
      } else if (statusFilter === "implemented") {
        if (s.status !== "implemented" && s.status !== "closed") return false;
      } else if (statusFilter === "fake_closure") {
        if (!["fake_closure", "rejected", "dropped"].includes(s.status)) return false;
      } else if (statusFilter && statusFilter !== "all") {
        if (s.status !== statusFilter) return false;
      }

      // Date Range Filter (Submission Date vs Implementation Date)
      const targetDateStr = dateType === "created_at" ? s.created_at : s.completed_at;
      if (startDate || endDate) {
        if (!targetDateStr) return false;
        const targetDate = new Date(targetDateStr).toISOString().split("T")[0];
        if (startDate && targetDate < startDate) return false;
        if (endDate && targetDate > endDate) return false;
      }

      return true;
    });
  }, [data, q, statusFilter, dateType, startDate, endDate]);

  const exportSubtitle = useMemo(() => {
    const parts: string[] = [];
    if (statusFilter === "submitted") parts.push("Status: Submitted / In-Progress");
    else if (statusFilter === "implemented") parts.push("Status: Implemented");
    else if (statusFilter === "fake_closure") parts.push("Status: Fake Closures / Rejected");

    if (startDate || endDate) {
      const typeLabel = dateType === "created_at" ? "Submitted Date" : "Implemented Date";
      const range = `${startDate || "Beginning"} to ${endDate || "Present"}`;
      parts.push(`${typeLabel}: ${range}`);
    }

    return parts.length > 0 ? parts.join(" | ") : "All Suggestions Register";
  }, [statusFilter, dateType, startDate, endDate]);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader 
        title="Suggestions" 
        description="All suggestions recorded in the system." 
        actions={
          <div className="flex items-center gap-2">
            <div className="flex bg-muted/50 p-1 rounded-md border border-border">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setViewMode("table")}
              >
                <List className="w-3.5 h-3.5 mr-1.5" /> Table
              </Button>
              <Button
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="w-3.5 h-3.5 mr-1.5" /> Card
              </Button>
            </div>
            <ExportMenu 
              data={filtered}
              columns={[
                { key: "code", header: "Code" },
                { key: "title", header: "Title" },
                { key: "employee", header: "Employee", format: (s: any) => `${s.employees?.name} (${s.employees?.employee_code})` },
                { key: "department", header: "Department", format: (s: any) => s.current_departments?.name || s.departments?.name },
                { key: "plant", header: "Plant", format: (s: any) => s.plants?.name ?? "" },
                { key: "category", header: "Category", format: (s: any) => s.categories?.name ?? "" },
                { key: "status", header: "Status", format: (s: any) => STATUS_LABEL[s.status as keyof typeof STATUS_LABEL] ?? s.status },
                { key: "expected_saving", header: "Expected Saving (₹)", format: (s: any) => Number(s.expected_saving ?? 0) },
                { key: "actual_cost", header: "Verified Actual Cost (₹)", format: (s: any) => Number(s.actual_cost ?? 0) },
                { key: "created_at", header: "Submission Date", format: (s: any) => new Date(s.created_at).toLocaleDateString() },
                { key: "completed_at", header: "Implementation Date", format: (s: any) => (s.completed_at ? new Date(s.completed_at).toLocaleDateString() : "—") },
              ]}
              filename={`suggestions_${statusFilter}_${dateType}`}
              title="Suggestions Register Export"
              subtitle={exportSubtitle}
            />
          </div>
        }
      />

      {/* FILTER BAR 1: SEARCH & QUICK STATUS BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input placeholder="Search by code, title, or employee" className="pl-8 text-xs" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            className="h-8 px-3 text-xs font-semibold"
            onClick={() => setStatusFilter("all")}
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            All ({counts.total})
          </Button>
          <Button
            variant={statusFilter === "submitted" ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-semibold",
              statusFilter === "submitted" ? "bg-amber-600 hover:bg-amber-700 text-white" : "border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
            )}
            onClick={() => setStatusFilter("submitted")}
          >
            <Clock className="w-3.5 h-3.5 mr-1" />
            Submitted / Pending ({counts.submitted})
          </Button>
          <Button
            variant={statusFilter === "implemented" ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-semibold",
              statusFilter === "implemented" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
            )}
            onClick={() => setStatusFilter("implemented")}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Implemented ({counts.implemented})
          </Button>
          <Button
            variant={statusFilter === "fake_closure" ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-semibold",
              statusFilter === "fake_closure" ? "bg-red-600 hover:bg-red-700 text-white" : "border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-500/10"
            )}
            onClick={() => setStatusFilter("fake_closure")}
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Fake / Rejected ({counts.fake})
          </Button>
        </div>
      </div>

      {/* FILTER BAR 2: DATE TYPE & RANGE FILTERS */}
      <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-card border border-border rounded-lg mb-4 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-foreground shrink-0">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Date Filter:</span>
        </div>

        {/* Date Type Mode: Submission vs Implementation Date */}
        <select
          value={dateType}
          onChange={(e) => setDateType(e.target.value as "created_at" | "completed_at")}
          className="h-8 border border-input bg-background rounded-md px-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="created_at">📅 Submission Date (Created)</option>
          <option value="completed_at">✅ Implementation Date (Completed)</option>
        </select>

        {/* Start Date */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground font-medium">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-8 border border-input bg-background rounded-md px-2 text-xs cursor-pointer"
          />
        </div>

        {/* End Date */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground font-medium">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-8 border border-input bg-background rounded-md px-2 text-xs cursor-pointer"
          />
        </div>

        {/* Reset Date Filters */}
        {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => { setStartDate(""); setEndDate(""); }}
          >
            <X className="w-3.5 h-3.5 mr-1" /> Clear Dates
          </Button>
        )}

        <div className="ml-auto text-[11px] text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of {data.length} entries
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left">
                {["Code","Title","Employee","Department","Status","Created"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">No suggestions match your filters.</td></tr>
              ) : filtered.map((s: any) => (
                <tr
                  key={s.id}
                  className={`transition-colors cursor-pointer ${getRowColorForStatus(s.status)}`}
                  onClick={() => setPreviewId(s.id)}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{s.code}</td>
                  <td className="px-4 py-2.5 max-w-xs truncate">
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const ind = getBestSuggestionIndicator(s.best_suggestions);
                        return ind ? <Trophy className={`w-3.5 h-3.5 shrink-0 ${ind.color}`} title={ind.title} /> : null;
                      })()}
                      <span className="truncate">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs font-medium">
                    {isPEOrAdmin ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{s.employees?.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">({s.employees?.employee_code})</span>
                        <EmployeeBadges employeeId={s.employee_id} />
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs">{getDeptDisplay(s.current_departments || s.departments)}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s: any) => (
            <div
              key={s.id}
              onClick={() => setPreviewId(s.id)}
              className={`flex flex-col gap-3 p-4 rounded-xl border border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${getRowColorForStatus(s.status)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-primary">{s.code}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
                {(() => {
                  const ind = getBestSuggestionIndicator(s.best_suggestions);
                  return ind ? <Trophy className={`w-3.5 h-3.5 inline mr-1.5 align-text-bottom ${ind.color}`} title={ind.title} /> : null;
                })()}
                {s.title}
              </h3>
              
              <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                <div className="truncate flex items-center gap-1.5 flex-wrap">
                  {isPEOrAdmin ? (
                    <>
                      <span className="font-semibold text-foreground/80 truncate max-w-[120px]">{s.employees?.name}</span>
                      <EmployeeBadges employeeId={s.employee_id} />
                    </>
                  ) : "—"}
                </div>
                <div className="truncate">{getDeptDisplay(s.current_departments || s.departments)}</div>
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground border rounded-lg bg-card">
              No suggestions match your filters.
            </div>
          )}
        </div>
      )}

      <SuggestionPreviewDialog id={previewId} onClose={() => setPreviewId(null)} />
    </AppShell>
  );
}

function SuggestionPreviewDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [navigating, setNavigating] = useState(false);
  const open = !!id;
  const { data: sess } = useSession();
  const isPEOrAdmin = useMemo(() => {
    if (!sess?.roles) return false;
    return sess.roles.some((r) => r.role === "pe_user" || r.role === "super_admin" || r.role === "corporate_admin" || r.role === "admin");
  }, [sess?.roles]);

  const { data: sug, isLoading } = useQuery({
    enabled: open,
    queryKey: ["suggestion-preview", id],
    queryFn: async () =>
      (
        await supabase
          .from("suggestions")
          .select(
            "*, employees(id, name, employee_code, email, mobile, gender, designation, department_id, plant_id, location_id, departments(name, code), plants(name), locations(location)), categories(name), departments!suggestions_department_id_fkey(name, code), current_departments:departments!suggestions_current_department_id_fkey(name, code), plants(name), locations(location)",
          )
          .eq("id", id!)
          .maybeSingle()
      ).data,
  });
  const { data: history = [] } = useQuery({
    enabled: open,
    queryKey: ["suggestion-preview-history", id],
    queryFn: async () =>
      (
        await supabase
          .from("suggestion_history")
          .select("*, from_dept:departments!suggestion_history_from_department_id_fkey(name, code), to_dept:departments!suggestion_history_to_department_id_fkey(name, code)")
          .eq("suggestion_id", id!)
          .order("created_at")
      ).data ?? [],
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {sug?.title ?? (isLoading ? "Loading…" : "Suggestion")}
            {sug && (
              <>
                <StatusBadge status={sug.status} />
              </>
            )}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {sug?.code ?? ""}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 text-sm text-muted-foreground text-center">Loading suggestion…</div>
        ) : !sug ? (
          <div className="py-6 text-sm text-muted-foreground text-center">Not found.</div>
        ) : (
          <div className="space-y-4 py-2">
            {isPEOrAdmin && (
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="text-xs uppercase font-bold text-muted-foreground mb-3">Employee Information</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <Meta 
                    label="Name" 
                    value={
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{sug.employees?.name ?? "—"}</span>
                        <EmployeeBadges employeeId={sug.employee_id} />
                      </div>
                    } 
                  />
                  <Meta label="Employee ID" value={sug.employees?.employee_code ?? "—"} />
                  <Meta label="Email" value={sug.employees?.email ?? "—"} />
                  <Meta label="Mobile" value={sug.employees?.mobile ?? "—"} />
                  <Meta label="Gender" value={sug.employees?.gender ? (sug.employees.gender.charAt(0).toUpperCase() + sug.employees.gender.slice(1).replace(/_/g, " ")) : "—"} />
                  <Meta label="Designation" value={sug.employees?.designation ?? "—"} />
                  <Meta label="Base Department" value={sug.employees?.departments?.name ?? "—"} />
                  <Meta label="Base Plant" value={sug.employees?.plants?.name ?? "—"} />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-4 gap-3 text-sm border-t border-border pt-3">
              <Meta label="Category" value={sug.categories?.name} />
              <Meta label="Owner department" value={sug.current_departments?.name || sug.departments?.name} />
              <Meta label="Plant" value={sug.plants?.name} />
              <Meta label="Location" value={sug.locations?.location} />
            </div>

            <Section title="Problem">{sug.problem}</Section>
            <Section title="Current method">{sug.current_method}</Section>
            <Section title="Suggested method">{sug.suggested_method}</Section>
            <Section title="Expected benefits">{sug.expected_benefits}</Section>

            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Timeline</div>
              {(() => {
                const effectiveHistory = getEffectiveHistory(history, sug);
                return (
                  <ol className="space-y-3">
                    {effectiveHistory.length === 0 ? (
                      <li className="text-xs text-muted-foreground">No activity yet.</li>
                    ) : (
                      effectiveHistory.map((h: any) => (
                        <li key={h.id} className="relative pl-4 border-l-2 border-border">
                          <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                          <div className="text-sm font-medium">
                            {getHistoryActionText(h)}
                          </div>
                          {h.remarks && <div className="text-xs text-muted-foreground mt-0.5">{h.remarks}</div>}
                        </li>
                      ))
                    )}
                  </ol>
                );
              })()}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={navigating}>Close</Button>
          {sug && (
            <Button asChild aria-disabled={navigating}>
              <Link
                to="/admin"
                search={{ section: "suggestion", id: sug.id } as any}
                onClick={(e) => {
                  if (navigating) {
                    e.preventDefault();
                    return;
                  }
                  setNavigating(true);
                  onClose();
                }}
                style={navigating ? { pointerEvents: "none", opacity: 0.7 } : undefined}
              >
                {navigating ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                )}
                {navigating ? "Opening…" : "Open full workflow"}
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
      <div className="text-sm whitespace-pre-wrap">{children}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-sm break-all">{value || "—"}</div>
    </div>
  );
}