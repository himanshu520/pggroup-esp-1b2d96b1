import { t as supabase } from "./client-DfqwfaTb.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useSession } from "./session-DHPGTdIs.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as PageHeader, l as AppShell } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-DQ8qczLk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.workflow-Cf2vHDMZ.js
var import_jsx_runtime = require_jsx_runtime();
var QUEUES = [
	{
		key: "pe_in",
		label: "PE Inbox",
		statuses: ["pe_review", "submitted"],
		forPE: true
	},
	{
		key: "dept",
		label: "Department Review",
		statuses: ["dept_review", "transferred"]
	},
	{
		key: "impl",
		label: "Implementation",
		statuses: [
			"approved",
			"implementation",
			"evidence_pending"
		]
	},
	{
		key: "pe_verify",
		label: "PE Verification",
		statuses: ["pe_verification", "evidence_submitted"],
		forPE: true
	},
	{
		key: "fake",
		label: "Fake Closure — Reopen",
		statuses: ["fake_closure", "reopened"]
	}
];
function WorkflowPage() {
	const { data: session } = useSession();
	const { data = [] } = useQuery({
		queryKey: ["workflow-queue"],
		queryFn: async () => (await supabase.from("suggestions").select("*, employees(name), departments!suggestions_department_id_fkey(name)").order("created_at", { ascending: false })).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Workflow Queue",
			description: "Everything waiting on someone. PE queues show only for PE / Super / Corporate roles."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: QUEUES.filter((q) => !q.forPE || session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin").map((q) => {
				const items = data.filter((s) => q.statuses.includes(s.status));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 border-b border-border flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: q.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [items.length, " pending"]
						})]
					}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-xs text-muted-foreground",
						children: "Queue is clear."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: items.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 font-mono text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin",
											search: {
												section: "suggestion",
												id: s.id
											},
											className: "text-primary hover:underline",
											children: s.code
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 max-w-md truncate",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 text-xs",
										children: s.departments?.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: s.priority })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 text-xs text-muted-foreground text-right",
										children: new Date(s.created_at).toLocaleDateString()
									})
								]
							}, s.id))
						})
					})]
				}, q.key);
			})
		})]
	});
}
var SplitComponent = () => null;
//#endregion
export { WorkflowPage, SplitComponent as component };
