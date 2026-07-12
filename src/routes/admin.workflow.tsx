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

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRowColorForStatus } from "@/lib/statuses";

export function WorkflowPage() {
  const { data: session } = useSession();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

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
      <PageHeader 
        title="Workflow Queue" 
        description="Everything waiting on someone. PE queues show only for PE / Super / Corporate roles."
        actions={
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
              <LayoutGrid className="w-3.5 h-3.5 mr-1.5" /> Grid
            </Button>
          </div>
        }
      />

      <div className="grid gap-6">
        {QUEUES.filter((q) => !q.forPE || session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin").map((q) => {
          const items = accessibleSugs.filter((s) => q.statuses.includes(s.status));
          
          if (items.length === 0) {
            return (
              <div key={q.key} className="rounded-lg border border-border bg-card">
                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                  <div className="text-sm font-medium">{q.label}</div>
                  <div className="text-xs text-muted-foreground">0 pending</div>
                </div>
                <div className="p-6 text-center text-xs text-muted-foreground">Queue is clear.</div>
              </div>
            );
          }

          return (
            <div key={q.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{q.label}</div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length} pending</div>
              </div>
              
              {viewMode === "table" ? (
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      {items.slice(0, 8).map((s: any) => (
                        <tr key={s.id} className={`transition-colors ${getRowColorForStatus(s.status)}`}>
                          <td className="px-4 py-2 font-mono text-xs w-24">
                            <Link to="/admin" search={{ section: "suggestion", id: s.id } as any} className="text-primary hover:underline font-medium">{s.code}</Link>
                          </td>
                          <td className="px-4 py-2 max-w-[200px] sm:max-w-md truncate font-medium">{s.title}</td>
                          <td className="px-4 py-2 text-xs text-muted-foreground hidden sm:table-cell">{s.departments?.name}</td>
                          <td className="px-4 py-2 w-24 hidden md:table-cell"><PriorityBadge priority={s.priority} /></td>
                          <td className="px-4 py-2 w-32"><StatusBadge status={s.status} /></td>
                          <td className="px-4 py-2 text-xs text-muted-foreground text-right w-24 hidden lg:table-cell">{new Date(s.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.slice(0, 12).map((s: any) => (
                    <Link
                      key={s.id}
                      to="/admin"
                      search={{ section: "suggestion", id: s.id } as any}
                      className={`flex flex-col gap-3 p-4 rounded-xl border border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${getRowColorForStatus(s.status)}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">{s.code}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">{s.title}</h3>
                      <div className="text-xs text-muted-foreground truncate">{s.departments?.name ?? "No Department"}</div>
                      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/50">
                        <StatusBadge status={s.status} />
                        <PriorityBadge priority={s.priority} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
