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
  LabelList,
} from "recharts";
import { Activity } from "lucide-react";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DashboardChartsProps {
  suggestions: EmployeeSuggestion[];
}

// Color Palette Extracted Directly from Reference Screenshots
const SCREENSHOT_PALETTE = [
  "#A5B4FC", // Soft Periwinkle Blue
  "#C084FC", // Soft Pastel Lavender
  "#7DD3FC", // Soft Aqua Cyan
  "#FCA5A5", // Soft Pastel Salmon / Pink
  "#A7F3D0", // Soft Mint Green
  "#FDE047", // Soft Warm Yellow
  "#F472B6", // Soft Pastel Magenta
  "#93C5FD", // Soft Sky Blue
];

// Custom Clean Tooltip matching reference screenshot style
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md p-2.5 text-xs backdrop-blur-md z-50">
        {label && <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 border-b border-slate-100 dark:border-slate-800 pb-0.5">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm inline-block shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name || entry.dataKey}:
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Outer callout label for Pie & Donut Charts - renders values outside slice with clean leader lines
const renderOuterPieLabel = ({ cx, cy, midAngle, outerRadius, percent, value }: any) => {
  if (value === undefined || value === 0) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 14;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? "start" : "end";
  const pctStr = percent !== undefined ? ` (${(percent * 100).toFixed(0)}%)` : "";

  return (
    <text
      x={x}
      y={y}
      fill="#334155"
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="text-[11px] font-extrabold"
    >
      {`${value}${pctStr}`}
    </text>
  );
};

export function DashboardChartsSection({ suggestions }: DashboardChartsProps) {
  // 1. Suggestion State / Status Breakdown (Pending, Under Review, Approved, Implemented, Rejected)
  const statusStateData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      "Pending": 0,
      "Under Review": 0,
      "Approved": 0,
      "Implemented": 0,
      "Rejected": 0,
    };

    suggestions.forEach((s) => {
      if (s.status === "implemented") {
        statusCounts["Implemented"] += 1;
      } else if (s.status === "under_review") {
        statusCounts["Under Review"] += 1;
      } else if (s.status === "approved") {
        statusCounts["Approved"] += 1;
      } else if (s.status === "rejected" || s.status === "dropped") {
        statusCounts["Rejected"] += 1;
      } else {
        statusCounts["Pending"] += 1;
      }
    });

    return [
      { state: "Pending", count: statusCounts["Pending"], fill: "#FDE047" },
      { state: "Under Review", count: statusCounts["Under Review"], fill: "#7DD3FC" },
      { state: "Approved", count: statusCounts["Approved"], fill: "#C084FC" },
      { state: "Implemented", count: statusCounts["Implemented"], fill: "#A7F3D0" },
      { state: "Rejected", count: statusCounts["Rejected"], fill: "#FCA5A5" },
    ];
  }, [suggestions]);

  // 2. Plant-wise Distribution (Donut Chart)
  const plantData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      const p = (s.plant && s.plant !== "—" ? s.plant : "Unassigned").trim();
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).map(([plant, value]) => ({
      name: plant.length > 18 ? plant.slice(0, 18) + "..." : plant,
      value,
    }));
  }, [suggestions]);

  // 3. Suggestion Category Distribution (Pie Chart)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      let cat = (s.category && s.category !== "—" ? s.category : "General").trim();
      if (cat.length > 18) {
        cat = cat.slice(0, 16) + "...";
      }
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [suggestions]);

  // 4. Gender-wise Participation (Donut Chart)
  const genderData = useMemo(() => {
    const counts: Record<string, number> = { Male: 0, Female: 0 };
    suggestions.forEach((s) => {
      const g = s.gender === "Female" ? "Female" : "Male";
      counts[g] = (counts[g] || 0) + 1;
    });
    return [
      { name: "Male", value: counts.Male },
      { name: "Female", value: counts.Female },
    ];
  }, [suggestions]);

  // 5. Execution Pending Department-wise (Horizontal Bar Chart)
  const pendingDeptData = useMemo(() => {
    const deptPending: Record<string, number> = {};

    suggestions.forEach((s) => {
      const dept = (s.department && s.department !== "—" ? s.department : "General").trim();
      if (deptPending[dept] === undefined) {
        deptPending[dept] = 0;
      }
      if (s.status !== "implemented" && s.status !== "closed" && s.status !== "rejected" && s.status !== "dropped") {
        deptPending[dept] += 1;
      }
    });

    const result = Object.entries(deptPending).map(([department, count]) => ({
      department: department.length > 15 ? department.slice(0, 15) + "..." : department,
      count,
    }));

    return result.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [suggestions]);

  // 6. Cost Category Stacked Column Chart
  const costCategoryData = useMemo(() => {
    const deptCost: Record<string, { "No Cost": number; "Low Cost": number; "High Cost": number }> = {};

    suggestions.forEach((s) => {
      const dept = (s.department && s.department !== "—" ? s.department : "General").trim();
      if (!deptCost[dept]) {
        deptCost[dept] = { "No Cost": 0, "Low Cost": 0, "High Cost": 0 };
      }
      const ct = s.costType || "No Cost";
      if (ct === "High Cost") deptCost[dept]["High Cost"] += 1;
      else if (ct === "Low Cost") deptCost[dept]["Low Cost"] += 1;
      else deptCost[dept]["No Cost"] += 1;
    });

    const res = Object.entries(deptCost).map(([department, costs]) => ({
      department: department.length > 12 ? department.slice(0, 12) + "..." : department,
      ...costs,
    }));

    return res.slice(0, 6);
  }, [suggestions]);

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 7. Monthly Trend Line Chart (Dynamic per real DB plant)
  const monthlyTrendData = useMemo(() => {
    const plantsInUse = Array.from(new Set(suggestions.map((s) => s.plant).filter((p) => p && p !== "—" && p !== "Unassigned"))).slice(0, 5);

    return MONTHS.slice(0, 6).map((m) => {
      const row: Record<string, any> = { month: `${m}` };
      if (plantsInUse.length === 0) {
        row["All Plants"] = suggestions.filter((s) => s.participationMonth === m).length;
      } else {
        plantsInUse.forEach((plant) => {
          row[plant] = suggestions.filter((s) => s.participationMonth === m && s.plant === plant).length;
        });
      }
      return row;
    });
  }, [suggestions]);

  const trendPlantKeys = useMemo(() => {
    if (monthlyTrendData.length === 0) return [];
    return Object.keys(monthlyTrendData[0]).filter((k) => k !== "month");
  }, [monthlyTrendData]);

  // 8. Monthly Participation Area Chart
  const monthlyParticipationData = useMemo(() => {
    return MONTHS.slice(0, 6).map((m) => {
      const monthSugs = suggestions.filter((s) => s.participationMonth === m);
      const uniqueEmps = new Set(monthSugs.map((s) => s.employeeId)).size;
      return {
        month: `${m}`,
        Participants: uniqueEmps || monthSugs.length,
      };
    });
  }, [suggestions]);

  // 9. Department Ranking Bar Chart
  const deptRankingData = useMemo(() => {
    const deptPoints: Record<string, number> = {};
    suggestions.forEach((s) => {
      const dept = (s.department && s.department !== "—" ? s.department : "General").trim();
      deptPoints[dept] = (deptPoints[dept] || 0) + (s.points || 100);
    });
    const res = Object.entries(deptPoints).map(([department, points]) => ({
      department: department.length > 14 ? department.slice(0, 14) + "..." : department,
      points,
    }));

    return res.sort((a, b) => b.points - a.points).slice(0, 6);
  }, [suggestions]);

  // 10. Suggestion Status Donut
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      implemented: 0,
      approved: 0,
      pending: 0,
      under_review: 0,
      rejected: 0,
    };
    suggestions.forEach((s) => {
      if (s.status === "rejected" || s.status === "dropped") counts.rejected += 1;
      else if (s.status === "implemented" || s.status === "closed") counts.implemented += 1;
      else if (s.status === "approved" || s.status === "implementation") counts.approved += 1;
      else if (s.status === "under_review" || s.status === "pe_review" || s.status === "dept_review") counts.under_review += 1;
      else counts.pending += 1;
    });
    return [
      { name: "Implemented", value: counts.implemented },
      { name: "Approved", value: counts.approved },
      { name: "Pending", value: counts.pending },
      { name: "Under Review", value: counts.under_review },
      { name: "Rejected", value: counts.rejected },
    ];
  }, [suggestions]);

  // 11. Year-wise Comparison (2025 vs 2026)
  const yearComparisonData = useMemo(() => {
    const total26 = suggestions.filter((s) => s.year === 2026 || !s.year).length;
    const impl26 = suggestions.filter((s) => (s.year === 2026 || !s.year) && (s.status === "implemented" || s.status === "closed")).length;
    const savings26 = Math.round(suggestions.filter((s) => s.year === 2026 || !s.year).reduce((acc, s) => acc + (s.savings || 0), 0) / 100000);
    const awards26 = suggestions.filter((s) => (s.year === 2026 || !s.year) && s.award && s.award !== "None").length;

    const total25 = suggestions.filter((s) => s.year === 2025).length;
    const impl25 = suggestions.filter((s) => s.year === 2025 && (s.status === "implemented" || s.status === "closed")).length;
    const savings25 = Math.round(suggestions.filter((s) => s.year === 2025).reduce((acc, s) => acc + (s.savings || 0), 0) / 100000);
    const awards25 = suggestions.filter((s) => s.year === 2025 && s.award && s.award !== "None").length;

    return [
      { metric: "Total Ideas", "2025": total25, "2026": total26 },
      { metric: "Implemented", "2025": impl25, "2026": impl26 },
      { metric: "Savings (₹L)", "2025": savings25, "2026": savings26 },
      { metric: "Awards Given", "2025": awards25, "2026": awards26 },
    ];
  }, [suggestions]);

  // 12. Plant Performance Radar Chart (Dynamic per real DB plant)
  const radarData = useMemo(() => {
    const plantsInUse = Array.from(new Set(suggestions.map((s) => s.plant).filter((p) => p && p !== "—" && p !== "Unassigned"))).slice(0, 3);
    const activePlants = plantsInUse.length > 0 ? plantsInUse : ["All Plants"];

    const getScore = (sugs: EmployeeSuggestion[], type: string) => {
      if (sugs.length === 0) return 0;
      if (type === "Participation") return Math.min(100, Math.round((sugs.length / Math.max(1, suggestions.length)) * 100));
      if (type === "Implementation") {
        const implCount = sugs.filter((s) => s.status === "implemented" || s.status === "closed").length;
        return Math.round((implCount / sugs.length) * 100);
      }
      if (type === "Avg Points") {
        const avgPts = sugs.reduce((acc, s) => acc + s.points, 0) / sugs.length;
        return Math.min(100, Math.round((avgPts / 450) * 100));
      }
      if (type === "Savings") {
        const totalSav = sugs.reduce((acc, s) => acc + s.savings, 0);
        return Math.min(100, Math.round((totalSav / 100000) * 10));
      }
      return Math.min(100, Math.round((sugs.filter((s) => s.status === "implemented" || s.status === "closed").length / Math.max(1, sugs.length)) * 100));
    };

    const subjects = ["Participation", "Implementation", "Avg Points", "Savings", "Completion %"];
    return subjects.map((subj) => {
      const row: Record<string, any> = { subject: subj };
      activePlants.forEach((p) => {
        const plantSugs = p === "All Plants" ? suggestions : suggestions.filter((s) => s.plant === p);
        row[p] = getScore(plantSugs, subj);
      });
      return row;
    });
  }, [suggestions]);

  const radarPlantKeys = useMemo(() => {
    if (radarData.length === 0) return [];
    return Object.keys(radarData[0]).filter((k) => k !== "subject");
  }, [radarData]);

  // 13. Monthly Area Cost Savings
  const savingsData = useMemo(() => {
    let runningSavings = 0;
    return MONTHS.slice(0, 6).map((m) => {
      const monthSugs = suggestions.filter(
        (s) => s.participationMonth === m || (s.createdDate && new Date(s.createdDate).getMonth() === MONTHS.indexOf(m))
      );
      const mSavings = monthSugs.reduce((acc, s) => acc + (s.savings || 0), 0);
      runningSavings += mSavings;
      return {
        month: `${m}`,
        Savings: Number((runningSavings / 100000).toFixed(1)),
      };
    });
  }, [suggestions]);

  // 14. Suggestion Execution Status Timeline
  const timelineData = useMemo(() => {
    return MONTHS.map((m) => {
      const submitted = suggestions.filter((s) => s.participationMonth === m).length;
      const completed = suggestions.filter((s) => s.participationMonth === m && s.status === "implemented").length;
      return {
        week: `${m} 26`,
        Submitted: submitted,
        Completed: completed,
      };
    });
  }, [suggestions]);

  return (
    <div className="space-y-4">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" /> Executive Analytics Charts & Dashboards
        </h2>
      </div>

      {/* SINGLE UNIFIED GRID: 3 Charts Per Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Chart 1: Suggestion State / Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📊</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Suggestion State Breakdown</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Workflow Stages
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusStateData} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="state" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={20}>
                  {statusStateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="count" position="top" style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Plant Distribution (Donut Chart for PGTL & NGM) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🏭</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Plant Distribution</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Units Ratio
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plantData}
                  cx="50%"
                  cy="42%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderOuterPieLabel}
                  labelLine={{ stroke: "#94A3B8", strokeWidth: 1.5 }}
                >
                  {plantData.map((_, index) => (
                    <Cell key={`cell-plant-${index}`} fill={SCREENSHOT_PALETTE[index % SCREENSHOT_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(val: string) => (val.length > 18 ? val.slice(0, 18) + "..." : val)}
                  wrapperStyle={{ fontSize: "11px", pt: "6px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Suggestion Category Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🔍</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Category Distribution</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              5S, Kaizen
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="42%"
                  outerRadius={65}
                  dataKey="value"
                  label={renderOuterPieLabel}
                  labelLine={{ stroke: "#94A3B8", strokeWidth: 1.5 }}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-cat-${index}`} fill={SCREENSHOT_PALETTE[(index + 3) % SCREENSHOT_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(val: string) => (val.length > 18 ? val.slice(0, 18) + "..." : val)}
                  wrapperStyle={{ fontSize: "11px", pt: "6px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Gender Participation Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">👥</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Gender Participation</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Workforce Ratio
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="42%"
                  innerRadius={38}
                  outerRadius={62}
                  paddingAngle={4}
                  dataKey="value"
                  label={renderOuterPieLabel}
                  labelLine={{ stroke: "#94A3B8", strokeWidth: 1.5 }}
                >
                  <Cell fill="#A5B4FC" />
                  <Cell fill="#F472B6" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", pt: "6px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Pending Dept-Wise Horizontal Bar (Enhanced Balanced Data) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🔝</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Pending Dept-Wise</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Pending Queue
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={pendingDeptData} margin={{ top: 10, right: 25, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 10, fill: "#64748B" }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {pendingDeptData.map((_, index) => (
                    <Cell key={`cell-pd-${index}`} fill={SCREENSHOT_PALETTE[(index + 2) % SCREENSHOT_PALETTE.length]} />
                  ))}
                  <LabelList dataKey="count" position="right" style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Cost Breakdown Stacked Bar Chart (Sleek Thinner Bars & Balanced Data) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💰</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Cost Breakdown</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Investment Tiers
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costCategoryData} margin={{ top: 18, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="No Cost" stackId="a" fill="#6EE7B7" barSize={16}>
                  <LabelList
                    dataKey="No Cost"
                    position="center"
                    formatter={(val: any) => (Number(val) > 0 ? val : "")}
                    style={{ fontSize: "9px", fontWeight: "extrabold", fill: "#065F46" }}
                  />
                </Bar>
                <Bar dataKey="Low Cost" stackId="a" fill="#38BDF8" barSize={16}>
                  <LabelList
                    dataKey="Low Cost"
                    position="center"
                    formatter={(val: any) => (Number(val) > 0 ? val : "")}
                    style={{ fontSize: "9px", fontWeight: "extrabold", fill: "#0369A1" }}
                  />
                </Bar>
                <Bar dataKey="High Cost" stackId="a" fill="#FBBF24" radius={[3, 3, 0, 0]} barSize={16}>
                  <LabelList
                    dataKey="High Cost"
                    position="center"
                    formatter={(val: any) => (Number(val) > 0 ? val : "")}
                    style={{ fontSize: "9px", fontWeight: "extrabold", fill: "#78350F" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Plant-wise Monthly Trend Line Chart (PGTL vs NGM) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🏢</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Plant-wise Monthly Trend</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Monthly Trend
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 20, right: 28, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} padding={{ left: 10, right: 15 }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                {trendPlantKeys.map((plantKey, idx) => {
                  const colors = ["#3B82F6", "#A855F7", "#10B981", "#F59E0B", "#EF4444"];
                  const color = colors[idx % colors.length];
                  return (
                    <Line
                      key={plantKey}
                      type="monotone"
                      dataKey={plantKey}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#fff", stroke: color, strokeWidth: 2 }}
                    >
                      <LabelList dataKey={plantKey} position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: color }} />
                    </Line>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: 6-Month Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📈</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">6-Month Suggestion Trend</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Volume Trend
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyParticipationData} margin={{ top: 20, right: 28, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C084FC" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#C084FC" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} padding={{ left: 10, right: 15 }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Participants" stroke="#9333EA" strokeWidth={3} fillOpacity={1} fill="url(#colorPurpleGrad)" dot={{ r: 4, fill: "#9333EA", stroke: "#fff", strokeWidth: 2 }}>
                  <LabelList dataKey="Participants" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#6B21A8" }} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 9: Production Line Comparison Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📊</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Production Line Comparison</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Lines Volume
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRankingData} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="points" fill="#A5B4FC" radius={[4, 4, 0, 0]} barSize={20}>
                  <LabelList dataKey="points" position="top" style={{ fontSize: "11px", fontWeight: "bold", fill: "#4338CA" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 10: Status Breakdown Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🍩</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Status Breakdown</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Org Summary
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="42%"
                  innerRadius={38}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderOuterPieLabel}
                  labelLine={{ stroke: "#94A3B8", strokeWidth: 1.5 }}
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-st-${index}`} fill={SCREENSHOT_PALETTE[index % SCREENSHOT_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", pt: "6px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 11: YoY Comparison Column Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⚖️</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">YoY Comparison</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              2025 vs 2026
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearComparisonData} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="metric" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="2025" fill="#CBD5E1" radius={[3, 3, 0, 0]} barSize={16}>
                  <LabelList dataKey="2025" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#475569" }} />
                </Bar>
                <Bar dataKey="2026" fill="#818CF8" radius={[3, 3, 0, 0]} barSize={16}>
                  <LabelList dataKey="2026" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#3730A3" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 12: Plant Performance Radar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🎯</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Plant Performance Matrix</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Radar
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="45%" outerRadius={68} data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#64748B" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                {radarPlantKeys.map((plantKey, idx) => {
                  const colors = ["#818CF8", "#FDE047", "#34D399", "#F472B6", "#FB923C"];
                  const color = colors[idx % colors.length];
                  return (
                    <Radar
                      key={plantKey}
                      name={plantKey}
                      dataKey={plantKey}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.4}
                    />
                  );
                })}
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 13: Cumulative Cost Savings Area Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💵</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Cumulative Savings</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              ₹ Lacs
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData} margin={{ top: 20, right: 28, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} padding={{ left: 10, right: 15 }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Savings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGreenGrad)" dot={{ r: 3, fill: "#10B981" }}>
                  <LabelList dataKey="Savings" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#047857" }} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 14: Execution Status Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Execution Status</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Weekly Rate
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 20, right: 28, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#64748B" }} padding={{ left: 10, right: 15 }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="Submitted" stroke="#FDBA74" strokeWidth={2} dot={{ r: 3 }}>
                  <LabelList dataKey="Submitted" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#C2410C" }} />
                </Line>
                <Line type="monotone" dataKey="Completed" stroke="#86EFAC" strokeWidth={2} dot={{ r: 3 }}>
                  <LabelList dataKey="Completed" position="bottom" style={{ fontSize: "9px", fontWeight: "bold", fill: "#15803D" }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
