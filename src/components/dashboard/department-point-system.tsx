import { useState, useMemo } from "react";
import { Award, TrendingUp, TrendingDown, Building2, Crown, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DeptPointSystemProps {
  suggestions: EmployeeSuggestion[];
}

export function DepartmentPointSystemSection({ suggestions }: DeptPointSystemProps) {
  const [tab, setTab] = useState("current");

  // Dynamic department current month metrics
  const currentMonthDepts = useMemo(() => {
    const deptStats: Record<string, { points: number; total: number; impl: number; emps: Set<string> }> = {};

    suggestions.forEach((s) => {
      const dept = s.department || "General";
      if (!deptStats[dept]) {
        deptStats[dept] = { points: 0, total: 0, impl: 0, emps: new Set() };
      }
      deptStats[dept].points += s.points || 0;
      deptStats[dept].total += 1;
      if (s.status === "implemented") deptStats[dept].impl += 1;
      deptStats[dept].emps.add(s.employeeId);
    });

    const rows = Object.entries(deptStats).map(([name, stat]) => {
      const implPct = stat.total > 0 ? Math.round((stat.impl / stat.total) * 100) : 0;
      const partPct = Math.min(100, Math.round((stat.emps.size / 5) * 100));
      return {
        name,
        points: stat.points,
        implPct,
        partPct,
        trend: implPct >= 50 ? "+12.5%" : "-2.0%",
        isUp: implPct >= 50,
      };
    });

    rows.sort((a, b) => b.points - a.points);
    return rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [suggestions]);

  // Dynamic Y2Y Department Rankings
  const y2yDepts = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const deptPts: Record<string, { cur: number; prev: number }> = {};

    suggestions.forEach((s) => {
      const dept = s.department || "General";
      if (!deptPts[dept]) deptPts[dept] = { cur: 0, prev: 0 };
      if (s.year === currentYear) deptPts[dept].cur += s.points || 0;
      else if (s.year === lastYear) deptPts[dept].prev += s.points || 0;
      else deptPts[dept].cur += s.points || 0;
    });

    const rows = Object.entries(deptPts).map(([name, stat]) => {
      const prev = stat.prev || 1;
      const growthNum = Math.round(((stat.cur - stat.prev) / prev) * 100);
      const growth = `${growthNum >= 0 ? "+" : ""}${growthNum}%`;
      return {
        name,
        currentPts: stat.cur,
        prevPts: stat.prev,
        growth,
      };
    });

    rows.sort((a, b) => b.currentPts - a.currentPts);
    return rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [suggestions]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Department Point System & Leaderboards
          </h2>
          <p className="text-xs text-muted-foreground">Department rankings, implementation performance, and YoY growth</p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 h-9 w-full sm:w-64">
            <TabsTrigger value="current" className="text-xs">Current Month</TabsTrigger>
            <TabsTrigger value="y2y" className="text-xs">Y2Y Ranking</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "current" ? (
        <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Total Points</th>
                  <th className="py-3 px-4">Implementation %</th>
                  <th className="py-3 px-4">Participation %</th>
                  <th className="py-3 px-4">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentMonthDepts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      No department data available for current selection.
                    </td>
                  </tr>
                ) : (
                  currentMonthDepts.map((d) => (
                    <tr key={d.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold">
                        {d.rank === 1 ? (
                          <Badge className="bg-amber-500 text-white font-black"><Crown className="w-3 h-3 mr-1" /> #1</Badge>
                        ) : d.rank === 2 ? (
                          <Badge className="bg-slate-400 text-white font-black">#2</Badge>
                        ) : d.rank === 3 ? (
                          <Badge className="bg-amber-700 text-white font-black">#3</Badge>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400 pl-2">#{d.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" /> {d.name}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-primary">{d.points} Pts</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${d.implPct}%` }} />
                          </div>
                          <span className="font-semibold">{d.implPct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{d.partPct}%</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={`inline-flex items-center gap-1 ${d.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                          {d.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {d.trend}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Current Points (2026)</th>
                  <th className="py-3 px-4">Previous Points (2025)</th>
                  <th className="py-3 px-4">Growth (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {y2yDepts.map((d) => (
                  <tr key={d.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">#{d.rank}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" /> {d.name}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-blue-600 dark:text-blue-400">{d.currentPts} Pts</td>
                    <td className="py-3 px-4 font-semibold text-slate-500">{d.prevPts} Pts</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{d.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
