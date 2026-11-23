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
  QrCode as QrCodeIcon,
  Copy,
  Check,
  ExternalLink,
  Printer,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { normalizeStatusCategory, type EmployeeSuggestion, type DashboardFilters } from "@/lib/dummy-suggestions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG } from "@/components/ui/qr-code";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KpiDetailDialog, type KpiCardId } from "./kpi-detail-dialog";

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
  const [selectedKpiId, setSelectedKpiId] = useState<KpiCardId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute live Employee Portal URL
  const employeePortalUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/employee`;
    }
    return "https://pggroup-esp-1b2d96b1.vercel.app/employee";
  }, []);

  const handleCopyUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(employeePortalUrl);
      setCopied(true);
      toast.success("Employee portal link copied!", {
        description: employeePortalUrl,
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintQr = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print QR Code");
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PG Group — Employee Suggestion Portal QR</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              text-align: center;
              padding: 40px 20px;
              color: #0f172a;
            }
            .card {
              max-width: 450px;
              margin: 0 auto;
              border: 3px solid #0284c7;
              border-radius: 20px;
              padding: 30px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            h1 { font-size: 24px; margin-bottom: 6px; color: #0369a1; }
            h2 { font-size: 16px; margin-top: 0; color: #475569; font-weight: normal; }
            .qr-box { margin: 25px auto; display: inline-block; padding: 15px; border: 2px dashed #94a3b8; border-radius: 12px; }
            .url { font-size: 14px; font-weight: bold; color: #0284c7; word-break: break-all; margin: 15px 0; }
            .instructions { font-size: 13px; color: #64748b; margin-top: 15px; line-height: 1.5; }
            @media print {
              body { padding: 0; }
              .card { box-shadow: none; border-color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>PG Group — ESP</h1>
            <h2>Employee Suggestion Portal / कर्मचारी सुझाव पोर्टल</h2>
            <div class="qr-box">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(employeePortalUrl)}" width="240" height="240" alt="QR Code" />
            </div>
            <p class="url">${employeePortalUrl}</p>
            <p class="instructions">
              <strong>Scan using Phone Camera, WhatsApp, or Google Lens</strong><br/>
              मोबाइल कैमरा से स्कैन करें और तुरंत अपना सुझाव दर्ज करें।
            </p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
      id: "employee_qr",
      title: "Employee Portal QR",
      growth: "Scan & Submit",
      growthType: "neutral",
      icon: QrCodeIcon,
      lightBg: "bg-cyan-50/90 dark:bg-cyan-950/30 border-cyan-200/90 dark:border-cyan-800/60",
      iconBg: "bg-cyan-600 text-white",
      comparison: "Mobile Link",
      isQrCard: true,
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
          const isQrCard = (card as any).isQrCard;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (isQrCard) {
                  setIsQrModalOpen(true);
                  return;
                }
                setSelectedKpiId(card.id as KpiCardId);
                setIsDialogOpen(true);
              }}
              title={isQrCard ? "Click to view full employee portal QR code & share options" : "Click to view detailed popup breakdown"}
              className={`relative overflow-hidden rounded-xl p-2 flex flex-col justify-between cursor-pointer border shadow-2xs transition-all hover:shadow-md hover:scale-[1.03] active:scale-[0.99] group ${card.lightBg}`}
            >
              {/* Top Row: Title & Icon */}
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                  {card.title}
                </span>
                <div className={`p-1 rounded-md ${card.iconBg} shadow-2xs shrink-0 group-hover:scale-110 transition-transform`}>
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

              {/* Middle Row: Animated Main Value or QR Code */}
              {isQrCard ? (
                <div className="my-1 flex items-center justify-between gap-1.5 bg-white/90 dark:bg-slate-900/90 p-1 rounded-md border border-cyan-200/60 dark:border-cyan-800/60">
                  <div className="bg-white p-0.5 rounded shrink-0 shadow-2xs">
                    <QRCodeSVG
                      value={employeePortalUrl}
                      size={32}
                      level="M"
                      fgColor="#0f172a"
                      bgColor="#ffffff"
                      includeMargin={false}
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-extrabold text-cyan-950 dark:text-cyan-200 leading-tight truncate">
                      Mobile Portal
                    </span>
                    <span className="text-[8px] text-cyan-700 dark:text-cyan-400 font-medium truncate">
                      Scan to Submit
                    </span>
                  </div>
                </div>
              ) : (
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
              )}

              {/* Bottom Row: Growth Badge & Detail Indicator */}
              <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span
                  className={`inline-flex items-center gap-0.5 font-bold px-1 py-0.2 rounded-full ${
                    isQrCard
                      ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300"
                      : card.growthType === "up"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                      : card.growthType === "down"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                      : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {isQrCard ? (
                    <QrCodeIcon className="w-2.5 h-2.5" />
                  ) : card.growthType === "up" ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : card.growthType === "down" ? (
                    <TrendingDown className="w-2.5 h-2.5" />
                  ) : null}
                  {card.growth}
                </span>
                <span className="text-[8px] text-muted-foreground opacity-60 group-hover:opacity-100 font-bold">
                  {isQrCard ? "QR &rarr;" : "Details &rarr;"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Interactive Popup Modal Dialog */}
      <KpiDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        kpiId={selectedKpiId}
        suggestions={suggestions}
      />

      {/* Employee Portal QR Code Dialog */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 border border-border shadow-xl rounded-2xl">
          <DialogHeader className="text-center sm:text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 flex items-center justify-center mb-2">
              <QrCodeIcon className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-black text-foreground">
              Employee Suggestion Portal QR
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Scan with any mobile camera, WhatsApp or Google Lens to instantly open the employee suggestion page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-3">
            {/* High-Resolution QR Card */}
            <div className="relative p-4 bg-white rounded-2xl border-2 border-cyan-500/30 shadow-lg flex flex-col items-center">
              <div className="mb-2 text-[11px] font-black tracking-wider text-slate-700 uppercase">
                PG Group • ESP
              </div>
              <QRCodeSVG
                value={employeePortalUrl}
                size={220}
                level="M"
                fgColor="#0f172a"
                bgColor="#ffffff"
                includeMargin={false}
                className="rounded-lg"
              />
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Employee Form
              </div>
            </div>

            {/* Direct URL Box */}
            <div className="w-full mt-4 p-2 bg-muted/60 dark:bg-slate-800/60 rounded-lg border border-border/80 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-muted-foreground truncate select-all px-1">
                {employeePortalUrl}
              </span>
              <Button
                size="sm"
                variant={copied ? "default" : "outline"}
                onClick={handleCopyUrl}
                className="h-7 px-2.5 text-xs font-bold shrink-0 gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* Hindi Instruction */}
            <p className="mt-3 text-[11px] text-center text-muted-foreground font-medium">
              कर्मचारी अपने फोन के कैमरे से स्कैन करके बिना किसी ऐप के सीधा सुझाव सबमिट कर सकते हैं।
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <Button
              variant="outline"
              onClick={handlePrintQr}
              className="flex-1 h-9 text-xs font-bold gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print QR Poster
            </Button>
            <Button
              asChild
              className="flex-1 h-9 text-xs font-bold gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <a href={employeePortalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Open Portal
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const KPICardsSection = memo(KPICardsSectionComponent);
