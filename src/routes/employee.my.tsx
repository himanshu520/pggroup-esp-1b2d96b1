import { createFileRoute, redirect } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, BudgetBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Search, LayoutGrid, List } from "lucide-react";
import { STATUS_LABEL, getRowColorForStatus, getHistoryActionText, getEffectiveHistory } from "@/lib/statuses";
import { useT } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/employee/my")({
  beforeLoad: () => { throw redirect({ to: "/employee", search: { section: "my" } as any }); },
  component: () => null,
});

export function MySuggestions() {
  const { data: session } = useSession();
  const t = useT();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["my-suggestions", session?.employee?.id],
    enabled: !!session?.employee?.id,
    queryFn: async () => (await supabase.from("suggestions").select("*, categories(name)").eq("employee_id", session!.employee!.id).order("created_at", { ascending: false })).data ?? [],
  });

  const TERMINAL = new Set(["approved","implemented","rejected","closed"]);
  const filtered = data.filter((s: any) => {
    if (s.deleted_at) return false;

    if (status === "under_review") {
      if (TERMINAL.has(s.status)) return false;
    } else if (status && s.status !== status) return false;
    if (q && !(`${s.title} ${s.code}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <EmployeeShell>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <PageHeader title={t("my_title")} description={t("my_desc")} />
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/50 p-1 rounded-md border border-border">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="w-3.5 h-3.5 mr-1.5" /> Card
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setViewMode("table")}
            >
              <List className="w-3.5 h-3.5 mr-1.5" /> Table
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input placeholder={t("my_search")} value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">{t("my_all_statuses")}</option>
          <option value="under_review">{t("my_under_review")}</option>
          <option value="approved">{t("status_approved")}</option>
          <option value="implemented">{t("status_implemented")}</option>
          <option value="rejected">{t("status_rejected")}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">{t("my_loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-12 border border-dashed border-border rounded-lg">{t("my_empty")}</div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s: any) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              className={`text-left flex flex-col justify-between p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all ${getRowColorForStatus(s.status)}`}
            >
              <div className="flex items-start justify-between gap-3 w-full mb-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono font-semibold text-primary">{s.code}</div>
                  <div className="mt-1 font-semibold text-sm line-clamp-2 leading-tight">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 truncate">{s.categories?.name ?? "—"} · {new Date(s.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-auto w-full pt-3 border-t border-border/50">
                <StatusBadge status={s.status} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left">
                {["Code", "Title", "Category", "Status", "Created"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s: any) => (
                <tr
                  key={s.id}
                  className={`cursor-pointer transition-colors ${getRowColorForStatus(s.status)}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-primary w-24">{s.code}</td>
                  <td className="px-4 py-2.5 max-w-[200px] sm:max-w-xs truncate font-medium">{s.title}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground truncate max-w-[120px]">{s.categories?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 w-32"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs w-24 hidden md:table-cell">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SuggestionDetailsDialog
        suggestionId={selectedId}
        onClose={() => setSelectedId(null)}
        onChanged={() => refetch()}
      />
    </EmployeeShell>
  );
}

function SuggestionDetailsDialog({
  suggestionId,
  onClose,
  onChanged,
}: {
  suggestionId: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const t = useT();
  const { data, isLoading } = useQuery({
    queryKey: ["my-suggestion-detail", suggestionId],
    enabled: !!suggestionId,
    queryFn: async () => {
      const [{ data: s }, { data: h }] = await Promise.all([
        supabase
          .from("suggestions")
          .select("*, categories(name), departments!suggestions_department_id_fkey(name), plants(name), locations(location)")
          .eq("id", suggestionId!)
          .maybeSingle(),
        supabase
          .from("suggestion_history")
          .select("*, from_dept:departments!suggestion_history_from_department_id_fkey(name), to_dept:departments!suggestion_history_to_department_id_fkey(name)")
          .eq("suggestion_id", suggestionId!)
          .order("created_at"),
      ]);
      return { s, h: h ?? [] };
    },
  });

  const s = data?.s as any;
  const history = getEffectiveHistory(data?.h, s);

  return (
    <Dialog open={!!suggestionId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{s?.title ?? "…"}</DialogTitle>
          <DialogDescription className="font-mono text-xs">{s?.code}</DialogDescription>
        </DialogHeader>

        {isLoading || !s ? (
          <div className="text-sm text-muted-foreground py-6">{t("my_loading")}</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={s.status} />
              {s.budget_tier && <BudgetBadge tier={s.budget_tier} />}
              <span className="text-xs text-muted-foreground">
                {t("submitted_on")} {new Date(s.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-sm border-t border-border pt-3">
              <Meta label={t("category")} value={s.categories?.name ? t(s.categories.name) : "—"} />
              <Meta label="Department" value={s.departments?.name ?? "—"} />
              <Meta label="Plant" value={s.plants?.name ?? "—"} />
              <Meta label="Location" value={s.locations?.location ?? "—"} />
            </div>

            <div className="border-t border-border pt-3 space-y-3">
              <Section title={t("problem")} body={s.problem} />
              <Section title={t("suggested_method")} body={s.suggested_method} />
              <Section title={t("expected_benefits")} body={s.expected_benefits} />
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-sm font-medium mb-3">{t("timeline")}</div>
              <ol className="space-y-3 relative">
                {history.map((h: any, i: number) => (
                  <li key={h.id} className="relative pl-6">
                    <div className="absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" />
                    {i < history.length - 1 && (
                      <div className="absolute left-2 top-3 bottom-[-0.75rem] w-px bg-border" />
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(h.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm font-medium">
                      {getHistoryActionText(h)}
                    </div>
                    {h.remarks && (
                      <div className="text-xs text-muted-foreground mt-0.5">{h.remarks}</div>
                    )}
                  </li>
                ))}
                {history.length === 0 && (
                  <li className="text-xs text-muted-foreground">{t("no_activity")}</li>
                )}
              </ol>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-end items-center sm:justify-end w-full">
          <Button variant="outline" onClick={onClose}>{t("close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 break-all">{value}</div>
    </div>
  );
}
function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-1 text-sm whitespace-pre-wrap">{body}</div>
    </div>
  );
}
