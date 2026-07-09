import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { o as createLucideIcon, t as Button } from "./button-yJoTZDYV.mjs";
import { t as Bell } from "./dist-BCwtjUtj.mjs";
import { h as DialogContent, m as Dialog, u as AppShell, y as DialogTitle } from "./app-shell-uI3AfMIW.mjs";
import { t as Search } from "./search-CEsBOJfy.mjs";
import { t as BrandLogos } from "./brand-logos-CoQqwro8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee-shell-CbgHP3o1.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "esp.lang";
var DICT = {
	welcome_title: {
		en: "Welcome",
		hi: "स्वागत है"
	},
	welcome_sub: {
		en: "Employee Suggestion Portal",
		hi: "कर्मचारी सुझाव पोर्टल"
	},
	welcome_intro: {
		en: "Share your ideas. Improve your workplace. Get recognised.",
		hi: "अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ। सम्मान पाएँ।"
	},
	continue_q: {
		en: "Do you want to continue?",
		hi: "क्या आप जारी रखना चाहते हैं?"
	},
	continue_en: {
		en: "Continue in English",
		hi: "Continue in English"
	},
	continue_hi: {
		en: "हिन्दी में जारी रखें",
		hi: "हिन्दी में जारी रखें"
	},
	nav_submit: {
		en: "Submit Suggestion",
		hi: "सुझाव भेजें"
	},
	nav_my: {
		en: "My Suggestions",
		hi: "मेरे सुझाव"
	},
	nav_track: {
		en: "Track Suggestion",
		hi: "सुझाव ट्रैक करें"
	},
	nav_notifications: {
		en: "Notifications",
		hi: "सूचनाएँ"
	},
	profile_title: {
		en: "Profile",
		hi: "प्रोफ़ाइल"
	},
	profile_desc: {
		en: "Your employee record.",
		hi: "आपका कर्मचारी रिकॉर्ड।"
	},
	profile_emp_id: {
		en: "Employee ID",
		hi: "कर्मचारी आईडी"
	},
	profile_name: {
		en: "Name",
		hi: "नाम"
	},
	profile_email: {
		en: "Email",
		hi: "ईमेल"
	},
	profile_mobile: {
		en: "Mobile",
		hi: "मोबाइल"
	},
	profile_designation: {
		en: "Designation",
		hi: "पदनाम"
	},
	profile_gender: {
		en: "Gender",
		hi: "लिंग"
	},
	profile_language: {
		en: "Language",
		hi: "भाषा"
	},
	profile_language_desc: {
		en: "Choose your preferred language for the portal.",
		hi: "पोर्टल के लिए अपनी पसंदीदा भाषा चुनें।"
	},
	gender_male: {
		en: "Male",
		hi: "पुरुष"
	},
	gender_female: {
		en: "Female",
		hi: "महिला"
	},
	gender_other: {
		en: "Other",
		hi: "अन्य"
	},
	gender_prefer_not_to_say: {
		en: "Prefer not to say",
		hi: "बताना नहीं चाहते"
	},
	my_title: {
		en: "My Suggestions",
		hi: "मेरे सुझाव"
	},
	my_desc: {
		en: "All ideas you have submitted.",
		hi: "आपके द्वारा भेजे गए सभी विचार।"
	},
	my_search: {
		en: "Search by title or code…",
		hi: "शीर्षक या कोड से खोजें…"
	},
	my_all_statuses: {
		en: "All statuses",
		hi: "सभी स्थितियाँ"
	},
	my_under_review: {
		en: "Under Review",
		hi: "समीक्षाधीन"
	},
	my_empty: {
		en: "No suggestions match your filters.",
		hi: "कोई सुझाव नहीं मिले।"
	},
	my_loading: {
		en: "Loading…",
		hi: "लोड हो रहा है…"
	},
	view_details: {
		en: "View details",
		hi: "विवरण देखें"
	},
	close: {
		en: "Close",
		hi: "बंद करें"
	},
	timeline: {
		en: "Timeline",
		hi: "समयरेखा"
	},
	no_activity: {
		en: "No activity yet.",
		hi: "अभी कोई गतिविधि नहीं।"
	},
	problem: {
		en: "Problem",
		hi: "समस्या"
	},
	suggested_method: {
		en: "Suggested method",
		hi: "सुझाई गई विधि"
	},
	expected_benefits: {
		en: "Expected benefits",
		hi: "अपेक्षित लाभ"
	},
	category: {
		en: "Category",
		hi: "श्रेणी"
	},
	submitted_on: {
		en: "Submitted",
		hi: "भेजा गया"
	},
	expected_saving: {
		en: "Expected saving",
		hi: "अपेक्षित बचत"
	},
	submit_title: {
		en: "Submit a Suggestion",
		hi: "सुझाव भेजें"
	},
	submit_desc: {
		en: "Share your improvement idea. It will be routed through PE and the concerned department.",
		hi: "अपना सुधार विचार साझा करें। यह PE और संबंधित विभाग तक पहुँचेगा।"
	}
};
var LangCtx = (0, import_react.createContext)(null);
function LanguageProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("en");
	const [hasChosen, setHasChosen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const v = localStorage.getItem(STORAGE_KEY);
			if (v === "en" || v === "hi") {
				setLangState(v);
				setHasChosen(true);
			}
		} catch {}
	}, []);
	const setLang = (l) => {
		setLangState(l);
		try {
			localStorage.setItem(STORAGE_KEY, l);
		} catch {}
	};
	const markChosen = () => setHasChosen(true);
	const t = (key) => {
		const entry = DICT[key];
		if (!entry) return key;
		return entry[lang] ?? entry.en;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangCtx.Provider, {
		value: {
			lang,
			setLang,
			hasChosen,
			markChosen,
			t
		},
		children
	});
}
function useLang() {
	const ctx = (0, import_react.useContext)(LangCtx);
	if (!ctx) throw new Error("useLang must be used within LanguageProvider");
	return ctx;
}
function useT() {
	return useLang().t;
}
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowRight = createLucideIcon("arrow-right", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "m12 5 7 7-7 7",
	key: "xquz4c"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CirclePlus = createLucideIcon("circle-plus", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M8 12h8",
		key: "1wcyev"
	}],
	["path", {
		d: "M12 8v8",
		key: "napkw2"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleUser = createLucideIcon("circle-user", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["circle", {
		cx: "12",
		cy: "10",
		r: "3",
		key: "ilqhr7"
	}],
	["path", {
		d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",
		key: "154egf"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListChecks = createLucideIcon("list-checks", [
	["path", {
		d: "M13 5h8",
		key: "a7qcls"
	}],
	["path", {
		d: "M13 12h8",
		key: "h98zly"
	}],
	["path", {
		d: "M13 19h8",
		key: "c3s6r1"
	}],
	["path", {
		d: "m3 17 2 2 4-4",
		key: "1jhpwq"
	}],
	["path", {
		d: "m3 7 2 2 4-4",
		key: "1obspn"
	}]
]);
var EMPLOYEE_NAV = [{ items: [
	{
		to: "/employee",
		section: "submit",
		label: "Submit Suggestion",
		icon: CirclePlus
	},
	{
		to: "/employee",
		section: "my",
		label: "My Suggestions",
		icon: ListChecks
	},
	{
		to: "/employee",
		section: "track",
		label: "Track Suggestion",
		icon: Search
	},
	{
		to: "/employee/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/employee",
		section: "profile",
		label: "Profile",
		icon: CircleUser
	}
] }];
/**
* One-time post-login language chooser. Shows on the employee portal until
* the user has picked a language (persisted in localStorage `esp.lang`).
*/
function LanguageWelcomeModal() {
	const { hasChosen, setLang, markChosen } = useLang();
	function choose(l) {
		setLang(l);
		markChosen();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !hasChosen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md p-8 [&>button.absolute]:hidden",
			onEscapeKeyDown: (e) => e.preventDefault(),
			onPointerDownOutside: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "Choose language"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogos, {
						className: "justify-center",
						imgClassName: "h-12"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Welcome / स्वागत है"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Employee Suggestion Portal / कर्मचारी सुझाव पोर्टल"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-foreground/80",
						children: [
							"Share your ideas. Improve your workplace.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ।"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold mb-3",
							children: "Do you want to continue? / क्या आप जारी रखना चाहते हैं?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "h-11",
								onClick: () => choose("en"),
								children: ["Continue in English ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 ml-1" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "h-11",
								onClick: () => choose("hi"),
								children: ["हिन्दी में जारी रखें ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 ml-1" })]
							})]
						})]
					})
				]
			})]
		})
	});
}
var LABEL_KEYS = {
	"Submit Suggestion": "nav_submit",
	"My Suggestions": "nav_my",
	"Track Suggestion": "nav_track",
	"Notifications": "nav_notifications",
	"Profile": "profile_title"
};
function EmployeeShell({ children }) {
	const t = useT();
	const nav = (0, import_react.useMemo)(() => EMPLOYEE_NAV.map((g) => ({
		...g,
		items: g.items.map((it) => ({
			...it,
			label: LABEL_KEYS[it.label] ? t(LABEL_KEYS[it.label]) : it.label
		}))
	})), [t]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageWelcomeModal, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: nav,
		title: "Employee Portal",
		collapsible: true,
		children
	})] });
}
//#endregion
export { useT as i, LanguageProvider as n, useLang as r, EmployeeShell as t };
