import { useMemo, memo } from "react";
import {
  ShieldCheck,
  DollarSign,
  Sparkles,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Layers,
  Award,
  BarChart2,
  ShieldAlert,
  CheckCheck,
} from "lucide-react";
import { normalizeStatusCategory, type EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface StatisticsSectionProps {
  suggestions: EmployeeSuggestion[];
}

function StatisticsSectionComponent({ suggestions }: StatisticsSectionProps) {
  const stats = useMemo(() => {
    const foolProofingCount = suggestions.filter(
      (s) =>
        s.category?.toLowerCase().includes("fool") ||
        s.suggestionType?.toLowerCase().includes("fool") ||
        s.suggestionTitle?.toLowerCase().includes("poka")
    ).length;

    const lowCostCount = suggestions.filter((s) => s.costType === "Low Cost").length;
    const noCostCount = suggestions.filter((s) => s.costType === "No Cost").length;
    const highCostCount = suggestions.filter((s) => s.costType === "High Cost").length;

    const kaizenCount = suggestions.filter(
      (s) =>
        s.category?.toLowerCase().includes("kaizen") ||
        s.suggestionType?.toLowerCase().includes("kaizen")
    ).length;

    const totalAwards = suggestions.filter((s) => s.award && s.award !== "None").length;
    const mdAwards = suggestions.filter(
      (s) =>
        (s.award || "").toLowerCase().includes("md") ||
        (s.award || "").toLowerCase().includes("special") ||
        (s.award || "").toLowerCase().includes("best")
    ).length;

    // Replacements for duplicates:
    const implementedCount = suggestions.filter(
      (s) => normalizeStatusCategory(s.status) === "Implemented"
    ).length;
    const implRate = suggestions.length > 0 ? ((implementedCount / suggestions.length) * 100).toFixed(1) : "0.0";

    const safetyCount = suggestions.filter(
      (s) =>
        s.category?.toLowerCase().includes("safety") ||
        s.category?.toLowerCase().includes("ehs") ||
        s.department?.toLowerCase().includes("safety") ||
        s.department?.toLowerCase().includes("ehs") ||
        s.suggestionTitle?.toLowerCase().includes("safety")
    ).length;

    const qualityCount = suggestions.filter(
      (s) =>
        s.category?.toLowerCase().includes("quality") ||
        s.category?.toLowerCase().includes("5s") ||
        s.suggestionTitle?.toLowerCase().includes("quality") ||
        s.suggestionTitle?.toLowerCase().includes("5s")
    ).length;

    return [
      {
        title: "Total Fool Proofing",
        value: foolProofingCount,
        icon: ShieldCheck,
        cardBg: "bg-purple-50/90 dark:bg-purple-950/40 border-purple-200/90 dark:border-purple-800/60 shadow-2xs",
        iconColor: "text-purple-600 bg-purple-100 dark:bg-purple-900/60",
      },
      {
        title: "Low Cost Suggestions",
        value: lowCostCount,
        icon: DollarSign,
        cardBg: "bg-blue-50/90 dark:bg-blue-950/40 border-blue-200/90 dark:border-blue-800/60 shadow-2xs",
        iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-900/60",
      },
      {
        title: "No Cost Suggestions",
        value: noCostCount,
        icon: Sparkles,
        cardBg: "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/90 dark:border-emerald-800/60 shadow-2xs",
        iconColor: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60",
      },
      {
        title: "High Cost / CapEx",
        value: highCostCount,
        icon: Layers,
        cardBg: "bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-800/60 shadow-2xs",
        iconColor: "text-amber-600 bg-amber-100 dark:bg-amber-900/60",
      },
      {
        title: "Total Kaizens",
        value: kaizenCount,
        icon: BarChart2,
        cardBg: "bg-cyan-50/90 dark:bg-cyan-950/40 border-cyan-200/90 dark:border-cyan-800/60 shadow-2xs",
        iconColor: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/60",
      },
      {
        title: "Implementation Rate",
        value: `${implRate}%`,
        icon: TrendingUp,
        cardBg: "bg-teal-50/90 dark:bg-teal-950/40 border-teal-200/90 dark:border-teal-800/60 shadow-2xs",
        iconColor: "text-teal-600 bg-teal-100 dark:bg-teal-900/60",
      },
      {
        title: "Safety & EHS Ideas",
        value: safetyCount,
        icon: ShieldAlert,
        cardBg: "bg-rose-50/90 dark:bg-rose-950/40 border-rose-200/90 dark:border-rose-800/60 shadow-2xs",
        iconColor: "text-rose-600 bg-rose-100 dark:bg-rose-900/60",
      },
      {
        title: "Quality & 5S Ideas",
        value: qualityCount,
        icon: CheckCheck,
        cardBg: "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200/90 dark:border-indigo-800/60 shadow-2xs",
        iconColor: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/60",
      },
      {
        title: "Total Recognitions",
        value: totalAwards,
        icon: Trophy,
        cardBg: "bg-orange-50/90 dark:bg-orange-950/40 border-orange-200/90 dark:border-orange-800/60 shadow-2xs",
        iconColor: "text-orange-600 bg-orange-100 dark:bg-orange-900/60",
      },
      {
        title: "MD Special Awards",
        value: mdAwards,
        icon: Award,
        cardBg: "bg-pink-50/90 dark:bg-pink-950/40 border-pink-200/90 dark:border-pink-800/60 shadow-2xs",
        iconColor: "text-pink-600 bg-pink-100 dark:bg-pink-900/60",
      },
    ];
  }, [suggestions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Key Organization Statistics
          </h2>
          <p className="text-xs text-muted-foreground">Aggregated metric counters across kaizens, cost classifications, safety, and quality innovations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl p-3.5 border flex items-center gap-3 hover:scale-[1.02] transition-transform ${item.cardBg}`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${item.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate block">{item.title}</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const StatisticsSection = memo(StatisticsSectionComponent);
