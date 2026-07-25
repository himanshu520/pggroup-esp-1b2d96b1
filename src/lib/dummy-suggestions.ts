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

// Enterprise Demo Suggestions Seed for PGTL & NGM Plants
export const DUMMY_SUGGESTIONS: EmployeeSuggestion[] = [
  {
    id: "sug-demo-1",
    code: "SUG-PGTL-2026-001",
    employeeName: "Rajesh Kumar",
    employeeId: "EMP-PGTL-101",
    gender: "Male",
    employeePhoto: "",
    department: "Production",
    plant: "PGTL",
    state: "Haryana",
    location: "Bawal Unit",
    category: "Kaizen",
    suggestionTitle: "Automated Assembly Conveyor Sensor",
    description: "Install auto-stop photoelectric sensors on Assembly Line 1 to reduce product rejection by 15%.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Kaizen",
    reviewer: "Amit Sharma (Plant Head)",
    createdDate: "2026-02-14",
    completedDate: "2026-02-28",
    points: 450,
    award: "Best Kaizen Award",
    beforeImage: "",
    afterImage: "",
    remarks: "Successfully implemented on Line 1.",
    participationMonth: "Feb",
    year: 2026,
    savings: 125000,
  },
  {
    id: "sug-demo-2",
    code: "SUG-NGM-2026-002",
    employeeName: "Priya Sharma",
    employeeId: "EMP-NGM-204",
    gender: "Female",
    employeePhoto: "",
    department: "Quality Control",
    plant: "NGM",
    state: "Delhi NCR",
    location: "Manesar Hub",
    category: "5S",
    suggestionTitle: "Color-Coded Tool Fixture Racks",
    description: "Implement 5S visual management tool shadow boards in QC testing lab.",
    costType: "No Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "5S",
    reviewer: "Vikram Singh (QC Manager)",
    createdDate: "2026-03-05",
    completedDate: "2026-03-12",
    points: 380,
    award: "5S Champion",
    beforeImage: "",
    afterImage: "",
    remarks: "Inspected and certified by 5S audit team.",
    participationMonth: "Mar",
    year: 2026,
    savings: 45000,
  },
  {
    id: "sug-demo-3",
    code: "SUG-PGTL-2026-003",
    employeeName: "Suresh Verma",
    employeeId: "EMP-PGTL-188",
    gender: "Male",
    employeePhoto: "",
    department: "Maintenance",
    plant: "PGTL",
    state: "Haryana",
    location: "Bawal Unit",
    category: "Safety",
    suggestionTitle: "Interlocked Safety Guard for Stamping Press",
    description: "Add dual-hand pneumatic interlock valves on heavy stamping presses to protect operators.",
    costType: "Low Cost",
    status: "approved",
    implementationStatus: "In Progress",
    priority: "High",
    suggestionType: "Safety",
    reviewer: "Sunil Verma (Safety Officer)",
    createdDate: "2026-03-18",
    completedDate: null,
    points: 300,
    award: "Safety Star",
    beforeImage: "",
    afterImage: "",
    remarks: "Procurement of safety valves in progress.",
    participationMonth: "Mar",
    year: 2026,
    savings: 200000,
  },
  {
    id: "sug-demo-4",
    code: "SUG-NGM-2026-004",
    employeeName: "Anjali Gupta",
    employeeId: "EMP-NGM-312",
    gender: "Female",
    employeePhoto: "",
    department: "HR & Admin",
    plant: "NGM",
    state: "Delhi NCR",
    location: "Manesar Hub",
    category: "Cost Savings",
    suggestionTitle: "Digital Canteen Token System",
    description: "Replace paper canteen coupons with RFID badge scanning to eliminate paper waste.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "Cost Savings",
    reviewer: "Deepak Mehta (HR Head)",
    createdDate: "2026-04-02",
    completedDate: "2026-04-15",
    points: 400,
    award: "Green Workplace Award",
    beforeImage: "",
    afterImage: "",
    remarks: "Live on canteen counters.",
    participationMonth: "Apr",
    year: 2026,
    savings: 85000,
  },
  {
    id: "sug-demo-5",
    code: "SUG-PGTL-2026-005",
    employeeName: "Manish Yadav",
    employeeId: "EMP-PGTL-142",
    gender: "Male",
    employeePhoto: "",
    department: "Production",
    plant: "PGTL",
    state: "Haryana",
    location: "Bawal Unit",
    category: "Kaizen",
    suggestionTitle: "Air Leakage Audit & Fitting Tightening",
    description: "Conduct bi-weekly pneumatic line leakage audits to conserve compressed air electricity.",
    costType: "No Cost",
    status: "pending",
    implementationStatus: "Pending Review",
    priority: "High",
    suggestionType: "Kaizen",
    reviewer: "Committee Review",
    createdDate: "2026-05-10",
    completedDate: null,
    points: 100,
    award: "None",
    beforeImage: "",
    afterImage: "",
    remarks: "Submitted to Plant Energy Committee.",
    participationMonth: "May",
    year: 2026,
    savings: 180000,
  },
  {
    id: "sug-demo-6",
    code: "SUG-NGM-2026-006",
    employeeName: "Kavita Rathi",
    employeeId: "EMP-NGM-225",
    gender: "Female",
    employeePhoto: "",
    department: "EHS & Safety",
    plant: "NGM",
    state: "Delhi NCR",
    location: "Manesar Hub",
    category: "Safety",
    suggestionTitle: "Anti-Skid Flooring in Chemical Wash Area",
    description: "Apply epoxy anti-skid coating on shop floor wash bays to prevent slip injuries.",
    costType: "Low Cost",
    status: "under_review",
    implementationStatus: "In Progress",
    priority: "High",
    suggestionType: "Safety",
    reviewer: "EHS Committee",
    createdDate: "2026-05-22",
    completedDate: null,
    points: 150,
    award: "None",
    beforeImage: "",
    afterImage: "",
    remarks: "Vendor quote received.",
    participationMonth: "May",
    year: 2026,
    savings: 60000,
  },
  {
    id: "sug-demo-7",
    code: "SUG-PGTL-2026-007",
    employeeName: "Vikas Saini",
    employeeId: "EMP-PGTL-210",
    gender: "Male",
    employeePhoto: "",
    department: "Logistics",
    plant: "PGTL",
    state: "Haryana",
    location: "Bawal Unit",
    category: "Cost Savings",
    suggestionTitle: "Reusable Returnable Pallet Packing",
    description: "Transition vendor parts packaging from disposable corrugated boxes to heavy-duty plastic totes.",
    costType: "High Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Cost Savings",
    reviewer: "Rakesh Malik (Logistics Head)",
    createdDate: "2026-06-04",
    completedDate: "2026-06-25",
    points: 500,
    award: "Excellence Award",
    beforeImage: "",
    afterImage: "",
    remarks: "Implemented across top 5 tier-1 suppliers.",
    participationMonth: "Jun",
    year: 2026,
    savings: 450000,
  },
  {
    id: "sug-demo-8",
    code: "SUG-NGM-2026-008",
    employeeName: "Sunita Devi",
    employeeId: "EMP-NGM-195",
    gender: "Female",
    employeePhoto: "",
    department: "Production",
    plant: "NGM",
    state: "Delhi NCR",
    location: "Manesar Hub",
    category: "Kaizen",
    suggestionTitle: "Poka-Yoke Jig for Connector Terminal Wiring",
    description: "Design error-proofing guide pins on wiring harnesses to prevent backward pin insertions.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "Kaizen",
    reviewer: "Neeraj Rawat (Production Lead)",
    createdDate: "2026-06-18",
    completedDate: "2026-06-29",
    points: 420,
    award: "Quality Innovator",
    beforeImage: "",
    afterImage: "",
    remarks: "Zero defect reported on Line 2 last month.",
    participationMonth: "Jun",
    year: 2026,
    savings: 110000,
  },
];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Maps live database records from Supabase into UI-ready EmployeeSuggestion format.
 * Automatically falls back / merges rich demo seed data if database entries are low.
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
          department: s.current_departments?.name || s.departments?.name || "Production",
          plant: s.plants?.name || "PGTL",
          state: s.plants?.locations?.state || s.locations?.state || "Haryana",
          location: s.plants?.locations?.location || s.locations?.location || "Bawal Unit",
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
      })
    : [];

  // Merge demo data if live database records are sparse (< 5 records) to render full dashboard cards & charts
  if (mappedLive.length < 5) {
    return [...mappedLive, ...DUMMY_SUGGESTIONS];
  }

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
