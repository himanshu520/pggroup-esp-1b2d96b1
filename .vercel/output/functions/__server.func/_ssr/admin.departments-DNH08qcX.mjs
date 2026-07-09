import { t as supabase } from "./client-DfqwfaTb.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as PageHeader, l as AppShell } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
import { t as ExportMenu } from "./export-menu-uQzy2Rlg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.departments-DNH08qcX.js
var import_jsx_runtime = require_jsx_runtime();
function DeptPerf() {
	const { data: depts = [] } = useQuery({
		queryKey: ["depts-all"],
		queryFn: async () => (await supabase.from("departments").select("id,name")).data ?? []
	});
	const { data: sugs = [] } = useQuery({
		queryKey: ["all-sugs"],
		queryFn: async () => (await supabase.from("suggestions").select("id,department_id,status,created_at,completed_at").limit(5e3)).data ?? []
	});
	const rows = depts.map((d) => {
		const all = sugs.filter((s) => s.department_id === d.id);
		const impl = all.filter((s) => s.status === "implemented" || s.status === "closed").length;
		const fake = all.filter((s) => s.status === "fake_closure").length;
		const pending = all.filter((s) => ![
			"implemented",
			"closed",
			"rejected"
		].includes(s.status)).length;
		const avgDays = (() => {
			const done = all.filter((s) => s.completed_at);
			if (!done.length) return "—";
			const totalMs = done.reduce((sum, s) => sum + (new Date(s.completed_at).getTime() - new Date(s.created_at).getTime()), 0);
			return Math.round(totalMs / (done.length * 864e5)) + "d";
		})();
		return {
			name: d.name,
			total: all.length,
			implemented: impl,
			pending,
			fake,
			implPct: all.length ? Math.round(impl / all.length * 100) : 0,
			avgDays
		};
	}).sort((a, b) => b.total - a.total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Department Performance",
			description: "Ranked by total suggestions and implementation rate.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
				data: rows,
				columns: [
					{
						key: "name",
						header: "Department"
					},
					{
						key: "total",
						header: "Total"
					},
					{
						key: "implemented",
						header: "Implemented"
					},
					{
						key: "pending",
						header: "Pending"
					},
					{
						key: "fake",
						header: "Fake closure"
					},
					{
						key: "implPct",
						header: "Impl %"
					},
					{
						key: "avgDays",
						header: "Avg days"
					}
				],
				filename: "department_performance",
				title: "Department Performance Report"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"#",
						"Department",
						"Total",
						"Implemented",
						"Pending",
						"Fake",
						"Impl %",
						"Avg days"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-muted/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 font-mono text-xs",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 font-medium",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: r.total
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-success",
								children: r.implemented
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-warning",
								children: r.pending
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-destructive",
								children: r.fake
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2",
								children: [r.implPct, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-muted-foreground",
								children: r.avgDays
							})
						]
					}, r.name))
				})]
			})
		})]
	});
}
var SplitComponent = () => null;
//#endregion
export { DeptPerf, SplitComponent as component };
