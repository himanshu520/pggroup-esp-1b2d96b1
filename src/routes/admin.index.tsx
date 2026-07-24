import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { AppShell, PageHeader, StatCard } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, type SuggestionStatus } from "@/lib/statuses";
import { ExportMenu } from "@/components/export-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, CheckCircle2, Rocket, XCircle, TrendingUp, RotateCcw } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { useSession, isLocationAccessible, isPlantAccessible, isSuggestionAccessible } from "@/lib/session";

// Consolidated admin section components (each sub-route file redirects here and exports its component).
import { AnalyticsPage } from "./admin.analytics";
import { AuditPage } from "./admin.audit";
import { DeptPerf } from "./admin.departments";
import { EmployeesPage } from "./admin.employees";
import { LocationPerf } from "./admin.locations";
import { MastersPage } from "./admin.masters";
import { PlantPerf } from "./admin.plants";
import { SecurityPage } from "./admin.security";
import { SettingsPage } from "./admin.settings";
import { SuggestionsList } from "./admin.suggestions.index";
import { SuggestionDetail } from "./admin.suggestions.$id";
import { WorkflowPage } from "./admin.workflow";
import { UsersPage } from "./admin.users";
import { LeaderboardView } from "@/components/leaderboard";
import { FilterDrawer } from "@/components/filter-drawer";
import { DUMMY_SUGGESTIONS, filterSuggestions, type DashboardFilters } from "@/lib/dummy-suggestions";
import { KPICardsSection } from "@/components/dashboard/kpi-cards";
import { DashboardChartsSection } from "@/components/dashboard/dashboard-charts";
import { DashboardHighlightsSection } from "@/components/dashboard/dashboard-highlights";
import { StatisticsSection } from "@/components/dashboard/statistics-section";
import { DepartmentPointSystemSection } from "@/components/dashboard/department-point-system";
import { EmployeeLeaderboardSection } from "@/components/dashboard/employee-leaderboard-section";

type AdminSearch = { section?: string; id?: string };

const SECTION_TITLES: Record<string, string> = {
  overview: "Overview Analytics — ESP Admin",
  suggestions: "Suggestions — ESP Admin",
  suggestion: "Suggestion — ESP Admin",
  workflow: "Workflow Queue — ESP Admin",
  departments: "Department Performance — ESP",
  plants: "Plant Performance — ESP",
  locations: "Location Performance — ESP",
  analytics: "Analytics — ESP",
  masters: "Masters — ESP",
  employees: "Employees — ESP",
  users: "Users & Roles — ESP",
  audit: "Audit Logs — ESP",
  security: "Security — ESP Admin",
  settings: "Settings — ESP Admin",
  leaderboard: "Performance Leaderboard — ESP",
};

export const Route = createFileRoute("/admin/")({
  validateSearch: (s: Record<string, unknown>): AdminSearch => ({
    section: typeof s.section === "string" ? s.section : undefined,
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  head: ({ match }) => {
    const s = (match.search as AdminSearch | undefined)?.section ?? "overview";
    return { meta: [{ title: SECTION_TITLES[s] ?? SECTION_TITLES.overview }] };
  },
  component: AdminHome,
});

const ADMIN_ONLY_SECTIONS = new Set(["masters", "employees", "users", "audit", "security", "settings"]);

function AdminHome() {
  const { section, id } = Route.useSearch();
  const { data: sess } = useSession();
  const isSuper = sess?.primaryRole === "super_admin";
  const effectiveSection = section && ADMIN_ONLY_SECTIONS.has(section) && !isSuper ? undefined : section;
  switch (effectiveSection) {
    case "suggestions": return <SuggestionsList />;
    case "suggestion":  return id ? <SuggestionDetail id={id} /> : <SuggestionsList />;
    case "workflow":    return <WorkflowPage />;
    case "departments": return <DeptPerf />;
    case "plants":      return <PlantPerf />;
    case "locations":   return <LocationPerf />;
    case "analytics":   return <AnalyticsPage />;
    case "masters":     return <MastersPage />;
    case "employees":   return <EmployeesPage />;
    case "users":       return <UsersPage />;
    case "audit":       return <AuditPage />;
    case "security":    return <SecurityPage />;
    case "settings":    return <SettingsPage />;
    case "leaderboard": return <LeaderboardView adminMode={true} />;
    default:            return <OverviewPage />;
  }
}


const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function OverviewPage() {
  const { data: sess } = useSession();
  const [filters, setFilters] = useState<DashboardFilters>({});

  // Query database suggestions
  const { data: sugs = [] } = useQuery({
    queryKey: ["admin-suggestions-overview-export"],
    queryFn: async () =>
      (
        await supabase
          .from("suggestions")
          .select(
            "id, code, title, status, priority, created_at, completed_at, actual_cost, department_id, current_department_id, plant_id, location_id, category_id, expected_saving, employees(name, employee_code), departments!suggestions_department_id_fkey(name), current_departments:departments!suggestions_current_department_id_fkey(name), categories(name), plants(name)"
          )
          .order("created_at", { ascending: false })
          .limit(5000)
      ).data ?? [],
  });

  // Filter realistic preloaded dummy dataset according to Filter Drawer selection
  const filteredSuggestions = useMemo(() => {
    return filterSuggestions(DUMMY_SUGGESTIONS, filters);
  }, [filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return (
    <AppShell
      navGroups={ADMIN_NAV}
      title="Executive Analytics Dashboard"
      filterSlot={
        <FilterDrawer
          filters={filters}
          onApplyFilters={(f) => setFilters(f)}
          onResetFilters={() => setFilters({})}
        />
      }
    >
      <div className="space-y-6 pb-8 page-fade-in">
        {/* Active Filter Banner if filters applied */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <span>
              Active Filter Panel: Showing {filteredSuggestions.length} of {DUMMY_SUGGESTIONS.length} suggestions ({activeFilterCount} criteria applied)
            </span>
            <Button variant="ghost" size="sm" onClick={() => setFilters({})} className="h-6 px-2 text-xs font-bold hover:bg-primary/20">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* 1. Dashboard 15 KPI Cards */}
        <KPICardsSection suggestions={filteredSuggestions} />

        {/* 2. Executive Highlights Cards */}
        <DashboardHighlightsSection suggestions={filteredSuggestions} />

        {/* 3. Statistics Section (10 Animated Metric Cards) */}
        <StatisticsSection suggestions={filteredSuggestions} />

        {/* 4. Dashboard 14 Interactive Recharts */}
        <DashboardChartsSection suggestions={filteredSuggestions} />

        {/* 5. Department Point System & Leaderboards */}
        <DepartmentPointSystemSection suggestions={filteredSuggestions} />

        {/* 6. Employee Leaderboard */}
        <EmployeeLeaderboardSection suggestions={filteredSuggestions} />
      </div>
    </AppShell>
  );
}
