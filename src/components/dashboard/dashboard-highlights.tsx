import { Award, Crown, ShieldCheck, Sparkles, Building2, TrendingUp, CheckCircle, Flame, ArrowUpRight } from "lucide-react";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DashboardHighlightsProps {
  suggestions: EmployeeSuggestion[];
}

export function DashboardHighlightsSection({ suggestions }: DashboardHighlightsProps) {
  // Find Best Suggestion of the Month
  const bestSug = suggestions.find((s) => s.award.includes("King") || s.points >= 550) || suggestions[0];

  // Find Best Fool Proofing
  const bestFoolProofing = suggestions.find((s) => s.category === "Fool Proofing") || suggestions[0];

  // King of Suggestion Champion
  const kingOfSug = suggestions.find((s) => s.employeeName === "Pooja Reddy" || s.points >= 590) || suggestions[1];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" /> Executive Dashboard Highlights
          </h2>
          <p className="text-xs text-muted-foreground">Top performers, champions, and award-winning implementations</p>
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
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Plant 2 - Chennai Unit</h3>
              </div>
            </div>
            <Award className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Plant Score</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">98.4 / 100</span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Participation %</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">94.2%</span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Implementation %</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">92.0%</span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Total Savings</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹24.5 Lacs</span>
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
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Quality Department</h3>
              </div>
            </div>
            <Crown className="w-6 h-6 text-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Total Points</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1,890 Points</span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Current Ranking</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">#1 Org-Wide</span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Growth Trend</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +28.5%
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground block text-[10px]">Awards Won</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">8 Trophies</span>
            </div>
          </div>
        </div>

        {/* Card 3: Best Suggestion of the Month */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src={bestSug.employeePhoto} alt={bestSug.employeeName} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Best Suggestion of Month</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bestSug.employeeName}</h3>
                <span className="text-[10px] text-muted-foreground">{bestSug.department} • {bestSug.plant}</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 my-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{bestSug.suggestionTitle}</h4>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{bestSug.description}</p>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{(bestSug.savings / 100000).toFixed(1)}L Savings</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{bestSug.points} Points</span>
          </div>
        </div>

        {/* Card 4: Best Fool Proofing of the Month (with Before/After comparison) */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 dark:from-purple-950/20 dark:to-slate-900 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Best Fool Proofing (Poka-Yoke)</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bestFoolProofing.employeeName}</h3>
              </div>
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
              Zero Defect Impact
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            <div>
              <span className="text-[10px] font-bold text-rose-600 block mb-0.5">BEFORE: Manual Risk</span>
              <img src={bestFoolProofing.beforeImage} alt="Before" className="w-full h-20 rounded-md object-cover border border-rose-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 block mb-0.5">AFTER: Poka-Yoke Sensor</span>
              <img src={bestFoolProofing.afterImage} alt="After" className="w-full h-20 rounded-md object-cover border border-emerald-200" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground line-clamp-1">{bestFoolProofing.remarks}</p>
        </div>

        {/* Card 5: King of Suggestion / Y-to-Y Champion */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 border border-rose-200/60 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/50 to-amber-50/30 dark:from-rose-950/20 dark:to-slate-900 md:col-span-2 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={kingOfSug.employeePhoto} alt={kingOfSug.employeeName} className="w-14 h-14 rounded-full object-cover border-2 border-rose-500 shadow-md" />
                <Crown className="w-6 h-6 text-amber-400 absolute -top-2 -right-1 animate-bounce" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-sm">
                  <Flame className="w-3.5 h-3.5" /> KING OF SUGGESTIONS - Y2Y CHAMPION
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">{kingOfSug.employeeName}</h3>
                <span className="text-xs text-muted-foreground">{kingOfSug.department} • {kingOfSug.plant} • EMP ID: {kingOfSug.employeeId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] font-bold text-muted-foreground block">TOTAL POINTS</span>
                <span className="text-base font-black text-rose-600 dark:text-rose-400">{kingOfSug.points} PTS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] font-bold text-muted-foreground block">NATIONAL RANK</span>
                <span className="text-base font-black text-amber-500">RANK #1</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Key Achievement: Standardized procurement savings of ₹21.0 Lacs across 4 plants.
            </span>
            <span className="font-bold text-rose-600 flex items-center gap-1 cursor-pointer hover:underline">
              View Profile <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
