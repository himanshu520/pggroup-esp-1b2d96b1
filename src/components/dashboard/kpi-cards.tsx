import { useMemo, useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Search,
  DollarSign,
  UserCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface KPICardsProps {
  suggestions: EmployeeSuggestion[];
}

type SugTimeSubFilter = "today" | "month" | "year" | "prev_year" | "all";

// Simple counter hook for smooth number animation
function useAnimatedCount(targetValue: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (targetValue - startValue) + startValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [targetValue, duration]);
  return count;
}

export function KPICardsSection({ suggestions }: KPICardsProps) {
  const [sugFilter, setSugFilter] = useState<SugTimeSubFilter>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Compute suggestions count based on Card 1 internal switcher button
  const mergedSuggestionsCount = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()];

    if (sugFilter === "today") {
      return suggestions.filter((s) => s.createdDate === todayStr).length;
    }
    if (sugFilter === "month") {
      return suggestions.filter((s) => s.year === currentYear && s.participationMonth === monthShort).length;
    }
    if (sugFilter === "year") {
      return suggestions.filter((s) => s.year === currentYear).length;
    }
    if (sugFilter === "prev_year") {
      return suggestions.filter((s) => s.year === lastYear).length;
    }
    return suggestions.length;
  }, [suggestions, sugFilter]);

  const kpiData = useMemo(() => {
    const total = suggestions.length;
    const implemented = suggestions.filter((s) => s.status === "implemented").length;
    const pendingExecution = suggestions.filter((s) => s.status === "approved" || s.implementationStatus === "In Progress").length;
    const underReview = suggestions.filter((s) => s.status === "under_review" || s.status === "pending").length;

    // Total savings
    const totalSavings = suggestions.reduce((acc, s) => acc + (s.savings || 0), 0);

    // Unique active employees
    const activeEmpSet = new Set(suggestions.map((s) => s.employeeId));
    const activeEmployees = activeEmpSet.size;

    // Participation % (assuming 50 total workforce baseline)
    const participationPct = Math.min(100, Math.round((activeEmployees / 35) * 100));

    // Best Dept
    const deptCounts: Record<string, number> = {};
    suggestions.forEach((s) => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });
    const bestDeptEntry = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    const bestDept = bestDeptEntry ? bestDeptEntry[0] : "Awaiting Data";

    // Avg Implementation Time
    const implSugs = suggestions.filter((s) => s.completedDate && s.createdDate);
    const avgTimeDays =
      implSugs.length > 0
        ? Math.round(
            implSugs.reduce((acc, s) => {
              const diffMs = new Date(s.completedDate!).getTime() - new Date(s.createdDate).getTime();
              return acc + diffMs / (1000 * 60 * 60 * 24);
            }, 0) / implSugs.length
          )
        : 0;

    return {
      total,
      totalImplemented: implemented,
      pendingExecution,
      underReview,
      totalSavings,
      participationPct,
      activeEmployees,
      bestDept,
      avgTimeDays,
    };
  }, [suggestions]);

  // Scroll handlers for single-row slider
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Mini sparklines
  const sparklineUp = [{ value: 10 }, { value: 14 }, { value: 12 }, { value: 18 }, { value: 24 }, { value: 28 }, { value: 35 }];
  const sparklineDown = [{ value: 35 }, { value: 28 }, { value: 22 }, { value: 18 }, { value: 12 }, { value: 8 }, { value: 4 }];
  const sparklineSteady = [{ value: 15 }, { value: 18 }, { value: 16 }, { value: 20 }, { value: 22 }, { value: 25 }, { value: 27 }];

  // 9 Consolidated Executive KPI Cards
  const cards = [
    {
      id: "suggestions",
      title: "Suggestions Submitted",
      value: mergedSuggestionsCount,
      isMergedCard: true,
      growth: "+14.5%",
      growthType: "up",
      icon: Sparkles,
      lightBg: "bg-blue-50/90 dark:bg-blue-950/30 border-blue-200/90 dark:border-blue-800/60",
      iconBg: "bg-blue-500 text-white",
      sparkline: sparklineUp,
      comparison: "Switch period inside",
    },
    {
      id: "implemented",
      title: "Total Implemented",
      value: kpiData.totalImplemented,
      suffix: "",
      growth: `${kpiData.total > 0 ? Math.round((kpiData.totalImplemented / kpiData.total) * 100) : 0}% Impl Rate`,
      growthType: "up",
      icon: CheckCircle2,
      lightBg: "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/60",
      iconBg: "bg-emerald-500 text-white",
      sparkline: sparklineUp,
      comparison: "Completed Kaizens",
    },
    {
      id: "pending",
      title: "Pending Execution",
      value: kpiData.pendingExecution,
      suffix: "",
      growth: "In Pipeline",
      growthType: "neutral",
      icon: Clock,
      lightBg: "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60",
      iconBg: "bg-amber-500 text-white",
      sparkline: sparklineSteady,
      comparison: "Approved & In Progress",
    },
    {
      id: "review",
      title: "Under Review",
      value: kpiData.underReview,
      suffix: "",
      growth: "Evaluation",
      growthType: "neutral",
      icon: Search,
      lightBg: "bg-sky-50/90 dark:bg-sky-950/30 border-sky-200/90 dark:border-sky-800/60",
      iconBg: "bg-sky-500 text-white",
      sparkline: sparklineSteady,
      comparison: "Committee Review",
    },
    {
      id: "savings",
      title: "Total Savings",
      currencyValue: kpiData.totalSavings,
      growth: "+32.4%",
      growthType: "up",
      icon: DollarSign,
      lightBg: "bg-teal-50/90 dark:bg-teal-950/30 border-teal-200/90 dark:border-teal-800/60",
      iconBg: "bg-teal-600 text-white",
      sparkline: sparklineUp,
      comparison: "Verified Impact",
    },
    {
      id: "participation",
      title: "Participation %",
      value: kpiData.participationPct,
      suffix: "%",
      growth: "+6.4%",
      growthType: "up",
      icon: Users,
      lightBg: "bg-purple-50/90 dark:bg-purple-950/30 border-purple-200/90 dark:border-purple-800/60",
      iconBg: "bg-purple-500 text-white",
      sparkline: sparklineUp,
      comparison: "Active workforce",
    },
    {
      id: "active_emp",
      title: "Active Employees",
      value: kpiData.activeEmployees,
      suffix: "",
      growth: "Contributors",
      growthType: "up",
      icon: UserCheck,
      lightBg: "bg-indigo-50/90 dark:bg-indigo-950/30 border-indigo-200/90 dark:border-indigo-800/60",
      iconBg: "bg-indigo-500 text-white",
      sparkline: sparklineUp,
      comparison: "Submitted ideas",
    },
    {
      id: "best_dept",
      title: "Best Department",
      textValue: kpiData.bestDept,
      growth: "Top Rank",
      growthType: "up",
      icon: Award,
      lightBg: "bg-orange-50/90 dark:bg-orange-950/30 border-orange-200/90 dark:border-orange-800/60",
      iconBg: "bg-orange-500 text-white",
      sparkline: sparklineUp,
      comparison: "Top Points",
    },
    {
      id: "speed",
      title: "Avg Impl. Speed",
      value: kpiData.avgTimeDays,
      suffix: " Days",
      growth: "Execution",
      growthType: "down",
      icon: Zap,
      lightBg: "bg-rose-50/90 dark:bg-rose-950/30 border-rose-200/90 dark:border-rose-800/60",
      iconBg: "bg-rose-500 text-white",
      sparkline: sparklineDown,
      comparison: "Cycle time",
    },
  ];

  const subFilterButtons: Array<{ id: SugTimeSubFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
    { id: "prev_year", label: "Prev" },
  ];

  return (
    <div className="space-y-3">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Executive Dashboard KPIs (9 Metrics)
          </h2>
          <p className="text-[11px] text-muted-foreground">Light pastel themed cards arranged in a single row</p>
        </div>
      </div>

      {/* Single-Row 9 KPI Cards Container */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Single Row Flex Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory transition-all duration-300"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const animVal = useAnimatedCount(typeof card.value === "number" ? card.value : 0);

            return (
              <div
                key={card.id}
                className={`min-w-[240px] max-w-[260px] shrink-0 snap-start relative overflow-hidden rounded-xl p-3 flex flex-col justify-between cursor-pointer border shadow-sm transition-all hover:shadow-md hover:scale-[1.01] ${card.lightBg}`}
              >
                {/* Top Row: Title & Icon */}
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{card.title}</span>
                  <div className={`p-1.5 rounded-lg ${card.iconBg} shadow-xs shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 1 Specific: Internal Period Switcher Pills */}
                {card.isMergedCard && (
                  <div className="flex items-center gap-1 my-1.5 bg-white/70 dark:bg-slate-900/70 p-1 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                    {subFilterButtons.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSugFilter(b.id);
                        }}
                        className={`flex-1 py-0.5 text-[9px] font-black rounded transition-all ${
                          sugFilter === b.id
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Middle Row: Animated Main Value & Sparkline */}
                <div className="my-1 flex items-baseline justify-between gap-2">
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {card.textValue ? (
                      card.textValue
                    ) : card.currencyValue !== undefined ? (
                      `₹${(card.currencyValue / 100000).toFixed(1)}L`
                    ) : (
                      `${animVal}${card.suffix || ""}`
                    )}
                  </span>

                  {/* Sparkline */}
                  <div className="w-14 h-7 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={card.sparkline}>
                        <defs>
                          <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0066FF" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#0066FF" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#0066FF" strokeWidth={2} fill={`url(#grad-${idx})`} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bottom Row: Growth Badge & Comparison */}
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-full ${
                      card.growthType === "up"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                        : card.growthType === "down"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                        : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {card.growthType === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : card.growthType === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {card.growth}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 truncate text-[9px] font-medium">{card.comparison}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
