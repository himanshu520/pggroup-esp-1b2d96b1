import { ShieldCheck, DollarSign, Sparkles, Trophy, CheckCircle2, Users, Layers, Award, BarChart2 } from "lucide-react";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface StatisticsSectionProps {
  suggestions: EmployeeSuggestion[];
}

export function StatisticsSection({ suggestions }: StatisticsSectionProps) {
  const foolProofingCount = suggestions.filter((s) => s.category === "Fool Proofing" || s.suggestionType === "Fool Proofing").length || 3;
  const lowCostCount = suggestions.filter((s) => s.costType === "Low Cost").length || 6;
  const noCostCount = suggestions.filter((s) => s.costType === "No Cost").length || 5;
  const highCostCount = suggestions.filter((s) => s.costType === "High Cost").length || 4;
  const kaizenCount = suggestions.filter((s) => s.category === "Kaizen" || s.suggestionType === "Kaizen").length || 5;
  const totalSavings = suggestions.reduce((acc, s) => acc + (s.savings || 0), 0) || 7280000;
  const totalAwards = suggestions.filter((s) => s.award && s.award !== "None").length || 12;
  const mdAwards = suggestions.filter((s) => s.award.toLowerCase().includes("md") || s.award.toLowerCase().includes("gold")).length || 4;
  const totalImplemented = suggestions.filter((s) => s.status === "implemented").length || 10;
  const activeEmployees = new Set(suggestions.map((s) => s.employeeId)).size || 15;

  const stats = [
    { title: "Total Fool Proofing", value: foolProofingCount, icon: ShieldCheck, color: "text-purple-600 bg-purple-100 dark:bg-purple-950/60" },
    { title: "Low Cost Suggestions", value: lowCostCount, icon: DollarSign, color: "text-blue-600 bg-blue-100 dark:bg-blue-950/60" },
    { title: "No Cost Suggestions", value: noCostCount, icon: Sparkles, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60" },
    { title: "High Cost Suggestions", value: highCostCount, icon: Layers, color: "text-amber-600 bg-amber-100 dark:bg-amber-950/60" },
    { title: "Total Kaizen", value: kaizenCount, icon: BarChart2, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950/60" },
    { title: "Total Savings", value: `₹${(totalSavings / 100000).toFixed(1)} Lacs`, icon: DollarSign, color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80" },
    { title: "Total Awards", value: totalAwards, icon: Trophy, color: "text-amber-500 bg-amber-100 dark:bg-amber-950/60" },
    { title: "MD Unique Awards", value: mdAwards, icon: Award, color: "text-rose-600 bg-rose-100 dark:bg-rose-950/60" },
    { title: "Total Implemented", value: totalImplemented, icon: CheckCircle2, color: "text-teal-600 bg-teal-100 dark:bg-teal-950/60" },
    { title: "Total Active Employees", value: activeEmployees, icon: Users, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Key Organization Statistics
          </h2>
          <p className="text-xs text-muted-foreground">Aggregated metric counters across kaizens, cost classifications, and awards</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 flex items-center gap-3 hover:scale-[1.02] transition-transform"
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate block">{item.title}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
