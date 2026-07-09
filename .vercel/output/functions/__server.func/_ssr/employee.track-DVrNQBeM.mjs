import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { S as Search } from "../_libs/lucide-react.mjs";
import { C as PageHeader, T as STATUS_LABEL } from "./app-shell-D3p4__nB.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-DQ8qczLk.mjs";
import { t as EmployeeShell } from "./employee-shell-CcFVNx6P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.track-DVrNQBeM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TrackPage({ initialCode }) {
	const [code, setCode] = (0, import_react.useState)(initialCode ?? "");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)([]);
	async function search() {
		if (!code.trim()) return;
		setLoading(true);
		try {
			const { data } = await supabase.from("suggestions").select("*, categories(name), employees(name, employee_code), departments!suggestions_department_id_fkey(name), plants(name), locations(location)").ilike("code", code.trim()).maybeSingle();
			setResult(data);
			if (data) {
				const { data: h } = await supabase.from("suggestion_history").select("*").eq("suggestion_id", data.id).order("created_at");
				setHistory(h ?? []);
			} else setHistory([]);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmployeeShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Track Suggestion",
			description: "Enter a suggestion ID to see its full timeline."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 mb-6 max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "SUG-P01-2026-000001",
					value: code,
					onChange: (e) => setCode(e.target.value),
					className: "pl-8 font-mono",
					onKeyDown: (e) => e.key === "Enter" && search()
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: search,
				disabled: loading,
				children: "Track"
			})]
		}),
		result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 rounded-lg border border-border bg-card p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-mono text-muted-foreground",
								children: result.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold mt-1",
								children: result.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: result.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: result.priority }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: ["Submitted ", new Date(result.created_at).toLocaleDateString()]
									})
								]
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3 text-sm border-t border-border pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Employee",
								value: `${result.employees?.name} (${result.employees?.employee_code})`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Category",
								value: result.categories?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Department",
								value: result.departments?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Plant",
								value: result.plants?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Location",
								value: result.locations?.location ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Expected saving",
								value: result.expected_saving ? `₹ ${Number(result.expected_saving).toLocaleString()}` : "—"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-3 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Problem",
								body: result.problem
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Suggested method",
								body: result.suggested_method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Expected benefits",
								body: result.expected_benefits
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium mb-3",
					children: "Timeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "space-y-4 relative",
					children: [history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative pl-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" }),
							i < history.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-2 top-3 bottom-[-1rem] w-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: new Date(h.created_at).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: STATUS_LABEL[h.to_status]
							}),
							h.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: h.remarks
							})
						]
					}, h.id)), history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs text-muted-foreground",
						children: "No activity yet."
					})]
				})]
			})]
		}) : code && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "No suggestion found for that ID."
		}) : null
	] });
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5",
		children: value
	})] });
}
function Section({ title, body }) {
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-sm whitespace-pre-wrap",
		children: body
	})] });
}
var SplitComponent = () => null;
//#endregion
export { TrackPage, SplitComponent as component };
