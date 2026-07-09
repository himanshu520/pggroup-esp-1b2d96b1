import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useSession } from "./session-DHPGTdIs.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { C as PageHeader } from "./app-shell-D3p4__nB.mjs";
import { i as useT, r as useLang, t as EmployeeShell } from "./employee-shell-CcFVNx6P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.profile-CdTYnjt4.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { data: s } = useSession();
	const e = s?.employee;
	const t = useT();
	const { lang, setLang } = useLang();
	const genderLabel = e?.gender ? t(`gender_${e.gender}`) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmployeeShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: t("profile_title"),
		description: t("profile_desc")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-6 grid md:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_emp_id"),
					value: e?.employee_code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_name"),
					value: e?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_email"),
					value: e?.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_mobile"),
					value: e?.mobile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_designation"),
					value: e?.designation
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_gender"),
					value: genderLabel
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: t("profile_language")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: t("profile_language_desc")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: lang === "en" ? "default" : "outline",
						onClick: () => setLang("en"),
						children: "English"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: lang === "hi" ? "default" : "outline",
						onClick: () => setLang("hi"),
						children: "हिन्दी (Hindi)"
					})]
				})
			]
		})]
	})] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 text-sm",
		children: value ?? "—"
	})] });
}
var SplitComponent = () => null;
//#endregion
export { ProfilePage, SplitComponent as component };
