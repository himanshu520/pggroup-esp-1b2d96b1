import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";
const STORAGE_KEY = "esp.lang";

type Dict = Record<string, { en: string; hi: string }>;

// Translation strings. Add new keys here.
const DICT: Dict = {
  // Welcome modal
  welcome_title: { en: "Welcome", hi: "स्वागत है" },
  welcome_sub: { en: "Employee Suggestion Portal", hi: "कर्मचारी सुझाव पोर्टल" },
  welcome_intro: {
    en: "Share your ideas. Improve your workplace. Get recognised.",
    hi: "अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ। सम्मान पाएँ।",
  },
  continue_q: { en: "Do you want to continue?", hi: "क्या आप जारी रखना चाहते हैं?" },
  continue_en: { en: "Continue in English", hi: "Continue in English" },
  continue_hi: { en: "हिन्दी में जारी रखें", hi: "हिन्दी में जारी रखें" },

  // Nav
  nav_submit: { en: "Submit Suggestion", hi: "सुझाव भेजें" },
  nav_my: { en: "My Suggestions", hi: "मेरे सुझाव" },
  nav_track: { en: "Track Suggestion", hi: "सुझाव ट्रैक करें" },
  nav_notifications: { en: "Notifications", hi: "सूचनाएँ" },

  // Profile
  profile_title: { en: "Profile", hi: "प्रोफ़ाइल" },
  profile_desc: { en: "Your employee record.", hi: "आपका कर्मचारी रिकॉर्ड।" },
  profile_emp_id: { en: "Employee ID", hi: "कर्मचारी आईडी" },
  profile_name: { en: "Name", hi: "नाम" },
  profile_email: { en: "Email", hi: "ईमेल" },
  profile_mobile: { en: "Mobile", hi: "मोबाइल" },
  profile_designation: { en: "Designation", hi: "पदनाम" },
  profile_gender: { en: "Gender", hi: "लिंग" },
  profile_language: { en: "Language", hi: "भाषा" },
  profile_language_desc: {
    en: "Choose your preferred language for the portal.",
    hi: "पोर्टल के लिए अपनी पसंदीदा भाषा चुनें।",
  },

  // Gender labels
  gender_male: { en: "Male", hi: "पुरुष" },
  gender_female: { en: "Female", hi: "महिला" },
  gender_other: { en: "Other", hi: "अन्य" },
  gender_prefer_not_to_say: { en: "Prefer not to say", hi: "बताना नहीं चाहते" },

  // My Suggestions
  my_title: { en: "My Suggestions", hi: "मेरे सुझाव" },
  my_desc: { en: "All ideas you have submitted.", hi: "आपके द्वारा भेजे गए सभी विचार।" },
  my_search: { en: "Search by title or code…", hi: "शीर्षक या कोड से खोजें…" },
  my_all_statuses: { en: "All statuses", hi: "सभी स्थितियाँ" },
  my_under_review: { en: "Under Review", hi: "समीक्षाधीन" },
  my_empty: { en: "No suggestions match your filters.", hi: "कोई सुझाव नहीं मिले।" },
  my_loading: { en: "Loading…", hi: "लोड हो रहा है…" },
  view_details: { en: "View details", hi: "विवरण देखें" },
  close: { en: "Close", hi: "बंद करें" },
  timeline: { en: "Timeline", hi: "समयरेखा" },
  no_activity: { en: "No activity yet.", hi: "अभी कोई गतिविधि नहीं।" },
  problem: { en: "Problem", hi: "समस्या" },
  suggested_method: { en: "Suggested method", hi: "सुझाई गई विधि" },
  expected_benefits: { en: "Expected benefits", hi: "अपेक्षित लाभ" },
  category: { en: "Category", hi: "श्रेणी" },
  submitted_on: { en: "Submitted", hi: "भेजा गया" },
  expected_saving: { en: "Expected saving", hi: "अपेक्षित बचत" },

  // Submit form
  submit_title: { en: "Submit a Suggestion", hi: "सुझाव भेजें" },
  submit_desc: {
    en: "Share your improvement idea. It will be routed through PE and the concerned department.",
    hi: "अपना सुधार विचार साझा करें। यह PE और संबंधित विभाग तक पहुँचेगा।",
  },
  sec_1_title: { en: "Employee & Work Location", hi: "कर्मचारी और कार्य स्थान" },
  sec_1_sub: { en: "Your identity and posting", hi: "आपकी पहचान और पोस्टिंग" },
  sec_2_title: { en: "Classification & Budget", hi: "वर्गीकरण और बजट" },
  sec_2_sub: { en: "Categorise your idea", hi: "अपने विचार को वर्गीकृत करें" },
  sec_3_title: { en: "Idea Description", hi: "विचार विवरण" },
  sec_3_sub: { en: "Tell us about your improvement", hi: "हमें अपने सुधार के बारे में बताएं" },
  lbl_full_name: { en: "Full Name", hi: "पूरा नाम" },
  lbl_employee_id: { en: "Employee ID", hi: "कर्मचारी आईडी" },
  lbl_email_address: { en: "Email Address", hi: "ईमेल पता" },
  lbl_mobile_number: { en: "Mobile Number", hi: "मोबाइल नंबर" },
  lbl_gender: { en: "Gender", hi: "लिंग" },
  lbl_state_location: { en: "State / Location", hi: "राज्य / स्थान" },
  lbl_unit_plant: { en: "Unit / Plant", hi: "यूनिट / प्लांट" },
  lbl_department: { en: "Department", hi: "विभाग" },
  lbl_idea_category: { en: "Idea Category", hi: "विचार श्रेणी" },
  lbl_implementation_budget: { en: "Implementation Budget", hi: "कार्यान्वयन बजट" },
  lbl_suggestion_title: { en: "Suggestion Title / Subject", hi: "सुझाव का शीर्षक / विषय" },
  lbl_current_problem: { en: "Current Problem / Situation", hi: "वर्तमान समस्या / स्थिति" },
  lbl_proposed_solution: { en: "Your Proposed Solution", hi: "आपका प्रस्तावित समाधान" },
  lbl_expected_benefits: { en: "Expected Benefits / Impact", hi: "अपेक्षित लाभ / प्रभाव" },
  lbl_attachments: { en: "Attachments", hi: "अटैचमेंट" },
  lbl_priority: { en: "Priority Level", hi: "प्राथमिकता स्तर" },
  lbl_budget_tier: { en: "Implementation Budget Tier", hi: "कार्यान्वयन बजट श्रेणी" },
  
  ph_full_name: { en: "Your full name", hi: "आपका पूरा नाम" },
  ph_employee_id: { en: "Enter Employee ID", hi: "कर्मचारी आईडी दर्ज करें" },
  ph_mobile: { en: "10-digit mobile number", hi: "10-अंकीय मोबाइल नंबर" },
  ph_suggestion_title: { en: "Short, descriptive title for your idea...", hi: "आपके विचार के लिए एक संक्षिप्त, वर्णनात्मक शीर्षक..." },
  ph_problem: { en: "Describe the current issue in detail...", hi: "वर्तमान समस्या का विस्तार से वर्णन करें..." },
  ph_solution: { en: "Explain your idea to solve the problem...", hi: "समस्या को हल करने के लिए अपना विचार समझाएं..." },
  ph_benefits: { en: "Positive impacts of your idea...", hi: "आपके विचार के सकारात्मक प्रभाव..." },

  hint_problem: { en: "Concern, bottleneck, defect, or safety hazard", hi: "चिंता, बाधा, दोष, या सुरक्षा खतरा" },
  hint_solution: { en: "How would you solve or improve this?", hi: "आप इसे कैसे हल या सुधारेंगे?" },
  hint_benefits: { en: "Cost savings, safety, cycle time, quality...", hi: "लागत बचत, सुरक्षा, चक्र समय, गुणवत्ता..." },
  hint_budget: { en: "Estimated budget to execute this", hi: "इसे निष्पादित करने के लिए अनुमानित बजट" },
  hint_category: { en: "Which category does your idea fall under?", hi: "आपका विचार किस श्रेणी के अंतर्गत आता है?" },
  hint_title: { en: "A clear, concise headline", hi: "एक स्पष्ट, संक्षिप्त शीर्षक" },

  opt_select_category: { en: "Select a category", hi: "एक श्रेणी चुनें" },
  opt_select_state: { en: "— Select Location —", hi: "— स्थान चुनें —" },
  opt_select_plant: { en: "— Select Plant —", hi: "— प्लांट चुनें —" },
  opt_select_dept: { en: "— Select Department —", hi: "— विभाग चुनें —" },

  btn_reset_form: { en: "Reset Form", hi: "रीसेट करें" },
  btn_submit_suggestion: { en: "Submit Suggestion", hi: "सुझाव सबमिट करें" },

  budget_no_cost: { en: "No Cost", hi: "कोई लागत नहीं" },
  budget_no_cost_hint: { en: "Method changes only", hi: "केवल प्रक्रिया में बदलाव" },
  budget_low_cost: { en: "Low Cost", hi: "कम लागत" },
  budget_low_cost_hint: { en: "Minor expense", hi: "मामूली खर्च" },
  budget_investment: { en: "Investment", hi: "निवेश" },
  budget_investment_hint: { en: "Budget required", hi: "बजट आवश्यक" },
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
      if (v === "en" || v === "hi") { setLangState(v); setHasChosen(true); }
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
