import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExportMenu } from "@/components/export-menu";

export const Route = createFileRoute("/admin/plants")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "plants" } as any }); },
  component: () => null,
});

export function PlantPerf() {
  const { data: plants = [] } = useQuery({
    queryKey: ["plants-perf"],
    queryFn: async () =>
      (await supabase.from("plants").select("id,name,code, locations(location)")).data ?? [],
  });
  const { data: sugs = [] } = useQuery({
    queryKey: ["all-sugs-plants"],
    queryFn: async () =>
      (await supabase
        .from("suggestions")
        .select("id,plant_id,status,expected_saving,actual_cost,created_at,completed_at")
        .limit(10000)).data ?? [],
  });

  const rows = plants
    .map((p: any) => {
      const all = sugs.filter((s: any) => s.plant_id === p.id);
      const impl = all.filter((s: any) => s.status === "implemented" || s.status === "closed").length;
      const fake = all.filter((s: any) => s.status === "fake_closure").length;
      const pending = all.filter((s: any) => !["implemented", "closed", "rejected"].includes(s.status)).length;
      const savings = all.reduce((s: number, x: any) => s + Number(x.expected_saving ?? 0), 0);
      const spend = all.reduce((s: number, x: any) => s + Number(x.actual_cost ?? 0), 0);
      const avgDays = (() => {
        const done = all.filter((s: any) => s.completed_at);
        if (!done.length) return 0;
        return Math.round(
          done.reduce((sum: number, s: any) =>
            sum + (new Date(s.completed_at).getTime() - new Date(s.created_at).getTime()), 0) /
          (done.length * 86400000),
        );
      })();
      return {
        code: p.code,
        name: p.name,
        location: p.locations?.location ?? "",
        total: all.length,
        implemented: impl,
        pending,
        fake,
        implPct: all.length ? Math.round((impl / all.length) * 100) : 0,
        expected_savings: Math.round(savings),
        actual_spend: Math.round(spend),
        avg_days: avgDays,
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Plant Performance"
        description="Ranked implementation performance across plants."
        actions={
          <ExportMenu
            data={rows}
            columns={[
              { key: "code", header: "Code" },
              { key: "name", header: "Plant" },
              { key: "location", header: "Location" },
              { key: "total", header: "Total" },
              { key: "implemented", header: "Implemented" },
              { key: "pending", header: "Pending" },
              { key: "fake", header: "Fake closure" },
              { key: "implPct", header: "Impl %" },
              { key: "expected_savings", header: "Expected savings" },
              { key: "actual_spend", header: "Actual spend" },
              { key: "avg_days", header: "Avg days to close" },
            ]}
            filename="plant_performance"
            title="Plant Performance Report"
          />
        }
      />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["#", "Plant", "Location", "Total", "Implemented", "Pending", "Fake", "Impl %", "Expected savings", "Avg days"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-sm text-muted-foreground">
                  No plants registered.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.code} className="hover:bg-muted/30">
                  <td className="px-4 py-2 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{r.name}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{r.location}</td>
                  <td className="px-4 py-2">{r.total}</td>
                  <td className="px-4 py-2 text-success">{r.implemented}</td>
                  <td className="px-4 py-2 text-warning">{r.pending}</td>
                  <td className="px-4 py-2 text-destructive">{r.fake}</td>
                  <td className="px-4 py-2">{r.implPct}%</td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {r.expected_savings.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {r.avg_days ? `${r.avg_days}d` : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
