import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/audit")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "audit" } as any }); },
  component: () => null,
});

export function AuditPage() {
  const { data = [] } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500)).data ?? [],
  });

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader title="Audit Logs" description="Complete action history — visible to super and corporate admins only." />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-left">
              {["When","Action","Entity","Meta"].map((h) => <th key={h} className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">No audit records yet, or you don't have permission to view them.</td></tr>
            ) : data.map((a: any) => (
              <tr key={a.id}>
                <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 font-mono text-xs">{a.action}</td>
                <td className="px-4 py-2 text-xs">{a.entity_type} <span className="text-muted-foreground">{a.entity_id?.slice(0,8)}</span></td>
                <td className="px-4 py-2 text-xs text-muted-foreground max-w-md truncate">{a.meta ? JSON.stringify(a.meta) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
