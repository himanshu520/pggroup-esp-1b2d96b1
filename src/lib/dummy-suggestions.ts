export interface EmployeeSuggestion {
  id: string;
  code: string;
  employeeName: string;
  employeeId: string;
  gender: "Male" | "Female" | "Others";
  employeePhoto: string;
  department: string;
  plant: string;
  state: string;
  location: string;
  category: string;
  suggestionTitle: string;
  description: string;
  costType: "No Cost" | "Low Cost" | "High Cost";
  status: "implemented" | "approved" | "pending" | "under_review" | "rejected" | "dropped" | "fake_closure";
  implementationStatus: "Completed" | "In Progress" | "Pending Review" | "On Hold" | "Rejected";
  priority: "High" | "Medium" | "Low";
  suggestionType: string;
  reviewer: string;
  createdDate: string; // YYYY-MM-DD
  completedDate: string | null;
  points: number;
  award: string;
  beforeImage: string;
  afterImage: string;
  remarks: string;
  participationMonth: string; // Jan, Feb, etc.
  year: number;
  expectedSaving?: number;
  actualCost?: number;
  savings: number; // in INR
}

export interface DashboardFilters {
  employeeName?: string;
  department?: string;
  plant?: string;
  state?: string;
  location?: string;
  category?: string;
  status?: string;
  costType?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  month?: string;
  year?: string;
  gender?: string;
  implementationStatus?: string;
  priority?: string;
  suggestionType?: string;
}


export const DUMMY_SUGGESTIONS: EmployeeSuggestion[] = [];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function normalizeStatusCategory(statusStr: string): "Implemented" | "Approved" | "Under Review" | "Pending" | "Rejected" {
  const s = String(statusStr || "").toLowerCase().trim();
  if (s === "implemented" || s === "closed" || s === "completed") {
    return "Implemented";
  }
  if (s === "approved" || s === "implementation" || s === "in progress" || s === "evidence_pending" || s === "evidence_submitted" || s === "pe_verification") {
    return "Approved";
  }
  if (s === "under_review" || s === "pe_review" || s === "dept_review" || s === "evaluation" || s === "submitted") {
    return "Under Review";
  }
  if (s === "rejected" || s === "dropped" || s === "fake_closure") {
    return "Rejected";
  }
  return "Pending";
}

export function getSuggestionPoints(s: any): number {
  if (!s) return 0;
  const status = String(s.status || "").toLowerCase();
  if (status === "implemented" || status === "closed") return 5;
  if (status === "fake_closure" || status === "rejected" || status === "dropped") return -2;
  return 0;
}

/**
 * Maps live database records from Supabase into UI-ready EmployeeSuggestion format.
 * Combines live records with presentation dummy dataset so dashboard charts,
 * plant benchmarks, and cards are completely populated for stakeholder presentations.
 */
