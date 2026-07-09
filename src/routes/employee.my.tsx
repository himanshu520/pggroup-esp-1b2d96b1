import { createFileRoute, redirect } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { STATUS_LABEL } from "@/lib/statuses";
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

  const { data = [], isLoading } = useQuery({
    queryKey: ["my-suggestions", session?.employee?.id],
    enabled: !!session?.employee?.id,
    queryFn: async () => (await supabase.from("suggestions").select("*, categories(name)").eq("employee_id", session!.employee!.id).order("created_at", { ascending: false })).data ?? [],
  });

  const TERMINAL = new Set(["approved","implemented","rejected","closed","fake_closure"]);
  const filtered = data.filter((s: any) => {
    if (status === "under_review") {
      if (TERMINAL.has(s.status)) return false;
    } else if (status && s.status !== status) return false;
    if (q && !(`${s.title} ${s.code}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <EmployeeShell>
      <PageHeader title={t("my_title")} description={t("my_desc")} />
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input placeholder={t("my_search")} value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">{t("my_all_statuses")}</option>
          <option value="under_review">{t("my_under_review")}</option>
          <option value="approved">{STATUS_LABEL.approved}</option>
          <option value="implemented">{STATUS_LABEL.implemented}</option>
          <option value="rejected">{STATUS_LABEL.rejected}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">{t("my_loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-12 border border-dashed border-border rounded-lg">{t("my_empty")}</div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((s: any) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              className="text-left block p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono text-muted-foreground">{s.code}</div>
                  <div className="mt-0.5 font-medium truncate">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.categories?.name ?? "—"} · {new Date(s.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <StatusBadge status={s.status} />
                  <PriorityBadge priority={s.priority} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <SuggestionDetailsDialog
        suggestionId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </EmployeeShell>
  );
}

function SuggestionDetailsDialog({
  suggestionId,
  onClose,
}: {
  suggestionId: string | null;
  onClose: () => void;
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
          .select("*")
          .eq("suggestion_id", suggestionId!)
          .order("created_at"),
      ]);
      return { s, h: h ?? [] };
    },
  });

  const s = data?.s as any;
  const history = data?.h ?? [];

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
              <PriorityBadge priority={s.priority} />
              <span className="text-xs text-muted-foreground">
                {t("submitted_on")} {new Date(s.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-sm border-t border-border pt-3">
              <Meta label={t("category")} value={s.categories?.name ?? "—"} />
              <Meta label="Department" value={s.departments?.name ?? "—"} />
              <Meta label="Plant" value={s.plants?.name ?? "—"} />
              <Meta label="Location" value={s.locations?.location ?? "—"} />
              <Meta
                label={t("expected_saving")}
                value={s.expected_saving ? `₹ ${Number(s.expected_saving).toLocaleString()}` : "—"}
              />
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
                      {STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL]}
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

        <DialogFooter>
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
      <div className="mt-0.5">{value}</div>
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
