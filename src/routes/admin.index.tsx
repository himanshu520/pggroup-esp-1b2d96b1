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
    default:            return <OverviewPage />;
  }
}


const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function OverviewPage() {
  const { data: sess } = useSession();

  const { data: sugs = [] } = useQuery({
    queryKey: ["admin-suggestions-all"],
    queryFn: async () => (await supabase.from("suggestions").select("id, status, priority, created_at, department_id, current_department_id, plant_id, location_id, category_id, expected_saving").order("created_at", { ascending: false }).limit(5000)).data ?? [],
  });
  const { data: locations = [] } = useQuery({ queryKey: ["locs"], queryFn: async () => (await supabase.from("locations").select("id,location")).data ?? [] });
  const { data: plants = [] } = useQuery({ queryKey: ["plants"], queryFn: async () => (await supabase.from("plants").select("id,name,location_id")).data ?? [] });
  const { data: categories = [] } = useQuery({ queryKey: ["cats"], queryFn: async () => (await supabase.from("categories").select("id,name")).data ?? [] });

  const isGlobal = useMemo(() => {
    if (!sess?.roles) return true;
    return sess.roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin");
  }, [sess?.roles]);

  const allowedLocations = useMemo(() => {
    if (!sess?.roles) return [];
    return locations.filter((l: any) => isLocationAccessible(l.id, sess.roles));
  }, [locations, sess?.roles]);

  const [locationId, setLocationId] = useState<string>("all");
  const [plantId, setPlantId] = useState<string>("all");
  const [trendMode, setTrendMode] = useState<"half" | "custom">("half");

  // Sync default location on load
  useEffect(() => {
    if (sess?.roles && !isGlobal && allowedLocations.length > 0 && locationId === "all") {
      setLocationId(allowedLocations[0].id);
    }
  }, [sess?.roles, isGlobal, allowedLocations, locationId]);

  // `nowTick` refreshes every hour so the half-year window auto-updates at month/year rollover
  const [nowTick, setNowTick] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const accessibleSugs = useMemo(() => {
    if (!sess?.roles) return [];
    return sugs.filter((s: any) => isSuggestionAccessible(s, sess.roles));
  }, [sugs, sess?.roles]);

  const filtered = useMemo(() => accessibleSugs.filter((s: any) =>
    (locationId === "all" || s.location_id === locationId) &&
    (plantId === "all" || s.plant_id === plantId),
  ), [accessibleSugs, locationId, plantId]);

  const by = (st: SuggestionStatus[]) => filtered.filter((s: any) => st.includes(s.status)).length;
  const implemented = by(["implemented", "closed"]);
  const total = filtered.length;
  const implRate = total ? Math.round((implemented / total) * 100) : 0;

  // Half-year window derived from the ticking "now"
  const now = useMemo(() => new Date(nowTick), [nowTick]);
  const halfStart = useMemo(() => new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1), [now]);

  // Custom range (defaults to current half-year on first open)
  const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const [customFrom, setCustomFrom] = useState<string>(() => toISO(halfStart));
  const [customTo, setCustomTo] = useState<string>(() => toISO(new Date(halfStart.getFullYear(), halfStart.getMonth() + 5, 1)));

  const { months, windowLabel } = useMemo(() => {
    let startDate: Date;
    let endDate: Date;
    if (trendMode === "custom") {
      const parse = (v: string, fallback: Date) => {
        const m = /^(\d{4})-(\d{2})$/.exec(v);
        if (!m) return fallback;
        const y = Number(m[1]);
        const mo = Number(m[2]) - 1;
        if (mo < 0 || mo > 11) return fallback;
        return new Date(y, mo, 1);
      };
      startDate = parse(customFrom, halfStart);
      endDate = parse(customTo, new Date(halfStart.getFullYear(), halfStart.getMonth() + 5, 1));
      if (endDate < startDate) endDate = startDate;
    } else {
      startDate = halfStart;
      endDate = new Date(halfStart.getFullYear(), halfStart.getMonth() + 5, 1);
    }

    const count =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) + 1;
    const cappedCount = Math.min(Math.max(count, 1), 36);

    const arr = Array.from({ length: cappedCount }).map((_, i) => {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: `${MONTH_SHORT[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
        fullLabel: `${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`,
        total: 0,
        implemented: 0,
      };
    });

    const first = arr[0];
    const last = arr[arr.length - 1];
    const label = first === last ? first.fullLabel : `${first.fullLabel} – ${last.fullLabel}`;
    return { months: arr, windowLabel: label };
  }, [trendMode, customFrom, customTo, halfStart]);

  for (const s of filtered as any[]) {
    if (!s.created_at) continue;
    const d = new Date(s.created_at);
    if (isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const m = months.find((x) => x.key === key);
    if (m) { m.total++; if (s.status === "implemented" || s.status === "closed") m.implemented++; }
  }

  const trendExportRows = months.map((m) => ({ month: m.fullLabel, total: m.total, implemented: m.implemented }));

  const catData = categories.map((c: any) => ({
    name: c.name,
    value: filtered.filter((s: any) => s.category_id === c.id).length,
  })).filter((x) => x.value > 0);

  const implData = [
    { name: "Implemented", value: implemented },
    { name: "Not Implemented", value: Math.max(0, total - implemented) },
  ];

  const PIE = ["oklch(0.72 0.15 220)", "oklch(0.75 0.12 155)", "oklch(0.72 0.15 65)", "oklch(0.65 0.20 27)", "oklch(0.60 0.20 300)", "oklch(0.55 0.14 254)"];
  const IMPL = ["oklch(0.62 0.16 155)", "oklch(0.88 0.02 250)"];

  const exportRows = (Object.keys(STATUS_LABEL) as SuggestionStatus[]).map((st) => ({
    status: STATUS_LABEL[st],
    count: filtered.filter((s: any) => s.status === st).length,
  }));

  function reset() {
    if (isGlobal) {
      setLocationId("all");
    } else if (allowedLocations.length > 0) {
      setLocationId(allowedLocations[0].id);
    }
    setPlantId("all");
  }

  const availablePlants = plants.filter((p: any) => locationId === "all" || p.location_id === locationId);
  const allowedPlants = useMemo(() => {
    if (!sess?.roles) return [];
    return availablePlants.filter((p: any) => isPlantAccessible(p.id, p.location_id, sess.roles));
  }, [availablePlants, sess?.roles]);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Enterprise Portal">
      <PageHeader
        title="Overview Analytics"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground uppercase mr-1">Filter:</span>
            <Select value={locationId} onValueChange={(v) => { setLocationId(v); setPlantId("all"); }}>
              <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Select Location" /></SelectTrigger>
              <SelectContent>
                {isGlobal && <SelectItem value="all">All Locations</SelectItem>}
                {allowedLocations.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={plantId} onValueChange={setPlantId}>
              <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Select Unit" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                {allowedPlants.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9" onClick={reset}>
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <ExportMenu
              data={exportRows}
              columns={[{ key: "status", header: "Status" }, { key: "count", header: "Count" }]}
              filename="overview_analytics"
              title="Overview Analytics"
            />
          </div>
        }
      />

      {/* KPI strip — sticks under the navbar while scrolling */}
      <div className="sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-6 bg-background border-b border-border shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total Suggestions" value={total} tone="info" icon={ClipboardList} />
          <StatCard label="Under Review" value={by(["submitted", "pe_review", "dept_review"])} tone="accent" icon={Search} />
          <StatCard label="Approved" value={by(["approved", "evaluation", "implementation"])} tone="success" icon={CheckCircle2} />
          <StatCard label="Implemented" value={by(["implemented", "closed"])} tone="info" icon={Rocket} />
          <StatCard label="Rejected" value={by(["rejected", "fake_closure"])} tone="destructive" icon={XCircle} />
          <StatCard label="Impl. Rate" value={`${implRate}%`} tone="accent" icon={TrendingUp} />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
            <div>
              <div className="text-base font-bold">Monthly Submission Trend</div>
              <div className="text-xs text-muted-foreground mt-0.5">{windowLabel}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={trendMode} onValueChange={(v) => setTrendMode(v as "half" | "custom")}>
                <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="half">Last 6 months</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              <ExportMenu
                data={trendExportRows}
                columns={[
                  { key: "month", header: "Month" },
                  { key: "total", header: "Total Ideas" },
                  { key: "implemented", header: "Implemented Ideas" },
                ]}
                filename="submission_trend"
                title="Monthly Submission Trend"
                subtitle={windowLabel}
                label="Export"
              />
            </div>
          </div>
          {trendMode === "custom" && (
            <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
              <span className="text-muted-foreground">From</span>
              <Input type="month" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-8 w-36 text-xs" />
              <span className="text-muted-foreground">To</span>
              <Input type="month" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="h-8 w-36 text-xs" />
            </div>
          )}
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={months}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.008 250)" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={50} stroke="oklch(0.52 0.02 250)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.52 0.02 250)" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }}
                  labelFormatter={(_l, payload: any) => payload?.[0]?.payload?.fullLabel ?? _l}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="total" name="Total Ideas" stroke="oklch(0.72 0.15 220)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="implemented" name="Implemented Ideas" stroke="oklch(0.75 0.12 155)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-base font-bold mb-4">Distribution by Category</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={45} paddingAngle={2} label={(e: any) => e.value}>
                  {catData.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-base font-bold mb-4">Implementation Analysis</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={implData} dataKey="value" nameKey="name" outerRadius={90} label={(e: any) => e.value}>
                  {implData.map((_, i) => <Cell key={i} fill={IMPL[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="text-base font-bold mb-4">Status Distribution</div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={exportRows.filter((x) => x.count > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.008 250)" />
              <XAxis dataKey="status" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} stroke="oklch(0.52 0.02 250)" />
              <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.52 0.02 250)" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid oklch(0.90 0.008 250)", fontSize: 12 }} />
              <Bar dataKey="count" fill="oklch(0.55 0.14 254)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
