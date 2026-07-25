import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Activity, MapPin, Building2, Tag, Layers, TrendingUp } from "lucide-react";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DashboardChartsProps {
  suggestions: EmployeeSuggestion[];
}

// Professional Soft Pastel Light Palette
const LIGHT_COLORS = [
  "#6366F1", // Soft Indigo
  "#10B981", // Soft Emerald Mint
  "#F59E0B", // Soft Amber
  "#06B6D4", // Soft Cyan
  "#8B5CF6", // Soft Violet
  "#EC4899", // Soft Rose Pink
  "#14B8A6", // Soft Teal
  "#3B82F6", // Soft Sky Blue
];

// Custom Soft Glassmorphic Light Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700 shadow-xl rounded-lg p-2.5 text-xs backdrop-blur-md">
        {label && <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 border-b border-slate-100 dark:border-slate-800 pb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name || entry.dataKey}:
            </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardChartsSection({ suggestions }: DashboardChartsProps) {
  // 1. Suggestion State / Status Breakdown (Pending, Under Review, Approved, Implemented, Rejected)
  const statusStateData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      "Pending": 0,
      "Under Review": 0,
      "Approved": 0,
      "Implemented": 0,
      "Rejected / Dropped": 0,
    };

    suggestions.forEach((s) => {
      if (s.status === "implemented") {
        statusCounts["Implemented"] += 1;
      } else if (s.status === "under_review") {
        statusCounts["Under Review"] += 1;
      } else if (s.status === "approved") {
        statusCounts["Approved"] += 1;
      } else if (s.status === "rejected" || s.status === "dropped") {
        statusCounts["Rejected / Dropped"] += 1;
      } else {
        statusCounts["Pending"] += 1;
      }
    });

    return [
      { state: "Pending", count: statusCounts["Pending"], fill: "#F59E0B" },
      { state: "Under Review", count: statusCounts["Under Review"], fill: "#3B82F6" },
      { state: "Approved", count: statusCounts["Approved"], fill: "#8B5CF6" },
      { state: "Implemented", count: statusCounts["Implemented"], fill: "#10B981" },
      { state: "Rejected / Dropped", count: statusCounts["Rejected / Dropped"], fill: "#F43F5E" },
    ];
  }, [suggestions]);

  // 2. Plant-wise Distribution (Donut Chart)
  const plantData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      counts[s.plant] = (counts[s.plant] || 0) + 1;
    });
    return Object.entries(counts).map(([plant, value]) => ({ name: plant, value }));
  }, [suggestions]);

  // 3. Suggestion Category Distribution (Pie Chart)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [suggestions]);

  // 4. Gender-wise Participation (Donut Chart)
  const genderData = useMemo(() => {
    const counts: Record<string, number> = { Male: 0, Female: 0, Others: 0 };
    suggestions.forEach((s) => {
      const g = s.gender || "Male";
      counts[g] = (counts[g] || 0) + 1;
    });
    return [
      { name: "Male", value: counts.Male },
      { name: "Female", value: counts.Female },
      { name: "Others", value: counts.Others },
    ];
  }, [suggestions]);

  // 5. Execution Pending Department-wise (Horizontal Bar Chart)
  const pendingDeptData = useMemo(() => {
    const deptPending: Record<string, number> = {};
    suggestions
      .filter((s) => s.status !== "implemented" && s.status !== "rejected")
      .forEach((s) => {
        deptPending[s.department] = (deptPending[s.department] || 0) + 1;
      });
    return Object.entries(deptPending)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [suggestions]);

  // 6. Cost Category Stacked Column Chart (No Cost, Low Cost, High Cost)
  const costCategoryData = useMemo(() => {
    const deptCost: Record<string, { "No Cost": number; "Low Cost": number; "High Cost": number }> = {};

    suggestions.forEach((s) => {
      const dept = s.department || "General";
      if (!deptCost[dept]) {
        deptCost[dept] = { "No Cost": 0, "Low Cost": 0, "High Cost": 0 };
      }
      const ct = s.costType || "No Cost";
      if (ct === "High Cost") deptCost[dept]["High Cost"] += 1;
      else if (ct === "Low Cost") deptCost[dept]["Low Cost"] += 1;
      else deptCost[dept]["No Cost"] += 1;
    });

    return Object.entries(deptCost)
      .map(([department, costs]) => ({
        department,
        ...costs,
      }))
      .slice(0, 6);
  }, [suggestions]);

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 7. Monthly Trend (Line Chart: Current Year vs Last Year)
  const monthlyTrendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    return MONTHS.map((m) => {
      const curCount = suggestions.filter((s) => s.participationMonth === m && s.year === currentYear).length;
      const lastCount = suggestions.filter((s) => s.participationMonth === m && s.year === lastYear).length;
      return {
        month: m,
        [`Current Year (${currentYear})`]: curCount,
        [`Last Year (${lastYear})`]: lastCount,
      };
    });
  }, [suggestions]);

  // 8. Monthly Participation Area Chart
  const monthlyParticipationData = useMemo(() => {
    return MONTHS.map((m) => {
      const monthSugs = suggestions.filter((s) => s.participationMonth === m);
      const uniqueEmps = new Set(monthSugs.map((s) => s.employeeId)).size;
      return {
        month: m,
        Participants: uniqueEmps,
      };
    });
  }, [suggestions]);

  // 9. Department Ranking Bar Chart
  const deptRankingData = useMemo(() => {
    const deptPoints: Record<string, number> = {};
    suggestions.forEach((s) => {
      deptPoints[s.department] = (deptPoints[s.department] || 0) + (s.points || 0);
    });
    return Object.entries(deptPoints)
      .map(([department, points]) => ({ department, points }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 7);
  }, [suggestions]);

  // 10. Suggestion Status Donut Chart
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return [
      { name: "Implemented", value: counts.implemented || 0 },
      { name: "Approved", value: counts.approved || 0 },
      { name: "Pending", value: counts.pending || 0 },
      { name: "Under Review", value: counts.under_review || 0 },
      { name: "Rejected / Dropped", value: (counts.rejected || 0) + (counts.dropped || 0) },
    ];
  }, [suggestions]);

  // 11. Year-wise Comparison
  const yearComparisonData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const curSugs = suggestions.filter((s) => s.year === currentYear);
    const lastSugs = suggestions.filter((s) => s.year === lastYear);

    const curImpl = curSugs.filter((s) => s.status === "implemented").length;
    const lastImpl = lastSugs.filter((s) => s.status === "implemented").length;

    const curSavings = Math.round(curSugs.reduce((acc, s) => acc + (s.savings || 0), 0) / 100000);
    const lastSavings = Math.round(lastSugs.reduce((acc, s) => acc + (s.savings || 0), 0) / 100000);

    const curAwards = curSugs.filter((s) => s.award && s.award !== "None").length;
    const lastAwards = lastSugs.filter((s) => s.award && s.award !== "None").length;

    return [
      { metric: "Total Suggestions", [lastYear.toString()]: lastSugs.length, [currentYear.toString()]: curSugs.length },
      { metric: "Implemented", [lastYear.toString()]: lastImpl, [currentYear.toString()]: curImpl },
      { metric: "Savings (in Lacs)", [lastYear.toString()]: lastSavings, [currentYear.toString()]: curSavings },
      { metric: "Awards Given", [lastYear.toString()]: lastAwards, [currentYear.toString()]: curAwards },
    ];
  }, [suggestions]);

  // 12. Plant Performance Radar Chart
  const radarData = useMemo(() => {
    const plantList = ["Plant 1", "Plant 2", "Plant 3", "Plant 4"];

    const getMetricValue = (plant: string, metric: string) => {
      const plantSugs = suggestions.filter((s) => s.plant === plant);
      if (plantSugs.length === 0) return 0;

      if (metric === "Participation %") {
        const uniqueEmp = new Set(plantSugs.map((s) => s.employeeId)).size;
        return Math.min(100, Math.round((uniqueEmp / 10) * 100));
      }
      if (metric === "Implementation %") {
        const impl = plantSugs.filter((s) => s.status === "implemented").length;
        return Math.round((impl / plantSugs.length) * 100);
      }
      if (metric === "Avg Points") {
        const totalPts = plantSugs.reduce((acc, s) => acc + (s.points || 0), 0);
        return Math.round(totalPts / plantSugs.length);
      }
      if (metric === "Savings Rate") {
        const totalSav = plantSugs.reduce((acc, s) => acc + (s.savings || 0), 0);
        return Math.min(100, Math.round(totalSav / 10000));
      }
      if (metric === "5S Compliance") {
        const count5s = plantSugs.filter((s) => s.category === "5S" || s.suggestionType === "5S").length;
        return Math.min(100, count5s * 25 + 50);
      }
      return 50;
    };

    const subjects = ["Participation %", "Implementation %", "Avg Points", "Savings Rate", "5S Compliance"];
    return subjects.map((subj) => {
      const row: Record<string, any> = { subject: subj };
      plantList.forEach((p) => {
        row[p] = getMetricValue(p, subj);
      });
      return row;
    });
  }, [suggestions]);

  // 13. Monthly Area Cost Savings
  const savingsData = useMemo(() => {
    let cumulative = 0;
    return MONTHS.map((m) => {
      const monthSugs = suggestions.filter((s) => s.participationMonth === m);
      const mSavings = monthSugs.reduce((acc, s) => acc + (s.savings || 0), 0);
      cumulative += mSavings;
      return {
        month: m,
        Savings: parseFloat((cumulative / 100000).toFixed(1)),
      };
    });
  }, [suggestions]);

  // 14. Suggestion Execution Timeline
  const timelineData = useMemo(() => {
    return MONTHS.slice(0, 7).map((m) => {
      const monthSugs = suggestions.filter((s) => s.participationMonth === m);
      const completed = monthSugs.filter((s) => s.status === "implemented" || s.completedDate !== null).length;
      return {
        week: m,
        Submitted: monthSugs.length,
        Completed: completed,
      };
    });
  }, [suggestions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" /> Interactive Executive Analytics & Charts
          </h2>
          <p className="text-xs text-muted-foreground">Power BI professional dashboard charts with soft light color palettes (3 per row)</p>
        </div>
      </div>

      {/* SINGLE UNIFIED GRID: 3 Charts Per Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Chart 1: Suggestion State / Status Distribution */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-indigo-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Suggestion State Breakdown</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              Workflow Stages
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusStateData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusStateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Plant-wise Distribution */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-amber-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-amber-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Plant-wise Distribution</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              Manufacturing Units
            </span>
          </div>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={plantData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {plantData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={LIGHT_COLORS[index % LIGHT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Suggestion Category Distribution */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-emerald-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Tag className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Category Distribution</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              Safety, 5S, Kaizen
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-cat-${index}`} fill={LIGHT_COLORS[index % LIGHT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Gender-wise Participation */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-purple-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <PieIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Gender Participation</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
              Workforce Ratio
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={6} dataKey="value">
                  <Cell fill="#6366F1" />
                  <Cell fill="#EC4899" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Execution Pending Department Wise */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-rose-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-rose-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Pending Dept-Wise</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
              Pipeline Bottlenecks
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={pendingDeptData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#F43F5E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Cost Category Stacked Column Chart */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-teal-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-teal-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Cost Breakdown</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
              Investment Tiers
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costCategoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
                <Bar dataKey="No Cost" stackId="a" fill="#10B981" />
                <Bar dataKey="Low Cost" stackId="a" fill="#3B82F6" />
                <Bar dataKey="High Cost" stackId="a" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Monthly Trend */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-blue-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-blue-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <LineIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Monthly Trend</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              2026 vs 2025
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Current Year (2026)" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Last Year (2025)" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Monthly Participation */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-cyan-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-cyan-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Monthly Participation</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300">
              Active Submitters
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyParticipationData}>
                <defs>
                  <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Participants" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 9: Department Ranking */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-amber-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-amber-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Dept Points Ranking</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              Leaderboard Points
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRankingData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="points" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 10: Suggestion Status Donut */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-emerald-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <PieIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Status Breakdown</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              Org Totals
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {statusData.map((_, index) => (
                    <Cell key={`cell-st-${index}`} fill={LIGHT_COLORS[index % LIGHT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 11: Year-wise Comparison */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-indigo-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">YoY Comparison</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              2025 vs 2026
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearComparisonData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="metric" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
                <Bar dataKey="2025" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2026" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 12: Plant Performance Radar Chart */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-rose-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-rose-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Plant Radar Matrix</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
              Plant 1-4
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="Plant 1" dataKey="Plant 1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} />
                <Radar name="Plant 2" dataKey="Plant 2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.25} />
                <Legend tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 13: Cost Savings Monthly Area */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-teal-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-teal-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Cumulative Savings</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
              ₹ Lacs
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSav" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Savings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSav)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 14: Suggestion Execution Timeline */}
        <div className="glass-card relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-sky-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:to-slate-950 border border-sky-100/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <LineIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Execution Velocity</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300">
              Timeline
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Submitted" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Completed" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
