import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { A as useQuery } from "./dist-DuWSCmUg.mjs";
import { M as PageHeader, u as AppShell } from "./app-shell-B-C1Zdxr.mjs";
import { t as ADMIN_NAV } from "./admin-nav-B2pYfMco.mjs";
import { t as ExportMenu } from "./export-menu-DY-TMX0z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.locations-DHkGnCMJ.js
var import_jsx_runtime = require_jsx_runtime();
function LocationPerf() {
	const { data: locations = [] } = useQuery({
		queryKey: ["locs-perf"],
		queryFn: async () => (await supabase.from("locations").select("id,location,state")).data ?? []
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["plants-for-locs"],
		queryFn: async () => (await supabase.from("plants").select("id,location_id")).data ?? []
	});
	const { data: sugs = [] } = useQuery({
		queryKey: ["all-sugs-locs"],
		queryFn: async () => (await supabase.from("suggestions").select("id,location_id,status,expected_saving,actual_cost").limit(1e4)).data ?? []
	});
	const rows = locations.map((l) => {
		const all = sugs.filter((s) => s.location_id === l.id);
		const impl = all.filter((s) => s.status === "implemented" || s.status === "closed").length;
		const fake = all.filter((s) => s.status === "fake_closure").length;
		const pending = all.filter((s) => ![
			"implemented",
			"closed",
			"rejected"
		].includes(s.status)).length;
		const savings = all.reduce((s, x) => s + Number(x.expected_saving ?? 0), 0);
		const plantCount = plants.filter((p) => p.location_id === l.id).length;
		return {
			state: l.state,
			location: l.location,
			plants: plantCount,
			total: all.length,
			implemented: impl,
			pending,
			fake,
			implPct: all.length ? Math.round(impl / all.length * 100) : 0,
			expected_savings: Math.round(savings)
		};
	}).sort((a, b) => b.total - a.total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Location Performance",
			description: "Roll-up of plants and departments per location.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
				data: rows,
				columns: [
					{
						key: "state",
						header: "State"
					},
					{
						key: "location",
						header: "Location"
					},
					{
						key: "plants",
						header: "Plants"
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
					}
				],
				filename: "location_performance",
				title: "Location Performance Report"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"#",
						"Location",
						"Plants",
						"Total",
						"Implemented",
						"Pending",
						"Fake",
						"Impl %",
						"Expected savings"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 9,
						className: "text-center py-12 text-sm text-muted-foreground",
						children: "No locations registered."
					}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-muted/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 font-mono text-xs",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 font-medium",
								children: r.location
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: r.plants
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
							})
						]
					}, r.state))
				})]
			})
		})]
	});
}
var SplitComponent = () => null;
//#endregion
export { LocationPerf, SplitComponent as component };
