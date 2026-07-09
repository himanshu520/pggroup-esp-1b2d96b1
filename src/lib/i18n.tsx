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
