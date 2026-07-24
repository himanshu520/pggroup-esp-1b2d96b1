import { useMemo, useEffect, useState } from "react";
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
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface KPICardsProps {
  suggestions: EmployeeSuggestion[];
}

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
  const kpiData = useMemo(() => {
    const total = suggestions.length;
    const implemented = suggestions.filter((s) => s.status === "implemented").length;
    const pendingExecution = suggestions.filter((s) => s.status === "approved" || s.implementationStatus === "In Progress").length;
    const underReview = suggestions.filter((s) => s.status === "under_review" || s.status === "pending").length;
    const fakeClosures = suggestions.filter((s) => s.status === "fake_closure").length;
    const rejectedDropped = suggestions.filter((s) => s.status === "rejected" || s.status === "dropped").length;
    
    // Total savings
    const totalSavings = suggestions.reduce((acc, s) => acc + (s.savings || 0), 0);
    
    // Unique active employees
    const activeEmpSet = new Set(suggestions.map((s) => s.employeeId));
    const activeEmployees = activeEmpSet.size;
    
    // Participation % (assuming 50 total workforce baseline)
    const participationPct = Math.min(100, Math.round((activeEmployees / 35) * 100));

    // Department counts to get best department
    const deptCounts: Record<string, number> = {};
    suggestions.forEach((s) => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });
    const bestDeptEntry = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    const bestDept = bestDeptEntry ? bestDeptEntry[0] : "Production";

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
        : 12;

    // Time-based calculations
    const todaySugs = suggestions.filter((s) => s.createdDate === "2026-07-18" || s.createdDate.startsWith("2026-07")).length || 3;
    const monthSugs = suggestions.filter((s) => s.participationMonth === "Jul" || s.createdDate.startsWith("2026-07")).length || 6;
    const currentYearSugs = suggestions.filter((s) => s.year === 2026).length;
    const lastYearSugs = 18; // Benchmark comparison

    return {
      todaySugs,
      monthSugs,
      currentYearSugs,
      lastYearSugs,
      participationPct,
      fakeClosures,
      rejectedDropped,
      bestDept,
      momImprovement: 14.8,
      totalImplemented: implemented,
      pendingExecution,
      underReview,
      totalSavings,
      activeEmployees,
      avgTimeDays,
    };
  }, [suggestions]);

  // Mini sparkline data generators
  const sparklineUp = [
    { value: 10 }, { value: 14 }, { value: 12 }, { value: 18 }, { value: 24 }, { value: 28 }, { value: 35 }
  ];
  const sparklineDown = [
    { value: 35 }, { value: 28 }, { value: 22 }, { value: 18 }, { value: 12 }, { value: 8 }, { value: 4 }
  ];
  const sparklineSteady = [
    { value: 15 }, { value: 18 }, { value: 16 }, { value: 20 }, { value: 22 }, { value: 25 }, { value: 27 }
  ];

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
      growth: "-5.2%",
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
      growth: "+14.8%",
      growthType: "up",
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
      growth: "3 in pipeline",
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
      growth: "+8 members",
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
      growth: "-2.5 Days",
      growthType: "down",
      icon: Zap,
      color: "from-blue-600 to-cyan-600",
      sparkline: sparklineDown,
      comparison: "Speed of execution",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Executive Dashboard KPIs
          </h2>
          <p className="text-xs text-muted-foreground">Real-time suggestion portal analytics & performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const animVal = useAnimatedCount(typeof card.value === "number" ? card.value : 0);

          return (
            <div
              key={idx}
              className="glass-card relative overflow-hidden rounded-xl p-3.5 flex flex-col justify-between group cursor-pointer border border-slate-200/80 dark:border-slate-800"
            >
              {/* Top Row: Title & Icon */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">{card.title}</span>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-sm shrink-0 transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Middle Row: Animated Main Value & Sparkline */}
              <div className="my-2 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {card.textValue ? (
                      card.textValue
                    ) : card.currencyValue !== undefined ? (
                      `₹${(card.currencyValue / 100000).toFixed(1)}L`
                    ) : (
                      `${animVal}${card.suffix}`
                    )}
                  </span>
                </div>
                {/* Mini Sparkline Chart */}
                <div className="w-16 h-8 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
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
              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-800">
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
                <span className="text-muted-foreground truncate">{card.comparison}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
