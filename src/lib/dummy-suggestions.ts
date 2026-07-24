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

// Demo data removed - initialized to empty array
export const DUMMY_SUGGESTIONS: EmployeeSuggestion[] = [];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Maps live database records from Supabase into UI-ready EmployeeSuggestion format.
 */
export function mapDatabaseSuggestionsToUI(dbSugs: any[]): EmployeeSuggestion[] {
  if (!Array.isArray(dbSugs)) return [];

  return dbSugs.map((s) => {
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
    else if (s.status === "approved" || s.status === "implementation") implStatus = "In Progress";
    else if (s.status === "rejected") implStatus = "Rejected";
    else if (s.status === "dropped") implStatus = "On Hold";

    return {
      id: s.id || `sug-${Math.random()}`,
      code: s.code || `SUG-${s.id?.slice(0, 6)}`,
      employeeName: s.employees?.name || "Employee",
      employeeId: s.employees?.employee_code || "EMP",
      gender: (s.employees?.gender as "Male" | "Female" | "Others") || "Male",
      employeePhoto: s.employees?.avatar_url || "",
      department: s.current_departments?.name || s.departments?.name || "General",
      plant: s.plants?.name || "Plant 1",
      state: s.plants?.locations?.state || s.locations?.state || "Haryana",
      location: s.plants?.locations?.location || s.locations?.location || "Main Hub",
      category: s.categories?.name || "Kaizen",
      suggestionTitle: s.title || "Improvement Idea",
      description: s.description || s.title || "",
      costType,
      status: (s.status as any) || "pending",
      implementationStatus: implStatus,
      priority: (s.priority as any) || "Medium",
      suggestionType: s.categories?.name || "Kaizen",
      reviewer: s.reviewer || "Committee Member",
      createdDate,
      completedDate,
      points: s.status === "implemented" ? 450 : 100,
      award: s.award || (s.status === "implemented" ? "Recognition Award" : "None"),
      beforeImage: s.before_image_url || "",
      afterImage: s.after_image_url || "",
      remarks: s.remarks || "",
      participationMonth: month,
      year,
      savings: Number(s.expected_saving || s.actual_cost || 0),
    };
  });
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
