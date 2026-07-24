import { useMemo } from "react";
import { Award, Crown, ShieldCheck, Sparkles, Building2, TrendingUp, CheckCircle, Flame, ArrowUpRight, User, Image as ImageIcon } from "lucide-react";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DashboardHighlightsProps {
  suggestions: EmployeeSuggestion[];
}

export function DashboardHighlightsSection({ suggestions }: DashboardHighlightsProps) {
  // 1. Dynamic Best Plant calculation
  const bestPlant = useMemo(() => {
    if (suggestions.length === 0) return null;
    const plantStats: Record<string, { total: number; implemented: number; savings: number; points: number }> = {};
    suggestions.forEach((s) => {
      const p = s.plant || "Plant 1";
      if (!plantStats[p]) plantStats[p] = { total: 0, implemented: 0, savings: 0, points: 0 };
      plantStats[p].total += 1;
      if (s.status === "implemented") plantStats[p].implemented += 1;
      plantStats[p].savings += s.savings || 0;
      plantStats[p].points += s.points || 0;
    });

    const topEntry = Object.entries(plantStats).sort((a, b) => b[1].points - a[1].points)[0];
    if (!topEntry) return null;

    const [name, stat] = topEntry;
    const implPct = stat.total > 0 ? Math.round((stat.implemented / stat.total) * 100) : 0;
    const score = Math.min(100, Math.round(implPct * 0.6 + Math.min(40, stat.points / 10)));
    return {
      name,
      score,
      partPct: Math.min(100, stat.total * 15),
      implPct,
      savingsLacs: (stat.savings / 100000).toFixed(1),
    };
  }, [suggestions]);

  // 2. Dynamic Best Department calculation
  const bestDept = useMemo(() => {
    if (suggestions.length === 0) return null;
    const deptStats: Record<string, { points: number; total: number; implemented: number }> = {};
    suggestions.forEach((s) => {
      const d = s.department || "General";
      if (!deptStats[d]) deptStats[d] = { points: 0, total: 0, implemented: 0 };
      deptStats[d].points += s.points || 0;
      deptStats[d].total += 1;
      if (s.status === "implemented") deptStats[d].implemented += 1;
    });

    const sorted = Object.entries(deptStats).sort((a, b) => b[1].points - a[1].points);
    if (!sorted[0]) return null;

    const [name, stat] = sorted[0];
    return {
      name,
      points: stat.points,
      implemented: stat.implemented,
      total: stat.total,
    };
  }, [suggestions]);

  // 3. Dynamic Best Suggestion of Month
  const bestSug = useMemo(() => {
    if (suggestions.length === 0) return null;
    return [...suggestions].sort((a, b) => (b.points || 0) - (a.points || 0))[0] || null;
  }, [suggestions]);

  // 4. Dynamic Best Fool Proofing (Poka-Yoke)
  const bestFoolProofing = useMemo(() => {
    if (suggestions.length === 0) return null;
    return (
      suggestions.find((s) => s.category?.toLowerCase().includes("fool") || s.suggestionType?.toLowerCase().includes("fool")) ||
      suggestions[0] ||
      null
    );
  }, [suggestions]);

  // 5. Dynamic King of Suggestion / Champion
  const kingOfSug = useMemo(() => {
    if (suggestions.length === 0) return null;
    const empPoints: Record<string, { empName: string; empId: string; dept: string; plant: string; photo: string; points: number }> = {};

    suggestions.forEach((s) => {
      const key = s.employeeId || s.employeeName;
      if (!empPoints[key]) {
        empPoints[key] = {
          empName: s.employeeName,
          empId: s.employeeId,
          dept: s.department,
          plant: s.plant,
          photo: s.employeePhoto,
          points: 0,
        };
      }
      empPoints[key].points += s.points || 0;
    });

    const topEmp = Object.values(empPoints).sort((a, b) => b.points - a.points)[0];
    return topEmp || null;
  }, [suggestions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" /> Executive Dashboard Highlights
          </h2>
          <p className="text-xs text-muted-foreground">Top performers, champions, and award-winning implementations from current data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Best Plant */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500 text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Best Plant Award</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {bestPlant ? bestPlant.name : "Awaiting Data"}
                </h3>
              </div>
            </div>
            <Award className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Plant Score</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {bestPlant ? `${bestPlant.score} / 100` : "0 / 100"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Participation %</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {bestPlant ? `${bestPlant.partPct}%` : "0%"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Implementation %</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {bestPlant ? `${bestPlant.implPct}%` : "0%"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Total Savings</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {bestPlant ? `₹${bestPlant.savingsLacs} Lacs` : "₹0.0 Lacs"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Best Department */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600 text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Best Department</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {bestDept ? bestDept.name : "Awaiting Data"}
                </h3>
              </div>
            </div>
            <Crown className="w-6 h-6 text-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Total Points</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {bestDept ? `${bestDept.points} Points` : "0 Points"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Current Ranking</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {bestDept ? "#1 Org-Wide" : "N/A"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Implemented Ideas</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {bestDept ? `${bestDept.implemented} / ${bestDept.total}` : "0"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Status</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Active</span>
            </div>
          </div>
        </div>

        {/* Card 3: Best Suggestion of the Month */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              {bestSug?.employeePhoto ? (
                <img src={bestSug.employeePhoto} alt={bestSug.employeeName} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/40">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Best Suggestion of Month</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {bestSug ? bestSug.employeeName : "No Submissions Yet"}
                </h3>
                <span className="text-[10px] text-muted-foreground truncate block">
                  {bestSug ? `${bestSug.department} • ${bestSug.plant}` : "Corporate"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 my-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {bestSug ? bestSug.suggestionTitle : "Awaiting Employee Ideas"}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
              {bestSug ? bestSug.description : "No active suggestion description available."}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {bestSug ? `₹${(bestSug.savings / 100000).toFixed(1)}L Savings` : "₹0.0L Savings"}
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {bestSug ? `${bestSug.points} Points` : "0 Points"}
            </span>
          </div>
        </div>

        {/* Card 4: Best Fool Proofing (Poka-Yoke) */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 dark:from-purple-950/20 dark:to-slate-900 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-md shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">Best Fool Proofing (Poka-Yoke)</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {bestFoolProofing ? bestFoolProofing.employeeName : "No Fool Proofing Recorded"}
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full shrink-0">
              Zero Defect
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            <div>
              <span className="text-[10px] font-bold text-rose-600 block mb-0.5">BEFORE: Process Image</span>
              {bestFoolProofing?.beforeImage ? (
                <img src={bestFoolProofing.beforeImage} alt="Before" className="w-full h-20 rounded-md object-cover border border-rose-200" />
              ) : (
                <div className="w-full h-20 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                  <ImageIcon className="w-5 h-5 mr-1" /> No Image
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 block mb-0.5">AFTER: Poka-Yoke Solution</span>
              {bestFoolProofing?.afterImage ? (
                <img src={bestFoolProofing.afterImage} alt="After" className="w-full h-20 rounded-md object-cover border border-emerald-200" />
              ) : (
                <div className="w-full h-20 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                  <ImageIcon className="w-5 h-5 mr-1" /> No Image
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground line-clamp-1">
            {bestFoolProofing ? bestFoolProofing.suggestionTitle : "No Poka-Yoke solution recorded."}
          </p>
        </div>

        {/* Card 5: King of Suggestion / Y-to-Y Champion */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-rose-200/60 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/50 to-amber-50/30 dark:from-rose-950/20 dark:to-slate-900 md:col-span-2 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                {kingOfSug?.photo ? (
                  <img src={kingOfSug.photo} alt={kingOfSug.empName} className="w-14 h-14 rounded-full object-cover border-2 border-rose-500 shadow-md" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center font-black text-lg border-2 border-rose-500">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <Crown className="w-6 h-6 text-amber-400 absolute -top-2 -right-1 animate-bounce" />
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-sm">
                  <Flame className="w-3.5 h-3.5" /> KING OF SUGGESTIONS - CHAMPION
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1 truncate">
                  {kingOfSug ? kingOfSug.empName : "Awaiting Top Contributor"}
                </h3>
                <span className="text-xs text-muted-foreground truncate block">
                  {kingOfSug ? `${kingOfSug.dept} • ${kingOfSug.plant} • EMP ID: ${kingOfSug.empId}` : "No Employee Data"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] font-bold text-muted-foreground block">TOTAL POINTS</span>
                <span className="text-base font-black text-rose-600 dark:text-rose-400">
                  {kingOfSug ? `${kingOfSug.points} PTS` : "0 PTS"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] font-bold text-muted-foreground block">NATIONAL RANK</span>
                <span className="text-base font-black text-amber-500">
                  {kingOfSug ? "RANK #1" : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1 truncate">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Real-time leader derived strictly from current database suggestions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