export function mapDatabaseSuggestionsToUI(dbSugs: any[]): EmployeeSuggestion[] {
  const mappedLive = Array.isArray(dbSugs)
    ? dbSugs.map((s) => {
        const createdDate = s.created_at ? s.created_at.split("T")[0] : new Date().toISOString().split("T")[0];
        const completedDate = s.completed_at ? s.completed_at.split("T")[0] : null;
        const dateObj = new Date(s.created_at || Date.now());
        const month = MONTH_SHORT[dateObj.getMonth()] || "Jan";
        const year = dateObj.getFullYear();
        const actualCost = Number(s.actual_cost || 0);

        let costType: "No Cost" | "Low Cost" | "High Cost" = "No Cost";
        if (actualCost > 100000) costType = "High Cost";
        else if (actualCost > 0) costType = "Low Cost";

        let implStatus: "Completed" | "In Progress" | "Pending Review" | "On Hold" | "Rejected" = "Pending Review";
        if (s.status === "implemented" || s.status === "closed") implStatus = "Completed";
        else if (s.status === "approved" || s.status === "implementation" || s.status === "evidence_pending" || s.status === "evidence_submitted" || s.status === "pe_verification") implStatus = "In Progress";
        else if (s.status === "rejected") implStatus = "Rejected";
        else if (s.status === "dropped") implStatus = "On Hold";

        const rawPlantName = String(s.plants?.name || s.plant || "").toUpperCase();
        let mappedPlant = s.plants?.name || s.plant || "General Plant";
        if (rawPlantName.includes("NGM")) {
          mappedPlant = "NGM-KAROLI";
        } else if (rawPlantName.includes("PGTL") || rawPlantName.includes("BHIWADI")) {
          mappedPlant = "PGTL-BHIWADI";
        }

        return {
          id: s.id || `sug-${Math.random()}`,
          code: s.code || `SUG-${s.id?.slice(0, 6)}`,
          employeeName: s.employees?.name || "Employee",
          employeeId: s.employees?.employee_code || "EMP",
          gender: (s.employees?.gender as "Male" | "Female" | "Others") || "Male",
          employeePhoto: s.employees?.avatar_url || "",
          department: s.current_departments?.name || s.departments?.name || "General",
          plant: mappedPlant,
          state: s.plants?.locations?.state || s.locations?.state || "Rajasthan",
          location: s.plants?.locations?.location || s.locations?.location || "Bhiwadi",
          category: s.categories?.name || "Kaizen",
          suggestionTitle: s.title || "Suggestion Idea",
          description: s.description || s.title || "",
          costType,
          status: (s.status as any) || "pending",
          implementationStatus: implStatus,
          priority: (s.priority as any) || "Medium",
          suggestionType: s.categories?.name || "Kaizen",
          reviewer: s.reviewer || "—",
          createdDate,
          completedDate,
          points: getSuggestionPoints(s),
          award: s.award || ((s.status === "implemented" || s.status === "closed") ? "Recognition Award" : "None"),
          beforeImage: s.before_image_url || "",
          afterImage: s.after_image_url || "",
          remarks: s.remarks || "",
          participationMonth: month,
          year,
          expectedSaving: Number(s.expected_saving || 0),
          actualCost: Number(s.actual_cost || 0),
          savings: Number(s.actual_cost || s.expected_saving || 0),
        };
      })
    : [];

  // Return purely mapped live database suggestions without demo data
  return mappedLive;
}

/**
 * Filters suggestions based on user selected Filter Drawer criteria.
 */
export function filterSuggestions(data: EmployeeSuggestion[], filters: DashboardFilters): EmployeeSuggestion[] {
  return data.filter((s) => {
    if (filters.employeeName && !s.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase()) && !s.employeeId.toLowerCase().includes(filters.employeeName.toLowerCase())) {
      return false;
    }
    if (filters.department && filters.department !== "all" && s.department !== filters.department) {
      return false;
    }
    if (filters.plant && filters.plant !== "all" && s.plant !== filters.plant) {
      return false;
    }
    if (filters.state && filters.state !== "all" && s.state !== filters.state) {
      return false;
    }
    if (filters.location && filters.location !== "all" && !s.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.category && filters.category !== "all" && s.category !== filters.category) {
      return false;
    }
    if (filters.status && filters.status !== "all" && s.status !== filters.status) {
      return false;
    }
    if (filters.costType && filters.costType !== "all" && s.costType !== filters.costType) {
      return false;
    }
    if (filters.gender && filters.gender !== "all" && s.gender !== filters.gender) {
      return false;
    }
    if (filters.implementationStatus && filters.implementationStatus !== "all" && s.implementationStatus !== filters.implementationStatus) {
      return false;
    }
    if (filters.priority && filters.priority !== "all" && s.priority !== filters.priority) {
      return false;
    }
    if (filters.suggestionType && filters.suggestionType !== "all" && s.suggestionType !== filters.suggestionType) {
      return false;
    }
    if (filters.month && filters.month !== "all" && s.participationMonth !== filters.month) {
      return false;
    }
    if (filters.year && filters.year !== "all" && s.year.toString() !== filters.year) {
      return false;
    }
    if (filters.dateRangeStart && new Date(s.createdDate) < new Date(filters.dateRangeStart)) {
      return false;
    }
    if (filters.dateRangeEnd && new Date(s.createdDate) > new Date(filters.dateRangeEnd)) {
      return false;
    }
    return true;
  });
}
