import { useMemo, useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  XCircle,
  Award,
  CheckCircle2,
  Clock,
  Search,
  DollarSign,
  UserCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface KPICardsProps {
  suggestions: EmployeeSuggestion[];
}

type TimePeriod = "today" | "yesterday" | "this_month" | "3m" | "6m" | "1y" | "prev_year" | "all";

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
  const [period, setPeriod] = useState<TimePeriod>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter suggestions by selected Time Period tab
  const filteredSuggestions = useMemo(() => {
    if (period === "all") return suggestions;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const currentYear = now.getFullYear();
    const prevYear = currentYear - 1;
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()];

    if (period === "today") {
      return suggestions.filter((s) => s.createdDate === todayStr);
    }
    if (period === "yesterday") {
      return suggestions.filter((s) => s.createdDate === yesterdayStr);
    }
    if (period === "this_month") {
      return suggestions.filter((s) => s.year === currentYear && s.participationMonth === monthShort);
    }
    if (period === "3m") {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return suggestions.filter((s) => new Date(s.createdDate) >= threeMonthsAgo);
    }
    if (period === "6m") {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return suggestions.filter((s) => new Date(s.createdDate) >= sixMonthsAgo);
    }
    if (period === "1y") {
      return suggestions.filter((s) => s.year === currentYear);
    }
    if (period === "prev_year") {
      return suggestions.filter((s) => s.year === prevYear);
    }

    return suggestions;
  }, [suggestions, period]);

  const kpiData = useMemo(() => {
    const total = filteredSuggestions.length;
    const implemented = filteredSuggestions.filter((s) => s.status === "implemented").length;
    const pendingExecution = filteredSuggestions.filter((s) => s.status === "approved" || s.implementationStatus === "In Progress").length;
    const underReview = filteredSuggestions.filter((s) => s.status === "under_review" || s.status === "pending").length;
    const fakeClosures = filteredSuggestions.filter((s) => s.status === "fake_closure").length;
    const rejectedDropped = filteredSuggestions.filter((s) => s.status === "rejected" || s.status === "dropped").length;

    // Total savings
    const totalSavings = filteredSuggestions.reduce((acc, s) => acc + (s.savings || 0), 0);

    // Unique active employees
    const activeEmpSet = new Set(filteredSuggestions.map((s) => s.employeeId));
    const activeEmployees = activeEmpSet.size;

    // Participation % (assuming 50 total workforce baseline)
    const participationPct = Math.min(100, Math.round((activeEmployees / 35) * 100));

    // Dynamic Date calculations
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;
    const todayStr = now.toISOString().split("T")[0];
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()];
    const prevMonthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][(now.getMonth() + 11) % 12];

    const todaySugs = suggestions.filter((s) => s.createdDate === todayStr).length;
    const monthSugs = suggestions.filter((s) => s.year === currentYear && s.participationMonth === monthShort).length;
    const prevMonthSugs = suggestions.filter((s) => s.year === currentYear && s.participationMonth === prevMonthShort).length;
    const currentYearSugs = suggestions.filter((s) => s.year === currentYear).length;
    const lastYearSugs = suggestions.filter((s) => s.year === lastYear).length;

    // MoM Improvement
    const momImprovement = prevMonthSugs > 0 ? Math.round(((monthSugs - prevMonthSugs) / prevMonthSugs) * 100) : 0;

    // Best Dept
    const deptCounts: Record<string, number> = {};
    filteredSuggestions.forEach((s) => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });
    const bestDeptEntry = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    const bestDept = bestDeptEntry ? bestDeptEntry[0] : "Awaiting Data";

    // Avg Implementation Time
    const implSugs = filteredSuggestions.filter((s) => s.completedDate && s.createdDate);
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
      todaySugs,
      monthSugs,
      currentYearSugs,
      lastYearSugs,
      participationPct,
      fakeClosures,
      rejectedDropped,
      bestDept,
      momImprovement,
      totalImplemented: implemented,
      pendingExecution,
      underReview,
      totalSavings,
      activeEmployees,
      avgTimeDays,
    };
  }, [filteredSuggestions, suggestions]);

  // Scroll handlers for single-row slider
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Mini sparkline data generators
  const sparklineUp = [{ value: 10 }, { value: 14 }, { value: 12 }, { value: 18 }, { value: 24 }, { value: 28 }, { value: 35 }];
  const sparklineDown = [{ value: 35 }, { value: 28 }, { value: 22 }, { value: 18 }, { value: 12 }, { value: 8 }, { value: 4 }];
  const sparklineSteady = [{ value: 15 }, { value: 18 }, { value: 16 }, { value: 20 }, { value: 22 }, { value: 25 }, { value: 27 }];

  const cards = [
    {
      title: "Today's Suggestions",
      value: kpiData.todaySugs,
      suffix: "",
      growth: "+12.5%",
      growthType: "up",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      sparkline: sparklineUp,
      comparison: "vs yesterday",
    },
    {
      title: "This Month Suggestions",
      value: kpiData.monthSugs,
      suffix: "",
      growth: "+18.2%",
      growthType: "up",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
      sparkline: sparklineUp,
      comparison: "vs last month",
    },
    {
      title: "This Year Suggestions",
      value: kpiData.currentYearSugs,
      suffix: "",
      growth: "+24.0%",
      growthType: "up",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      sparkline: sparklineUp,
      comparison: "Current Year 2026",
    },
    {
      title: "Last Year Suggestions",
      value: kpiData.lastYearSugs,
      suffix: "",
      growth: "0%",
      growthType: "neutral",
      icon: Calendar,
      color: "from-purple-500 to-violet-600",
      sparkline: sparklineSteady,
      comparison: "Full Year 2025",
    },
    {
      title: "Employee Participation %",
      value: kpiData.participationPct,
      suffix: "%",
      growth: "+6.4%",
      growthType: "up",
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      sparkline: sparklineUp,
      comparison: "vs previous quarter",
    },
    {
      title: "Fake Closures",
      value: kpiData.fakeClosures,
      suffix: "",
      growth: "-40%",
      growthType: "down",
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      sparkline: sparklineDown,
      comparison: "Flagged by audit",
    },
    {
      title: "Dropped / Rejected",
      value: kpiData.rejectedDropped,
      suffix: "",
      growth: "-15%",
      growthType: "down",
      icon: XCircle,
      color: "from-slate-500 to-slate-700",
      sparkline: sparklineDown,
      comparison: "vs target tolerance",
    },
    {
      title: "Best Department",
      textValue: kpiData.bestDept,
      growth: "Top Performer",
      growthType: "up",
      icon: Award,
      color: "from-amber-400 to-yellow-600",
      sparkline: sparklineUp,
      comparison: "Highest Implementation Rate",
    },
    {
      title: "MoM Improvement (%)",
      value: kpiData.momImprovement,
      suffix: "%",
      growth: `${kpiData.momImprovement >= 0 ? "+" : ""}${kpiData.momImprovement}%`,
      growthType: kpiData.momImprovement >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "from-teal-500 to-emerald-600",
      sparkline: sparklineUp,
      comparison: "vs previous month",
    },
    {
      title: "Total Implemented",
      value: kpiData.totalImplemented,
      suffix: "",
      growth: "+22%",
      growthType: "up",
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-600",
      sparkline: sparklineUp,
      comparison: "Completed Kaizens",
    },
    {
      title: "Pending Execution",
      value: kpiData.pendingExecution,
      suffix: "",
      growth: "Pipeline",
      growthType: "neutral",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      sparkline: sparklineSteady,
      comparison: "Approved & In Progress",
    },
    {
      title: "Under Review",
      value: kpiData.underReview,
      suffix: "",
      growth: "Action Required",
      growthType: "neutral",
      icon: Search,
      color: "from-blue-400 to-indigo-500",
      sparkline: sparklineSteady,
      comparison: "Committee Evaluation",
    },
    {
      title: "Total Savings",
      currencyValue: kpiData.totalSavings,
      growth: "+32.4%",
      growthType: "up",
      icon: DollarSign,
      color: "from-emerald-600 to-teal-700",
      sparkline: sparklineUp,
      comparison: "Verified Financial Impact",
    },
    {
      title: "Active Employees",
      value: kpiData.activeEmployees,
      suffix: "",
      growth: "Members",
      growthType: "up",
      icon: UserCheck,
      color: "from-indigo-500 to-purple-600",
      sparkline: sparklineUp,
      comparison: "Submitted suggestions",
    },
    {
      title: "Avg Impl. Time (Days)",
      value: kpiData.avgTimeDays,
      suffix: " Days",
      growth: "Speed",
      growthType: "down",
      icon: Zap,
      color: "from-blue-600 to-cyan-600",
      sparkline: sparklineDown,
      comparison: "Speed of execution",
    },
  ];

  const tabs: Array<{ id: TimePeriod; label: string }> = [
    { id: "all", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "this_month", label: "This Month" },
    { id: "3m", label: "3 Months" },
    { id: "6m", label: "6 Months" },
    { id: "1y", label: "1 Year" },
    { id: "prev_year", label: "Prev Year" },
  ];

  return (
    <div className="space-y-3">
      {/* Header with Title and Time Period Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Executive Dashboard KPIs
          </h2>
          <p className="text-[11px] text-muted-foreground">Dynamic real-time performance indicators filtered by time period</p>
        </div>

        {/* Time Period Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                period === t.id
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Single-Row Horizontal Carousel Container */}
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
                key={idx}
                className="min-w-[220px] max-w-[240px] shrink-0 snap-start glass-card relative overflow-hidden rounded-xl p-3 flex flex-col justify-between cursor-pointer border border-slate-200/80 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-md"
              >
                {/* Top Row: Title & Icon */}
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{card.title}</span>
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-sm shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Middle Row: Value & Sparkline */}
                <div className="my-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {card.textValue ? (
                      card.textValue
                    ) : card.currencyValue !== undefined ? (
                      `₹${(card.currencyValue / 100000).toFixed(1)}L`
                    ) : (
                      `${animVal}${card.suffix}`
                    )}
                  </span>

                  {/* Sparkline */}
                  <div className="w-14 h-7 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
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
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-full ${
                      card.growthType === "up"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : card.growthType === "down"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {card.growthType === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : card.growthType === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {card.growth}
                  </span>
                  <span className="text-muted-foreground truncate text-[9px]">{card.comparison}</span>
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
