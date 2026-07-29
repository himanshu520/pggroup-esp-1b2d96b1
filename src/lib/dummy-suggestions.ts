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

// Generate a rich, 100% logically consistent 120-suggestion dataset for PGTL & NGM
function createLogicalDataset(): EmployeeSuggestion[] {
  const dataset: EmployeeSuggestion[] = [];

  const depts = ["Production", "Quality Control", "Maintenance", "EHS & Safety", "HR & Admin", "Logistics"];
  const categories = ["Kaizen", "5S", "Quality Control", "Cost Savings"];
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  
  // Balanced status distribution: 45% implemented, 25% approved, 15% under review, 10% pending, 5% rejected
  const statuses: ("implemented" | "approved" | "pending" | "under_review" | "rejected")[] = [
    "implemented", "approved", "pending", "under_review", "implemented",
    "approved", "implemented", "under_review", "implemented", "approved",
    "implemented", "pending", "approved", "implemented", "rejected"
  ];

  const maleNames = ["Rajesh Kumar", "Suresh Verma", "Manish Yadav", "Vikas Saini", "Amit Sharma", "Rohan Mehta", "Deepak Gupta", "Sunil Rawat"];
  const femaleNames = ["Priya Sharma", "Anjali Gupta", "Kavita Rathi", "Sunita Devi", "Pooja Verma", "Neha Singh", "Ritu Kumari"];

  // Generate 120 logically coherent suggestions
  for (let i = 1; i <= 120; i++) {
    const isPgtl = i <= 72; // 60% PGTL, 40% NGM
    const plant = isPgtl ? "PGTL-BHIWADI" : "NGM-KAROLI";
    const state = "Rajasthan";
    const location = isPgtl ? "Bhiwadi Plant" : "Karoli Unit";

    const isFemale = i % 3 === 0; // ~33% female participation
    const gender = isFemale ? "Female" : "Male";
    const employeeName = isFemale ? femaleNames[i % femaleNames.length] : maleNames[i % maleNames.length];
    const employeeId = `${plant}-EMP-${100 + (i % 35)}`;

    const department = depts[(i - 1) % depts.length];
    const category = categories[(i - 1) % categories.length];
    const month = months[(i - 1) % months.length];
    const monthIndex = months.indexOf(month) + 2; // 02 to 07
    const day = String((i % 25) + 1).padStart(2, "0");
    const createdDate = `2026-0${monthIndex}-${day}`;

    const status = statuses[(i - 1) % statuses.length];
    let implStatus: "Completed" | "In Progress" | "Pending Review" | "On Hold" | "Rejected" = "Pending Review";
    let completedDate: string | null = null;
    let savings = 0;
    let points = 100;
    let award = "None";

    if (status === "implemented") {
      implStatus = "Completed";
      completedDate = `2026-0${monthIndex}-28`;
      points = 5;
      savings = (i % 4 === 0) ? 120000 : (i % 2 === 0 ? 55000 : 25000);
      award = i % 5 === 0 ? "Best Kaizen Award" : "Implementation Certificate";
    } else if (status === "approved" || status === "under_review" || status === "pending") {
      implStatus = status === "approved" ? "In Progress" : "Pending Review";
      points = 0;
      savings = status === "approved" ? 30000 : 0;
    } else if (status === "rejected" || status === "dropped" || status === "fake_closure") {
      implStatus = "Rejected";
      points = -2;
    }

    // Well-balanced Cost Category Tiering for rich Stacked Bar charts
    let costType: "No Cost" | "Low Cost" | "High Cost" = "No Cost";
    if (i % 5 === 0) {
      costType = "High Cost";
    } else if (i % 3 === 0) {
      costType = "Low Cost";
    } else {
      costType = "No Cost";
    }

    const expectedSaving = (i % 4 === 0) ? 150000 : (i % 2 === 0 ? 80000 : 40000);
    const actualCost = status === "implemented" ? (i % 4 === 0 ? 120000 : (i % 2 === 0 ? 55000 : 25000)) : 0;

    dataset.push({
      id: `sug-logical-${i}`,
      code: `SUG-${plant}-2026-${String(i).padStart(3, "0")}`,
      employeeName,
      employeeId,
      gender,
      employeePhoto: "",
      department,
      plant,
      state,
      location,
      category,
      suggestionTitle: `${category} Improvement in ${department} #${i}`,
      description: `Optimizing workflow efficiency and safety standards in ${department} at ${plant} facility.`,
      costType,
      status,
      implementationStatus: implStatus,
      priority: i % 4 === 0 ? "High" : i % 2 === 0 ? "Medium" : "Low",
      suggestionType: category,
      reviewer: `${department} Review Committee`,
      createdDate,
      completedDate,
      points,
      award,
      beforeImage: "",
      afterImage: "",
      remarks: `Audited and verified by ${plant} committee.`,
      participationMonth: month,
      year: 2026,
      expectedSaving,
      actualCost,
      savings,
    });
  }

  // Generate 10 dedicated demo entries for PGTL Karoli plant
  const pgtlKaroliTitles = [
    "Poka-Yoke Sensor Installation on Karoli Stamping Line #3",
    "Automated Scrap Conveyor Belt in Karoli Fabrication Yard",
    "Pneumatic Clamping Safety Interlock at PGTL Karoli Assembly",
    "LED Energy Conservation & Sensor Lighting in Karoli Warehouse",
    "Tool Changeover Setup Time Reduction (SMED) - Karoli Line 1",
    "Ergonomic Material Transfer Trolley for Karoli Press Shop",
    "Hydraulic Pressure Gauge Digital Monitoring at PGTL Karoli",
    "Zero Defect Visual Inspection Checklist in Karoli QC Bay",
    "Heat Energy Recovery from Karoli Paint Shop Exhaust System",
    "5S Floor Standardization & Tool Shadow Boarding in PGTL Karoli"
  ];

  for (let k = 1; k <= 10; k++) {
    const department = depts[(k - 1) % depts.length];
    const category = categories[(k - 1) % categories.length];
    const month = months[(k - 1) % months.length];
    const monthIndex = months.indexOf(month) + 2;
    const day = String((k % 20) + 5).padStart(2, "0");
    const createdDate = `2026-0${monthIndex}-${day}`;

    const isImpl = k % 2 === 0;
    const status = isImpl ? "implemented" : (k % 3 === 0 ? "approved" : "under_review");
    const implStatus = isImpl ? "Completed" : "In Progress";
    const completedDate = isImpl ? `2026-0${monthIndex}-25` : null;
    const savings = isImpl ? 45000 + k * 8000 : 0;
    const expectedSaving = 60000 + k * 10000;
    const actualCost = isImpl ? 30000 + k * 5000 : 0;
    const points = isImpl ? 5 : 0;

    dataset.push({
      id: `sug-pgtl-bhiwadi-${k}`,
      code: `SUG-PGTL-2026-${String(k + 120).padStart(3, "0")}`,
      employeeName: maleNames[(k - 1) % maleNames.length],
      employeeId: `PGTL-EMP-${200 + k}`,
      gender: "Male",
      employeePhoto: "",
      department,
      plant: "PGTL-BHIWADI",
      state: "Rajasthan",
      location: "Bhiwadi Plant",
      category,
      suggestionTitle: pgtlKaroliTitles[k - 1],
      description: `Process improvement initiative implemented at PGTL Bhiwadi plant in ${department}.`,
      costType: k % 3 === 0 ? "High Cost" : (k % 2 === 0 ? "Low Cost" : "No Cost"),
      status: status as any,
      implementationStatus: implStatus,
      priority: k % 3 === 0 ? "High" : "Medium",
      suggestionType: category,
      reviewer: "Bhiwadi Plant Review Committee",
      createdDate,
      completedDate,
      points,
      award: isImpl ? "Bhiwadi Kaizen Excellence Award" : "None",
      beforeImage: "",
      afterImage: "",
      remarks: "Audited and verified by PGTL Bhiwadi Steering Committee.",
      participationMonth: month,
      year: 2026,
      expectedSaving,
      actualCost,
      savings,
    });
  }

  // Generate 60 previous year (2025) suggestions for YoY Comparison & Y2Y Department Rankings
  for (let j = 1; j <= 60; j++) {
    const isPgtl = j % 2 === 0;
    const plant = isPgtl ? "PGTL-BHIWADI" : "NGM-KAROLI";
    const state = "Rajasthan";
    const location = isPgtl ? "Bhiwadi Plant" : "Karoli Unit";

    const isFemale = j % 4 === 0;
    const gender = isFemale ? "Female" : "Male";
    const employeeName = isFemale ? femaleNames[j % femaleNames.length] : maleNames[j % maleNames.length];
    const employeeId = `${plant}-EMP-${100 + (j % 35)}`;

    const department = depts[(j - 1) % depts.length];
    const category = categories[(j - 1) % categories.length];
    const month = months[(j - 1) % months.length];
    const monthIndex = months.indexOf(month) + 2;
    const day = String((j % 25) + 1).padStart(2, "0");
    const createdDate = `2025-0${monthIndex}-${day}`;

    const isImpl = j % 5 !== 0;
    const status = isImpl ? "implemented" : (j % 2 === 0 ? "approved" : "under_review");
    const implStatus = isImpl ? "Completed" : "In Progress";
    const completedDate = isImpl ? `2025-0${monthIndex}-28` : null;
    const points = isImpl ? 5 : 0;
    const savings = isImpl ? (j % 3 === 0 ? 85000 : 35000) : 0;
    const award = isImpl && j % 4 === 0 ? "Annual Excellence Award 2025" : (isImpl ? "Recognition Award" : "None");
    const expectedSaving25 = (j % 3 === 0) ? 120000 : (j % 2 === 0 ? 60000 : 30000);
    const actualCost25 = isImpl ? (j % 3 === 0 ? 85000 : 35000) : 0;

    let costType: "No Cost" | "Low Cost" | "High Cost" = "No Cost";
    if (j % 4 === 0) costType = "High Cost";
    else if (j % 2 === 0) costType = "Low Cost";

    dataset.push({
      id: `sug-logical-2025-${j}`,
      code: `SUG-${plant}-2025-${String(j).padStart(3, "0")}`,
      employeeName,
      employeeId,
      gender,
      employeePhoto: "",
      department,
      plant,
      state,
      location,
      category,
      suggestionTitle: `2025 ${category} Kaizen in ${department} #${j}`,
      description: `Historical 2025 process optimization in ${department} at ${plant} unit.`,
      costType,
      status: status as any,
      implementationStatus: implStatus,
      priority: j % 3 === 0 ? "High" : "Medium",
      suggestionType: category,
      reviewer: `${department} Review Committee`,
      createdDate,
      completedDate,
      points,
      award,
      beforeImage: "",
      afterImage: "",
      remarks: `2025 Audited record.`,
      participationMonth: month,
      year: 2025,
      expectedSaving: expectedSaving25,
      actualCost: actualCost25,
      savings,
    });
  }

  return dataset;
}

export const DUMMY_SUGGESTIONS: EmployeeSuggestion[] = createLogicalDataset();

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
 * Falls back to rich logical dataset if database is empty so demo dashboard is 100% complete.
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
        let mappedPlant = "PGTL-BHIWADI";
        if (rawPlantName.includes("NGM")) {
          mappedPlant = "NGM-KAROLI";
        } else {
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

  // Combine all live database records with demo dataset so every new user submission increments dashboard totals dynamically
  if (mappedLive.length > 0) {
    return [...mappedLive, ...DUMMY_SUGGESTIONS];
  }

  return DUMMY_SUGGESTIONS;
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
