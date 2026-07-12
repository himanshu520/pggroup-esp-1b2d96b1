import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession, isSuggestionAccessible } from "@/lib/session";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Search, ExternalLink, Loader2, LayoutGrid, List } from "lucide-react";
import { STATUS_LABEL, PRIORITY_LABEL, getRowColorForStatus } from "@/lib/statuses";
import { ExportMenu } from "@/components/export-menu";

export const Route = createFileRoute("/admin/suggestions/")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "suggestions" } as any }); },
  component: () => null,
});

export function SuggestionsList() {
  const { data: sess } = useSession();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const isPEOrAdmin = useMemo(() => {
    if (!sess?.roles) return false;
    return sess.roles.some((r) => r.role === "pe_user" || r.role === "super_admin" || r.role === "corporate_admin");
  }, [sess?.roles]);

  const { data = [] } = useQuery({
    queryKey: ["admin-suggestions", status],
    queryFn: async () => {
      let query = supabase.from("suggestions").select("*, employees(name, employee_code), categories(name), departments!suggestions_department_id_fkey(name), current_departments:departments!suggestions_current_department_id_fkey(name), plants(name)").order("created_at", { ascending: false }).limit(500);
      if (status === "under_review") {
        query = query.not("status", "in", "(approved,implemented,rejected,closed,fake_closure)");
      } else if (status) {
        query = query.eq("status", status as any);
      }
      const { data } = await query;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!q) return data;
    const lowq = q.toLowerCase();
    return data.filter((s: any) => 
      s.title?.toLowerCase().includes(lowq) || 
      s.code?.toLowerCase().includes(lowq) || 
      s.employees?.name?.toLowerCase().includes(lowq)
    );
  }, [data, q]);

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
                { key: "priority", header: "Priority", format: (s: any) => PRIORITY_LABEL[s.priority as keyof typeof PRIORITY_LABEL] ?? s.priority },
                { key: "status", header: "Status", format: (s: any) => STATUS_LABEL[s.status as keyof typeof STATUS_LABEL] ?? s.status },
                { key: "actual_cost", header: "Actual cost", format: (s: any) => Number(s.actual_cost ?? 0) },
                { key: "created_at", header: "Created", format: (s: any) => new Date(s.created_at).toLocaleDateString() },
                { key: "completed_at", header: "Completed", format: (s: any) => (s.completed_at ? new Date(s.completed_at).toLocaleDateString() : "") },
              ]}
              filename="suggestions"
              title="Suggestions Register"
              subtitle={status ? `Filtered by status: ${status === "under_review" ? "Under Review" : STATUS_LABEL[status as keyof typeof STATUS_LABEL]}` : "All statuses"}
            />
          </div>
        }
      />
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input placeholder="Search by code, title, or employee" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="border border-input bg-background rounded-md px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="under_review">Under Review</option>
          <option value="approved">{STATUS_LABEL.approved}</option>
          <option value="implemented">{STATUS_LABEL.implemented}</option>
          <option value="rejected">{STATUS_LABEL.rejected}</option>
        </select>
      </div>

      {viewMode === "table" ? (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left">
                {["Code","Title","Employee","Department","Priority","Status","Created"].map((h) => (
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
                  <td className="px-4 py-2.5 max-w-xs truncate">{s.title}</td>
                  <td className="px-4 py-2.5 text-xs">
                    {isPEOrAdmin ? (
                      <>
                        {s.employees?.name} <span className="text-muted-foreground">({s.employees?.employee_code})</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs">{s.current_departments?.name || s.departments?.name}</td>
                  <td className="px-4 py-2.5"><PriorityBadge priority={s.priority} /></td>
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
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">{s.title}</h3>
              
              <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                <div className="truncate">
                  {isPEOrAdmin ? (
                    <span className="font-medium text-foreground/80">{s.employees?.name} <span className="font-normal opacity-70">({s.employees?.employee_code})</span></span>
                  ) : "—"}
                </div>
                <div className="truncate">{s.current_departments?.name || s.departments?.name}</div>
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                <StatusBadge status={s.status} />
                <PriorityBadge priority={s.priority} />
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
    return sess.roles.some((r) => r.role === "pe_user" || r.role === "super_admin" || r.role === "corporate_admin");
  }, [sess?.roles]);

  const { data: sug, isLoading } = useQuery({
    enabled: open,
    queryKey: ["suggestion-preview", id],
    queryFn: async () =>
      (
        await supabase
          .from("suggestions")
          .select(
            "*, employees(id, name, employee_code, email, mobile, gender, designation, department_id, plant_id, location_id, departments(name), plants(name), locations(location)), categories(name), departments!suggestions_department_id_fkey(name), current_departments:departments!suggestions_current_department_id_fkey(name), plants(name), locations(location)",
          )
          .eq("id", id!)
          .maybeSingle()
      ).data,
  });
  const { data: history = [] } = useQuery({
    enabled: open,
    queryKey: ["suggestion-preview-history", id],
    queryFn: async () =>
      (await supabase.from("suggestion_history").select("*").eq("suggestion_id", id!).order("created_at")).data ?? [],
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
                <PriorityBadge priority={sug.priority} />
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
                  <Meta label="Name" value={sug.employees?.name ?? "—"} />
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
              <ol className="space-y-3">
                {history.length === 0 ? (
                  <li className="text-xs text-muted-foreground">No activity yet.</li>
                ) : (
                  history.map((h: any) => (
                    <li key={h.id} className="relative pl-4 border-l-2 border-border">
                      <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                      <div className="text-sm font-medium">
                        {STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL] ?? h.to_status}
                      </div>
                      {h.remarks && <div className="text-xs text-muted-foreground mt-0.5">{h.remarks}</div>}
                    </li>
                  ))
                )}
              </ol>
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