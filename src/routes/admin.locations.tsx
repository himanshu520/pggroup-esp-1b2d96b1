import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExportMenu } from "@/components/export-menu";
import { useSession, isLocationAccessible } from "@/lib/session";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/locations")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "locations" } as any }); },
  component: () => null,
});

export function LocationPerf() {
  const { data: sess } = useSession();
  const { data: locations = [] } = useQuery({
    queryKey: ["locs-perf"],
    queryFn: async () => (await supabase.from("locations").select("id,location,state")).data ?? [],
  });
  const { data: plants = [] } = useQuery({
    queryKey: ["plants-for-locs"],
    queryFn: async () => (await supabase.from("plants").select("id,location_id")).data ?? [],
  });
  const { data: sugs = [] } = useQuery({
    queryKey: ["all-sugs-locs"],
    queryFn: async () =>
      (await supabase
        .from("suggestions")
        .select("id,location_id,status,expected_saving,actual_cost")
        .limit(10000)).data ?? [],
  });

  const filteredLocations = useMemo(() => {
    if (!sess?.roles) return [];
    return locations.filter((l: any) => isLocationAccessible(l.id, sess.roles));
  }, [locations, sess?.roles]);

  const rows = useMemo(() => {
    return filteredLocations
      .map((l: any) => {
        const all = sugs.filter((s: any) => s.location_id === l.id);
        const impl = all.filter((s: any) => s.status === "implemented" || s.status === "closed").length;
        const fake = all.filter((s: any) => s.status === "fake_closure").length;
        const pending = all.filter((s: any) => !["implemented", "closed", "rejected"].includes(s.status)).length;
        const savings = all.reduce((s: number, x: any) => s + Number(x.expected_saving ?? 0), 0);
        const plantCount = plants.filter((p: any) => p.location_id === l.id).length;
        return {
          state: l.state,
          location: l.location,
          plants: plantCount,
          total: all.length,
          implemented: impl,
          pending,
          fake,
          implPct: all.length ? Math.round((impl / all.length) * 100) : 0,
          expected_savings: Math.round(savings),
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [filteredLocations, sugs, plants]);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Location Performance"
        description="Roll-up of plants and departments per location."
        actions={
          <ExportMenu
            data={rows}
            columns={[
              { key: "state", header: "State" },
              { key: "location", header: "Location" },
              { key: "plants", header: "Plants" },
              { key: "total", header: "Total" },
              { key: "implemented", header: "Implemented" },
              { key: "pending", header: "Pending" },
              { key: "fake", header: "Fake closure" },
              { key: "implPct", header: "Impl %" },
              { key: "expected_savings", header: "Expected savings" },
            ]}
            filename="location_performance"
            title="Location Performance Report"
          />
        }
      />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["Sr number", "Location", "Plants", "Total", "Implemented", "Pending", "Fake", "Impl %", "Expected savings"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-sm text-muted-foreground">
                  No locations registered.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.state} className="hover:bg-muted/30">
                  <td className="px-4 py-2 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{r.location}</td>
                  <td className="px-4 py-2">{r.plants}</td>
                  <td className="px-4 py-2">{r.total}</td>
                  <td className="px-4 py-2 text-success">{r.implemented}</td>
                  <td className="px-4 py-2 text-warning">{r.pending}</td>
                  <td className="px-4 py-2 text-destructive">{r.fake}</td>
                  <td className="px-4 py-2">{r.implPct}%</td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {r.expected_savings.toLocaleString()}
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

