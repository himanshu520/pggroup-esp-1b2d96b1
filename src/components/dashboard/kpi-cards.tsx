import { useMemo, useEffect, useState, useRef, memo } from "react";
import {
  Sparkles,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Search,
  DollarSign,
  UserCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  MapPin,
  Building2,
  Tag,
  Layers,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { normalizeStatusCategory, type EmployeeSuggestion, type DashboardFilters } from "@/lib/dummy-suggestions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface KPICardsProps {
  suggestions: EmployeeSuggestion[];
  filters?: DashboardFilters;
  onApplyFilters?: (filters: DashboardFilters) => void;
  onResetFilters?: () => void;
  isFilterBarOpen?: boolean;
  onToggleFilterBar?: () => void;
}

type SugTimeSubFilter = "today" | "month" | "year" | "prev_year" | "all";

// Simple counter hook for smooth number animation without CPU thrashing
function useAnimatedCount(targetValue: number) {
  const [count, setCount] = useState(targetValue);
  useEffect(() => {
    setCount(targetValue);
  }, [targetValue]);
  return count;
}

function KPICardsSectionComponent({
  suggestions,
  filters = {},
  onApplyFilters,
  onResetFilters,
  isFilterBarOpen: externalFilterBarOpen,
  onToggleFilterBar,
}: KPICardsProps) {
  const [sugFilter, setSugFilter] = useState<SugTimeSubFilter>("all");
  const [internalFilterBarOpen, setInternalFilterBarOpen] = useState(false);

  // Dynamic Master Queries from Supabase
  const { data: dbPlants = [] } = useQuery({
    queryKey: ["kpi-cards-plants"],
    queryFn: async () => {
      const { data } = await supabase.from("plants").select("name").eq("active", true).order("name");
      return (data || []).map((p) => p.name);
    },
  });

  const { data: dbDepts = [] } = useQuery({
    queryKey: ["kpi-cards-depts"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("name").eq("active", true).order("name");
      return (data || []).map((d) => d.name);
    },
  });

  const { data: dbStates = [] } = useQuery({
    queryKey: ["kpi-cards-states"],
    queryFn: async () => {
      const { data } = await supabase.from("locations").select("location").eq("active", true).order("location");
      return (data || []).map((l) => l.location);
    },
  });

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["kpi-cards-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("name").eq("active", true).order("name");
      return (data || []).map((c) => c.name);
    },
  });

  const uniquePlants = useMemo(() => {
    const fromSugs = Array.from(new Set(suggestions.map((s) => s.plant).filter((p) => p && p !== "—")));
    return Array.from(new Set([...dbPlants, ...fromSugs]));
  }, [dbPlants, suggestions]);

  const uniqueDepts = useMemo(() => {
    const fromSugs = Array.from(new Set(suggestions.map((s) => s.department).filter((d) => d && d !== "—")));
    return Array.from(new Set([...dbDepts, ...fromSugs]));
  }, [dbDepts, suggestions]);

  const uniqueStates = useMemo(() => {
    const fromSugs = Array.from(new Set(suggestions.map((s) => s.state).filter((st) => st && st !== "—")));
    return Array.from(new Set([...dbStates, ...fromSugs]));
  }, [dbStates, suggestions]);

  const uniqueCategories = useMemo(() => {
    const fromSugs = Array.from(new Set(suggestions.map((s) => s.category).filter((c) => c && c !== "—")));
    return Array.from(new Set([...dbCategories, ...fromSugs]));
  }, [dbCategories, suggestions]);

  const isFilterBarOpen = externalFilterBarOpen !== undefined ? externalFilterBarOpen : internalFilterBarOpen;
  const toggleFilterBar = onToggleFilterBar || (() => setInternalFilterBarOpen((prev) => !prev));

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v && v !== "all").length;
  }, [filters]);

  // Compute suggestions count based on Card 1 internal switcher button
  const mergedSuggestionsCount = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()];

    if (sugFilter === "today") {
      return suggestions.filter((s) => s.createdDate === todayStr || s.createdDate?.startsWith(todayStr)).length;
    }
    if (sugFilter === "month") {
      return suggestions.filter((s) => {
        if (s.participationMonth === monthShort) return true;
        if (!s.createdDate) return false;
        const d = new Date(s.createdDate);
        return d.getMonth() === now.getMonth() && d.getFullYear() === currentYear;
      }).length;
    }
    if (sugFilter === "year") {
      return suggestions.filter((s) => {
        if (s.year === currentYear) return true;
        if (!s.createdDate) return false;
        return new Date(s.createdDate).getFullYear() === currentYear;
      }).length;
    }
    if (sugFilter === "prev_year") {
      return suggestions.filter((s) => {
        if (s.year === lastYear) return true;
        if (!s.createdDate) return false;
        return new Date(s.createdDate).getFullYear() === lastYear;
      }).length;
    }
    return suggestions.length;
  }, [suggestions, sugFilter]);

  const kpiData = useMemo(() => {
    const total = suggestions.length;
    const implemented = suggestions.filter((s) => normalizeStatusCategory(s.status) === "Implemented").length;
    const pendingExecution = suggestions.filter((s) => normalizeStatusCategory(s.status) === "Approved").length;
    const underReview = suggestions.filter((s) => normalizeStatusCategory(s.status) === "Under Review" || normalizeStatusCategory(s.status) === "Pending").length;

    // Total savings
    const totalSavings = suggestions.reduce((acc, s) => acc + (s.savings || 0), 0);

    // Unique active employees
    const activeEmpSet = new Set(suggestions.map((s) => s.employeeId));
    const activeEmployees = activeEmpSet.size;

    // Participation %
    const participationPct = total > 0 ? Math.min(100, Math.round((activeEmployees / Math.max(1, total)) * 100)) : 0;

    // Best Dept
    const deptCounts: Record<string, number> = {};
    suggestions.forEach((s) => {
      if (s.department && s.department !== "—") {
        deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
      }
    });
    const bestDeptEntry = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    const bestDept = bestDeptEntry ? bestDeptEntry[0] : "—";

    // Avg Implementation Time
    const implSugs = suggestions.filter((s) => s.completedDate && s.createdDate);
    const avgTimeDays =
      implSugs.length > 0
        ? Math.round(
            implSugs.reduce((acc, s) => {
              const diff = new Date(s.completedDate!).getTime() - new Date(s.createdDate).getTime();
              return acc + diff / (1000 * 3600 * 24);
            }, 0) / implSugs.length
          )
        : 0;

    return {
      total,
      implemented,
      pendingExecution,
      underReview,
      totalSavings,
      participationPct,
      activeEmployees,
      bestDept,
      avgTimeDays,
    };
  }, [suggestions]);

  // Card definitions
  const cards = [
    {
      id: "suggestions_merged",
      title: "Total Suggestions",
      value: mergedSuggestionsCount,
      suffix: "",
      growth: sugFilter === "today" ? "Today" : sugFilter === "month" ? "This Month" : sugFilter === "year" ? "This Year" : sugFilter === "prev_year" ? "Prev Year" : "All Time",
      growthType: "neutral",
      icon: Calendar,
      lightBg: "bg-blue-50/90 dark:bg-blue-950/30 border-blue-200/90 dark:border-blue-800/60",
      iconBg: "bg-blue-600 text-white",
      comparison: "Dynamic Switcher",
      isMergedCard: true,
    },
    {
      id: "implemented",
      title: "Implemented Ideas",
      value: kpiData.implemented,
      suffix: "",
      growth: "+8.5%",
      growthType: "up",
      icon: CheckCircle2,
      lightBg: "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/60",
      iconBg: "bg-emerald-600 text-white",
      comparison: "Verified Action",
    },
    {
      id: "pending_exec",
      title: "Pending Execution",
      value: kpiData.pendingExecution,
      suffix: "",
      growth: "-2.1%",
      growthType: "down",
      icon: Clock,
      lightBg: "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60",
      iconBg: "bg-amber-500 text-white",
      comparison: "Approved & In Progress",
    },
    {
      id: "review",
      title: "Under Review",
      value: kpiData.underReview,
      suffix: "",
      growth: "Evaluation",
      growthType: "neutral",
      icon: Search,
      lightBg: "bg-sky-50/90 dark:bg-sky-950/30 border-sky-200/90 dark:border-sky-800/60",
      iconBg: "bg-sky-500 text-white",
      comparison: "Committee Review",
    },
    {
      id: "savings",
      title: "Total Savings",
      currencyValue: kpiData.totalSavings,
      growth: "+32.4%",
      growthType: "up",
      icon: DollarSign,
      lightBg: "bg-teal-50/90 dark:bg-teal-950/30 border-teal-200/90 dark:border-teal-800/60",
      iconBg: "bg-teal-600 text-white",
      comparison: "Verified Impact",
    },
    {
      id: "participation",
      title: "Participation %",
      value: kpiData.participationPct,
      suffix: "%",
      growth: "+6.4%",
      growthType: "up",
      icon: Users,
      lightBg: "bg-purple-50/90 dark:bg-purple-950/30 border-purple-200/90 dark:border-purple-800/60",
      iconBg: "bg-purple-500 text-white",
      comparison: "Active workforce",
    },
    {
      id: "active_emp",
      title: "Active Employees",
      value: kpiData.activeEmployees,
      suffix: "",
      growth: "Contributors",
      growthType: "up",
      icon: UserCheck,
      lightBg: "bg-indigo-50/90 dark:bg-indigo-950/30 border-indigo-200/90 dark:border-indigo-800/60",
      iconBg: "bg-indigo-500 text-white",
      comparison: "Submitted ideas",
    },
    {
      id: "best_dept",
      title: "Best Department",
      textValue: kpiData.bestDept,
      growth: "Top Rank",
      growthType: "up",
      icon: Award,
      lightBg: "bg-orange-50/90 dark:bg-orange-950/30 border-orange-200/90 dark:border-orange-800/60",
      iconBg: "bg-orange-500 text-white",
      comparison: "Top Points",
    },
    {
      id: "speed",
      title: "Avg Impl. Speed",
      value: kpiData.avgTimeDays,
      suffix: " Days",
      growth: "Execution",
      growthType: "down",
      icon: Zap,
      lightBg: "bg-rose-50/90 dark:bg-rose-950/30 border-rose-200/90 dark:border-rose-800/60",
      iconBg: "bg-rose-500 text-white",
      comparison: "Cycle time",
    },
  ];

  const subFilterButtons: Array<{ id: SugTimeSubFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
    { id: "prev_year", label: "Prev" },
  ];

  const handleFilterChange = (key: keyof DashboardFilters, value: string) => {
    if (onApplyFilters) {
      onApplyFilters({
        ...filters,
        [key]: value === "all" ? undefined : value,
      });
    }
  };

  return (
    <div className="sticky top-18 sm:top-20 z-20 bg-background dark:bg-slate-900 pt-2 pb-2.5 -mx-4 px-4 border-b border-border shadow-md transition-all">
      {/* Expandable Filter Bar (toggled exclusively from Main Top Navbar) */}

      {/* Expandable Filter Bar (Appears directly above 9 KPI cards when Navbar Filter button is clicked) */}
      {isFilterBarOpen && (
        <div className="mb-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-primary/20 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/60">
            <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-primary" /> Filter Dashboard Data (Location, Plant, Dept, Category & Status)
            </span>
            {activeFilterCount > 0 && onResetFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-6 px-2 text-[11px] font-bold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear All Filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {/* Location / State Filter */}
            <div>
              <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location / State
              </label>
              <Select value={filters.state || "all"} onValueChange={(val) => handleFilterChange("state", val)}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plant Filter */}
            <div>
              <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Plant Unit
              </label>
              <Select value={filters.plant || "all"} onValueChange={(val) => handleFilterChange("plant", val)}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="All Plants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plants</SelectItem>
                  {uniquePlants.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Department
              </label>
              <Select value={filters.department || "all"} onValueChange={(val) => handleFilterChange("department", val)}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Suggestion Category
              </label>
              <Select value={filters.category || "all"} onValueChange={(val) => handleFilterChange("category", val)}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Status
              </label>
              <Select value={filters.status || "all"} onValueChange={(val) => handleFilterChange("status", val)}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* 9 KPI Cards 1-Row Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 w-full">
        {cards.map((card) => {
          const Icon = card.icon;
          const animVal = useAnimatedCount(typeof card.value === "number" ? card.value : 0);

          return (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-xl p-2 flex flex-col justify-between cursor-pointer border shadow-2xs transition-all hover:shadow-xs hover:scale-[1.02] ${card.lightBg}`}
            >
              {/* Top Row: Title & Icon */}
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight">{card.title}</span>
                <div className={`p-1 rounded-md ${card.iconBg} shadow-2xs shrink-0`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              {/* Card 1 Specific: Internal Period Switcher Pills */}
              {card.isMergedCard && (
                <div className="flex items-center gap-0.5 my-1 bg-white/80 dark:bg-slate-900/80 p-0.5 rounded border border-blue-200/60 dark:border-blue-800/40">
                  {subFilterButtons.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSugFilter(b.id);
                      }}
                      className={`flex-1 py-0.2 text-[8px] font-black rounded transition-all ${
                        sugFilter === b.id
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Middle Row: Animated Main Value */}
              <div className="my-0.5 flex items-baseline justify-between gap-1">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate">
                  {card.textValue ? (
                    card.textValue
                  ) : card.currencyValue !== undefined ? (
                    `₹${(card.currencyValue / 100000).toFixed(1)}L`
                  ) : (
                    `${animVal}${card.suffix || ""}`
                  )}
                </span>
              </div>

              {/* Bottom Row: Growth Badge */}
              <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span
                  className={`inline-flex items-center gap-0.5 font-bold px-1 py-0.2 rounded-full ${
                    card.growthType === "up"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                      : card.growthType === "down"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                      : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {card.growthType === "up" ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : card.growthType === "down" ? (
                    <TrendingDown className="w-2.5 h-2.5" />
                  ) : null}
                  {card.growth}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const KPICardsSection = memo(KPICardsSectionComponent);
