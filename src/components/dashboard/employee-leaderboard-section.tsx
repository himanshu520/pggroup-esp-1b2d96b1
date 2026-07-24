import { useMemo } from "react";
import { Award, Crown, TrendingUp, TrendingDown, Users, CheckCircle2, Trophy, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface EmployeeLeaderboardProps {
  suggestions: EmployeeSuggestion[];
}

export function EmployeeLeaderboardSection({ suggestions }: EmployeeLeaderboardProps) {
  const topContributors = useMemo(() => {
    const empStats: Record<
      string,
      {
        id: string;
        name: string;
        dept: string;
        plant: string;
        photo: string;
        points: number;
        awards: string;
        sugsCount: number;
        implCount: number;
      }
    > = {};

    suggestions.forEach((s) => {
      const empId = s.employeeId || s.employeeName || "EMP";
      if (!empStats[empId]) {
        empStats[empId] = {
          id: empId,
          name: s.employeeName,
          dept: s.department,
          plant: s.plant,
          photo: s.employeePhoto,
          points: 0,
          awards: s.award || "Star Contributor",
          sugsCount: 0,
          implCount: 0,
        };
      }
      empStats[empId].points += s.points || 0;
      empStats[empId].sugsCount += 1;
      if (s.status === "implemented") empStats[empId].implCount += 1;
      if (s.award && s.award !== "None") empStats[empId].awards = s.award;
    });

    const rows = Object.values(empStats).map((e) => {
      const implPct = e.sugsCount > 0 ? Math.round((e.implCount / e.sugsCount) * 100) : 0;
      return {
        ...e,
        implPct,
        prevRank: 1,
        trend: "+1 Rank",
        isUp: true,
      };
    });

    rows.sort((a, b) => b.points - a.points);
    return rows.slice(0, 10).map((r, idx) => ({ ...r, currentRank: idx + 1 }));
  }, [suggestions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Employee Leaderboard — Top Contributors
          </h2>
          <p className="text-xs text-muted-foreground">Individual employee rankings based on total points and implemented ideas</p>
        </div>
      </div>

      <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Plant</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Suggestions</th>
                <th className="py-3 px-4">Implementation %</th>
                <th className="py-3 px-4">Award Recognition</th>
                <th className="py-3 px-4">Rank Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topContributors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                    No active contributors recorded in the database yet.
                  </td>
                </tr>
              ) : (
                topContributors.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold">
                      {emp.currentRank === 1 ? (
                        <Badge className="bg-amber-500 text-white font-black"><Crown className="w-3 h-3 mr-1" /> #1</Badge>
                      ) : emp.currentRank === 2 ? (
                        <Badge className="bg-slate-400 text-white font-black">#2</Badge>
                      ) : emp.currentRank === 3 ? (
                        <Badge className="bg-amber-700 text-white font-black">#3</Badge>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 pl-2">#{emp.currentRank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        {emp.photo ? (
                          <img src={emp.photo} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <span className="block font-bold">{emp.name}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">{emp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">{emp.dept}</span>
                      <span className="text-[10px] text-muted-foreground">{emp.plant}</span>
                    </td>
                    <td className="py-3 px-4 font-black text-primary">{emp.points} Pts</td>
                    <td className="py-3 px-4 font-semibold">{emp.sugsCount} Ideas</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full text-[11px]">
                        {emp.implPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {emp.awards}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={`inline-flex items-center gap-1 ${emp.isUp ? "text-emerald-600" : "text-slate-500"}`}>
                        {emp.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {emp.trend}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
