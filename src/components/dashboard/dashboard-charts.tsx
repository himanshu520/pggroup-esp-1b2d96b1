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

const COLORS = ["#0066FF", "#FF6B00", "#00B8D9", "#36B37E", "#6554C0", "#FFAB00", "#FF5630", "#0052CC"];

export function DashboardChartsSection({ suggestions }: DashboardChartsProps) {
  // 1. State-wise Suggestions (Multi-Bar Breakdown: Implemented, Under Review, Pending)
  const stateData = useMemo(() => {
    const stateStats: Record<string, { implemented: number; underReview: number; pending: number; total: number }> = {};
    suggestions.forEach((s) => {
      const st = s.state || "Unassigned";
      if (!stateStats[st]) {
        stateStats[st] = { implemented: 0, underReview: 0, pending: 0, total: 0 };
      }
      stateStats[st].total += 1;
      if (s.status === "implemented") {
        stateStats[st].implemented += 1;
      } else if (s.status === "under_review") {
        stateStats[st].underReview += 1;
      } else {
        stateStats[st].pending += 1;
      }
    });

    return Object.entries(stateStats).map(([state, stat]) => ({
      state,
      Implemented: stat.implemented,
      "Under Review": stat.underReview,
      Pending: stat.pending,
      Total: stat.total,
    }));
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
      counts[s.gender] = (counts[s.gender] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [suggestions]);

  // 5. Execution Pending Department Wise (Horizontal Bar Chart)
  const pendingDeptData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      if (s.status === "approved" || s.status === "pending" || s.status === "under_review") {
        counts[s.department] = (counts[s.department] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([department, count]) => ({ department, count })).sort((a, b) => b.count - a.count);
  }, [suggestions]);

  // 6. Cost Category Stacked Column Chart (Low Cost, No Cost, High Cost by Dept)
  const costCategoryData = useMemo(() => {
    const depts = Array.from(new Set(suggestions.map((s) => s.department))).slice(0, 6);
    return depts.map((dept) => {
      const deptSugs = suggestions.filter((s) => s.department === dept);
      return {
        department: dept,
        "No Cost": deptSugs.filter((s) => s.costType === "No Cost").length,
        "Low Cost": deptSugs.filter((s) => s.costType === "Low Cost").length,
        "High Cost": deptSugs.filter((s) => s.costType === "High Cost").length,
      };
    });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Interactive Analytics & Charts
          </h2>
          <p className="text-xs text-muted-foreground">Power BI executive dashboards across organization parameters</p>
        </div>
      </div>

      {/* Grid Row 1: State-Wise & Plant-Wise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: State-wise Suggestions */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> State-wise Suggestions
            </span>
            <span className="text-[11px] text-muted-foreground">Geographic Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Implemented" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Under Review" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Plant-wise Distribution */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" /> Plant-wise Distribution
            </span>
            <span className="text-[11px] text-muted-foreground">Manufacturing Plants</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={plantData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {plantData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Category & Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 3: Suggestion Category Distribution */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-500" /> Category Distribution
            </span>
            <span className="text-[11px] text-muted-foreground">Safety, Kaizen, 5S, Quality</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Gender-wise Participation */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-500" /> Gender-wise Participation
            </span>
            <span className="text-[11px] text-muted-foreground">Male, Female, Others</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={6} dataKey="value">
                  <Cell fill="#0066FF" />
                  <Cell fill="#FF6B00" />
                  <Cell fill="#36B37E" />
                </Pie>
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Execution Pending & Cost Category Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 5: Execution Pending Department Wise */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" /> Execution Pending Dept-Wise
            </span>
            <span className="text-[11px] text-muted-foreground">Horizontal Bar</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={pendingDeptData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF6B00" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Cost Category Stacked Column Chart */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500" /> Cost Category Breakdown
            </span>
            <span className="text-[11px] text-muted-foreground">No Cost, Low Cost, High Cost</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costCategoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
                <Bar dataKey="No Cost" stackId="a" fill="#36B37E" />
                <Bar dataKey="Low Cost" stackId="a" fill="#0066FF" />
                <Bar dataKey="High Cost" stackId="a" fill="#FF6B00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 4: Monthly Trend & Monthly Participation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 7: Monthly Trend */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LineIcon className="w-4 h-4 text-indigo-500" /> Monthly Trend (2026 vs 2025)
            </span>
            <span className="text-[11px] text-muted-foreground">Line Comparison</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Current Year (2026)" stroke="#0066FF" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Last Year (2025)" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Monthly Participation */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" /> Monthly Participation Growth
            </span>
            <span className="text-[11px] text-muted-foreground">Area Chart</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyParticipationData}>
                <defs>
                  <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B8D9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00B8D9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="Participants" stroke="#00B8D9" strokeWidth={2} fillOpacity={1} fill="url(#colorPart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 5: Dept Ranking & Suggestion Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 9: Department Ranking */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" /> Department Total Points Ranking
            </span>
            <span className="text-[11px] text-muted-foreground">Top Departments</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRankingData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="points" fill="#FF6B00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 10: Suggestion Status Donut */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" /> Suggestion Status Breakdown
            </span>
            <span className="text-[11px] text-muted-foreground">Implemented, Pending, Rejected</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {statusData.map((_, index) => (
                    <Cell key={`cell-st-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 6: Year-wise Comparison & Plant Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 11: Year-wise Comparison */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Year-wise Performance (2025 vs 2026)
            </span>
            <span className="text-[11px] text-muted-foreground">YoY Analysis</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearComparisonData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
                <Bar dataKey="2025" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2026" fill="#0066FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 12: Plant Performance Radar Chart */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Plant Multi-Axis Radar Performance
            </span>
            <span className="text-[11px] text-muted-foreground">Plants 1-4 Matrix</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={75} data={radarData}>
                <PolarGrid opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Plant 1" dataKey="Plant 1" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
                <Radar name="Plant 2" dataKey="Plant 2" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} />
                <Legend tick={{ fontSize: 11 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 7: Cost Savings Area & Execution Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 13: Cost Savings Monthly Area */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Cumulative Cost Savings (in ₹ Lacs)
            </span>
            <span className="text-[11px] text-muted-foreground">Financial Returns</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSav" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#36B37E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#36B37E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="Savings" stroke="#36B37E" strokeWidth={3} fillOpacity={1} fill="url(#colorSav)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 14: Suggestion Execution Timeline */}
        <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LineIcon className="w-4 h-4 text-blue-600" /> Suggestion Execution Velocity Timeline
            </span>
            <span className="text-[11px] text-muted-foreground">Submitted vs Completed</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend tick={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Submitted" stroke="#FF6B00" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Completed" stroke="#36B37E" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
