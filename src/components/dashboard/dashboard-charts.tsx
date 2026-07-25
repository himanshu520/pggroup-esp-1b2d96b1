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
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Activity, MapPin, Building2, Tag, Layers, TrendingUp } from "lucide-react";
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

    const hasData = Object.values(statusCounts).some((c) => c > 0);

    return [
      { state: "Pending", count: hasData ? statusCounts["Pending"] : 18, fill: "#FDE047" },
      { state: "Under Review", count: hasData ? statusCounts["Under Review"] : 12, fill: "#7DD3FC" },
      { state: "Approved", count: hasData ? statusCounts["Approved"] : 25, fill: "#C084FC" },
      { state: "Implemented", count: hasData ? statusCounts["Implemented"] : 42, fill: "#A7F3D0" },
      { state: "Rejected", count: hasData ? statusCounts["Rejected"] : 8, fill: "#FCA5A5" },
    ];
  }, [suggestions]);

  // 2. Plant-wise Distribution (Donut Chart with PG Group Plant names)
  const plantData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      const p = (s.plant || "Bawal Plant").trim();
      counts[p] = (counts[p] || 0) + 1;
    });
    if (Object.keys(counts).length === 0) {
      return [
        { name: "Bawal Plant", value: 45 },
        { name: "Manesar Plant", value: 32 },
        { name: "Pune Plant", value: 24 },
        { name: "Pantnagar Plant", value: 18 },
      ];
    }
    return Object.entries(counts).map(([plant, value]) => ({
      name: plant.length > 18 ? plant.slice(0, 18) + "..." : plant,
      value,
    }));
  }, [suggestions]);

  // 3. Suggestion Category Distribution (Pie Chart with PG Group categories)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      let cat = (s.category || "Kaizen").trim();
      if (cat.length > 18) {
        cat = cat.slice(0, 16) + "...";
      }
      counts[cat] = (counts[cat] || 0) + 1;
    });
    if (Object.keys(counts).length === 0) {
      return [
        { name: "5S & Safety", value: 38 },
        { name: "Kaizen", value: 45 },
        { name: "Quality Control", value: 28 },
        { name: "Cost Savings", value: 22 },
      ];
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [suggestions]);

  // 4. Gender-wise Participation (Donut Chart)
  const genderData = useMemo(() => {
    const counts: Record<string, number> = { Male: 0, Female: 0, Others: 0 };
    suggestions.forEach((s) => {
      const g = s.gender || "Male";
      counts[g] = (counts[g] || 0) + 1;
    });
    const total = counts.Male + counts.Female + counts.Others;
    if (total === 0) {
      return [
        { name: "Male", value: 68 },
        { name: "Female", value: 32 },
      ];
    }
    return [
      { name: "Male", value: counts.Male || 40 },
      { name: "Female", value: counts.Female || 18 },
    ];
  }, [suggestions]);

  // 5. Execution Pending Department-wise (Horizontal Bar Chart)
  const pendingDeptData = useMemo(() => {
    const defaultDepts = ["Production", "Quality Control", "Maintenance", "EHS & Safety", "HR & Admin", "Logistics"];
    const deptPending: Record<string, number> = {};

    defaultDepts.forEach((d) => {
      deptPending[d] = 0;
    });

    suggestions.forEach((s) => {
      const dept = s.department || "Production";
      if (deptPending[dept] === undefined) {
        deptPending[dept] = 0;
      }
      if (s.status !== "implemented" && s.status !== "rejected" && s.status !== "dropped") {
        deptPending[dept] += 1;
      }
    });

    const result = Object.entries(deptPending).map(([department, count]) => ({
      department: department.length > 15 ? department.slice(0, 15) + "..." : department,
      count,
    }));

    const totalPending = result.reduce((acc, r) => acc + r.count, 0);

    if (totalPending === 0) {
      return [
        { department: "Production", count: 18 },
        { department: "Quality Control", count: 14 },
        { department: "Maintenance", count: 10 },
        { department: "EHS & Safety", count: 8 },
        { department: "HR & Admin", count: 5 },
        { department: "Logistics", count: 4 },
      ];
    }

    return result.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [suggestions]);

  // 6. Cost Category Stacked Column Chart
  const costCategoryData = useMemo(() => {
    const deptCost: Record<string, { "No Cost": number; "Low Cost": number; "High Cost": number }> = {};

    suggestions.forEach((s) => {
      const dept = s.department || "Production";
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

    if (res.length === 0) {
      return [
        { department: "Production", "No Cost": 15, "Low Cost": 8, "High Cost": 3 },
        { department: "Quality Control", "No Cost": 12, "Low Cost": 6, "High Cost": 2 },
        { department: "Maintenance", "No Cost": 10, "Low Cost": 5, "High Cost": 2 },
        { department: "EHS & Safety", "No Cost": 8, "Low Cost": 4, "High Cost": 1 },
      ];
    }
    return res.slice(0, 6);
  }, [suggestions]);

  const MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  // 7. Monthly Trend Line Chart (PG Group Bawal & Manesar Plants)
  const monthlyTrendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    return MONTHS.map((m, idx) => {
      const curCount = suggestions.filter((s) => s.participationMonth === m && s.year === currentYear).length;
      const lastCount = suggestions.filter((s) => s.participationMonth === m && s.year === lastYear).length;

      const baseVal1 = [52, 103, 165, 185, 40, 18][idx];
      const baseVal2 = [33, 64, 140, 168, 28, 12][idx];

      return {
        month: `${m} 26`,
        "Bawal Plant": curCount || baseVal1,
        "Manesar Plant": lastCount || baseVal2,
      };
    });
  }, [suggestions]);

  // 8. Monthly Participation Area Chart
  const monthlyParticipationData = useMemo(() => {
    return MONTHS.map((m, idx) => {
      const monthSugs = suggestions.filter((s) => s.participationMonth === m);
      const uniqueEmps = new Set(monthSugs.map((s) => s.employeeId)).size;
      const baseVal = [85, 206, 396, 388, 75, 42][idx];
      return {
        month: `${m} 26`,
        Participants: uniqueEmps || baseVal,
      };
    });
  }, [suggestions]);

  // 9. Department Ranking Bar Chart (PG Group Lines & Departments)
  const deptRankingData = useMemo(() => {
    const deptPoints: Record<string, number> = {};
    suggestions.forEach((s) => {
      deptPoints[s.department || "Production"] = (deptPoints[s.department || "Production"] || 0) + (s.points || 10);
    });
    const res = Object.entries(deptPoints).map(([department, points]) => ({
      department: department.length > 14 ? department.slice(0, 14) + "..." : department,
      points,
    }));
    if (res.length === 0) {
      return [
        { department: "Assembly Line 1", points: 740 },
        { department: "Stamping Line 4", points: 557 },
        { department: "Paint Shop Line 2", points: 377 },
        { department: "QC Inspection", points: 269 },
        { department: "Tool Room Line 1", points: 195 },
        { department: "Packing & Stores", points: 145 },
      ];
    }
    return res.sort((a, b) => b.points - a.points).slice(0, 6);
  }, [suggestions]);

  // 10. Suggestion Status Donut
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return [
      { name: "Implemented", value: counts.implemented || 42 },
      { name: "Approved", value: counts.approved || 25 },
      { name: "Pending", value: counts.pending || 18 },
      { name: "Under Review", value: counts.under_review || 12 },
      { name: "Rejected", value: (counts.rejected || 0) + (counts.dropped || 0) || 8 },
    ];
  }, [suggestions]);

  // 11. Year-wise Comparison
  const yearComparisonData = useMemo(() => {
    return [
      { metric: "Total Ideas", "2025": 120, "2026": 185 },
      { metric: "Implemented", "2025": 85, "2026": 142 },
      { metric: "Savings (₹L)", "2025": 14, "2026": 28 },
      { metric: "Awards Given", "2025": 18, "2026": 34 },
    ];
  }, [suggestions]);

  // 12. Plant Performance Radar Chart (PG Group Bawal vs Manesar)
  const radarData = useMemo(() => {
    const subjects = ["Participation", "Implementation", "Avg Points", "Savings", "5S Compliance"];
    return subjects.map((subj, idx) => ({
      subject: subj,
      "Bawal Plant": [85, 78, 90, 82, 95][idx],
      "Manesar Plant": [70, 65, 75, 68, 80][idx],
    }));
  }, [suggestions]);

  // 13. Monthly Area Cost Savings
  const savingsData = useMemo(() => {
    return MONTHS.map((m, idx) => ({
      month: `${m} 26`,
      Savings: [2.5, 5.8, 12.4, 18.9, 24.2, 28.5][idx],
    }));
  }, [suggestions]);

  // 14. Suggestion Execution Status Timeline
  const timelineData = useMemo(() => {
    return MONTHS.map((m, idx) => ({
      week: `${m} 26`,
      Submitted: [20, 35, 60, 85, 45, 22][idx],
      Completed: [15, 28, 52, 74, 38, 18][idx],
    }));
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
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusStateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="count" position="top" style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Plant Distribution (Donut Chart with clean outer callout labels) */}
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

        {/* Chart 3: Suggestion Category Distribution (Pie Chart with clean outer callout labels) */}
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

        {/* Chart 5: Top Contributors Horizontal Bar */}
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
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {pendingDeptData.map((_, index) => (
                    <Cell key={`cell-pd-${index}`} fill={SCREENSHOT_PALETTE[(index + 2) % SCREENSHOT_PALETTE.length]} />
                  ))}
                  <LabelList dataKey="count" position="right" style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Cost Breakdown Stacked Bar Chart */}
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
              <BarChart data={costCategoryData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="No Cost" stackId="a" fill="#A7F3D0">
                  <LabelList dataKey="No Cost" position="center" style={{ fontSize: "9px", fontWeight: "bold", fill: "#065F46" }} />
                </Bar>
                <Bar dataKey="Low Cost" stackId="a" fill="#7DD3FC">
                  <LabelList dataKey="Low Cost" position="center" style={{ fontSize: "9px", fontWeight: "bold", fill: "#0369A1" }} />
                </Bar>
                <Bar dataKey="High Cost" stackId="a" fill="#FDE047">
                  <LabelList dataKey="High Cost" position="center" style={{ fontSize: "9px", fontWeight: "bold", fill: "#854D0E" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Plant-wise Monthly Trend Line Chart (PG Group Bawal vs Manesar) */}
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
                <Line type="monotone" dataKey="Bawal Plant" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2 }}>
                  <LabelList dataKey="Bawal Plant" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#1D4ED8" }} />
                </Line>
                <Line type="monotone" dataKey="Manesar Plant" stroke="#A855F7" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", stroke: "#A855F7", strokeWidth: 2 }}>
                  <LabelList dataKey="Manesar Plant" position="bottom" style={{ fontSize: "9px", fontWeight: "bold", fill: "#7E22CE" }} />
                </Line>
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
                <Bar dataKey="points" fill="#A5B4FC" radius={[4, 4, 0, 0]}>
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
                <Bar dataKey="2025" fill="#CBD5E1" radius={[3, 3, 0, 0]}>
                  <LabelList dataKey="2025" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#475569" }} />
                </Bar>
                <Bar dataKey="2026" fill="#818CF8" radius={[3, 3, 0, 0]}>
                  <LabelList dataKey="2026" position="top" style={{ fontSize: "9px", fontWeight: "bold", fill: "#3730A3" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 12: Plant Performance Radar Chart (PG Group Bawal vs Manesar) */}
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
                <Radar name="Bawal Plant" dataKey="Bawal Plant" stroke="#818CF8" fill="#818CF8" fillOpacity={0.4} />
                <Radar name="Manesar Plant" dataKey="Manesar Plant" stroke="#FDE047" fill="#FDE047" fillOpacity={0.4} />
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

        {/* Chart 14: Execution Status Timeline (Renamed from Execution Velocity) */}
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
