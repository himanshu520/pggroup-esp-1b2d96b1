import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { A as useQuery } from "./dist-DuWSCmUg.mjs";
import { A as PRIORITY_LABEL, M as PageHeader, u as AppShell, z as STATUS_LABEL } from "./app-shell-B-C1Zdxr.mjs";
import { t as ADMIN_NAV } from "./admin-nav-B2pYfMco.mjs";
import { t as ExportMenu } from "./export-menu-DY-TMX0z.mjs";
import { _ as YAxis, d as Legend, f as Pie, g as XAxis, h as Tooltip, i as Cell, m as ResponsiveContainer, n as BarChart, p as PieChart, r as CartesianGrid, t as Bar } from "./PieChart-Eqb2yVAj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-n3ilqdxx.js
var import_jsx_runtime = require_jsx_runtime();
var PIE_COLORS = [
	"oklch(0.45 0.14 254)",
	"oklch(0.58 0.14 155)",
	"oklch(0.72 0.15 65)",
	"oklch(0.55 0.20 27)",
	"oklch(0.55 0.12 240)",
	"oklch(0.60 0.10 300)",
	"oklch(0.65 0.08 200)",
	"oklch(0.50 0.10 20)"
];
function AnalyticsPage() {
	const { data: sugs = [] } = useQuery({
		queryKey: ["analytics-sugs"],
		queryFn: async () => (await supabase.from("suggestions").select("id,status,priority,category_id,created_at,expected_saving,actual_cost").limit(1e4)).data ?? []
	});
	const { data: categories = [] } = useQuery({
		queryKey: ["cats-analytics"],
		queryFn: async () => (await supabase.from("categories").select("id,name")).data ?? []
	});
	const statusRows = Object.keys(STATUS_LABEL).map((st) => {
		const list = sugs.filter((s) => s.status === st);
		return {
			status: STATUS_LABEL[st],
			count: list.length,
			expected_savings: Math.round(list.reduce((sum, s) => sum + Number(s.expected_saving ?? 0), 0))
		};
	}).filter((x) => x.count > 0);
	const priorityRows = Object.keys(PRIORITY_LABEL).map((p) => ({
		priority: PRIORITY_LABEL[p],
		count: sugs.filter((s) => s.priority === p).length
	})).filter((x) => x.count > 0);
	const catRows = categories.map((c) => {
		const list = sugs.filter((s) => s.category_id === c.id);
		const impl = list.filter((s) => s.status === "implemented" || s.status === "closed").length;
		return {
			category: c.name,
			total: list.length,
			implemented: impl,
			impl_pct: list.length ? Math.round(impl / list.length * 100) : 0
		};
	}).filter((x) => x.total > 0).sort((a, b) => b.total - a.total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Analytics",
				description: "Status, priority, and category breakdown across the enterprise.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
					data: statusRows,
					columns: [
						{
							key: "status",
							header: "Status"
						},
						{
							key: "count",
							header: "Count"
						},
						{
							key: "expected_savings",
							header: "Expected savings"
						}
					],
					filename: "status_distribution",
					title: "Status Distribution Report"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Status distribution"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: statusRows,
							layout: "vertical",
							margin: { left: 40 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "oklch(0.90 0.008 250)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "status",
									tick: { fontSize: 10 },
									width: 110
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									borderRadius: 6,
									border: "1px solid oklch(0.90 0.008 250)",
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									fill: "oklch(0.45 0.14 254)",
									radius: [
										0,
										4,
										4,
										0
									]
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium mb-3",
						children: "Priority breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: priorityRows,
								dataKey: "count",
								nameKey: "priority",
								outerRadius: 90,
								innerRadius: 45,
								paddingAngle: 2,
								children: priorityRows.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								borderRadius: 6,
								border: "1px solid oklch(0.90 0.008 250)",
								fontSize: 12
							} })
						] }) })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "Category performance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
						data: catRows,
						columns: [
							{
								key: "category",
								header: "Category"
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
								key: "impl_pct",
								header: "Impl %"
							}
						],
						filename: "category_performance",
						title: "Category Performance"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 border-b border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Category",
							"Total",
							"Implemented",
							"Impl %"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: catRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "text-center py-8 text-sm text-muted-foreground",
							children: "No category data."
						}) }) : catRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 font-medium",
									children: r.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: r.total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 text-success",
									children: r.implemented
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-2",
									children: [r.impl_pct, "%"]
								})
							]
						}, r.category))
					})]
				})]
			})
		]
	});
}
var SplitComponent = () => null;
//#endregion
export { AnalyticsPage, SplitComponent as component };
