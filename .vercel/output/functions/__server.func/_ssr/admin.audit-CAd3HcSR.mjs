import { t as supabase } from "./client-DfqwfaTb.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as PageHeader, l as AppShell } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-CAd3HcSR.js
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const { data = [] } = useQuery({
		queryKey: ["audit-logs"],
		queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500)).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Audit Logs",
			description: "Complete action history — visible to super and corporate admins only."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "text-left",
						children: [
							"When",
							"Action",
							"Entity",
							"Meta"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: h
						}, h))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 4,
						className: "text-center py-12 text-sm text-muted-foreground",
						children: "No audit records yet, or you don't have permission to view them."
					}) }) : data.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-xs text-muted-foreground whitespace-nowrap",
							children: new Date(a.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 font-mono text-xs",
							children: a.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2 text-xs",
							children: [
								a.entity_type,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: a.entity_id?.slice(0, 8)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-xs text-muted-foreground max-w-md truncate",
							children: a.meta ? JSON.stringify(a.meta) : "—"
						})
					] }, a.id))
				})]
			})
		})]
	});
}
var SplitComponent = () => null;
//#endregion
export { AuditPage, SplitComponent as component };
