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
  // 1. State-wise Suggestions (Bar Chart)
  const stateData = useMemo(() => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      counts[s.state] = (counts[s.state] || 0) + 1;
    });
    return Object.entries(counts).map(([state, count]) => ({ state, count }));
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

  // 7. Monthly Trend (Line Chart: Current Year vs Last Year)
  const monthlyTrendData = [
    { month: "Jan", "Current Year (2026)": 12, "Last Year (2025)": 8 },
    { month: "Feb", "Current Year (2026)": 15, "Last Year (2025)": 10 },
    { month: "Mar", "Current Year (2026)": 18, "Last Year (2025)": 12 },
    { month: "Apr", "Current Year (2026)": 22, "Last Year (2025)": 14 },
    { month: "May", "Current Year (2026)": 26, "Last Year (2025)": 15 },
    { month: "Jun", "Current Year (2026)": 31, "Last Year (2025)": 18 },
    { month: "Jul", "Current Year (2026)": 35, "Last Year (2025)": 20 },
  ];

  // 8. Monthly Participation Area Chart
  const monthlyParticipationData = [
    { month: "Jan", Participants: 14 },
    { month: "Feb", Participants: 19 },
    { month: "Mar", Participants: 24 },
    { month: "Apr", Participants: 28 },
    { month: "May", Participants: 32 },
    { month: "Jun", Participants: 38 },
    { month: "Jul", Participants: 42 },
  ];

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
  const yearComparisonData = [
    { metric: "Total Suggestions", "2025": 140, "2026": 185 },
    { metric: "Implemented", "2025": 95, "2026": 138 },
    { metric: "Savings (in Lacs)", "2025": 42, "2026": 68 },
    { metric: "Awards Given", "2025": 18, "2026": 32 },
  ];

  // 12. Plant Performance Radar Chart
  const radarData = [
    { subject: "Participation %", "Plant 1": 88, "Plant 2": 92, "Plant 3": 78, "Plant 4": 85 },
    { subject: "Implementation %", "Plant 1": 82, "Plant 2": 95, "Plant 3": 80, "Plant 4": 88 },
    { subject: "Avg Points", "Plant 1": 420, "Plant 2": 490, "Plant 3": 380, "Plant 4": 460 },
    { subject: "Savings Rate", "Plant 1": 90, "Plant 2": 94, "Plant 3": 75, "Plant 4": 86 },
    { subject: "5S Compliance", "Plant 1": 95, "Plant 2": 98, "Plant 3": 88, "Plant 4": 92 },
  ];

  // 13. Monthly Area Cost Savings
  const savingsData = [
    { month: "Jan", Savings: 3.2 },
    { month: "Feb", Savings: 8.0 },
    { month: "Mar", Savings: 20.5 },
    { month: "Apr", Savings: 30.0 },
    { month: "May", Savings: 44.5 },
    { month: "Jun", Savings: 65.5 },
    { month: "Jul", Savings: 72.8 },
  ];

  // 14. Suggestion Execution Timeline
  const timelineData = [
    { week: "W1 Jan", Submitted: 4, Completed: 3 },
    { week: "W2 Feb", Submitted: 6, Completed: 5 },
    { week: "W3 Mar", Submitted: 8, Completed: 7 },
    { week: "W4 Apr", Submitted: 10, Completed: 9 },
    { week: "W5 May", Submitted: 12, Completed: 11 },
    { week: "W6 Jun", Submitted: 15, Completed: 14 },
  ];

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
                <Bar dataKey="count" fill="#0066FF" radius={[6, 6, 0, 0]} />
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
