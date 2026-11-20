import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";
const STORAGE_KEY = "esp.lang";

type Dict = Record<string, { en: string; hi: string; mr: string }>;

// Translation strings. Add new keys here.
const DICT: Dict = {
  // Welcome modal
  welcome_title: { en: "Welcome", hi: "स्वागत है", mr: "स्वागत आहे" },
  welcome_sub: { en: "Employee Suggestion Portal", hi: "कर्मचारी सुझाव पोर्टल", mr: "कर्मचारी सूचना पोर्टल" },
  welcome_intro: {
    en: "Share your ideas. Improve your workplace. Get recognised.",
    hi: "अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ। सम्मान पाएँ।",
    mr: "आपल्या कल्पना शेअर करा. आपले कार्यस्थळ अधिक चांगले बनवा. सन्मान मिळवा.",
  },
  continue_q: { en: "Do you want to continue?", hi: "क्या आप जारी रखना चाहते हैं?", mr: "तुम्हाला पुढे सुरू ठेवायचे आहे का?" },
  continue_en: { en: "Continue in English", hi: "Continue in English", mr: "Continue in English" },
  continue_hi: { en: "हिन्दी में जारी रखें", hi: "हिन्दी में जारी रखें", mr: "हिन्दी में जारी रखें" },
  continue_mr: { en: "मराठीत पुढे सुरू ठेवा", hi: "मराठीत पुढे सुरू ठेवा", mr: "मराठीत पुढे सुरू ठेवा" },

  // Nav
  nav_submit: { en: "Submit Suggestion", hi: "सुझाव भेजें", mr: "सूचना सादर करा" },
  nav_my: { en: "My Suggestions", hi: "मेरे सुझाव", mr: "माझ्या सूचना" },
  nav_track: { en: "Track Suggestion", hi: "सुझाव ट्रैक करें", mr: "सूचना ट्रॅक करा" },
  nav_notifications: { en: "Notifications", hi: "सूचनाएँ", mr: "सूचना (Notifications)" },

  // Profile
  profile_title: { en: "Profile", hi: "प्रोफ़ाइल", mr: "प्रोफाइल" },
  profile_desc: { en: "Your employee record.", hi: "आपका कर्मचारी रिकॉर्ड।", mr: "आपला कर्मचारी तपशील." },
  profile_emp_id: { en: "Employee ID", hi: "कर्मचारी आईडी", mr: "कर्मचारी आयडी" },
  profile_name: { en: "Name", hi: "नाम", mr: "नाव" },
  profile_email: { en: "Email", hi: "ईमेल", mr: "ईमेल" },
  profile_mobile: { en: "Mobile", hi: "मोबाइल", mr: "मोबाईल" },
  profile_designation: { en: "Designation", hi: "पदनाम", mr: "पदनाम / हुद्दा" },
  profile_gender: { en: "Gender", hi: "लिंग", mr: "लिंग" },
  profile_language: { en: "Language", hi: "भाषा", mr: "भाषा" },
  profile_language_desc: {
    en: "Choose your preferred language for the portal.",
    hi: "पोर्टल के लिए अपनी पसंदीदा भाषा चुनें।",
    mr: "पोर्टलसाठी आपली पसंतीची भाषा निवडा.",
  },

  // Gender labels
  gender_male: { en: "Male", hi: "पुरुष", mr: "पुरुष" },
  gender_female: { en: "Female", hi: "महिला", mr: "महिला" },
  gender_other: { en: "Other", hi: "अन्य", mr: "इतर" },
  gender_prefer_not_to_say: { en: "Prefer not to say", hi: "बताना नहीं चाहते", mr: "सांगू इच्छित नाही" },

  // My Suggestions
  my_title: { en: "My Suggestions", hi: "मेरे सुझाव", mr: "माझ्या सूचना" },
  my_desc: { en: "All ideas you have submitted.", hi: "आपके द्वारा भेजे गए सभी विचार।", mr: "आपण सादर केलेल्या सर्व कल्पना/सूचना." },
  my_search: { en: "Search by title or code…", hi: "शीर्षक या कोड से खोजें…", mr: "शीर्षक किंवा कोडने शोधा…" },
  my_all_statuses: { en: "All statuses", hi: "सभी स्थितियाँ", mr: "सर्व स्थिती" },
  my_under_review: { en: "Under Review", hi: "समीक्षाधीन", mr: "पुनरावलोकनाधीन (Under Review)" },
  my_empty: { en: "No suggestions match your filters.", hi: "कोई सुझाव नहीं मिले।", mr: "कोणत्याही सूचना सापडल्या नाहीत." },
  my_loading: { en: "Loading…", hi: "लोड हो रहा है…", mr: "लोड होत आहे…" },
  view_details: { en: "View details", hi: "विवरण देखें", mr: "तपशील पहा" },
  close: { en: "Close", hi: "बंद करें", mr: "बंद करा" },
  timeline: { en: "Timeline", hi: "समयरेखा", mr: "टाइमलाइन" },
  no_activity: { en: "No activity yet.", hi: "अभी कोई गतिविधि नहीं।", mr: "अद्याप कोणतीही हालचाल नाही." },
  problem: { en: "Problem", hi: "समस्या", mr: "समस्या" },
  suggested_method: { en: "Suggested method", hi: "सुझाई गई विधि", mr: "सुचवलेली पद्धत" },
  expected_benefits: { en: "Expected benefits", hi: "अपेक्षित लाभ", mr: "अपेक्षित फायदे" },
  category: { en: "Category", hi: "श्रेणी", mr: "श्रेणी" },
  submitted_on: { en: "Submitted", hi: "भेजा गया", mr: "सादर केले" },
  expected_saving: { en: "Expected saving", hi: "अपेक्षित बचत", mr: "अपेक्षित बचत" },

  // Submit form
  submit_title: { en: "Submit a Suggestion", hi: "सुझाव भेजें", mr: "सूचना सादर करा" },
  submit_desc: {
    en: "Share your improvement idea. It will be routed through PE and the concerned department.",
    hi: "अपना सुधार विचार साझा करें। यह PE और संबंधित विभाग तक पहुँचेगा।",
    mr: "आपली सुधारणा कल्पना शेअर करा. ती PE आणि संबंधित विभागाकडे पाठवली जाईल.",
  },
  sec_1_title: { en: "Employee & Work Location", hi: "कर्मचारी और कार्य स्थान", mr: "कर्मचारी आणि कामाचे ठिकाण" },
  sec_1_sub: { en: "Your identity and posting", hi: "आपकी पहचान और पोस्टिंग", mr: "आपली ओळख आणि पोस्टिंग" },
  sec_2_title: { en: "Classification & Budget", hi: "वर्गीकरण और बजट", mr: "वर्गीकरण आणि बजेट" },
  sec_2_sub: { en: "Categorise your idea", hi: "अपने विचार को वर्गीकृत करें", mr: "आपल्या कल्पनेचे वर्गीकरण करा" },
  sec_3_title: { en: "Idea Description", hi: "विचार विवरण", mr: "कल्पनेचे तपशील" },
  sec_3_sub: { en: "Tell us about your improvement", hi: "हमें अपने सुधार के बारे में बताएं", mr: "आपल्या सुधारणेबद्दल माहिती द्या" },
  lbl_full_name: { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  lbl_employee_id: { en: "Employee ID", hi: "कर्मचारी आईडी", mr: "कर्मचारी आयडी" },
  lbl_email_address: { en: "Email Address", hi: "ईमेल पता", mr: "ईमेल पत्ता" },
  lbl_mobile_number: { en: "Mobile Number", hi: "मोबाइल नंबर", mr: "मोबाईल नंबर" },
  lbl_gender: { en: "Gender", hi: "लिंग", mr: "लिंग" },
  lbl_state_location: { en: "State / Location", hi: "राज्य / स्थान", mr: "राज्य / स्थान" },
  lbl_unit_plant: { en: "Unit / Plant", hi: "यूनिट / प्लांट", mr: "युनिट / प्लांट" },
  lbl_department: { en: "Department", hi: "विभाग", mr: "विभाग" },
  lbl_idea_category: { en: "Idea Category", hi: "विचार श्रेणी", mr: "कल्पनेची श्रेणी" },
  lbl_implementation_budget: { en: "Implementation Budget", hi: "कार्यान्वयन बजट", mr: "अंमलबजावणी बजेट" },
  lbl_suggestion_title: { en: "Suggestion Title / Subject", hi: "सुझाव का शीर्षक / विषय", mr: "सूचनेचे शीर्षक / विषय" },
  lbl_current_problem: { en: "Current Problem / Situation", hi: "वर्तमान समस्या / स्थिति", mr: "सध्याची समस्या / परिस्थिती" },
  lbl_proposed_solution: { en: "Your Proposed Solution", hi: "आपका प्रस्तावित समाधान", mr: "आपला प्रस्तावित उपाय / तोडगा" },
  lbl_expected_benefits: { en: "Expected Benefits / Impact", hi: "अपेक्षित लाभ / प्रभाव", mr: "अपेक्षित फायदे / परिणाम" },
  lbl_attachments: { en: "Attachments", hi: "अटैचमेंट", mr: "अटॅचमेंट्स" },
  lbl_priority: { en: "Priority Level", hi: "प्राथमिकता स्तर", mr: "प्राधान्यक्रम स्तर" },
  lbl_budget_tier: { en: "Implementation Budget Tier", hi: "कार्यान्वयन बजट श्रेणी", mr: "अंमलबजावणी बजेट श्रेणी" },
  
  ph_full_name: { en: "Your full name", hi: "आपका पूरा नाम", mr: "आपले पूर्ण नाव" },
  ph_employee_id: { en: "Enter Employee ID", hi: "कर्मचारी आईडी दर्ज करें", mr: "कर्मचारी आयडी प्रविष्ट करा" },
  ph_mobile: { en: "10-digit mobile number", hi: "10-अंकीय मोबाइल नंबर", mr: "१० अंकी मोबाईल नंबर" },
  ph_suggestion_title: { en: "Short, descriptive title for your idea...", hi: "आपके विचार के लिए एक संक्षिप्त, वर्णनात्मक शीर्षक...", mr: "आपल्या कल्पनेसाठी एक संक्षिप्त, स्पष्ट शीर्षक..." },
  ph_problem: { en: "Describe the current issue in detail...", hi: "वर्तमान समस्या का विस्तार से वर्णन करें...", mr: "सध्याच्या समस्येचे तपशीलवार वर्णन करा..." },
  ph_solution: { en: "Explain your idea to solve the problem...", hi: "समस्या को हल करने के लिए अपना विचार समझाएं...", mr: "समस्या सोडवण्यासाठी आपली कल्पना स्पष्ट करा..." },
  ph_benefits: { en: "Positive impacts of your idea...", hi: "आपके विचार के सकारात्मक प्रभाव...", mr: "आपल्या कल्पनेचे सकारात्मक फायदे/परिणाम..." },

  hint_problem: { en: "Concern, bottleneck, defect, or safety hazard", hi: "चिंता, बाधा, दोष, या सुरक्षा खतरा", mr: "अडचण, अडथळा, दोष, किंवा सुरक्षेचा धोका" },
  hint_solution: { en: "How would you solve or improve this?", hi: "आप इसे कैसे हल या सुधारेंगे?", mr: "तुम्ही हे कसे सोडवाल किंवा सुधाराल?" },
  hint_benefits: { en: "Cost savings, safety, cycle time, quality...", hi: "लागत बचत, सुरक्षा, चक्र समय, गुणवत्ता...", mr: "खर्चात बचत, सुरक्षितता, वेळ बचत, गुणवत्ता..." },
  hint_budget: { en: "Estimated budget to execute this", hi: "इसे निष्पादित करने के लिए अनुमानित बजट", mr: "यासाठी लागणारे अंदाजे बजेट" },
  hint_category: { en: "Which category does your idea fall under?", hi: "आपका विचार किस श्रेणी के अंतर्गत आता है?", mr: "आपली कल्पना कोणत्या श्रेणीत येते?" },
  hint_title: { en: "A clear, concise headline", hi: "एक स्पष्ट, संक्षिप्त शीर्षक", mr: "एक स्पष्ट, संक्षिप्त शीर्षक" },

  opt_select_category: { en: "Select a category", hi: "एक श्रेणी चुनें", mr: "एक श्रेणी निवडा" },
  opt_select_state: { en: "— Select Location —", hi: "— स्थान चुनें —", mr: "— स्थान निवडा —" },
  opt_select_plant: { en: "— Select Plant —", hi: "— प्लांट चुनें —", mr: "— प्लांट निवडा —" },
  opt_select_dept: { en: "— Select Department —", hi: "— विभाग चुनें —", mr: "— विभाग निवडा —" },

  btn_reset_form: { en: "Reset Form", hi: "रीसेट करें", mr: "रीसेट करा" },
  btn_submit_suggestion: { en: "Submit Suggestion", hi: "सुझाव सबमिट करें", mr: "सूचना सादर करा" },
  submitting: { en: "Submitting…", hi: "सबमिट हो रहा है…", mr: "सादर करत आहे…" },

  budget_no_cost: { en: "No Cost", hi: "कोई लागत नहीं", mr: "विना खर्च (No Cost)" },
  budget_no_cost_hint: { en: "Method changes only", hi: "केवल प्रक्रिया में बदलाव", mr: "फक्त पद्धतीत बदल" },
  budget_low_cost: { en: "Low Cost", hi: "कम लागत", mr: "कमी खर्च (Low Cost)" },
  budget_low_cost_hint: { en: "Minor expense", hi: "मामूली खर्च", mr: "किरकोळ खर्च" },
  budget_investment: { en: "Investment", hi: "निवेश", mr: "गुंतवणूक (Investment)" },
  budget_investment_hint: { en: "Budget required", hi: "बजट आवश्यक", mr: "बजेट आवश्यक" },

  // Categories
  "Productivity & Efficiency — Line Balancing, Cycle Time, Energy Saving": {
    en: "Productivity & Efficiency — Line Balancing, Cycle Time, Energy Saving",
    hi: "उत्पादकता और दक्षता — लाइन बैलेंसिंग, साइकिल टाइम, ऊर्जा की बचत",
    mr: "उत्पादकता आणि कार्यक्षमता — लाईन बॅलन्सिंग, सायकल टाइम, ऊर्जा बचत",
  },
  "Quality & Fool Proofing — Poka Yoke, Defect Reduction, Inspection": {
    en: "Quality & Fool Proofing — Poka Yoke, Defect Reduction, Inspection",
    hi: "गुणवत्ता और फूल-प्रूफिंग — पोका योके, दोष में कमी, निरीक्षण",
    mr: "गुणवत्ता आणि फूल-प्रूफिंग — पोका योके, दोष कमी करणे, तपासणी",
  },
  "Safety Improvement — Machine Safety, PPE, Fire/Electrical, Hazards": {
    en: "Safety Improvement — Machine Safety, PPE, Fire/Electrical, Hazards",
    hi: "सुरक्षा सुधार — मशीन सुरक्षा, पीपीई (PPE), अग्नि/विद्युत, खतरे",
    mr: "सुरक्षितता सुधारणा — मशीन सुरक्षा, पीपीई (PPE), आग/विद्युत, धोके",
  },
  "Environment / 5S / 3R — Reduce, Reuse, Recycle, Waste": {
    en: "Environment / 5S / 3R — Reduce, Reuse, Recycle, Waste",
    hi: "पर्यावरण / 5S / 3R — कम करें, पुन: उपयोग करें, रीसायकल करें, अपशिष्ट",
    mr: "पर्यावरण / 5S / 3R — घटवा, पुनर्वापर, रीसायकल, कचरा व्यवस्थापन",
  },
  "Automation & Digitization — LCA, Digital Systems, Paperless": {
    en: "Automation & Digitization — LCA, Digital Systems, Paperless",
    hi: "स्वचालन और डिजिटलीकरण — एलसीए (LCA), डिजिटल सिस्टम, पेपरलेस",
    mr: "स्वचालन आणि डिजिटलायझेशन — एलसीए (LCA), डिजिटल प्रणाली, पेपरलेस",
  },
  "Maintenance Improvement — Preventive Maintenance, Tools": {
    en: "Maintenance Improvement — Preventive Maintenance, Tools",
    hi: "रखरखाव में सुधार — निवारक रखरखाव, उपकरण",
    mr: "देखभाल सुधारणा — प्रतिबंधात्मक देखभाल (Preventive Maintenance), साधने",
  },
  "Material Flow & Logistics — FIFO, KANBAN, Layout": {
    en: "Material Flow & Logistics — FIFO, KANBAN, Layout",
    hi: "मटेरियल फ्लो और लॉजिस्टिक्स — फीफो (FIFO), कानबन (KANBAN), लेआउट",
    mr: "मटेरिअल फ्लो आणि लॉजिस्टिक — फिफो (FIFO), कानबान (KANBAN), लेआउट",
  },
  "Employee Welfare — Work Culture, Canteen, Rest Area": {
    en: "Employee Welfare — Work Culture, Canteen, Rest Area",
    hi: "कर्मचारी कल्याण — कार्य संस्कृति, कैंटीन, विश्राम क्षेत्र",
    mr: "कर्मचारी कल्याण — कार्य संस्कृती, कॅन्टीन, विश्रांती कक्ष",
  },
  "Others": {
    en: "Others",
    hi: "अन्य",
    mr: "इतर",
  },

  // Statuses
  status_submitted: { en: "Submitted", hi: "प्रस्तुत किया गया", mr: "सादर केले" },
  status_pe_review: { en: "PE Review", hi: "पीई समीक्षा (PE Review)", mr: "पीई पुनरावलोकन (PE Review)" },
  status_transferred: { en: "Transferred", hi: "स्थानांतरित", mr: "हस्तांतरित (Transferred)" },
  status_dept_review: { en: "Department Review", hi: "विभाग समीक्षा", mr: "विभाग पुनरावलोकन (Dept Review)" },
  status_approved: { en: "Approved", hi: "स्वीकृत", mr: "मंजूर (Approved)" },
  status_evaluation: { en: "Evaluation", hi: "मूल्यांकन", mr: "मूल्यमापन (Evaluation)" },
  status_implementation: { en: "Implementation", hi: "कार्यान्वयन", mr: "अंमलबजावणी (Implementation)" },
  status_evidence_pending: { en: "Evidence Pending", hi: "साक्ष्य लंबित", mr: "पुरावा प्रलंबित (Evidence Pending)" },
  status_evidence_submitted: { en: "Evidence Submitted", hi: "साक्ष्य प्रस्तुत किया गया", mr: "पुरावा सादर केला (Evidence Submitted)" },
  status_pe_verification: { en: "PE Verification", hi: "पीई सत्यापन (PE Verification)", mr: "पीई पडताळणी (PE Verification)" },
  status_implemented: { en: "Implemented", hi: "लागू किया गया", mr: "लागू केले (Implemented)" },
  status_rejected: { en: "Rejected", hi: "अस्वीकृत", mr: "नाकारले (Rejected)" },
  status_fake_closure: { en: "Fake Closure", hi: "फर्जी बंद (Fake Closure)", mr: "बनावट बंद (Fake Closure)" },
  status_reopened: { en: "Reopened", hi: "पुनः खोला गया", mr: "पुन्हा उघडले (Reopened)" },
  status_closed: { en: "Closed", hi: "बंद", mr: "बंद (Closed)" },

  // General text
  words: { en: "words", hi: "शब्द", mr: "शब्द" },
  lbl_code: { en: "Code", hi: "कोड", mr: "कोड" },
  lbl_title: { en: "Title", hi: "शीर्षक", mr: "शीर्षक" },
  lbl_status: { en: "Status", hi: "स्थिति", mr: "स्थिती" },
  lbl_created: { en: "Created", hi: "बनाया गया", mr: "दिनांक" },
  lbl_employee: { en: "Employee", hi: "कर्मचारी", mr: "कर्मचारी" },
  track_title: { en: "Track Suggestion", hi: "सुझाव ट्रैक करें", mr: "सूचना ट्रॅक करा" },
  track_desc: { en: "Enter a suggestion ID to see its full timeline.", hi: "पूरी समयरेखा देखने के लिए सुझाव आईडी दर्ज करें।", mr: "पूर्ण टाइमलाइन पाहण्यासाठी सूचना आयडी प्रविष्ट करा." },
  track_placeholder: { en: "E.g. SUG-P01-2026-000001", hi: "उदा. SUG-P01-2026-000001", mr: "उदा. SUG-P01-2026-000001" },
  track_btn: { en: "Track", hi: "ट्रैक करें", mr: "ट्रॅक करा" },
  no_suggestion_found: { en: "No suggestion found for that ID.", hi: "इस आईडी के लिए कोई सुझाव नहीं मिला।", mr: "या आयडीसाठी कोणतीही सूचना सापडली नाही." },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  hasChosen: boolean;
  markChosen: () => void;
  t: (key: keyof typeof DICT | string) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [hasChosen, setHasChosen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "en" || v === "hi" || v === "mr") { setLangState(v); setHasChosen(true); }
    } catch { /* ignore */ }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  };
  const markChosen = () => setHasChosen(true);

  const t = (key: string) => {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en;
  };

  return <LangCtx.Provider value={{ lang, setLang, hasChosen, markChosen, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}
