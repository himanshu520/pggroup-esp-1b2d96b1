import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExportMenu } from "@/components/export-menu";
import { STATUS_LABEL, PRIORITY_LABEL, type SuggestionStatus, type Priority } from "@/lib/statuses";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useSession, isSuggestionAccessible } from "@/lib/session";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/analytics")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "analytics" } as any }); },
  component: () => null,
});

const CHART_COLORS = [
  "oklch(0.62 0.16 155)",  // Green
  "oklch(0.60 0.15 320)",  // Pinkish Purple
  "oklch(0.65 0.18 200)",  // Blue-cyan
  "oklch(0.72 0.15 65)",   // Amber/orange
  "oklch(0.55 0.20 27)",   // Crimson
  "oklch(0.55 0.12 240)",  // Indigo
  "oklch(0.45 0.14 254)",  // Dark Blue
];

export function AnalyticsPage() {
  const { data: sess } = useSession();
  const { data: sugs = [] } = useQuery({
    queryKey: ["analytics-sugs"],
    queryFn: async () =>
      (await supabase
        .from("suggestions")
        .select("id,status,priority,category_id,created_at,expected_saving,actual_cost,department_id,current_department_id,departments(name),location_id,plant_id")
        .limit(10000)).data ?? [],
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["cats-analytics"],
    queryFn: async () => (await supabase.from("categories").select("id,name")).data ?? [],
  });

  const accessibleSugs = useMemo(() => {
    if (!sess?.roles) return [];
    return sugs.filter((s: any) => isSuggestionAccessible(s, sess.roles));
  }, [sugs, sess?.roles]);

  // 1. Department-wise implementation rate
  const deptImplRows = useMemo(() => {
    const statsMap = new Map<string, { total: number; implemented: number }>();
    for (const s of accessibleSugs as any[]) {
      const deptName = s.departments?.name || "Unknown";
      const current = statsMap.get(deptName) || { total: 0, implemented: 0 };
      current.total++;
      if (s.status === "implemented" || s.status === "closed") {
        current.implemented++;
      }
      statsMap.set(deptName, current);
    }
    return Array.from(statsMap.entries())
      .map(([name, { total, implemented }]) => ({
        name,
        rate: total > 0 ? Math.round((implemented / total) * 100) : 0,
        total,
      }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10);
  }, [accessibleSugs]);

  // 2. Fake closures
  const fakeClosuresRows = useMemo(() => {
    const statsMap = new Map<string, number>();
    for (const s of accessibleSugs as any[]) {
      if (s.status === "fake_closure") {
        const deptName = s.departments?.name || "Unknown";
        statsMap.set(deptName, (statsMap.get(deptName) || 0) + 1);
      }
    }
    return Array.from(statsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [accessibleSugs]);

  // 3. Weekly suggestions submitted by department
  const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weeklyData = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeks = Array.from({ length: 8 }).map((_, i) => {
      const d = new Date(startOfWeek.getTime() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
      return {
        start: d,
        end: new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
        label: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`,
        departments: {} as Record<string, number>,
        total: 0,
      };
    });

    const deptCounts = new Map<string, number>();
    for (const s of accessibleSugs as any[]) {
      if (!s.created_at) continue;
      const created = new Date(s.created_at);
      const week = weeks.find((w) => created >= w.start && created <= w.end);
      if (week) {
        const deptName = s.departments?.name || "Unknown";
        week.departments[deptName] = (week.departments[deptName] || 0) + 1;
        week.total++;
        deptCounts.set(deptName, (deptCounts.get(deptName) || 0) + 1);
      }
    }

    const topDepts = Array.from(deptCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const chartData = weeks.map((w) => {
      const row: Record<string, any> = { name: w.label };
      for (const dept of topDepts) {
        row[dept] = w.departments[dept] || 0;
      }
      let others = 0;
      for (const [dept, count] of Object.entries(w.departments)) {
        if (!topDepts.includes(dept)) {
          others += count;
        }
      }
      if (others > 0) row["Others"] = others;
      return row;
    });

    return {
      chartData,
      keys: [...topDepts, ...((chartData.some(r => r.Others > 0) ? ["Others"] : []) as string[])],
    };
  }, [accessibleSugs]);

  // By category
  const catRows = categories.map((c: any) => {
    const list = accessibleSugs.filter((s: any) => s.category_id === c.id);
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
        description="Department-wise rates, fake closures, and weekly submission trends."
        actions={
          <ExportMenu
            data={deptImplRows}
            columns={[
              { key: "name", header: "Department" },
              { key: "rate", header: "Implementation Rate %" },
              { key: "total", header: "Total Suggestions" },
            ]}
            filename="department_implementation_rates"
            title="Department Implementation Rates"
          />
        }
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Department wise implementation rate */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Department-wise Implementation Rate (%)</div>
          </div>
          <div className="h-64">
            {deptImplRows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={deptImplRows} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.008 250)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
                  <Bar dataKey="rate" fill="oklch(0.62 0.16 155)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Fake closures */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Fake Closures by Department</div>
          </div>
          <div className="h-64">
            {fakeClosuresRows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">No fake closures reported</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={fakeClosuresRows} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.008 250)" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
                  <Bar dataKey="count" fill="oklch(0.55 0.20 27)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Weekly suggestion submitted by department */}
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="text-sm font-medium mb-3">Weekly Suggestions Submitted by Department (Last 8 Weeks)</div>
        <div className="h-72">
          {accessibleSugs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No suggestion data available</div>
          ) : (
            <ResponsiveContainer>
              <LineChart data={weeklyData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.008 250)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {weeklyData.keys.map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
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

