import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession, isLocationAccessible, isPlantAccessible, isDeptAccessible, isSuggestionAccessible } from "@/lib/session";
import { toast } from "sonner";
import { 
  Trophy, Medal, Award, Star, Flame, Zap, TrendingUp, AlertTriangle, 
  Search, Lock, Unlock, Settings, Activity, Users, BarChart3, 
  CheckCircle2, XCircle, Sparkles, User, Building2, Factory, MapPin, 
  ChevronUp, ChevronDown, Calendar, RefreshCw, FileSpreadsheet, FileText
} from "lucide-react";
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, 
  Legend, LineChart, Line, CartesianGrid, Cell 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExportMenu } from "@/components/export-menu";
import { EmployeeBadges } from "./employee-badges";
import { lockLeaderboardMonth, updateLeaderboardSettings } from "@/lib/workflow.functions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Fallback scoring weights
const DEFAULT_WEIGHTS = {
  implemented: 1,
  fake_closure: -2,
  rejected: 0,
  pending: 0,
  approved: 0,
};

export function LeaderboardView({ adminMode = false }: { adminMode?: boolean }) {
  const { data: sess } = useSession();
  const isSuper = sess?.primaryRole === "super_admin";
  const qc = useQueryClient();

  // 1. Check if user is global (super_admin or corporate_admin)
  const isGlobal = useMemo(() => {
    if (!sess?.roles) return true;
    return sess.roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin");
  }, [sess?.roles]);

  // Filters state
  const [locationId, setLocationId] = useState<string>("all");
  const [plantId, setPlantId] = useState<string>("all");
  const [deptFilterId, setDeptFilterId] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-indexed
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"department" | "employee" | "best_suggestion" | "analytics" | "admin">("department");

  // Fetch locations & plants
  const { data: locations = [] } = useQuery({ queryKey: ["locs"], queryFn: async () => (await supabase.from("locations").select("id,location")).data ?? [] });
  const { data: plants = [] } = useQuery({ queryKey: ["plants"], queryFn: async () => (await supabase.from("plants").select("id,name,location_id")).data ?? [] });
  const { data: departments = [] } = useQuery({ queryKey: ["departments-all"], queryFn: async () => (await supabase.from("departments").select("id,name,plant_id")).data ?? [] });

  // Find accessible locations and plants based on roles
  const accessibleLocationIds = useMemo(() => {
    if (!sess?.roles) return new Set<string>();
    const ids = new Set<string>();
    sess.roles.forEach((r) => {
      if (r.role === "super_admin" || r.role === "corporate_admin") {
        return;
      }
      if (r.location_id) {
        ids.add(r.location_id);
      }
      if (r.plant_id) {
        const plant = plants.find((p: any) => p.id === r.plant_id);
        if (plant?.location_id) ids.add(plant.location_id);
      }
      if (r.department_id) {
        const dept = departments.find((d: any) => d.id === r.department_id);
        const plant = plants.find((p: any) => p.id === dept?.plant_id);
        if (plant?.location_id) ids.add(plant.location_id);
      }
    });
    return ids;
  }, [sess?.roles, plants, departments]);

  const accessiblePlantIds = useMemo(() => {
    if (!sess?.roles) return new Set<string>();
    const ids = new Set<string>();
    sess.roles.forEach((r) => {
      if (r.role === "super_admin" || r.role === "corporate_admin") {
        return;
      }
      if (r.location_id) {
        // Add all plants in this location
        plants.forEach((p: any) => {
          if (p.location_id === r.location_id) ids.add(p.id);
        });
      }
      if (r.plant_id) {
        ids.add(r.plant_id);
      }
      if (r.department_id) {
        const dept = departments.find((d: any) => d.id === r.department_id);
        if (dept?.plant_id) ids.add(dept.plant_id);
      }
    });
    return ids;
  }, [sess?.roles, plants, departments]);

  // Filter plants by selected location
  const filteredPlants = useMemo(() => {
    if (locationId === "all") return plants;
    return plants.filter((p: any) => p.location_id === locationId);
  }, [plants, locationId]);

  // Sync plant selection if it goes out of scope
  useEffect(() => {
    if (plantId !== "all" && locationId !== "all") {
      const isMatch = plants.some((p: any) => p.id === plantId && p.location_id === locationId);
      if (!isMatch) setPlantId("all");
    }
  }, [locationId, plantId, plants]);

  // Sync default location and plant on load if not global
  useEffect(() => {
    if (sess?.roles && !isGlobal) {
      if (accessibleLocationIds.size > 0 && locationId === "all") {
        if (accessibleLocationIds.size === 1) {
          setLocationId(Array.from(accessibleLocationIds)[0]);
        }
      }
      if (accessiblePlantIds.size > 0 && plantId === "all") {
        if (accessiblePlantIds.size === 1) {
          setPlantId(Array.from(accessiblePlantIds)[0]);
        }
      }
    }
  }, [sess?.roles, isGlobal, accessibleLocationIds, accessiblePlantIds, locationId, plantId]);

  // 1. Fetch Scoring Settings
  const { data: settings = {} } = useQuery({
    queryKey: ["leaderboard-settings-all"],
    queryFn: async () => {
      const { data } = await supabase.from("leaderboard_settings" as any).select("key, value");
      const rules = data?.find((s: any) => s.key === "scoring_rules")?.value ?? DEFAULT_WEIGHTS;
      const badges = data?.find((s: any) => s.key === "badge_rules")?.value ?? { enabled: true };
      return { rules, badges };
    }
  });

  const scoringRules = settings.rules ?? DEFAULT_WEIGHTS;

  // 2. Check if selected month/year is locked
  const { data: lockedMonths = [] } = useQuery({
    queryKey: ["locked-months"],
    queryFn: async () => {
      const { data } = await supabase.from("locked_leaderboards" as any).select("year, month");
      return data ?? [];
    }
  });

  const isLocked = useMemo(() => {
    return lockedMonths.some((l: any) => l.year === selectedYear && l.month === selectedMonth);
  }, [lockedMonths, selectedYear, selectedMonth]);

  // Date Range conversion for Live query
  const dateRange = useMemo(() => {
    const start = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1, 0, 0, 0)).toISOString();
    const end = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999)).toISOString();
    return { start, end };
  }, [selectedYear, selectedMonth]);

  // 3. Fetch Leaderboard Snapshot if locked, otherwise fetch live data
  const { data: deptLeaderboardRaw = [], isLoading: isLoadingDept } = useQuery({
    queryKey: ["leaderboard-dept", isLocked, selectedYear, selectedMonth, locationId, plantId],
    queryFn: async () => {
      if (isLocked) {
        // Load Snapshot
        const { data } = await supabase
          .from("leaderboard_snapshots" as any)
          .select("data")
          .eq("year", selectedYear)
          .eq("month", selectedMonth)
          .eq("type", "department")
          .maybeSingle();
        const raw = (data?.data as any[]) ?? [];
        // Apply location/plant filters to snapshot if selected
        return raw.filter((r: any) => {
          if (locationId !== "all" && r.location_id !== locationId) return false;
          if (plantId !== "all" && r.plant_id !== plantId) return false;
          return true;
        });
      } else {
        // Live RPC
        const { data } = await supabase.rpc("get_department_leaderboard" as any, {
          p_location_id: locationId === "all" ? null : locationId,
          p_plant_id: plantId === "all" ? null : plantId,
          p_start_date: dateRange.start,
          p_end_date: dateRange.end,
        });
        return data as any[] ?? [];
      }
    }
  });

  const { data: empLeaderboardRaw = [], isLoading: isLoadingEmp } = useQuery({
    queryKey: ["leaderboard-emp", isLocked, selectedYear, selectedMonth, locationId, plantId, deptFilterId],
    queryFn: async () => {
      if (isLocked) {
        // Load Snapshot
        const { data } = await supabase
          .from("leaderboard_snapshots" as any)
          .select("data")
          .eq("year", selectedYear)
          .eq("month", selectedMonth)
          .eq("type", "employee")
          .maybeSingle();
        const raw = (data?.data as any[]) ?? [];
        return raw.filter((r: any) => {
          if (locationId !== "all" && r.location_id !== locationId) return false;
          if (plantId !== "all" && r.plant_id !== plantId) return false;
          if (deptFilterId !== "all" && r.department_id !== deptFilterId) return false;
          return true;
        });
      } else {
        // Live RPC
        const { data } = await supabase.rpc("get_employee_leaderboard" as any, {
          p_location_id: locationId === "all" ? null : locationId,
          p_plant_id: plantId === "all" ? null : plantId,
          p_department_id: deptFilterId === "all" ? null : deptFilterId,
          p_start_date: dateRange.start,
          p_end_date: dateRange.end,
        });
        return data as any[] ?? [];
      }
    }
  });

  // Fetch Best Suggestion of the Month selection
  const { data: bestSuggestion = null } = useQuery({
    queryKey: ["best-suggestion-of-month", selectedYear, selectedMonth],
    queryFn: async () => {
      const { data } = await supabase
        .from("best_suggestions" as any)
        .select("*, suggestions(*, employees(*, departments(name), plants(name), locations(location)))")
        .eq("year", selectedYear)
        .eq("month", selectedMonth)
        .maybeSingle();
      return data;
    }
  });

  // Calculate scores & metrics for Departments
  const deptLeaderboard = useMemo(() => {
    let list = deptLeaderboardRaw;
    
    // SECURE ACCESS FILTER
    if (!isGlobal && sess?.roles) {
      list = list.filter((d: any) => {
        return accessiblePlantIds.has(d.plant_id) || accessibleLocationIds.has(d.location_id);
      });
    }

    const calculated = list.map((d: any) => {
      const total = Number(d.total_suggestions ?? 0);
      const implemented = Number(d.implemented_suggestions ?? 0);
      const fake = Number(d.fake_closures ?? 0);
      
      const impRate = total > 0 ? (implemented / total) * 100 : 0;
      const fakeRate = total > 0 ? (fake / total) * 100 : 0;
      
      // Dynamic score calculation
      const score = (implemented * (scoringRules.implemented ?? 1)) + (fake * (scoringRules.fake_closure ?? -2));

      const plant = plants.find((p: any) => p.id === d.plant_id);
      const location = locations.find((l: any) => l.id === d.location_id);

      return {
        ...d,
        plant_name: plant?.name ?? "—",
        location_name: location?.location ?? "—",
        total_suggestions: total,
        implemented_suggestions: implemented,
        fake_closures: fake,
        implementation_rate: impRate,
        fake_closure_rate: fakeRate,
        score
      };
    });

    // Sort descending by score
    return calculated.sort((a, b) => b.score - a.score);
  }, [deptLeaderboardRaw, scoringRules, isGlobal, sess?.roles, departments, plants, locations, accessibleLocationIds, accessiblePlantIds]);

  // Calculate scores & badges for Employees
  const empLeaderboard = useMemo(() => {
    let list = empLeaderboardRaw;
    
    // SECURE ACCESS FILTER
    if (!isGlobal && sess?.roles) {
      list = list.filter((e: any) => {
        return accessiblePlantIds.has(e.plant_id) || accessibleLocationIds.has(e.location_id);
      });
    }

    const calculated = list.map((e: any) => {
      const total = Number(e.total_suggestions ?? 0);
      const implemented = Number(e.implemented_suggestions ?? 0);
      const score = implemented * 1;

      return {
        ...e,
        total_suggestions: total,
        implemented_suggestions: implemented,
        score
      };
    });

    // Sort descending by score
    return calculated.sort((a, b) => b.score - a.score);
  }, [empLeaderboardRaw, isGlobal, sess?.roles, accessibleLocationIds, accessiblePlantIds]);

  const showBestSuggestion = useMemo(() => {
    if (!bestSuggestion) return false;
    if (isGlobal) return true;
    if (!sess?.roles) return false;
    const sugInfo = bestSuggestion.suggestions;
    return isSuggestionAccessible(sugInfo, sess.roles);
  }, [bestSuggestion, isGlobal, sess?.roles]);

  // Filter lists by search query
  const filteredDepts = useMemo(() => {
    if (!searchQuery) return deptLeaderboard;
    return deptLeaderboard.filter((d: any) => d.department_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [deptLeaderboard, searchQuery]);

  const filteredEmps = useMemo(() => {
    if (!searchQuery) return empLeaderboard;
    return empLeaderboard.filter((e: any) => e.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) || e.employee_code.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [empLeaderboard, searchQuery]);

  // Find department badges
  const deptBadges = useMemo(() => {
    if (deptLeaderboard.length === 0) return {};
    
    // Innovation Leader: Highest score
    const maxScore = Math.max(...deptLeaderboard.map((d: any) => d.score));
    // Most Active: Highest submissions
    const maxSubmissions = Math.max(...deptLeaderboard.map((d: any) => d.total_suggestions));
    // Best Improvement Rate: Highest implementation %
    const maxImpRate = Math.max(...deptLeaderboard.map((d: any) => d.implementation_rate));
    // Quality Excellence: Highest ratio
    const maxQuality = Math.max(...deptLeaderboard.map((d: any) => d.total_suggestions > 0 ? d.implemented_suggestions / d.total_suggestions : 0));

    const badgesMap: Record<string, string[]> = {};
    
    deptLeaderboard.forEach((d: any) => {
      const badges: string[] = [];
      if (d.score === maxScore && d.score > 0) badges.push("leader");
      if (d.fake_closures === 0 && d.total_suggestions > 0) badges.push("zero_fake");
      if (d.implementation_rate === maxImpRate && d.implementation_rate > 0) badges.push("efficient");
      if (d.total_suggestions === maxSubmissions && d.total_suggestions > 0) badges.push("active");
      const qualityRatio = d.total_suggestions > 0 ? d.implemented_suggestions / d.total_suggestions : 0;
      if (qualityRatio === maxQuality && qualityRatio > 0) badges.push("quality");

      badgesMap[d.department_id] = badges;
    });

    return badgesMap;
  }, [deptLeaderboard]);

  // Widgets calculations
  const widgets = useMemo(() => {
    if (deptLeaderboard.length === 0) {
      return {
        topDeptName: "—",
        topDeptScore: 0,
        highestImpDept: "—",
        highestImpRate: 0,
        mostActiveDept: "—",
        mostActiveCount: 0,
        qualityChampion: "—",
        needsImprovement: "—",
        lowestDept: "—",
        overallImpRate: 0,
        overallFakeRate: 0,
      };
    }

    const topDept = deptLeaderboard[0];
    const lowestDept = deptLeaderboard[deptLeaderboard.length - 1];

    let highestImpDept = deptLeaderboard[0];
    let mostActiveDept = deptLeaderboard[0];
    let qualityChampion = deptLeaderboard[0];
    let needsImprovement = deptLeaderboard[0];

    let grandTotal = 0;
    let grandImplemented = 0;
    let grandFake = 0;

    deptLeaderboard.forEach((d: any) => {
      grandTotal += d.total_suggestions;
      grandImplemented += d.implemented_suggestions;
      grandFake += d.fake_closures;

      if (d.implementation_rate > highestImpDept.implementation_rate) highestImpDept = d;
      if (d.total_suggestions > mostActiveDept.total_suggestions) mostActiveDept = d;
      if (d.fake_closure_rate > needsImprovement.fake_closure_rate) needsImprovement = d;
      
      const dRatio = d.total_suggestions > 0 ? d.implemented_suggestions / d.total_suggestions : 0;
      const qRatio = qualityChampion.total_suggestions > 0 ? qualityChampion.implemented_suggestions / qualityChampion.total_suggestions : 0;
      if (dRatio > qRatio) qualityChampion = d;
    });

    return {
      topDeptName: topDept.score > 0 ? topDept.department_name : "—",
      topDeptScore: topDept.score,
      highestImpDept: highestImpDept.implementation_rate > 0 ? highestImpDept.department_name : "—",
      highestImpRate: highestImpDept.implementation_rate,
      mostActiveDept: mostActiveDept.total_suggestions > 0 ? mostActiveDept.department_name : "—",
      mostActiveCount: mostActiveDept.total_suggestions,
      qualityChampion: grandImplemented > 0 ? qualityChampion.department_name : "—",
      needsImprovement: needsImprovement.fake_closures > 0 ? needsImprovement.department_name : "—",
      lowestDept: lowestDept.score < 0 ? lowestDept.department_name : "—",
      overallImpRate: grandTotal > 0 ? (grandImplemented / grandTotal) * 100 : 0,
      overallFakeRate: grandTotal > 0 ? (grandFake / grandTotal) * 100 : 0,
    };
  }, [deptLeaderboard]);

  const topEmployee = useMemo(() => {
    return empLeaderboard.length > 0 && empLeaderboard[0].score > 0 ? empLeaderboard[0] : null;
  }, [empLeaderboard]);

  // Admin Mutations
  const lockMutation = useMutation({
    mutationFn: lockLeaderboardMonth,
    onSuccess: () => {
      toast.success(`Leaderboard locked for ${MONTHS[selectedMonth - 1]} ${selectedYear}`);
      qc.invalidateQueries({ queryKey: ["locked-months"] });
      qc.invalidateQueries({ queryKey: ["leaderboard-dept"] });
      qc.invalidateQueries({ queryKey: ["leaderboard-emp"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Lock failed")
  });

  const saveSettingsMutation = useMutation({
    mutationFn: updateLeaderboardSettings,
    onSuccess: () => {
      toast.success("Weights and configurations updated successfully!");
      qc.invalidateQueries({ queryKey: ["leaderboard-settings-all"] });
      qc.invalidateQueries({ queryKey: ["leaderboard-dept"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Save settings failed")
  });

  // Admin Form state
  const [weightImplemented, setWeightImplemented] = useState(scoringRules.implemented);
  const [weightFake, setWeightFake] = useState(scoringRules.fake_closure);

  useEffect(() => {
    setWeightImplemented(scoringRules.implemented);
    setWeightFake(scoringRules.fake_closure);
  }, [scoringRules]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Filter Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border/80 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
            Performance & Leaderboard Dashboard
          </h2>
          <p className="text-xs text-muted-foreground">
            Motivating high-quality employee ideas and department actions.
          </p>
        </div>

        {/* Global Date & Status Selection */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year selection */}
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-8 rounded border border-border bg-background px-2.5 text-xs font-semibold"
          >
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 3 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Month selection */}
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="h-8 rounded border border-border bg-background px-2.5 text-xs font-semibold"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>

          {/* Locked Badge Status */}
          {isLocked ? (
            <span className="h-8 inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25 font-semibold">
              <Lock className="w-3.5 h-3.5" /> Locked History
            </span>
          ) : (
            <span className="h-8 inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-semibold">
              <Unlock className="w-3.5 h-3.5" /> Live Ranking
            </span>
          )}
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border/60 shadow-sm">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Location</label>
          <select 
            value={locationId} 
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full mt-1 h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium"
          >
            <option value="all">All Locations</option>
            {locations.map((l: any) => (
              <option key={l.id} value={l.id}>{l.location}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Plant</label>
          <select 
            value={plantId} 
            onChange={(e) => setPlantId(e.target.value)}
            className="w-full mt-1 h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium"
          >
            <option value="all">All Plants</option>
            {filteredPlants.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Department</label>
          <select 
            value={deptFilterId} 
            onChange={(e) => setDeptFilterId(e.target.value)}
            className="w-full mt-1 h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium"
          >
            <option value="all">All Departments</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Live Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder={activeTab === "employee" ? "Search by employee name or code..." : "Search by department name..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Analytics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatWidget 
          title="Best Department" 
          value={widgets.topDeptName} 
          icon={<Trophy className="w-5 h-5 text-amber-500" />} 
          desc={widgets.topDeptScore > 0 ? `${widgets.topDeptScore} Points` : "No points yet"} 
        />
        <StatWidget 
          title="Top Employee" 
          value={topEmployee ? topEmployee.employee_name : "—"} 
          icon={<User className="w-5 h-5 text-blue-500" />} 
          desc={topEmployee ? `${topEmployee.score} Implemented` : "—"} 
        />
        <StatWidget 
          title="Implementation Rate" 
          value={`${widgets.overallImpRate.toFixed(0)}%`} 
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} 
          desc="Overall conversion" 
          progress={widgets.overallImpRate}
        />
        <StatWidget 
          title="Fake Closures" 
          value={`${widgets.overallFakeRate.toFixed(1)}%`} 
          icon={<XCircle className="w-5 h-5 text-red-500" />} 
          desc="Verify flag penalty" 
          progress={widgets.overallFakeRate}
          isWarning
        />
        <StatWidget 
          title="Most Active Department" 
          value={widgets.mostActiveDept} 
          icon={<Flame className="w-5 h-5 text-orange-500" />} 
          desc={`${widgets.mostActiveCount} Suggestions`} 
        />
        <StatWidget 
          title="Quality Champion" 
          value={widgets.qualityChampion} 
          icon={<Sparkles className="w-5 h-5 text-violet-500" />} 
          desc="Highest Imp/Sub ratio" 
        />
      </div>

      {/* 3. Section Switch Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: "department", label: "Department Leaderboard" },
          { id: "employee", label: "Employee Leaderboard" },
          { id: "best_suggestion", label: "Best Idea of the Month" },
          { id: "analytics", label: "Analytics & Trends" },
          ...(isSuper && adminMode ? [{ id: "admin", label: "Scoring Settings" }] : []),
        ].map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab View Content */}
      <div className="space-y-4">
        {/* DEPARTMENT LEADERBOARD */}
        {activeTab === "department" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Showing {filteredDepts.length} Departments
              </div>
              <ExportMenu 
                data={filteredDepts}
                filename={`department_leaderboard_${selectedMonth}_${selectedYear}`}
                title={`Department Performance Leaderboard - ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                subtitle={`Location: ${locationId}, Plant: ${plantId}`}
                columns={[
                  {key: "department_name", header: "Department"},
                  {key: "plant_name", header: "Plant"},
                  {key: "location_name", header: "Location"},
                  {key: "total_suggestions", header: "Total Submissions"},
                  {key: "approved_suggestions", header: "Approved"},
                  {key: "implemented_suggestions", header: "Implemented"},
                  {key: "fake_closures", header: "Fake Closures"},
                  {key: "rejected_suggestions", header: "Rejected"},
                  {key: "implementation_rate", header: "Implementation %", format: (r) => `${r.implementation_rate.toFixed(1)}%` },
                  {key: "fake_closure_rate", header: "Fake Closure %", format: (r) => `${r.fake_closure_rate.toFixed(1)}%` },
                  {key: "score", header: "Performance Score"},
                ]}
              />
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border">
                  <tr className="text-left font-semibold text-muted-foreground">
                    <th className="px-4 py-3 text-center w-12">Rank</th>
                    <th className="px-4 py-3">Department Name</th>
                    <th className="px-4 py-3">Plant & Location</th>
                    <th className="px-4 py-3 text-center">Total</th>
                    <th className="px-4 py-3 text-center">Approved</th>
                    <th className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">Implemented</th>
                    <th className="px-4 py-3 text-center text-red-600 dark:text-red-400">Fake Closures</th>
                    <th className="px-4 py-3 text-center">Rejected</th>
                    <th className="px-4 py-3 text-right">Implementation %</th>
                    <th className="px-4 py-3 text-right">Fake Closure %</th>
                    <th className="px-4 py-3 text-right font-bold w-32">Perf Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingDept ? (
                    <tr>
                      <td colSpan={11} className="text-center py-12 text-muted-foreground">Loading department data...</td>
                    </tr>
                  ) : filteredDepts.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-12 text-muted-foreground">No departments match your filters.</td>
                    </tr>
                  ) : filteredDepts.map((d: any, idx: number) => {
                    const rank = idx + 1;
                    const badges = deptBadges[d.department_id] ?? [];
                    return (
                      <tr 
                        key={d.department_id} 
                        className={`transition-colors hover:bg-muted/15 ${
                          rank === 1 ? "bg-amber-500/5 font-semibold" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 text-center">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white font-bold" title="Gold Trophy">🥇</span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold" title="Silver Medal">🥈</span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold" title="Bronze Medal">🥉</span>
                          ) : (
                            <span className="text-muted-foreground">{rank}</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{d.department_name}</span>
                            <div className="flex items-center gap-1 flex-wrap">
                              {badges.includes("leader") && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">👑 Leader</span>
                              )}
                              {badges.includes("zero_fake") && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">🛡️ Clean</span>
                              )}
                              {badges.includes("efficient") && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">⚡ Efficient</span>
                              )}
                              {badges.includes("active") && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">🔥 Active</span>
                              )}
                              {badges.includes("quality") && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">🎯 Quality</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          <div className="truncate max-w-[150px] font-medium text-foreground/80">{d.plant_name}</div>
                          <div className="text-[10px] truncate max-w-[150px]">{d.location_name}</div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-medium">{d.total_suggestions}</td>
                        <td className="px-4 py-3.5 text-center text-muted-foreground">{d.approved_suggestions}</td>
                        <td className="px-4 py-3.5 text-center font-medium text-emerald-600 dark:text-emerald-400">{d.implemented_suggestions}</td>
                        <td className="px-4 py-3.5 text-center font-medium text-red-600 dark:text-red-400">{d.fake_closures}</td>
                        <td className="px-4 py-3.5 text-center text-muted-foreground">{d.rejected_suggestions}</td>
                        <td className="px-4 py-3.5 text-right font-medium">{d.implementation_rate.toFixed(0)}%</td>
                        <td className="px-4 py-3.5 text-right text-muted-foreground">{d.fake_closure_rate.toFixed(1)}%</td>
                        <td className="px-4 py-3.5 text-right font-bold text-sm w-32">
                          <span className={d.score > 0 ? "text-emerald-600 dark:text-emerald-400" : d.score < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}>
                            {d.score > 0 ? `+${d.score}` : d.score}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPLOYEE LEADERBOARD */}
        {activeTab === "employee" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Showing {filteredEmps.length} Employees
              </div>
              <ExportMenu 
                data={filteredEmps}
                filename={`employee_leaderboard_${selectedMonth}_${selectedYear}`}
                title={`Employee Performance Leaderboard - ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                subtitle={`Location: ${locationId}, Plant: ${plantId}`}
                columns={[
                  { key: "employee_name", header: "Employee" },
                  { key: "employee_code", header: "Employee ID" },
                  { key: "department_name", header: "Department" },
                  { key: "plant_name", header: "Plant" },
                  { key: "location_name", header: "Location" },
                  { key: "total_suggestions", header: "Total Submitted" },
                  { key: "implemented_suggestions", header: "Implemented Suggestions" },
                  { key: "score", header: "Performance Score" },
                  { key: "last_implemented_date", header: "Last Implemented", format: (r) => r.last_implemented_date ? new Date(r.last_implemented_date).toLocaleDateString() : "—" },
                ]}
              />
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border">
                  <tr className="text-left font-semibold text-muted-foreground">
                    <th className="px-4 py-3 text-center w-12">Rank</th>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Plant & Location</th>
                    <th className="px-4 py-3 text-center w-28">Total Submitted</th>
                    <th className="px-4 py-3 text-center w-28 text-emerald-600 dark:text-emerald-400">Implemented</th>
                    <th className="px-4 py-3 text-center w-28">Last Implemented</th>
                    <th className="px-4 py-3 text-right font-bold w-32">Perf Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingEmp ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground">Loading employee data...</td>
                    </tr>
                  ) : filteredEmps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground">No employees match your filters.</td>
                    </tr>
                  ) : filteredEmps.map((e: any, idx: number) => {
                    const rank = idx + 1;
                    const avatarInitials = e.employee_name ? e.employee_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "EE";
                    return (
                      <tr 
                        key={e.employee_id} 
                        className={`transition-colors hover:bg-muted/15 ${
                          rank === 1 ? "bg-amber-500/5 font-semibold" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 text-center">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white font-bold" title="Gold Trophy">🥇</span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold" title="Silver Medal">🥈</span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold" title="Bronze Medal">🥉</span>
                          ) : (
                            <span className="text-muted-foreground">{rank}</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {/* Profile Image / Initials */}
                            {e.avatar_url ? (
                              <img 
                                src={e.avatar_url} 
                                alt={e.employee_name} 
                                className="w-8 h-8 rounded-full object-cover border border-border shadow-sm shrink-0" 
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                                {avatarInitials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-sm flex items-center gap-1.5 flex-wrap">
                                {e.employee_name}
                                <EmployeeBadges employeeId={e.employee_id} />
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono">{e.employee_code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-muted-foreground">{e.department_name ?? "—"}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          <div className="truncate max-w-[150px]">{e.plant_name ?? "—"}</div>
                          <div className="text-[10px] truncate max-w-[150px]">{e.location_name ?? "—"}</div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-medium">{e.total_suggestions}</td>
                        <td className="px-4 py-3.5 text-center font-medium text-emerald-600 dark:text-emerald-400">{e.implemented_suggestions}</td>
                        <td className="px-4 py-3.5 text-center text-muted-foreground">
                          {e.last_implemented_date ? new Date(e.last_implemented_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-sm w-32">
                          <span className={e.score > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                            +{e.score} Points
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BEST SUGGESTION SHOWCASE */}
        {activeTab === "best_suggestion" && (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              ⭐ Best Suggestion Showcase
            </div>

            {showBestSuggestion ? (
              <div className="relative overflow-hidden rounded-xl border-2 border-amber-500 bg-gradient-to-r from-amber-500/10 via-background to-amber-500/5 p-6 md:p-8 shadow-md space-y-6">
                {/* Visual Trophy background */}
                <div className="absolute right-4 top-4 text-amber-500/10 pointer-events-none">
                  <Trophy className="w-48 h-48 rotate-12" />
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-amber-500 text-white font-bold shadow-sm">
                      <Trophy className="w-3.5 h-3.5 animate-spin" />
                      Best Suggestion of the Month: {MONTHS[selectedMonth - 1]} {selectedYear}
                    </div>

                    <h3 className="text-2xl font-bold text-foreground leading-tight tracking-tight break-words">
                      {bestSuggestion.suggestions?.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground font-semibold">
                        {bestSuggestion.suggestions?.code}
                      </span>
                      <span className="text-muted-foreground">
                        Implemented: {bestSuggestion.suggestions?.completed_at ? new Date(bestSuggestion.suggestions.completed_at).toLocaleDateString() : "—"}
                      </span>
                      <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500" /> Super Admin Selected
                      </span>
                    </div>
                  </div>

                  {/* Profile info cards */}
                  <div className="flex items-center gap-3 bg-card border border-amber-500/30 p-4 rounded-lg shadow-sm shrink-0 md:max-w-xs">
                    {bestSuggestion.suggestions?.employees?.avatar_url ? (
                      <img 
                        src={bestSuggestion.suggestions.employees.avatar_url} 
                        alt={bestSuggestion.suggestions.employees.name} 
                        className="w-12 h-12 rounded-full object-cover border border-amber-500/30" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg border border-amber-500/20">
                        {bestSuggestion.suggestions?.employees?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "EE"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Submitter</div>
                      <div className="font-bold text-sm text-foreground truncate">{bestSuggestion.suggestions?.employees?.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{bestSuggestion.suggestions?.employees?.departments?.name} · {bestSuggestion.suggestions?.employees?.plants?.name}</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t border-amber-500/20 pt-6 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problem Statement</div>
                    <div className="text-foreground/90 whitespace-pre-wrap bg-card/40 p-3 rounded border border-border/60">
                      {bestSuggestion.suggestions?.problem ?? "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggested Method</div>
                    <div className="text-foreground/90 whitespace-pre-wrap bg-card/40 p-3 rounded border border-border/60">
                      {bestSuggestion.suggestions?.suggested_method ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 border-t border-amber-500/20 pt-6">
                  <div className="space-y-0.5">
                    <div className="text-xs uppercase text-muted-foreground font-bold">Expected Savings</div>
                    <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      {bestSuggestion.suggestions?.expected_saving ? `₹${Number(bestSuggestion.suggestions.expected_saving).toLocaleString()}` : "—"}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs uppercase text-muted-foreground font-bold">Expected Benefits</div>
                    <div className="text-sm font-semibold text-foreground/80">
                      {bestSuggestion.suggestions?.expected_benefits ?? "—"}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs uppercase text-muted-foreground font-bold">Selection Reason</div>
                    <div className="text-xs text-muted-foreground italic">
                      "{bestSuggestion.selection_reason || "Selected as the standout implemented idea of this month for organizational improvement."}"
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card/40">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-60" />
                <h3 className="font-semibold text-lg">No Best Suggestion Chosen</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Super Admin has not selected a suggestion of the month for {MONTHS[selectedMonth - 1]} {selectedYear} yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS & CHARTS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Department Performance Scores */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Department Performance Scores
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">{MONTHS[selectedMonth - 1]} {selectedYear}</span>
                </div>
                <div className="h-64">
                  {deptLeaderboard.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptLeaderboard.slice(0, 10)} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="department_name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ fontSize: 11 }} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {deptLeaderboard.slice(0, 10).map((d: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={d.score >= 0 ? "#eab308" : "#ef4444"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Implementation rates */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-primary" />
                    Implementation vs Fake Closures %
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">{MONTHS[selectedMonth - 1]} {selectedYear}</span>
                </div>
                <div className="h-64">
                  {deptLeaderboard.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptLeaderboard.slice(0, 8)} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="department_name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ fontSize: 11 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar name="Implementation %" dataKey="implementation_rate" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar name="Fake Closure %" dataKey="fake_closure_rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Department Comparison Stats */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" />
                Department Activity Comparison
              </h3>
              <div className="h-64">
                {deptLeaderboard.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deptLeaderboard} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="department_name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Line name="Total Submitted" type="monotone" dataKey="total_suggestions" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line name="Successfully Implemented" type="monotone" dataKey="implemented_suggestions" stroke="#10b981" strokeWidth={2} />
                      <Line name="Fake Closures" type="monotone" dataKey="fake_closures" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SCORING & ADMIN CONTROLS (SUPER ADMIN ONLY) */}
        {activeTab === "admin" && isSuper && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Scoring Config Weights */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Scoring Rules Configurations
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize performance score weights. Leaderboards update automatically.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Successfully Implemented Suggestion weight</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={weightImplemented} 
                      onChange={(e) => setWeightImplemented(Number(e.target.value))}
                      className="max-w-[120px]"
                    />
                    <span className="text-xs text-muted-foreground">Points awarded for successful evidence verification.</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Fake Closure Suggestion penalty</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={weightFake} 
                      onChange={(e) => setWeightFake(Number(e.target.value))}
                      className="max-w-[120px]"
                    />
                    <span className="text-xs text-muted-foreground">Negative points penalty deducted from department score.</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Button 
                    onClick={() => saveSettingsMutation.mutate({ key: "scoring_rules", value: { implemented: weightImplemented, fake_closure: weightFake } })}
                    disabled={saveSettingsMutation.isPending}
                  >
                    Save Scoring Configuration
                  </Button>
                </div>
              </div>
            </div>

            {/* Lock monthly rankings */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Lock Monthly Leaderboard History
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lock past monthly rankings. This freeze prevents any future data updates from changing historical records.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-800 dark:text-amber-300">
                  <strong>Warning:</strong> Locking a month generates serialized snapshots of ranks and scores. 
                  These snapshots will serve as the read-only source of truth when viewing this month's historical records.
                </div>

                <div className="p-3 bg-muted rounded-md text-xs space-y-1">
                  <div>Target Period: <strong>{MONTHS[selectedMonth - 1]} {selectedYear}</strong></div>
                  <div>Current Status: <strong>{isLocked ? "LOCKED" : "LIVE"}</strong></div>
                </div>

                <div className="pt-2">
                  {isLocked ? (
                    <Button disabled variant="outline" className="w-full">
                      <Lock className="w-4 h-4 mr-1.5" /> Already Locked
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (confirm(`Are you sure you want to lock the leaderboard for ${MONTHS[selectedMonth - 1]} ${selectedYear}? This action compiles historical rankings.`)) {
                          lockMutation.mutate({ month: selectedMonth, year: selectedYear });
                        }
                      }}
                      disabled={lockMutation.isPending}
                    >
                      Lock {MONTHS[selectedMonth - 1]} {selectedYear} Leaderboard
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Stat Widget Card
function StatWidget({ 
  title, 
  value, 
  icon, 
  desc, 
  progress, 
  isWarning = false 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  desc?: string; 
  progress?: number;
  isWarning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 min-w-0">
      <div className="flex items-start justify-between gap-2 w-full min-w-0">
        <div className="space-y-0.5 min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
          <div className="text-sm font-extrabold truncate leading-tight text-foreground" title={value}>{value}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-muted/40 shrink-0 border border-border/40">{icon}</div>
      </div>
      {progress !== undefined ? (
        <div className="mt-3 space-y-1">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isWarning ? "bg-red-500" : "bg-emerald-500"}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="text-[9px] text-muted-foreground">{desc}</div>
        </div>
      ) : (
        desc && <div className="text-[9px] text-muted-foreground mt-3 leading-tight">{desc}</div>
      )}
    </div>
  );
}
