import { createFileRoute, redirect } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Trash, RotateCcw, Trash2, Loader2 } from "lucide-react";
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
  const [viewTrash, setViewTrash] = useState(false);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["my-suggestions", session?.employee?.id],
    enabled: !!session?.employee?.id,
    queryFn: async () => (await supabase.from("suggestions").select("*, categories(name)").eq("employee_id", session!.employee!.id).order("created_at", { ascending: false })).data ?? [],
  });

  const TERMINAL = new Set(["approved","implemented","rejected","closed","fake_closure"]);
  const filtered = data.filter((s: any) => {
    if (viewTrash) {
      if (!s.deleted_at) return false;
    } else {
      if (s.deleted_at) return false;
    }

    if (status === "under_review") {
      if (TERMINAL.has(s.status)) return false;
    } else if (status && s.status !== status) return false;
    if (q && !(`${s.title} ${s.code}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <EmployeeShell>
      <div className="flex items-center justify-between gap-4 mb-4">
        <PageHeader title={viewTrash ? t("my_trash", "Trash") : t("my_title")} description={viewTrash ? t("my_trash_desc", "Deleted suggestions") : t("my_desc")} />
        <Button variant="outline" onClick={() => setViewTrash(!viewTrash)}>
          {viewTrash ? t("my_view_active", "View Active") : t("my_view_trash", "View Trash")}
        </Button>
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
        onChanged={() => refetch()}
        isTrash={viewTrash}
      />
    </EmployeeShell>
  );
}

import { ConfirmDialog } from "@/components/confirm-dialog";

function SuggestionDetailsDialog({
  suggestionId,
  onClose,
  onChanged,
  isTrash,
}: {
  suggestionId: string | null;
  onClose: () => void;
  onChanged: () => void;
  isTrash: boolean;
}) {
  const t = useT();
  const [acting, setActing] = useState(false);
  const [confirming, setConfirming] = useState<"trash" | "delete" | null>(null);
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

  async function handleMoveToTrash() {
    if (!suggestionId) return;
    setActing(true);
    try {
      const { error } = await supabase.from("suggestions").update({ deleted_at: new Date().toISOString() }).eq("id", suggestionId);
      if (error) throw error;
      toast.success("Suggestion moved to trash.");
      onChanged();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Could not move to trash.");
    } finally {
      setActing(false);
      setConfirming(null);
    }
  }

  async function handleRestore() {
    if (!suggestionId) return;
    setActing(true);
    try {
      const { error } = await supabase.from("suggestions").update({ deleted_at: null }).eq("id", suggestionId);
      if (error) throw error;
      toast.success("Suggestion restored.");
      onChanged();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Could not restore suggestion.");
    } finally {
      setActing(false);
    }
  }

  async function handlePermanentDelete() {
    if (!suggestionId) return;
    setActing(true);
    try {
      const { error } = await supabase.from("suggestions").delete().eq("id", suggestionId);
      if (error) throw error;
      toast.success("Suggestion permanently deleted.");
      onChanged();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Could not delete suggestion.");
    } finally {
      setActing(false);
      setConfirming(null);
    }
  }

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
                      {t(`status_${h.to_status}`)}
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

        <DialogFooter className="flex flex-row justify-between items-center sm:justify-between w-full">
          <div className="flex gap-2">
            {!isLoading && s && !isTrash && (
              <Button type="button" variant="destructive" onClick={() => setConfirming("trash")} disabled={acting}>
                {acting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash className="w-4 h-4 mr-2" />}
                Move to Trash
              </Button>
            )}
            {!isLoading && s && isTrash && (
              <>
                <Button type="button" variant="outline" onClick={handleRestore} disabled={acting}>
                  {acting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                  Restore
                </Button>
                <Button type="button" variant="destructive" onClick={() => setConfirming("delete")} disabled={acting}>
                  {acting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Delete Permanently
                </Button>
              </>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>{t("close")}</Button>
        </DialogFooter>
      </DialogContent>
      
      <ConfirmDialog
        open={confirming === "trash"}
        onOpenChange={(o) => !o && setConfirming(null)}
        title="Move to Trash"
        description="Are you sure you want to move this suggestion to trash?"
        confirmLabel="Move to Trash"
        cancelLabel="Cancel"
        destructive
        loading={acting}
        onConfirm={handleMoveToTrash}
      />

      <ConfirmDialog
        open={confirming === "delete"}
        onOpenChange={(o) => !o && setConfirming(null)}
        title="Delete Permanently"
        description="Are you sure you want to permanently delete this suggestion? This action cannot be undone."
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        destructive
        loading={acting}
        onConfirm={handlePermanentDelete}
      />
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
