import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { useSession, isSuggestionAccessible } from "@/lib/session";
import type { SuggestionStatus } from "@/lib/statuses";
import { useMemo } from "react";

const QUEUES: Array<{ key: string; label: string; statuses: SuggestionStatus[]; forPE?: boolean }> = [
  { key: "pe_in", label: "PE Inbox", statuses: ["pe_review","submitted"], forPE: true },
  { key: "dept", label: "Department Review", statuses: ["dept_review","transferred"] },
  { key: "impl", label: "Implementation", statuses: ["approved","implementation","evidence_pending"] },
  { key: "pe_verify", label: "PE Verification", statuses: ["pe_verification","evidence_submitted"], forPE: true },
  { key: "fake", label: "Fake Closure — Reopen", statuses: ["fake_closure","reopened"] },
];

export const Route = createFileRoute("/admin/workflow")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "workflow" } as any }); },
  component: () => null,
});

export function WorkflowPage() {
  const { data: session } = useSession();
  const { data = [] } = useQuery({
    queryKey: ["workflow-queue"],
    queryFn: async () => (await supabase.from("suggestions").select("*, employees(name), departments!suggestions_department_id_fkey(name)").order("created_at", { ascending: false })).data ?? [],
  });

  const accessibleSugs = useMemo(() => {
    if (!session?.roles) return [];
    return data.filter((s: any) => isSuggestionAccessible(s, session.roles));
  }, [data, session?.roles]);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader title="Workflow Queue" description="Everything waiting on someone. PE queues show only for PE / Super / Corporate roles." />

      <div className="grid gap-4">
        {QUEUES.filter((q) => !q.forPE || session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin").map((q) => {
          const items = accessibleSugs.filter((s) => q.statuses.includes(s.status));
          return (
            <div key={q.key} className="rounded-lg border border-border bg-card">
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                <div className="text-sm font-medium">{q.label}</div>
                <div className="text-xs text-muted-foreground">{items.length} pending</div>
              </div>
              {items.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">Queue is clear.</div>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {items.slice(0, 8).map((s: any) => (
                      <tr key={s.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2 font-mono text-xs">
                          <Link to="/admin" search={{ section: "suggestion", id: s.id } as any} className="text-primary hover:underline">{s.code}</Link>
                        </td>
                        <td className="px-4 py-2 max-w-md truncate">{s.title}</td>
                        <td className="px-4 py-2 text-xs">{s.departments?.name}</td>
                        <td className="px-4 py-2"><PriorityBadge priority={s.priority} /></td>
                        <td className="px-4 py-2"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-2 text-xs text-muted-foreground text-right">{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
