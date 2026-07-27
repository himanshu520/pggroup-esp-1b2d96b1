import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { AppShell, PageHeader, StatCard } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, type SuggestionStatus } from "@/lib/statuses";
import { ExportMenu } from "@/components/export-menu";
import { exportComprehensiveExecutiveDashboard } from "@/lib/exports";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, CheckCircle2, Rocket, XCircle, TrendingUp, RotateCcw, Filter } from "lucide-react";
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
import { filterSuggestions, mapDatabaseSuggestionsToUI, type DashboardFilters } from "@/lib/dummy-suggestions";
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
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);

  // Query database suggestions
  const { data: sugs = [] } = useQuery({
    queryKey: ["admin-suggestions-overview-export"],
    queryFn: async () =>
      (
        await supabase
          .from("suggestions")
          .select(
            "id, code, title, status, priority, created_at, completed_at, actual_cost, department_id, current_department_id, plant_id, location_id, category_id, expected_saving, employees(name, employee_code), departments!suggestions_department_id_fkey(name), current_departments:departments!suggestions_current_department_id_fkey(name), categories(name), plants(name, locations(location, state)), locations(location, state)"
          )
          .order("created_at", { ascending: false })
          .limit(5000)
      ).data ?? [],
  });

  // Map live database records from Supabase
  const mappedSuggestions = useMemo(() => {
    return mapDatabaseSuggestionsToUI(sugs);
  }, [sugs]);

  // Filter live database suggestions according to Filter Drawer selection
  const filteredSuggestions = useMemo(() => {
    return filterSuggestions(mappedSuggestions, filters);
  }, [mappedSuggestions, filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return (
    <AppShell
      navGroups={ADMIN_NAV}
      title="Executive Analytics Dashboard"
      filterSlot={
        <div className="flex items-center gap-2">
          <FilterDrawer
            filters={filters}
            onApplyFilters={(f) => setFilters(f)}
            onResetFilters={() => setFilters({})}
          />
          <ExportMenu
            data={filteredSuggestions}
            columns={[
              { header: "Code", accessor: (s: any) => s.code ?? s.id },
              { header: "Title", accessor: (s: any) => s.title },
              { header: "Employee", accessor: (s: any) => s.employeeName },
              { header: "Department", accessor: (s: any) => s.department },
              { header: "Plant", accessor: (s: any) => s.plant },
              { header: "Location", accessor: (s: any) => s.location },
              { header: "Status", accessor: (s: any) => s.status },
              { header: "Category", accessor: (s: any) => s.category },
              { header: "Savings", accessor: (s: any) => s.savings },
              { header: "Date", accessor: (s: any) => s.createdDate },
            ]}
            filename="ESP_Executive_Analytics_Report"
            title="ESP Comprehensive Analytics Presentation Report"
            customExport={(format) => exportComprehensiveExecutiveDashboard(format, filteredSuggestions, "ESP_Executive_Analytics_Report")}
          />
        </div>
      }
    >
      <div className="space-y-6 pb-8 page-fade-in">
        {/* Active Filter Banner if filters applied */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <span>
              Active Filter Panel: Showing {filteredSuggestions.length} of {mappedSuggestions.length} database suggestions ({activeFilterCount} criteria applied)
            </span>
            <Button variant="ghost" size="sm" onClick={() => setFilters({})} className="h-6 px-2 text-xs font-bold hover:bg-primary/20">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* 1. Sticky Dashboard 9 KPI Cards with Expandable Filter Bar */}
        <KPICardsSection
          suggestions={filteredSuggestions}
          filters={filters}
          onApplyFilters={(f) => setFilters(f)}
          onResetFilters={() => setFilters({})}
          isFilterBarOpen={isFilterBarOpen}
          onToggleFilterBar={() => setIsFilterBarOpen(!isFilterBarOpen)}
        />

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
