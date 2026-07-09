import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExportMenu } from "@/components/export-menu";

export const Route = createFileRoute("/admin/departments")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "departments" } as any }); },
  component: () => null,
});

export function DeptPerf() {
  const { data: depts = [] } = useQuery({ queryKey: ["depts-all"], queryFn: async () => (await supabase.from("departments").select("id,name")).data ?? [] });
  const { data: sugs = [] } = useQuery({ queryKey: ["all-sugs"], queryFn: async () => (await supabase.from("suggestions").select("id,department_id,status,created_at,completed_at").limit(5000)).data ?? [] });

  const rows = depts.map((d) => {
    const all = sugs.filter((s) => s.department_id === d.id);
    const impl = all.filter((s) => s.status === "implemented" || s.status === "closed").length;
    const fake = all.filter((s) => s.status === "fake_closure").length;
    const pending = all.filter((s) => !["implemented","closed","rejected"].includes(s.status)).length;
    const avgDays = (() => {
      const done = all.filter((s) => s.completed_at);
      if (!done.length) return "—";
      const totalMs = done.reduce((sum, s) => sum + (new Date(s.completed_at!).getTime() - new Date(s.created_at).getTime()), 0);
      return Math.round(totalMs / (done.length * 86400000)) + "d";
    })();
    return { name: d.name, total: all.length, implemented: impl, pending, fake, implPct: all.length ? Math.round((impl / all.length) * 100) : 0, avgDays };
  }).sort((a, b) => b.total - a.total);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Department Performance"
        description="Ranked by total suggestions and implementation rate."
        actions={
          <ExportMenu
            data={rows}
            columns={[
              { key: "name", header: "Department" },
              { key: "total", header: "Total" },
              { key: "implemented", header: "Implemented" },
              { key: "pending", header: "Pending" },
              { key: "fake", header: "Fake closure" },
              { key: "implPct", header: "Impl %" },
              { key: "avgDays", header: "Avg days" },
            ]}
            filename="department_performance"
            title="Department Performance Report"
          />
        }
      />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["#","Department","Total","Implemented","Pending","Fake","Impl %","Avg days"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={r.name} className="hover:bg-muted/30">
                <td className="px-4 py-2 font-mono text-xs">{i+1}</td>
                <td className="px-4 py-2 font-medium">{r.name}</td>
                <td className="px-4 py-2">{r.total}</td>
                <td className="px-4 py-2 text-success">{r.implemented}</td>
                <td className="px-4 py-2 text-warning">{r.pending}</td>
                <td className="px-4 py-2 text-destructive">{r.fake}</td>
                <td className="px-4 py-2">{r.implPct}%</td>
                <td className="px-4 py-2 text-muted-foreground">{r.avgDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
