import { useState, useEffect } from "react";
import { Filter, X, RotateCcw, Check, Calendar, User, Building2, MapPin, Tag, ShieldCheck, DollarSign, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { DashboardFilters } from "@/lib/dummy-suggestions";

interface FilterDrawerProps {
  filters: DashboardFilters;
  onApplyFilters: (filters: DashboardFilters) => void;
  onResetFilters: () => void;
}

const DEPARTMENTS = ["Production", "Quality", "Maintenance", "HR", "IT", "Tool Room", "Press Shop", "Assembly", "Purchase", "Stores"];
const PLANTS = ["Plant 1", "Plant 2", "Plant 3", "Plant 4"];
const STATES = ["Haryana", "Rajasthan", "UP", "Tamil Nadu", "Karnataka"];
const CATEGORIES = ["Safety", "Quality", "Cost Reduction", "Productivity", "5S", "Kaizen", "Fool Proofing"];
const STATUSES = [
  { value: "implemented", label: "Implemented" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "rejected", label: "Rejected" },
  { value: "dropped", label: "Dropped" },
  { value: "fake_closure", label: "Fake Closure" },
];
const COST_TYPES = ["No Cost", "Low Cost", "High Cost"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = ["2024", "2025", "2026"];
const GENDERS = ["Male", "Female", "Others"];
const IMPL_STATUSES = ["Completed", "In Progress", "Pending Review", "On Hold", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];
const SUGGESTION_TYPES = ["Kaizen", "Fool Proofing", "Safety", "Quality", "Productivity", "Cost Reduction", "5S"];

export function FilterDrawer({ filters, onApplyFilters, onResetFilters }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DashboardFilters>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const activeCount = Object.values(filters).filter((v) => v && v !== "all").length;

  const handleApply = () => {
    onApplyFilters(draft);
    setOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: DashboardFilters = {};
    setDraft(emptyFilters);
    onResetFilters();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-9 gap-2 border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm font-medium transition-all"
        >
          <Filter className="w-4 h-4 text-primary" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background border-l border-border shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b border-border bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Enterprise Filter Panel</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">Filter suggestions across 15 criteria</SheetDescription>
              </div>
            </div>
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount} active
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Filter Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. Employee Name / ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Employee Name / ID
            </label>
            <Input
              placeholder="Filter by name or employee code..."
              value={draft.employeeName || ""}
              onChange={(e) => setDraft({ ...draft, employeeName: e.target.value })}
              className="h-9 text-xs"
            />
          </div>

          {/* 2. Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" /> Department
            </label>
            <Select value={draft.department || "all"} onValueChange={(v) => setDraft({ ...draft, department: v })}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Plant & 4. State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" /> Plant
              </label>
              <Select value={draft.plant || "all"} onValueChange={(v) => setDraft({ ...draft, plant: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Plants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plants</SelectItem>
                  {PLANTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> State
              </label>
              <Select value={draft.state || "all"} onValueChange={(v) => setDraft({ ...draft, state: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 5. Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Location / Unit
            </label>
            <Input
              placeholder="Search location..."
              value={draft.location || ""}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="h-9 text-xs"
            />
          </div>

          {/* 6. Category & 7. Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Category
              </label>
              <Select value={draft.category || "all"} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Status
              </label>
              <Select value={draft.status || "all"} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUSES.map((st) => (
                    <SelectItem key={st.value} value={st.value}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 8. Cost Type & 12. Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" /> Cost Type
              </label>
              <Select value={draft.costType || "all"} onValueChange={(v) => setDraft({ ...draft, costType: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Cost Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cost Types</SelectItem>
                  {COST_TYPES.map((ct) => (
                    <SelectItem key={ct} value={ct}>
                      {ct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Gender
              </label>
              <Select value={draft.gender || "all"} onValueChange={(v) => setDraft({ ...draft, gender: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 10. Month & 11. Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Month
              </label>
              <Select value={draft.month || "all"} onValueChange={(v) => setDraft({ ...draft, month: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Year
              </label>
              <Select value={draft.year || "all"} onValueChange={(v) => setDraft({ ...draft, year: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 9. Date Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={draft.dateRangeStart || ""}
                onChange={(e) => setDraft({ ...draft, dateRangeStart: e.target.value })}
                className="h-9 text-xs"
              />
              <Input
                type="date"
                value={draft.dateRangeEnd || ""}
                onChange={(e) => setDraft({ ...draft, dateRangeEnd: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* 13. Implementation Status & 14. Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" /> Impl. Status
              </label>
              <Select value={draft.implementationStatus || "all"} onValueChange={(v) => setDraft({ ...draft, implementationStatus: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Impl. Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impl. Statuses</SelectItem>
                  {IMPL_STATUSES.map((is) => (
                    <SelectItem key={is} value={is}>
                      {is}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Priority
              </label>
              <Select value={draft.priority || "all"} onValueChange={(v) => setDraft({ ...draft, priority: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 15. Suggestion Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Suggestion Type
            </label>
            <Select value={draft.suggestionType || "all"} onValueChange={(v) => setDraft({ ...draft, suggestionType: v })}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Suggestion Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suggestion Types</SelectItem>
                {SUGGESTION_TYPES.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900/50 flex flex-row items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="w-1/2 gap-1.5 text-xs border-slate-300">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button size="sm" onClick={handleApply} className="w-1/2 gap-1.5 text-xs bg-primary text-white hover:bg-primary/90 font-semibold shadow-md">
            <Check className="w-3.5 h-3.5" /> Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
