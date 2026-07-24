export interface EmployeeSuggestion {
  id: string;
  code: string;
  employeeName: string;
  employeeId: string;
  gender: "Male" | "Female" | "Others";
  employeePhoto: string;
  department: "Production" | "Quality" | "Maintenance" | "HR" | "IT" | "Tool Room" | "Press Shop" | "Assembly" | "Purchase" | "Stores";
  plant: "Plant 1" | "Plant 2" | "Plant 3" | "Plant 4";
  state: "Haryana" | "Rajasthan" | "UP" | "Tamil Nadu" | "Karnataka";
  location: string;
  category: "Safety" | "Quality" | "Cost Reduction" | "Productivity" | "5S" | "Kaizen" | "Fool Proofing";
  suggestionTitle: string;
  description: string;
  costType: "No Cost" | "Low Cost" | "High Cost";
  status: "implemented" | "approved" | "pending" | "under_review" | "rejected" | "dropped" | "fake_closure";
  implementationStatus: "Completed" | "In Progress" | "Pending Review" | "On Hold" | "Rejected";
  priority: "High" | "Medium" | "Low";
  suggestionType: "Kaizen" | "Fool Proofing" | "Safety" | "Quality" | "Productivity" | "Cost Reduction" | "5S";
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

export const DUMMY_SUGGESTIONS: EmployeeSuggestion[] = [
  {
    id: "sug-001",
    code: "SUG-2026-001",
    employeeName: "Rajesh Kumar Sharma",
    employeeId: "EMP-1001",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    department: "Production",
    plant: "Plant 1",
    state: "Haryana",
    location: "Gurugram Hub",
    category: "Fool Proofing",
    suggestionTitle: "Poka-Yoke Sensor Installation on Assembly Conveyor Line 3",
    description: "Installed dual proximity sensors to detect wrong orientation of metal housings before riveting, stopping defect flow immediately.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Fool Proofing",
    reviewer: "Amitabh Verma (DGM Quality)",
    createdDate: "2026-01-10",
    completedDate: "2026-01-22",
    points: 450,
    award: "MD Unique Gold Excellence Award",
    beforeImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    remarks: "Defect rate dropped to 0 ppm. Zero mis-aligned parts in Q1 2026.",
    participationMonth: "Jan",
    year: 2026,
    savings: 320000,
  },
  {
    id: "sug-002",
    code: "SUG-2026-002",
    employeeName: "Priya Sundaram",
    employeeId: "EMP-1042",
    gender: "Female",
    employeePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Quality",
    plant: "Plant 2",
    state: "Tamil Nadu",
    location: "Chennai Unit",
    category: "Cost Reduction",
    suggestionTitle: "Reusable Ergonomic Tray Design for Micro-Component Testing",
    description: "Replaced disposable plastic blister packs with custom molded ESD anti-static silicone trays that last over 10,000 cycles.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Kaizen",
    reviewer: "Srinivasan Iyer (Head Ops)",
    createdDate: "2026-02-05",
    completedDate: "2026-02-18",
    points: 520,
    award: "Innovator of the Month",
    beforeImage: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    remarks: "Saved over 450 kg of single-use plastic waste and reduced procurement costs.",
    participationMonth: "Feb",
    year: 2026,
    savings: 480000,
  },
  {
    id: "sug-003",
    code: "SUG-2026-003",
    employeeName: "Vikram Rathore",
    employeeId: "EMP-1089",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    department: "Maintenance",
    plant: "Plant 3",
    state: "Rajasthan",
    location: "Bhiwadi Plant",
    category: "Productivity",
    suggestionTitle: "Vibration Sensor IoT Warning Alert for Hydraulic Pump Bearings",
    description: "Mounted ESP-32 vibration telemetry sensors on main press pumps to detect early bearing fatigue before catastrophic failure.",
    costType: "High Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Kaizen",
    reviewer: "Manoj Joshi (Plant Head)",
    createdDate: "2026-03-01",
    completedDate: "2026-03-25",
    points: 600,
    award: "Best Kaizen Trophy & Cash Bonus",
    beforeImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80",
    remarks: "Prevented an estimated 36 hours of unplanned factory downtime in March alone.",
    participationMonth: "Mar",
    year: 2026,
    savings: 1250000,
  },
  {
    id: "sug-004",
    code: "SUG-2026-004",
    employeeName: "Ananya Deshmukh",
    employeeId: "EMP-1120",
    gender: "Female",
    employeePhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    department: "HR",
    plant: "Plant 1",
    state: "Haryana",
    location: "Manesar Division",
    category: "Safety",
    suggestionTitle: "Digital QR Code Based Safety Induction & Equipment Quiz",
    description: "Automated contractor safety onboarding via mobile QR scan, testing mandatory PPE compliance before gate pass activation.",
    costType: "No Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "Safety",
    reviewer: "Ritu Kapoor (VP HR)",
    createdDate: "2026-03-12",
    completedDate: "2026-03-20",
    points: 380,
    award: "Zero Harm Safety Shield",
    beforeImage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    remarks: "100% compliance record achieved across all 400+ seasonal contractors.",
    participationMonth: "Mar",
    year: 2026,
    savings: 180000,
  },
  {
    id: "sug-005",
    code: "SUG-2026-005",
    employeeName: "Karthik Gowda",
    employeeId: "EMP-1195",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    department: "Tool Room",
    plant: "Plant 4",
    state: "Karnataka",
    location: "Bengaluru Plant",
    category: "Fool Proofing",
    suggestionTitle: "Mechanical Guide Pin Interlock for Stamping Die Alignment",
    description: "Added stepped pilot pins to stamping dies preventing die closure if raw sheet width fluctuates beyond tolerance.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Fool Proofing",
    reviewer: "Siddharth Rao (Tooling Expert)",
    createdDate: "2026-04-02",
    completedDate: "2026-04-14",
    points: 550,
    award: "Best Fool Proofing of the Month",
    beforeImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    remarks: "Completely eliminated die shearing defects and expensive die repairs.",
    participationMonth: "Apr",
    year: 2026,
    savings: 950000,
  },
  {
    id: "sug-006",
    code: "SUG-2026-006",
    employeeName: "Sunil Dutt Pandey",
    employeeId: "EMP-1210",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    department: "Press Shop",
    plant: "Plant 3",
    state: "UP",
    location: "Noida Industrial Area",
    category: "5S",
    suggestionTitle: "Shadow Board & Color-Coded Quick-Change Clamp System",
    description: "Reorganized press die changeover tools with visual color coding matching specific press machines.",
    costType: "No Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "5S",
    reviewer: "Deepak Yadav (Production Mgr)",
    createdDate: "2026-04-18",
    completedDate: "2026-04-26",
    points: 310,
    award: "5S Champion Ribbon",
    beforeImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    remarks: "Die changeover time reduced from 42 mins to 19 mins (54% improvement).",
    participationMonth: "Apr",
    year: 2026,
    savings: 340000,
  },
  {
    id: "sug-007",
    code: "SUG-2026-007",
    employeeName: "Meenakshi Sundaram",
    employeeId: "EMP-1280",
    gender: "Female",
    employeePhoto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    department: "Assembly",
    plant: "Plant 2",
    state: "Tamil Nadu",
    location: "Sriperumbudur Complex",
    category: "Quality",
    suggestionTitle: "Automated Optical Defect Scanner for Surface Scratch Detection",
    description: "Positioned high-resolution camera with AI vision module at final packing stage to automatically flag surface scratches.",
    costType: "High Cost",
    status: "approved",
    implementationStatus: "In Progress",
    priority: "High",
    suggestionType: "Quality",
    reviewer: "Venkatesh Raman (QA Director)",
    createdDate: "2026-05-04",
    completedDate: null,
    points: 400,
    award: "Quality Star Nomination",
    beforeImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    remarks: "Trial run completed with 99.8% detection accuracy. Procurement in progress.",
    participationMonth: "May",
    year: 2026,
    savings: 820000,
  },
  {
    id: "sug-008",
    code: "SUG-2026-008",
    employeeName: "Harpreet Singh",
    employeeId: "EMP-1315",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    department: "IT",
    plant: "Plant 1",
    state: "Haryana",
    location: "Gurugram Hub",
    category: "Productivity",
    suggestionTitle: "Automated Dispatch Gate Pass & E-Way Bill Integration",
    description: "Connected ERP dispatch order system directly with Government E-Way bill API, reducing truck wait times at exit gates.",
    costType: "No Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Productivity",
    reviewer: "Nitin Saxena (CIO)",
    createdDate: "2026-05-15",
    completedDate: "2026-05-24",
    points: 480,
    award: "Digital Transformation Star",
    beforeImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1586528116493-a029325540fa?w=600&auto=format&fit=crop&q=80",
    remarks: "Gate turn-around time dropped from 28 minutes to 4 minutes per vehicle.",
    participationMonth: "May",
    year: 2026,
    savings: 650000,
  },
  {
    id: "sug-009",
    code: "SUG-2026-009",
    employeeName: "Pooja Reddy",
    employeeId: "EMP-1342",
    gender: "Female",
    employeePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Purchase",
    plant: "Plant 4",
    state: "Karnataka",
    location: "Bengaluru Plant",
    category: "Cost Reduction",
    suggestionTitle: "Consolidated Bulk Freight Tender for Corrugated Packaging Boxes",
    description: "Standardized carton dimensions across all 4 plants and combined annual paper box purchasing contracts.",
    costType: "No Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "High",
    suggestionType: "Cost Reduction",
    reviewer: "Gaurav Malhotra (Head SCM)",
    createdDate: "2026-06-01",
    completedDate: "2026-06-16",
    points: 590,
    award: "King of Suggestion Candidate",
    beforeImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1586528116493-a029325540fa?w=600&auto=format&fit=crop&q=80",
    remarks: "Achieved an 11.4% price reduction across 1.2 million packaging units annually.",
    participationMonth: "Jun",
    year: 2026,
    savings: 2100000,
  },
  {
    id: "sug-010",
    code: "SUG-2026-010",
    employeeName: "Manish Agarwal",
    employeeId: "EMP-1390",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    department: "Stores",
    plant: "Plant 3",
    state: "UP",
    location: "Noida Industrial Area",
    category: "5S",
    suggestionTitle: "Vertical Bin Shelving & Barcode Location Tagging for Raw Stock",
    description: "Transformed flat floor storage into 4-tier rack system with barcode tags linked to WMS for instant retrieval.",
    costType: "Low Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "5S",
    reviewer: "Rajeshwar Sen (Logistics Lead)",
    createdDate: "2026-06-10",
    completedDate: "2026-06-28",
    points: 360,
    award: "Warehouse Excellence Badge",
    beforeImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1586528116493-a029325540fa?w=600&auto=format&fit=crop&q=80",
    remarks: "Freed up 380 sq. meters of floor space for new assembly line expansion.",
    participationMonth: "Jun",
    year: 2026,
    savings: 420000,
  },
  {
    id: "sug-011",
    code: "SUG-2026-011",
    employeeName: "Rohan Verma",
    employeeId: "EMP-1410",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    department: "Maintenance",
    plant: "Plant 1",
    state: "Haryana",
    location: "Gurugram Hub",
    category: "Safety",
    suggestionTitle: "Pneumatic Safety Interlock Gate for High Voltage Test Chamber",
    description: "Mechanically locked HV enclosure access door while transformer testing transformers are energized.",
    costType: "Low Cost",
    status: "under_review",
    implementationStatus: "Pending Review",
    priority: "High",
    suggestionType: "Safety",
    reviewer: "Suresh Gupta (Safety Head)",
    createdDate: "2026-07-02",
    completedDate: null,
    points: 210,
    award: "Safety Commendation",
    beforeImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80",
    remarks: "Under engineering validation by EHS Committee.",
    participationMonth: "Jul",
    year: 2026,
    savings: 150000,
  },
  {
    id: "sug-012",
    code: "SUG-2026-012",
    employeeName: "Kavita Pillai",
    employeeId: "EMP-1445",
    gender: "Female",
    employeePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    department: "Quality",
    plant: "Plant 2",
    state: "Tamil Nadu",
    location: "Chennai Unit",
    category: "Quality",
    suggestionTitle: "Ultrasonic Cleaning Bath Cycle Timer Calibration",
    description: "Standardized bath temperature and cycle timers for degreasing machined parts to prevent oxidation spot marks.",
    costType: "No Cost",
    status: "implemented",
    implementationStatus: "Completed",
    priority: "Medium",
    suggestionType: "Quality",
    reviewer: "T. Rajan (Quality Mgr)",
    createdDate: "2026-07-08",
    completedDate: "2026-07-16",
    points: 410,
    award: "Zero Scrap Award",
    beforeImage: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    remarks: "Rejection due to surface oxidation reduced to zero.",
    participationMonth: "Jul",
    year: 2026,
    savings: 290000,
  },
  {
    id: "sug-013",
    code: "SUG-2026-013",
    employeeName: "Deepak Solanki",
    employeeId: "EMP-1480",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
    department: "Press Shop",
    plant: "Plant 3",
    state: "Rajasthan",
    location: "Bhiwadi Plant",
    category: "Kaizen",
    suggestionTitle: "Automated Scrap Conveyor Chute Extension to Outdoor Bins",
    description: "Extended under-press metal scrap belt directly through wall chute, eliminating manual wheelbarrow transport.",
    costType: "Low Cost",
    status: "rejected",
    implementationStatus: "Rejected",
    priority: "Low",
    suggestionType: "Kaizen",
    reviewer: "Pradeep Meena (Plant Head)",
    createdDate: "2026-07-11",
    completedDate: "2026-07-14",
    points: 0,
    award: "None",
    beforeImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80",
    remarks: "Rejected due to structural wall load constraints. Alternative layout proposed.",
    participationMonth: "Jul",
    year: 2026,
    savings: 0,
  },
  {
    id: "sug-014",
    code: "SUG-2026-014",
    employeeName: "Sanjay Patil",
    employeeId: "EMP-1502",
    gender: "Male",
    employeePhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    department: "Production",
    plant: "Plant 4",
    state: "Karnataka",
    location: "Bengaluru Plant",
    category: "Productivity",
    suggestionTitle: "Dual-Spindle Torque Driver Station for Sub-Assembly Fastening",
    description: "Replaced single pneumatic screw drivers with synchronized dual-spindle torque wrenches for simultaneous screw tightening.",
    costType: "High Cost",
    status: "dropped",
    implementationStatus: "On Hold",
    priority: "Low",
    suggestionType: "Productivity",
    reviewer: "Naveen Hegde (Ops Mgr)",
    createdDate: "2026-07-15",
    completedDate: "2026-07-20",
    points: 50,
    award: "None",
    beforeImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    remarks: "Dropped due to ROI period exceeding company threshold of 24 months.",
    participationMonth: "Jul",
    year: 2026,
    savings: 0,
  },
  {
    id: "sug-015",
    code: "SUG-2026-015",
    employeeName: "Alok Kumar",
    employeeId: "EMP-1520",
    gender: "Others",
    employeePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Tool Room",
    plant: "Plant 1",
    state: "Haryana",
    location: "Manesar Division",
    category: "Fool Proofing",
    suggestionTitle: "Color-Coded Jig Lock Pins with RFID Verification",
    description: "Integrated RFID tags on machining fixtures to ensure CNC program cannot start if wrong jig is loaded.",
    costType: "Low Cost",
    status: "fake_closure",
    implementationStatus: "Rejected",
    priority: "High",
    suggestionType: "Fool Proofing",
    reviewer: "Virender Sehwag (Audit Officer)",
    createdDate: "2026-07-18",
    completedDate: "2026-07-22",
    points: 0,
    award: "Flagged Audit Violation",
    beforeImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    remarks: "Marked as Fake Closure during physical EHS spot verification.",
    participationMonth: "Jul",
    year: 2026,
    savings: 0,
  },
];

/**
 * Filters the dummy suggestions based on user selected Filter Drawer criteria.
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
