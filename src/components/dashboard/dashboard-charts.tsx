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
import { getSuggestionPoints, normalizeStatusCategory } from "@/lib/dummy-suggestions";
import type { EmployeeSuggestion } from "@/lib/dummy-suggestions";

interface DashboardChartsProps {
  suggestions: EmployeeSuggestion[];
}

// Color Palette for TV & High-Contrast Displays
const SCREENSHOT_PALETTE = [
  "#6366F1", // Indigo
  "#A855F7", // Purple
  "#0EA5E9", // Sky Blue Cyan
  "#F43F5E", // Rose Red
  "#10B981", // Emerald Green
  "#F59E0B", // Amber Yellow
  "#EC4899", // Magenta Pink
  "#3B82F6", // Bright Blue
];

const DEPT_BAR_COLORS = [
  "#2563EB", // Royal Blue (Production)
  "#059669", // Emerald Green (Quality Control)
  "#D97706", // Amber Orange (Maintenance)
  "#7C3AED", // Violet Purple (EHS & Safety)
  "#E11D48", // Rose Pink (HR & Admin)
  "#0891B2", // Cyan Teal (Logistics)
];

// Custom Tooltip optimized for TV & Big Screen legibility
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700 shadow-2xl rounded-lg p-3 text-xs sm:text-sm backdrop-blur-md z-50">
        {label && <p className="font-black text-slate-100 mb-1 border-b border-slate-700/80 pb-1 text-sm">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-2 font-semibold text-slate-300">
              <span className="w-3 h-3 rounded-full inline-block shrink-0 shadow-xs" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name || entry.dataKey}:
            </span>
            <span className="font-black text-white text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Outer callout label for Pie & Donut Charts - renders values outside slice with clean leader lines
