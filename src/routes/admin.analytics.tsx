import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExportMenu } from "@/components/export-menu";
import { STATUS_LABEL, PRIORITY_LABEL, type SuggestionStatus, type Priority } from "@/lib/statuses";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "analytics" } as any }); },
  component: () => null,
});

const PIE_COLORS = [
  "oklch(0.45 0.14 254)",
  "oklch(0.58 0.14 155)",
  "oklch(0.72 0.15 65)",
  "oklch(0.55 0.20 27)",
  "oklch(0.55 0.12 240)",
  "oklch(0.60 0.10 300)",
  "oklch(0.65 0.08 200)",
  "oklch(0.50 0.10 20)",
];

export function AnalyticsPage() {
  const { data: sugs = [] } = useQuery({
    queryKey: ["analytics-sugs"],
    queryFn: async () =>
      (await supabase
        .from("suggestions")
        .select("id,status,priority,category_id,created_at,expected_saving,actual_cost")
        .limit(10000)).data ?? [],
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["cats-analytics"],
    queryFn: async () => (await supabase.from("categories").select("id,name")).data ?? [],
  });

  // Status distribution
  const statusRows = (Object.keys(STATUS_LABEL) as SuggestionStatus[])
    .map((st) => {
      const list = sugs.filter((s: any) => s.status === st);
      return {
        status: STATUS_LABEL[st],
        count: list.length,
        expected_savings: Math.round(list.reduce((sum: number, s: any) => sum + Number(s.expected_saving ?? 0), 0)),
      };
    })
    .filter((x) => x.count > 0);

  // Priority
  const priorityRows = (Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => ({
    priority: PRIORITY_LABEL[p],
    count: sugs.filter((s: any) => s.priority === p).length,
  })).filter((x) => x.count > 0);

  // By category
  const catRows = categories.map((c: any) => {
    const list = sugs.filter((s: any) => s.category_id === c.id);
    const impl = list.filter((s: any) => s.status === "implemented" || s.status === "closed").length;
    return {
      category: c.name,
      total: list.length,
      implemented: impl,
      impl_pct: list.length ? Math.round((impl / list.length) * 100) : 0,
    };
  }).filter((x) => x.total > 0).sort((a, b) => b.total - a.total);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Analytics"
        description="Status, priority, and category breakdown across the enterprise."
        actions={
          <ExportMenu
            data={statusRows}
            columns={[
              { key: "status", header: "Status" },
              { key: "count", header: "Count" },
              { key: "expected_savings", header: "Expected savings" },
            ]}
            filename="status_distribution"
            title="Status Distribution Report"
          />
        }
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Status distribution</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={statusRows} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.008 250)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
                <Bar dataKey="count" fill="oklch(0.45 0.14 254)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium mb-3">Priority breakdown</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={priorityRows} dataKey="count" nameKey="priority" outerRadius={90} innerRadius={45} paddingAngle={2}>
                  {priorityRows.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="text-sm font-medium">Category performance</div>
          <ExportMenu
            data={catRows}
            columns={[
              { key: "category", header: "Category" },
              { key: "total", header: "Total" },
              { key: "implemented", header: "Implemented" },
              { key: "impl_pct", header: "Impl %" },
            ]}
            filename="category_performance"
            title="Category Performance"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["Category", "Total", "Implemented", "Impl %"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {catRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                  No category data.
                </td>
              </tr>
            ) : (
              catRows.map((r) => (
                <tr key={r.category} className="hover:bg-muted/30">
                  <td className="px-4 py-2 font-medium">{r.category}</td>
                  <td className="px-4 py-2">{r.total}</td>
                  <td className="px-4 py-2 text-success">{r.implemented}</td>
                  <td className="px-4 py-2">{r.impl_pct}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
