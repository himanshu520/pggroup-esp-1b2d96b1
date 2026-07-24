import { Award, Crown, TrendingUp, TrendingDown, Users, CheckCircle2, Trophy, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface EmployeeLeaderboardProps {
  suggestions: EmployeeSuggestion[];
}

export function EmployeeLeaderboardSection({ suggestions }: EmployeeLeaderboardProps) {
  const topContributors = [
    {
      id: "EMP-1342",
      name: "Pooja Reddy",
      dept: "Purchase",
      plant: "Plant 4",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      points: 590,
      awards: "King of Suggestion Candidate",
      sugsCount: 6,
      implPct: 100,
      currentRank: 1,
      prevRank: 2,
      trend: "+1 Rank",
      isUp: true,
    },
    {
      id: "EMP-1089",
      name: "Vikram Rathore",
      dept: "Maintenance",
      plant: "Plant 3",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      points: 600,
      awards: "Best Kaizen Trophy",
      sugsCount: 5,
      implPct: 100,
      currentRank: 2,
      prevRank: 1,
      trend: "-1 Rank",
      isUp: false,
    },
    {
      id: "EMP-1195",
      name: "Karthik Gowda",
      dept: "Tool Room",
      plant: "Plant 4",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      points: 550,
      awards: "Best Fool Proofing",
      sugsCount: 4,
      implPct: 100,
      currentRank: 3,
      prevRank: 4,
      trend: "+1 Rank",
      isUp: true,
    },
    {
      id: "EMP-1042",
      name: "Priya Sundaram",
      dept: "Quality",
      plant: "Plant 2",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      points: 520,
      awards: "Innovator of the Month",
      sugsCount: 4,
      implPct: 100,
      currentRank: 4,
      prevRank: 3,
      trend: "-1 Rank",
      isUp: false,
    },
    {
      id: "EMP-1315",
      name: "Harpreet Singh",
      dept: "IT",
      plant: "Plant 1",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      points: 480,
      awards: "Digital Star",
      sugsCount: 3,
      implPct: 100,
      currentRank: 5,
      prevRank: 7,
      trend: "+2 Ranks",
      isUp: true,
    },
    {
      id: "EMP-1001",
      name: "Rajesh Kumar Sharma",
      dept: "Production",
      plant: "Plant 1",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      points: 450,
      awards: "MD Gold Award",
      sugsCount: 3,
      implPct: 100,
      currentRank: 6,
      prevRank: 5,
      trend: "-1 Rank",
      isUp: false,
    },
  ];

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
              {topContributors.map((emp) => (
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
                      <img src={emp.photo} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
