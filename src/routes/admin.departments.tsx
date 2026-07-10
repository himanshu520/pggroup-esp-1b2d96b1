import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExportMenu } from "@/components/export-menu";
import { useSession, isDeptAccessible } from "@/lib/session";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/departments")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "departments" } as any }); },
  component: () => null,
});

export function DeptPerf() {
  const { data: sess } = useSession();
  const { data: depts = [] } = useQuery({
    queryKey: ["depts-all"],
    queryFn: async () =>
      (
        await supabase
          .from("departments")
          .select("id,name,plant_id, plants(name, location_id, locations(location))")
          .is("deleted_at", null)
      ).data ?? [],
  });
  const { data: sugs = [] } = useQuery({ queryKey: ["all-sugs"], queryFn: async () => (await supabase.from("suggestions").select("id,department_id,status,created_at,completed_at").limit(5000)).data ?? [] });

  const filteredDepts = useMemo(() => {
    if (!sess?.roles) return [];
    return depts.filter((d: any) => {
      const plantId = d.plant_id;
      const locationId = d.plants?.location_id;
      return isDeptAccessible(d.id, plantId, locationId, sess.roles);
    });
  }, [depts, sess?.roles]);

  const rows = useMemo(() => {
    return filteredDepts.map((d: any) => {
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
      return {
        name: d.name,
        plant: d.plants?.name ?? "—",
        location: d.plants?.locations?.location ?? "—",
        total: all.length,
        implemented: impl,
        pending,
        fake,
        implPct: all.length ? Math.round((impl / all.length) * 100) : 0,
        avgDays,
      };
    }).sort((a, b) => b.total - a.total);
  }, [filteredDepts, sugs]);

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
              { key: "plant", header: "Plant" },
              { key: "location", header: "Location" },
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
              {["Sr number","Department","Plant","Location","Total","Implemented","Pending","Fake","Impl %","Avg days"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={`${r.name}-${r.plant}`} className="hover:bg-muted/30">
                <td className="px-4 py-2 font-mono text-xs">{i+1}</td>
                <td className="px-4 py-2 font-medium">{r.name}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{r.plant}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{r.location}</td>
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

