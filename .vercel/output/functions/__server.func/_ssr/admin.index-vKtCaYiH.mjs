import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useSession } from "./session-DHPGTdIs.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { E as Rocket, S as Search, T as RotateCcw, rt as CircleX, st as CircleCheck, tt as ClipboardList, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { C as PageHeader, D as StatCard, T as STATUS_LABEL, l as AppShell } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
import { t as ExportMenu } from "./export-menu-uQzy2Rlg.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { C as SettingsPage, D as WorkflowPage, E as UsersPage, S as SecurityPage, T as SuggestionsList, a as LocationPerf, i as EmployeesPage, n as AuditPage, o as MastersPage, p as Route$13, r as DeptPerf, s as PlantPerf, t as AnalyticsPage, w as SuggestionDetail } from "./admin.suggestions._id-IBHBAAhk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-vKtCaYiH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_ONLY_SECTIONS = /* @__PURE__ */ new Set([
	"masters",
	"employees",
	"users",
	"audit",
	"security",
	"settings"
]);
function AdminHome() {
	const { section, id } = Route$13.useSearch();
	const { data: sess } = useSession();
	const isSuper = sess?.primaryRole === "super_admin";
	switch (section && ADMIN_ONLY_SECTIONS.has(section) && !isSuper ? void 0 : section) {
		case "suggestions": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionsList, {});
		case "suggestion": return id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionDetail, { id }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionsList, {});
		case "workflow": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowPage, {});
		case "departments": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeptPerf, {});
		case "plants": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantPerf, {});
		case "locations": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationPerf, {});
		case "analytics": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsPage, {});
		case "masters": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MastersPage, {});
		case "employees": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesPage, {});
		case "users": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPage, {});
		case "audit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditPage, {});
		case "security": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityPage, {});
		case "settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPage, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewPage, {});
	}
}
var MONTH_SHORT = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function OverviewPage() {
	const [locationId, setLocationId] = (0, import_react.useState)("all");
	const [plantId, setPlantId] = (0, import_react.useState)("all");
	const [trendMode, setTrendMode] = (0, import_react.useState)("half");
	const [nowTick, setNowTick] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNowTick(Date.now()), 3600 * 1e3);
		return () => clearInterval(id);
	}, []);
	const { data: sugs = [] } = useQuery({
		queryKey: ["admin-suggestions-all"],
		queryFn: async () => (await supabase.from("suggestions").select("id, status, priority, created_at, department_id, plant_id, location_id, category_id, expected_saving").order("created_at", { ascending: false }).limit(5e3)).data ?? []
	});
	const { data: locations = [] } = useQuery({
		queryKey: ["locs"],
		queryFn: async () => (await supabase.from("locations").select("id,location")).data ?? []
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["plants"],
		queryFn: async () => (await supabase.from("plants").select("id,name,location_id")).data ?? []
	});
	const { data: categories = [] } = useQuery({
		queryKey: ["cats"],
		queryFn: async () => (await supabase.from("categories").select("id,name")).data ?? []
	});
	const filtered = (0, import_react.useMemo)(() => sugs.filter((s) => (locationId === "all" || s.location_id === locationId) && (plantId === "all" || s.plant_id === plantId)), [
		sugs,
		locationId,
		plantId
	]);
	const by = (st) => filtered.filter((s) => st.includes(s.status)).length;
	const implemented = by(["implemented", "closed"]);
	const total = filtered.length;
	const implRate = total ? Math.round(implemented / total * 100) : 0;
	const now = (0, import_react.useMemo)(() => new Date(nowTick), [nowTick]);
	const halfStart = (0, import_react.useMemo)(() => new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1), [now]);
	const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	const [customFrom, setCustomFrom] = (0, import_react.useState)(() => toISO(halfStart));
	const [customTo, setCustomTo] = (0, import_react.useState)(() => toISO(new Date(halfStart.getFullYear(), halfStart.getMonth() + 5, 1)));
	const { months, windowLabel } = (0, import_react.useMemo)(() => {
		let startDate;
		let endDate;
		if (trendMode === "custom") {
			const parse = (v, fallback) => {
				const m = /^(\d{4})-(\d{2})$/.exec(v);
				if (!m) return fallback;
				const y = Number(m[1]);
				const mo = Number(m[2]) - 1;
				if (mo < 0 || mo > 11) return fallback;
				return new Date(y, mo, 1);
			};
			startDate = parse(customFrom, halfStart);
			endDate = parse(customTo, new Date(halfStart.getFullYear(), halfStart.getMonth() + 5, 1));
			if (endDate < startDate) endDate = startDate;
		} else {
			startDate = halfStart;
			endDate = new Date(halfStart.getFullYear(), halfStart.getMonth() + 5, 1);
		}
		const count = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
		const cappedCount = Math.min(Math.max(count, 1), 36);
		const arr = Array.from({ length: cappedCount }).map((_, i) => {
			const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
			return {
				key: `${d.getFullYear()}-${d.getMonth()}`,
				label: `${MONTH_SHORT[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
				fullLabel: `${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`,
				total: 0,
				implemented: 0
			};
		});
		const first = arr[0];
		const last = arr[arr.length - 1];
		return {
			months: arr,
			windowLabel: first === last ? first.fullLabel : `${first.fullLabel} – ${last.fullLabel}`
		};
	}, [
		trendMode,
		customFrom,
		customTo,
		halfStart
	]);
	for (const s of filtered) {
		if (!s.created_at) continue;
		const d = new Date(s.created_at);
		if (isNaN(d.getTime())) continue;
		const key = `${d.getFullYear()}-${d.getMonth()}`;
		const m = months.find((x) => x.key === key);
		if (m) {
			m.total++;
			if (s.status === "implemented" || s.status === "closed") m.implemented++;
		}
	}
	const trendExportRows = months.map((m) => ({
		month: m.fullLabel,
		total: m.total,
		implemented: m.implemented
	}));
	const catData = categories.map((c) => ({
		name: c.name,
		value: filtered.filter((s) => s.category_id === c.id).length
	})).filter((x) => x.value > 0);
	const implData = [{
		name: "Implemented",
		value: implemented
	}, {
		name: "Not Implemented",
		value: Math.max(0, total - implemented)
	}];
	const PIE = [
		"oklch(0.72 0.15 220)",
		"oklch(0.75 0.12 155)",
		"oklch(0.72 0.15 65)",
		"oklch(0.65 0.20 27)",
		"oklch(0.60 0.20 300)",
		"oklch(0.55 0.14 254)"
	];
	const IMPL = ["oklch(0.62 0.16 155)", "oklch(0.88 0.02 250)"];
	const exportRows = Object.keys(STATUS_LABEL).map((st) => ({
		status: STATUS_LABEL[st],
		count: filtered.filter((s) => s.status === st).length
	}));
	function reset() {
		setLocationId("all");
		setPlantId("all");
	}
	const availablePlants = plants.filter((p) => locationId === "all" || p.location_id === locationId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Enterprise Portal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Overview Analytics",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted-foreground uppercase mr-1",
							children: "Filter:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: locationId,
							onValueChange: (v) => {
								setLocationId(v);
								setPlantId("all");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-40 h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Locations" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Locations"
							}), locations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: l.id,
								children: l.location
							}, l.id))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: plantId,
							onValueChange: setPlantId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-40 h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Units" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Units"
							}), availablePlants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.id,
								children: p.name
							}, p.id))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-9",
							onClick: reset,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" }), " Reset"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
							data: exportRows,
							columns: [{
								key: "status",
								header: "Status"
							}, {
								key: "count",
								header: "Count"
							}],
							filename: "overview_analytics",
							title: "Overview Analytics"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-6 bg-background border-b border-border shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Suggestions",
							value: total,
							tone: "info",
							icon: ClipboardList
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Under Review",
							value: by([
								"submitted",
								"pe_review",
								"dept_review"
							]),
							tone: "accent",
							icon: Search
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Approved",
							value: by([
								"approved",
								"evaluation",
								"implementation"
							]),
							tone: "success",
							icon: CircleCheck
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Implemented",
							value: by(["implemented", "closed"]),
							tone: "info",
							icon: Rocket
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Rejected",
							value: by(["rejected", "fake_closure"]),
							tone: "destructive",
							icon: CircleX
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Impl. Rate",
							value: `${implRate}%`,
							tone: "accent",
							icon: TrendingUp
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-3 gap-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-1 rounded-lg border border-border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2 mb-3 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-base font-bold",
									children: "Monthly Submission Trend"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: windowLabel
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: trendMode,
										onValueChange: (v) => setTrendMode(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-36 h-8 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "half",
											children: "Last 6 months"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "custom",
											children: "Custom range"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
										data: trendExportRows,
										columns: [
											{
												key: "month",
												header: "Month"
											},
											{
												key: "total",
												header: "Total Ideas"
											},
											{
												key: "implemented",
												header: "Implemented Ideas"
											}
										],
										filename: "submission_trend",
										title: "Monthly Submission Trend",
										subtitle: windowLabel,
										label: "Export"
									})]
								})]
							}),
							trendMode === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-3 flex-wrap text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "From"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "month",
										value: customFrom,
										onChange: (e) => setCustomFrom(e.target.value),
										className: "h-8 w-36 text-xs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "To"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "month",
										value: customTo,
										onChange: (e) => setCustomTo(e.target.value),
										className: "h-8 w-36 text-xs"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: months,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "oklch(0.92 0.008 250)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: { fontSize: 10 },
											angle: -35,
											textAnchor: "end",
											height: 50,
											stroke: "oklch(0.52 0.02 250)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: { fontSize: 11 },
											stroke: "oklch(0.52 0.02 250)",
											allowDecimals: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												borderRadius: 6,
												border: "1px solid oklch(0.90 0.008 250)",
												fontSize: 12
											},
											labelFormatter: (_l, payload) => payload?.[0]?.payload?.fullLabel ?? _l
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "total",
											name: "Total Ideas",
											stroke: "oklch(0.72 0.15 220)",
											strokeWidth: 2,
											dot: { r: 3 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "implemented",
											name: "Implemented Ideas",
											stroke: "oklch(0.75 0.12 155)",
											strokeWidth: 2,
											dot: { r: 3 }
										})
									]
								}) })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold mb-4",
							children: "Distribution by Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: catData,
									dataKey: "value",
									nameKey: "name",
									outerRadius: 80,
									innerRadius: 45,
									paddingAngle: 2,
									label: (e) => e.value,
									children: catData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE[i % PIE.length] }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									borderRadius: 6,
									border: "1px solid oklch(0.90 0.008 250)",
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 10 } })
							] }) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold mb-4",
							children: "Implementation Analysis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: implData,
									dataKey: "value",
									nameKey: "name",
									outerRadius: 90,
									label: (e) => e.value,
									children: implData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: IMPL[i] }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									borderRadius: 6,
									border: "1px solid oklch(0.90 0.008 250)",
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
							] }) })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-bold mb-4",
					children: "Status Distribution"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: exportRows.filter((x) => x.count > 0),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "oklch(0.92 0.008 250)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "status",
								tick: { fontSize: 10 },
								angle: -20,
								textAnchor: "end",
								height: 60,
								stroke: "oklch(0.52 0.02 250)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								stroke: "oklch(0.52 0.02 250)",
								allowDecimals: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								borderRadius: 6,
								border: "1px solid oklch(0.90 0.008 250)",
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: "oklch(0.55 0.14 254)",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					}) })
				})]
			})
		]
	});
}
//#endregion
export { AdminHome as component };
