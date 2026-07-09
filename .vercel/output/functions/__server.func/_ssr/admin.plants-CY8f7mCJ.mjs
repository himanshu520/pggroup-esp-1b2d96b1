import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { A as useQuery } from "./dist-DuWSCmUg.mjs";
import { M as PageHeader, u as AppShell } from "./app-shell-B-C1Zdxr.mjs";
import { t as ADMIN_NAV } from "./admin-nav-B2pYfMco.mjs";
import { t as ExportMenu } from "./export-menu-DY-TMX0z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.plants-CY8f7mCJ.js
var import_jsx_runtime = require_jsx_runtime();
function PlantPerf() {
	const { data: plants = [] } = useQuery({
		queryKey: ["plants-perf"],
		queryFn: async () => (await supabase.from("plants").select("id,name,code, locations(location)")).data ?? []
	});
	const { data: sugs = [] } = useQuery({
		queryKey: ["all-sugs-plants"],
		queryFn: async () => (await supabase.from("suggestions").select("id,plant_id,status,expected_saving,actual_cost,created_at,completed_at").limit(1e4)).data ?? []
	});
	const rows = plants.map((p) => {
		const all = sugs.filter((s) => s.plant_id === p.id);
		const impl = all.filter((s) => s.status === "implemented" || s.status === "closed").length;
		const fake = all.filter((s) => s.status === "fake_closure").length;
		const pending = all.filter((s) => ![
			"implemented",
			"closed",
			"rejected"
		].includes(s.status)).length;
		const savings = all.reduce((s, x) => s + Number(x.expected_saving ?? 0), 0);
		const spend = all.reduce((s, x) => s + Number(x.actual_cost ?? 0), 0);
		const avgDays = (() => {
			const done = all.filter((s) => s.completed_at);
			if (!done.length) return 0;
			return Math.round(done.reduce((sum, s) => sum + (new Date(s.completed_at).getTime() - new Date(s.created_at).getTime()), 0) / (done.length * 864e5));
		})();
		return {
			code: p.code,
			name: p.name,
			location: p.locations?.location ?? "",
			total: all.length,
			implemented: impl,
			pending,
			fake,
			implPct: all.length ? Math.round(impl / all.length * 100) : 0,
			expected_savings: Math.round(savings),
			actual_spend: Math.round(spend),
			avg_days: avgDays
		};
	}).sort((a, b) => b.total - a.total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Plant Performance",
			description: "Ranked implementation performance across plants.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
				data: rows,
				columns: [
					{
						key: "code",
						header: "Code"
					},
					{
						key: "name",
						header: "Plant"
					},
					{
						key: "location",
						header: "Location"
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
						key: "expected_savings",
						header: "Expected savings"
					},
					{
						key: "actual_spend",
						header: "Actual spend"
					},
					{
						key: "avg_days",
						header: "Avg days to close"
					}
				],
				filename: "plant_performance",
				title: "Plant Performance Report"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"#",
						"Plant",
						"Location",
						"Total",
						"Implemented",
						"Pending",
						"Fake",
						"Impl %",
						"Expected savings",
						"Avg days"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 10,
						className: "text-center py-12 text-sm text-muted-foreground",
						children: "No plants registered."
					}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
								className: "px-4 py-2 text-xs text-muted-foreground",
								children: r.location
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
								className: "px-4 py-2 font-mono text-xs",
								children: r.expected_savings.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-muted-foreground",
								children: r.avg_days ? `${r.avg_days}d` : "—"
							})
						]
					}, r.code))
				})]
			})
		})]
	});
}
var SplitComponent = () => null;
//#endregion
export { PlantPerf, SplitComponent as component };