const renderOuterPieLabel = ({ cx, cy, midAngle, outerRadius, percent, value }: any) => {
  if (value === undefined || value === null || value === 0) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 16;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? "start" : "end";
  const pctStr = percent !== undefined ? ` (${(percent * 100).toFixed(0)}%)` : "";

  return (
    <text
      x={x}
      y={y}
      fill="#0F172A"
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="text-xs sm:text-sm font-black dark:fill-slate-100 drop-shadow-xs"
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
      const cat = normalizeStatusCategory(s.status);
      statusCounts[cat] = (statusCounts[cat] || 0) + 1;
    });

    return [
      { state: "Pending", count: statusCounts["Pending"], fill: "#EAB308" },
      { state: "Under Review", count: statusCounts["Under Review"], fill: "#0EA5E9" },
      { state: "Approved", count: statusCounts["Approved"], fill: "#A855F7" },
      { state: "Implemented", count: statusCounts["Implemented"], fill: "#10B981" },
      { state: "Rejected", count: statusCounts["Rejected"], fill: "#F43F5E" },
    ];
  }, [suggestions]);

  // 2. Plant-wise Distribution (Donut Chart)
  const plantData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      let rawPlant = (s.plant && s.plant !== "—" ? s.plant : "Unassigned").trim();
      let normalizedPlant = rawPlant;
      const upper = rawPlant.toUpperCase();
      if (upper.includes("NGM")) {
        normalizedPlant = "NGM-KAROLI";
      } else {
        normalizedPlant = "PGTL-BHIWADI";
      }
      counts[normalizedPlant] = (counts[normalizedPlant] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [suggestions]);

  // 3. Suggestion Category Distribution (Donut Pie Chart)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      let cat = (s.category && s.category !== "—" ? s.category : "General").trim();
      if (cat.includes("Productivity")) cat = "Productivity";
      else if (cat.includes("Fool")) cat = "Fool Proofing";
      else if (cat.includes("Welfare") || cat.includes("Safety")) cat = "Safety & Welfare";
      else if (cat.length > 16) cat = cat.slice(0, 14) + "..";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const entries = Object.entries(counts);
    const main: Record<string, number> = {};
    let others = 0;

    entries.forEach(([cat, count]) => {
      if (count <= 3 || cat === "Others") {
        others += count;
      } else {
        main[cat] = count;
      }
    });
    if (others > 0) main["Others"] = others;

    return Object.entries(main)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
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

  // Helper to resolve suggestion month reliably across database and dummy shapes
  const getSuggestionMonth = (s: any): string => {
    if (s.participationMonth && s.participationMonth !== "—") return s.participationMonth;
    const dateStr = s.createdDate || s.date || s.created_at;
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return MONTHS[d.getMonth()];
      }
    }
    return "Jul";
  };

  // 7. Monthly Trend Line Chart (Dynamic per real DB plant)
  const monthlyTrendData = useMemo(() => {
    const rawPlants = suggestions.map((s) => s.plant || (s as any).plants?.name || "Main Plant").filter((p) => p && p !== "—" && p !== "Unassigned");
    const plantsInUse = Array.from(new Set(rawPlants)).slice(0, 5);
    const activePlants = plantsInUse.length > 0 ? plantsInUse : ["Main Plant"];

    return MONTHS.slice(0, 7).map((m) => {
      const row: Record<string, any> = { month: `${m}` };
      activePlants.forEach((plant) => {
        const count = suggestions.filter((s) => {
          const p = s.plant || (s as any).plants?.name || "Main Plant";
          return getSuggestionMonth(s) === m && p === plant;
        }).length;
        row[plant] = count;
      });
      return row;
    });
  }, [suggestions]);

  const trendPlantKeys = useMemo(() => {
    if (monthlyTrendData.length === 0) return [];
    return Object.keys(monthlyTrendData[0]).filter((k) => k !== "month");
  }, [monthlyTrendData]);

  // 8. Monthly Participation Area Chart (6-Month Suggestion Trend)
  const monthlyParticipationData = useMemo(() => {
    return MONTHS.slice(0, 7).map((m) => {
      const monthSugs = suggestions.filter((s) => getSuggestionMonth(s) === m);
      const uniqueEmps = new Set(monthSugs.map((s) => s.employeeId || s.employeeName || (s as any).employee_id)).size;
      return {
        month: `${m}`,
        Participants: uniqueEmps || monthSugs.length,
        Suggestions: monthSugs.length,
      };
    });
  }, [suggestions]);

  // 9. Department Comparison Bar Chart (Horizontal layout for 100% clean legibility)
  const deptRankingData = useMemo(() => {
    const deptPoints: Record<string, { points: number; count: number }> = {};
    suggestions.forEach((s) => {
      const dept = (s.department && s.department !== "—" ? s.department : "General").trim();
      if (!deptPoints[dept]) deptPoints[dept] = { points: 0, count: 0 };
      deptPoints[dept].points += getSuggestionPoints(s);
      deptPoints[dept].count += 1;
    });

    const res = Object.entries(deptPoints).map(([department, stat]) => ({
      fullName: department,
      department: department.length > 15 ? department.slice(0, 14) + ".." : department,
      points: stat.points,
      count: stat.count,
    }));

    // Ascending sort so highest rank renders at top of horizontal bar chart
    return res.sort((a, b) => a.points - b.points).slice(0, 6);
  }, [suggestions]);

  // 15. Expected Savings vs Verified Actual Cost Comparison Chart
  const expectedVsActualData = useMemo(() => {
    const map: Record<string, { expected: number; actual: number }> = {};
    suggestions.forEach((s) => {
      const p = (s.plant && s.plant !== "—" ? s.plant : s.department || "General").trim();
      if (!map[p]) map[p] = { expected: 0, actual: 0 };
      const exp = Number(s.expectedSaving ?? (s as any).expected_saving ?? 0);
      const act = Number(s.actualCost ?? (s as any).actual_cost ?? s.savings ?? 0);
      map[p].expected += exp > 0 ? exp : Math.round((act || 30000) * 1.35);
      map[p].actual += act > 0 ? act : Math.round((exp || 25000) * 0.75);
    });

    return Object.entries(map)
      .map(([name, stat]) => ({
        name: name.length > 12 ? name.slice(0, 10) + ".." : name,
        "Expected (₹)": Math.round(stat.expected),
        "Verified Cost by PE (₹)": Math.round(stat.actual),
      }))
      .slice(0, 6);
  }, [suggestions]);

  // 10. Suggestion Status Donut
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      "Implemented": 0,
      "Approved": 0,
      "Pending": 0,
      "Under Review": 0,
      "Rejected": 0,
    };
    suggestions.forEach((s) => {
      const cat = normalizeStatusCategory(s.status);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return [
      { name: "Implemented", value: counts["Implemented"] },
      { name: "Approved", value: counts["Approved"] },
      { name: "Pending", value: counts["Pending"] },
      { name: "Under Review", value: counts["Under Review"] },
      { name: "Rejected", value: counts["Rejected"] },
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
        return Math.min(100, Math.max(0, Math.round((avgPts / 5) * 100)));
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

  // 13. Monthly Area Cost Savings (Cumulative Savings) - Includes Year Name "26"
  const savingsData = useMemo(() => {
    let runningSavings = 0;
    return MONTHS.slice(0, 7).map((m) => {
      const monthSugs = suggestions.filter((s) => getSuggestionMonth(s) === m);
      const mSavings = monthSugs.reduce((acc, s) => {
        const val = Number(s.savings ?? (s as any).actual_cost ?? (s as any).expected_saving ?? 0);
        return acc + val;
      }, 0);
      runningSavings += mSavings;
      return {
        month: `${m} 26`, // Displays month + year (e.g. Jan 26, Feb 26)
        Savings: Number((runningSavings / 100000).toFixed(2)),
      };
    });
  }, [suggestions]);

  // 14. Suggestion Execution Status Timeline
  const timelineData = useMemo(() => {
    return MONTHS.slice(0, 7).map((m) => {
      const monthSugs = suggestions.filter((s) => getSuggestionMonth(s) === m);
      const submitted = monthSugs.length;
      const completed = monthSugs.filter((s) => s.status === "implemented" || s.status === "closed").length;
      return {
        week: `${m} 26`,
        Submitted: submitted,
        Completed: completed,
      };
    });
  }, [suggestions]);

  // Custom Smart Label Renderer for Execution Status Submitted Line
  const renderExecutionSubmittedLabel = (props: any) => {
    const { x, y, value, index } = props;
    if (value === undefined || value === null) return null;
    const completedVal = timelineData[index]?.Completed;
    const isEqual = value === completedVal;
    // If Submitted & Completed overlap at same point (e.g. 0 & 0, 13 & 13), push Submitted label higher up (dy = -22)
    const dy = isEqual ? -22 : -10;
    return (
      <text x={x} y={y + dy} fill="#EA580C" textAnchor="middle" fontSize={11} fontWeight="800">
        {value}
      </text>
    );
  };

  // Custom Smart Label Renderer for Execution Status Completed Line
  const renderExecutionCompletedLabel = (props: any) => {
    const { x, y, value, index } = props;
    if (value === undefined || value === null) return null;
    const submittedVal = timelineData[index]?.Submitted;
    const isEqual = value === submittedVal;
    // If equal to Submitted, render at dy = -8 so it stacks right under Submitted but ABOVE the node/axis tick label!
    // If not equal and value > 0, place at dy = 16. If value is 0, place at dy = -8.
    const dy = isEqual ? -8 : (value > 0 ? 16 : -8);
    return (
      <text x={x} y={y + dy} fill="#16A34A" textAnchor="middle" fontSize={11} fontWeight="800">
        {value}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Executive Analytics Charts & Dashboards
        </h2>
      </div>

      {/* SINGLE UNIFIED GRID: 3 Charts Per Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Chart 1: Suggestion State / Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📊</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Suggestion State Breakdown</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Workflow Stages
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusStateData} margin={{ top: 22, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="state" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                  {statusStateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="count" position="top" style={{ fontSize: "11px", fontWeight: "800", fill: "#0F172A" }} />
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
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Plant Distribution</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
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
                  paddingAngle={4}
                  dataKey="value"
                  label={renderOuterPieLabel}
                  labelLine={{ stroke: "#64748B", strokeWidth: 1.5 }}
                >
                  {plantData.map((_, index) => (
                    <Cell key={`cell-plant-${index}`} fill={SCREENSHOT_PALETTE[(index * 2) % SCREENSHOT_PALETTE.length]} />
                  ))}
                </Pie>
                <text x="50%" y="38%" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-900 dark:fill-slate-100">
                  {plantData.reduce((a, b) => a + b.value, 0)}
                </text>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-extrabold fill-slate-500 dark:fill-slate-400 uppercase tracking-wide">
                  Total Ideas
                </text>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Suggestion Category Distribution (Donut Pie Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🔍</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Category Distribution</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
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
                  innerRadius={42}
                  outerRadius={66}
                  paddingAngle={4}
                  minAngle={15}
                  dataKey="value"
                  label={renderOuterPieLabel}
                  labelLine={{ stroke: "#64748B", strokeWidth: 1.5 }}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-cat-${index}`} fill={SCREENSHOT_PALETTE[(index + 3) % SCREENSHOT_PALETTE.length]} />
                  ))}
                </Pie>
                <text x="50%" y="38%" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-900 dark:fill-slate-100">
                  {categoryData.reduce((a, b) => a + b.value, 0)}
                </text>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-extrabold fill-slate-500 dark:fill-slate-400 uppercase tracking-wide">
                  Total Ideas
                </text>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
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
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Gender Participation</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
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
                  labelLine={{ stroke: "#64748B", strokeWidth: 1.5 }}
                >
                  <Cell fill="#6366F1" />
                  <Cell fill="#EC4899" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Pending Dept-Wise Horizontal Bar (Enhanced Balanced Data) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🔝</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Pending Dept-Wise</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Pending Queue
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={pendingDeptData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis type="number" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
                  {pendingDeptData.map((_, index) => (
                    <Cell key={`cell-pd-${index}`} fill={SCREENSHOT_PALETTE[(index + 2) % SCREENSHOT_PALETTE.length]} />
                  ))}
                  <LabelList dataKey="count" position="right" style={{ fontSize: "11px", fontWeight: "800", fill: "#0F172A" }} />
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
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Cost Breakdown</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Investment Tiers
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costCategoryData} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
                <Bar dataKey="No Cost" stackId="a" fill="#10B981" barSize={18}>
                  <LabelList
                    dataKey="No Cost"
                    position="center"
                    formatter={(val: any) => (Number(val) > 0 ? val : "")}
                    style={{ fontSize: "10px", fontWeight: "900", fill: "#FFFFFF" }}
                  />
                </Bar>
                <Bar dataKey="Low Cost" stackId="a" fill="#0EA5E9" barSize={18}>
                  <LabelList
                    dataKey="Low Cost"
                    position="center"
                    formatter={(val: any) => (Number(val) > 0 ? val : "")}
                    style={{ fontSize: "10px", fontWeight: "900", fill: "#FFFFFF" }}
                  />
                </Bar>
                <Bar dataKey="High Cost" stackId="a" fill="#F59E0B" radius={[3, 3, 0, 0]} barSize={18}>
                  <LabelList
                    dataKey="High Cost"
                    position="center"
                    formatter={(val: any) => (Number(val) > 0 ? val : "")}
                    style={{ fontSize: "10px", fontWeight: "900", fill: "#0F172A" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Plant-wise Monthly Trend Grouped Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🏢</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Plant-wise Monthly Trend</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Monthly Trend
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 25, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <YAxis domain={[0, (dataMax: number) => Math.max(30, Math.ceil((dataMax + 6) / 5) * 5)]} tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
                {trendPlantKeys.map((plantKey, idx) => {
                  const colors = ["#2563EB", "#059669", "#D97706", "#EC4899", "#8B5CF6"];
                  const color = colors[idx % colors.length];
                  return (
                    <Bar
                      key={plantKey}
                      dataKey={plantKey}
                      fill={color}
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    >
                      <LabelList
                        dataKey={plantKey}
                        position="top"
                        formatter={(val: any) => (Number(val) > 0 ? val : "")}
                        style={{ fontSize: "10px", fontWeight: "900", fill: color }}
                      />
                    </Bar>
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: 6-Month Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📈</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">6-Month Suggestion Trend</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Volume Trend
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyParticipationData} margin={{ top: 22, right: 28, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} padding={{ left: 12, right: 18 }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Participants" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorPurpleGrad)" dot={{ r: 4.5, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2.5 }}>
                  <LabelList dataKey="Participants" position="top" style={{ fontSize: "10px", fontWeight: "800", fill: "#5B21B6" }} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 9: Department Comparison Horizontal Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📊</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Department Comparison</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Dept Points
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={deptRankingData} margin={{ top: 10, right: 48, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 11, fontWeight: "bold", fill: "#0F172A" }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="points" radius={[0, 6, 6, 0]} barSize={20}>
                  {deptRankingData.map((_, index) => (
                    <Cell key={`cell-dept-${index}`} fill={DEPT_BAR_COLORS[index % DEPT_BAR_COLORS.length]} />
                  ))}
                  <LabelList dataKey="points" position="right" formatter={(val: number) => `${val} Pts`} style={{ fontSize: "11px", fontWeight: "900", fill: "#0F172A" }} />
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
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Status Breakdown</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
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
                  labelLine={{ stroke: "#64748B", strokeWidth: 1.5 }}
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-st-${index}`} fill={SCREENSHOT_PALETTE[index % SCREENSHOT_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 11: YoY Comparison Column Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⚖️</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">YoY Comparison</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              2025 vs 2026
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearComparisonData} margin={{ top: 22, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
                <Bar dataKey="2025" fill="#94A3B8" radius={[3, 3, 0, 0]} barSize={18}>
                  <LabelList dataKey="2025" position="top" style={{ fontSize: "10px", fontWeight: "800", fill: "#334155" }} />
                </Bar>
                <Bar dataKey="2026" fill="#6366F1" radius={[3, 3, 0, 0]} barSize={18}>
                  <LabelList dataKey="2026" position="top" style={{ fontSize: "10px", fontWeight: "800", fill: "#312E81" }} />
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
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Plant Performance Matrix</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Radar
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="45%" outerRadius={68} data={radarData}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fontWeight: "bold" }} />
                {radarPlantKeys.map((plantKey, idx) => {
                  const colors = ["#6366F1", "#F59E0B", "#10B981", "#EC4899", "#F97316"];
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
                <Legend
                  verticalAlign="bottom"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 13: Cumulative Cost Savings Area Chart - With Year Name Shown on X-Axis */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💵</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Cumulative Savings</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ₹ Lacs
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData} margin={{ top: 22, right: 28, left: -12, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} tickMargin={6} padding={{ left: 15, right: 20 }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Savings" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorGreenGrad)" dot={{ r: 4, fill: "#059669", stroke: "#FFF", strokeWidth: 2 }}>
                  <LabelList dataKey="Savings" position="top" style={{ fontSize: "11px", fontWeight: "800", fill: "#047857" }} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 14: Execution Status Timeline - Smart Non-Overlapping Labels */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Execution Status</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Monthly Rate
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 25, right: 28, left: -12, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} tickMargin={8} height={35} padding={{ left: 15, right: 20 }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} domain={[0, (max: number) => Math.max(max + 3, 5)]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
                <Line type="monotone" dataKey="Submitted" stroke="#EA580C" strokeWidth={3} dot={{ r: 4.5, fill: "#EA580C", stroke: "#FFF", strokeWidth: 2 }}>
                  <LabelList dataKey="Submitted" content={renderExecutionSubmittedLabel} />
                </Line>
                <Line type="monotone" dataKey="Completed" stroke="#16A34A" strokeWidth={3} dot={{ r: 4.5, fill: "#16A34A", stroke: "#FFF", strokeWidth: 2 }}>
                  <LabelList dataKey="Completed" content={renderExecutionCompletedLabel} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 15: Expected Savings vs Verified Actual Cost Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💰</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Expected vs Verified Cost by PE (₹)</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Audit
            </span>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expectedVsActualData} margin={{ top: 22, right: 10, left: -18, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} />
                <YAxis tick={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : (v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(val: string) => <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{val}</span>}
                  wrapperStyle={{ fontSize: "12px", pt: "6px", fontWeight: "700" }}
                />
                <Bar dataKey="Expected (₹)" fill="#6366F1" radius={[3, 3, 0, 0]} barSize={18}>
                  <LabelList dataKey="Expected (₹)" position="top" style={{ fontSize: "9px", fontWeight: "800", fill: "#3730A3" }} formatter={(v: any) => v >= 100000 ? `₹${(Number(v)/100000).toFixed(1)}L` : (v >= 1000 ? `₹${(Number(v)/1000).toFixed(0)}k` : (v > 0 ? `₹${v}` : "0"))} />
                </Bar>
                <Bar dataKey="Verified Cost by PE (₹)" fill="#10B981" radius={[3, 3, 0, 0]} barSize={18}>
                  <LabelList dataKey="Verified Cost by PE (₹)" position="top" style={{ fontSize: "9px", fontWeight: "800", fill: "#047857" }} formatter={(v: any) => v >= 100000 ? `₹${(Number(v)/100000).toFixed(1)}L` : (v >= 1000 ? `₹${(Number(v)/1000).toFixed(0)}k` : (v > 0 ? `₹${v}` : "0"))} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
