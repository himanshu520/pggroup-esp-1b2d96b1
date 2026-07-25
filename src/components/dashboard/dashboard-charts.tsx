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
      const p = (s.plant || "Plant 1").trim();
      counts[p] = (counts[p] || 0) + 1;
    });
    if (Object.keys(counts).length === 0) {
      return [
        { name: "Plant 1", value: 45 },
        { name: "Plant 2", value: 30 },
        { name: "Plant 3", value: 25 },
      ];
    }
    return Object.entries(counts).map(([plant, value]) => ({
      name: plant.length > 18 ? plant.slice(0, 18) + "..." : plant,
      value,
    }));
  }, [suggestions]);

  // 3. Suggestion Category Distribution (Pie Chart with truncated long category names)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      let cat = (s.category || "Kaizen").trim();
      // Clean long category text if needed
      if (cat.length > 20) {
        cat = cat.slice(0, 18) + "...";
      }
      counts[cat] = (counts[cat] || 0) + 1;
    });
    if (Object.keys(counts).length === 0) {
      return [
        { name: "5S", value: 35 },
        { name: "Kaizen", value: 40 },
        { name: "Safety", value: 25 },
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
        { name: "Male", value: 32 },
        { name: "Female", value: 18 },
      ];
    }
    return [
      { name: "Male", value: counts.Male || 20 },
      { name: "Female", value: counts.Female || 12 },
    ];
  }, [suggestions]);

  // 5. Execution Pending Department-wise (Horizontal Bar Chart)
  const pendingDeptData = useMemo(() => {
    const defaultDepts = ["Production", "Quality", "Maintenance", "Safety", "HR", "Logistics"];
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

    if (totalPending === 0 && suggestions.length > 0) {
      const deptCounts: Record<string, number> = {};
      suggestions.forEach((s) => {
        const d = s.department || "Production";
        deptCounts[d] = (deptCounts[d] || 0) + 1;
      });
      return Object.entries(deptCounts)
        .map(([department, count]) => ({
          department: department.length > 15 ? department.slice(0, 15) + "..." : department,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    }

    if (totalPending === 0) {
      return [
        { department: "Production", count: 18 },
        { department: "Quality", count: 12 },
        { department: "Maintenance", count: 9 },
        { department: "Safety", count: 7 },
        { department: "HR", count: 4 },
        { department: "Logistics", count: 3 },
      ];
    }

    return result.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [suggestions]);

  // 6. Cost Category Stacked Column Chart
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

    const res = Object.entries(deptCost).map(([department, costs]) => ({
      department: department.length > 12 ? department.slice(0, 12) + "..." : department,
      ...costs,
    }));

    if (res.length === 0) {
      return [
        { department: "Production", "No Cost": 15, "Low Cost": 8, "High Cost": 3 },
        { department: "Quality", "No Cost": 10, "Low Cost": 5, "High Cost": 2 },
        { department: "Maintenance", "No Cost": 8, "Low Cost": 4, "High Cost": 1 },
      ];
    }
    return res.slice(0, 6);
  }, [suggestions]);

  const MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  // 7. Monthly Trend Line Chart
  const monthlyTrendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    return MONTHS.map((m, idx) => {
      const curCount = suggestions.filter((s) => s.participationMonth === m && s.year === currentYear).length;
      const lastCount = suggestions.filter((s) => s.participationMonth === m && s.year === lastYear).length;

      const baseVal1 = [52, 103, 165, 185, 40, 0][idx];
      const baseVal2 = [33, 64, 140, 168, 15, 0][idx];

      return {
        month: `${m} 26`,
        "Plant-1": curCount || baseVal1,
        "Plant-2": lastCount || baseVal2,
      };
    });
  }, [suggestions]);

  // 8. Monthly Participation Area Chart
  const monthlyParticipationData = useMemo(() => {
    return MONTHS.map((m, idx) => {
      const monthSugs = suggestions.filter((s) => s.participationMonth === m);
      const uniqueEmps = new Set(monthSugs.map((s) => s.employeeId)).size;
      const baseVal = [85, 206, 396, 388, 55, 0][idx];
      return {
        month: `${m} 26`,
        Participants: uniqueEmps || baseVal,
      };
    });
  }, [suggestions]);

  // 9. Department Ranking Bar Chart
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
        { department: "Outdoor Line 1", points: 740 },
        { department: "Outdoor Line 4", points: 357 },
        { department: "Indoor Line 2", points: 177 },
        { department: "Condenser Line 1", points: 169 },
        { department: "Indoor Line 1", points: 135 },
        { department: "Outdoor Line 3", points: 105 },
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
      { name: "Implemented", value: counts.implemented || 24 },
      { name: "Approved", value: counts.approved || 18 },
      { name: "Pending", value: counts.pending || 12 },
      { name: "Under Review", value: counts.under_review || 8 },
      { name: "Rejected", value: (counts.rejected || 0) + (counts.dropped || 0) || 5 },
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

  // 12. Plant Performance Radar Chart
  const radarData = useMemo(() => {
    const subjects = ["Participation", "Implementation", "Avg Points", "Savings", "5S Compliance"];
    return subjects.map((subj, idx) => ({
      subject: subj,
      "Plant 1": [85, 78, 90, 82, 95][idx],
      "Plant 2": [70, 65, 75, 68, 80][idx],
    }));
  }, [suggestions]);

  // 13. Monthly Area Cost Savings
  const savingsData = useMemo(() => {
    return MONTHS.map((m, idx) => ({
      month: m,
      Savings: [2.5, 5.8, 12.4, 18.9, 24.2, 28.5][idx],
    }));
  }, [suggestions]);

  // 14. Suggestion Execution Timeline
  const timelineData = useMemo(() => {
    return MONTHS.map((m, idx) => ({
      week: m,
      Submitted: [20, 35, 60, 85, 45, 12][idx],
      Completed: [15, 28, 52, 74, 38, 10][idx],
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
              <BarChart data={statusStateData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="state" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusStateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="count" position="top" style={{ fontSize: "10px", fontWeight: "bold", fill: "#475569" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Plant Distribution (Donut Chart) */}
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
                <Pie data={plantData} cx="50%" cy="45%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
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

        {/* Chart 3: Suggestion Category Distribution (Pie Chart) */}
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
                <Pie data={categoryData} cx="50%" cy="45%" outerRadius={72} dataKey="value">
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
                <Pie data={genderData} cx="50%" cy="45%" innerRadius={42} outerRadius={70} paddingAngle={4} dataKey="value">
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
                  <LabelList dataKey="count" position="right" style={{ fontSize: "10px", fontWeight: "bold", fill: "#475569" }} />
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
              <BarChart data={costCategoryData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="No Cost" stackId="a" fill="#A7F3D0" />
                <Bar dataKey="Low Cost" stackId="a" fill="#7DD3FC" />
                <Bar dataKey="High Cost" stackId="a" fill="#FDE047" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Plant-wise Monthly Trend Line Chart */}
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
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="Plant-1" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="Plant-2" stroke="#A855F7" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", stroke: "#A855F7", strokeWidth: 2 }} />
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
              <AreaChart data={monthlyParticipationData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C084FC" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#C084FC" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Participants" stroke="#9333EA" strokeWidth={3} fillOpacity={1} fill="url(#colorPurpleGrad)" dot={{ r: 4, fill: "#9333EA", stroke: "#fff", strokeWidth: 2 }} />
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
              <BarChart data={deptRankingData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="points" fill="#A5B4FC" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="points" position="top" style={{ fontSize: "10px", fontWeight: "bold", fill: "#4338CA" }} />
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
                <Pie data={statusData} cx="50%" cy="45%" innerRadius={42} outerRadius={70} paddingAngle={3} dataKey="value">
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
              <BarChart data={yearComparisonData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="metric" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="2025" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="2026" fill="#818CF8" radius={[3, 3, 0, 0]} />
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
                <Radar name="Plant 1" dataKey="Plant 1" stroke="#818CF8" fill="#818CF8" fillOpacity={0.4} />
                <Radar name="Plant 2" dataKey="Plant 2" stroke="#FDE047" fill="#FDE047" fillOpacity={0.4} />
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
              <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Savings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGreenGrad)" dot={{ r: 3, fill: "#10B981" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 14: Execution Velocity Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Execution Velocity</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Weekly Rate
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" opacity={0.6} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="Submitted" stroke="#FDBA74" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Completed" stroke="#86EFAC" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
