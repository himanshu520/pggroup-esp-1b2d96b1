import { useState } from "react";
import { Award, TrendingUp, TrendingDown, Building2, Crown, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DeptPointSystemProps {
  suggestions: EmployeeSuggestion[];
}

export function DepartmentPointSystemSection({ suggestions }: DeptPointSystemProps) {
  const [tab, setTab] = useState("current");

  // Generate department current month metrics
  const currentMonthDepts = [
    { name: "Quality", points: 1890, rank: 1, implPct: 95.0, partPct: 92.5, trend: "+28.5%", isUp: true },
    { name: "Production", points: 1650, rank: 2, implPct: 90.0, partPct: 88.0, trend: "+19.2%", isUp: true },
    { name: "Maintenance", points: 1420, rank: 3, implPct: 85.5, partPct: 84.0, trend: "+14.0%", isUp: true },
    { name: "Tool Room", points: 1280, rank: 4, implPct: 88.0, partPct: 82.0, trend: "+11.5%", isUp: true },
    { name: "Assembly", points: 1150, rank: 5, implPct: 82.0, partPct: 79.5, trend: "+8.4%", isUp: true },
    { name: "Press Shop", points: 980, rank: 6, implPct: 78.0, partPct: 76.0, trend: "-2.1%", isUp: false },
    { name: "HR", points: 860, rank: 7, implPct: 80.0, partPct: 75.0, trend: "+5.2%", isUp: true },
    { name: "IT", points: 790, rank: 8, implPct: 92.0, partPct: 78.0, trend: "+15.0%", isUp: true },
    { name: "Purchase", points: 740, rank: 9, implPct: 86.0, partPct: 70.0, trend: "+6.8%", isUp: true },
    { name: "Stores", points: 620, rank: 10, implPct: 75.0, partPct: 68.0, trend: "+3.4%", isUp: true },
  ];

  // Generate Y2Y Department Rankings
  const y2yDepts = [
    { name: "Quality", currentPts: 1890, prevPts: 1470, growth: "+28.5%", rank: 1 },
    { name: "Production", currentPts: 1650, prevPts: 1380, growth: "+19.5%", rank: 2 },
    { name: "Maintenance", currentPts: 1420, prevPts: 1240, growth: "+14.5%", rank: 3 },
    { name: "Tool Room", currentPts: 1280, prevPts: 1120, growth: "+14.2%", rank: 4 },
    { name: "Assembly", currentPts: 1150, prevPts: 1050, growth: "+9.5%", rank: 5 },
    { name: "Press Shop", currentPts: 980, prevPts: 1010, growth: "-2.9%", rank: 6 },
    { name: "HR", currentPts: 860, prevPts: 810, growth: "+6.1%", rank: 7 },
    { name: "IT", currentPts: 790, prevPts: 680, growth: "+16.1%", rank: 8 },
    { name: "Purchase", currentPts: 740, prevPts: 690, growth: "+7.2%", rank: 9 },
    { name: "Stores", currentPts: 620, prevPts: 590, growth: "+5.0%", rank: 10 },
  ];

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
                {currentMonthDepts.map((d) => (
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
                ))}
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
