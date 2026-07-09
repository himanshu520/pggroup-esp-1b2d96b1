import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as ExternalLink, R as LoaderCircle, S as Search } from "../_libs/lucide-react.mjs";
import { C as PageHeader, T as STATUS_LABEL, d as DialogContent, f as DialogDescription, h as DialogTitle, l as AppShell, m as DialogHeader, p as DialogFooter, u as Dialog, x as PRIORITY_LABEL } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
import { t as ExportMenu } from "./export-menu-uQzy2Rlg.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-DQ8qczLk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.suggestions.index-B0auaG4H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuggestionsList() {
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [previewId, setPreviewId] = (0, import_react.useState)(null);
	const { data = [] } = useQuery({
		queryKey: ["admin-suggestions", status],
		queryFn: async () => {
			let query = supabase.from("suggestions").select("*, employees(name, employee_code), categories(name), departments!suggestions_department_id_fkey(name), plants(name)").order("created_at", { ascending: false }).limit(500);
			if (status === "under_review") query = query.not("status", "in", "(approved,implemented,rejected,closed,fake_closure)");
			else if (status) query = query.eq("status", status);
			const { data } = await query;
			return data ?? [];
		}
	});
	const filtered = q ? data.filter((s) => `${s.code} ${s.title} ${s.employees?.name}`.toLowerCase().includes(q.toLowerCase())) : data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Suggestions",
				description: "Cross-plant register with role-scoped visibility. Click a row to preview.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
					data: filtered,
					columns: [
						{
							key: "code",
							header: "Code",
							format: (s) => s.code ?? ""
						},
						{
							key: "title",
							header: "Title",
							format: (s) => s.title ?? ""
						},
						{
							key: "employee",
							header: "Employee",
							format: (s) => s.employees?.name ?? ""
						},
						{
							key: "employee_code",
							header: "Employee ID",
							format: (s) => s.employees?.employee_code ?? ""
						},
						{
							key: "plant",
							header: "Plant",
							format: (s) => s.plants?.name ?? ""
						},
						{
							key: "department",
							header: "Department",
							format: (s) => s.departments?.name ?? ""
						},
						{
							key: "category",
							header: "Category",
							format: (s) => s.categories?.name ?? ""
						},
						{
							key: "priority",
							header: "Priority",
							format: (s) => PRIORITY_LABEL[s.priority] ?? s.priority
						},
						{
							key: "status",
							header: "Status",
							format: (s) => STATUS_LABEL[s.status] ?? s.status
						},
						{
							key: "expected_saving",
							header: "Expected saving",
							format: (s) => Number(s.expected_saving ?? 0)
						},
						{
							key: "actual_cost",
							header: "Actual cost",
							format: (s) => Number(s.actual_cost ?? 0)
						},
						{
							key: "created_at",
							header: "Created",
							format: (s) => new Date(s.created_at).toLocaleDateString()
						},
						{
							key: "completed_at",
							header: "Completed",
							format: (s) => s.completed_at ? new Date(s.completed_at).toLocaleDateString() : ""
						}
					],
					filename: "suggestions",
					title: "Suggestions Register",
					subtitle: status ? `Filtered by status: ${status === "under_review" ? "Under Review" : STATUS_LABEL[status]}` : "All statuses"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by code, title, or employee",
						className: "pl-8",
						value: q,
						onChange: (e) => setQ(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "border border-input bg-background rounded-md px-3 text-sm",
					value: status,
					onChange: (e) => setStatus(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "under_review",
							children: "Under Review"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "approved",
							children: STATUS_LABEL.approved
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "implemented",
							children: STATUS_LABEL.implemented
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "rejected",
							children: STATUS_LABEL.rejected
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 border-b border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "text-left",
							children: [
								"Code",
								"Title",
								"Employee",
								"Department",
								"Priority",
								"Status",
								"Created"
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: h
							}, h))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "text-center py-12 text-sm text-muted-foreground",
							children: "No suggestions match your filters."
						}) }) : filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30 cursor-pointer",
							onClick: () => setPreviewId(s.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 font-mono text-xs text-primary",
									children: s.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 max-w-xs truncate",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-2.5 text-xs",
									children: [
										s.employees?.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"(",
												s.employees?.employee_code,
												")"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-xs",
									children: s.departments?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: s.priority })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-muted-foreground text-xs",
									children: new Date(s.created_at).toLocaleDateString()
								})
							]
						}, s.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionPreviewDialog, {
				id: previewId,
				onClose: () => setPreviewId(null)
			})
		]
	});
}
function SuggestionPreviewDialog({ id, onClose }) {
	const [navigating, setNavigating] = (0, import_react.useState)(false);
	const open = !!id;
	const { data: sug, isLoading } = useQuery({
		enabled: open,
		queryKey: ["suggestion-preview", id],
		queryFn: async () => (await supabase.from("suggestions").select("*, employees(name, employee_code, email), categories(name), departments!suggestions_department_id_fkey(name), plants(name), locations(location)").eq("id", id).maybeSingle()).data
	});
	const { data: history = [] } = useQuery({
		enabled: open,
		queryKey: ["suggestion-preview-history", id],
		queryFn: async () => (await supabase.from("suggestion_history").select("*").eq("suggestion_id", id).order("created_at")).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[85vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 flex-wrap",
					children: [sug?.title ?? (isLoading ? "Loading…" : "Suggestion"), sug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: sug.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: sug.priority })] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "font-mono text-xs",
					children: sug?.code ?? ""
				})] }),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-6 text-sm text-muted-foreground text-center",
					children: "Loading suggestion…"
				}) : !sug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-6 text-sm text-muted-foreground text-center",
					children: "Not found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-3 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Employee",
									value: sug.employees ? `${sug.employees.name} (${sug.employees.employee_code})` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Category",
									value: sug.categories?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Owner department",
									value: sug.departments?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Plant",
									value: sug.plants?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Location",
									value: sug.locations?.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Expected saving",
									value: sug.expected_saving ? `₹ ${Number(sug.expected_saving).toLocaleString()}` : "—"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Problem",
							children: sug.problem
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Current method",
							children: sug.current_method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Suggested method",
							children: sug.suggested_method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Expected benefits",
							children: sug.expected_benefits
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
							children: "Timeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-3",
							children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs text-muted-foreground",
								children: "No activity yet."
							}) : history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "relative pl-4 border-l-2 border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: new Date(h.created_at).toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: STATUS_LABEL[h.to_status] ?? h.to_status
									}),
									h.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: h.remarks
									})
								]
							}, h.id))
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					disabled: navigating,
					children: "Close"
				}), sug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					"aria-disabled": navigating,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						search: {
							section: "suggestion",
							id: sug.id
						},
						onClick: (e) => {
							if (navigating) {
								e.preventDefault();
								return;
							}
							setNavigating(true);
							onClose();
						},
						style: navigating ? {
							pointerEvents: "none",
							opacity: .7
						} : void 0,
						children: [navigating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-1.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4 mr-1.5" }), navigating ? "Opening…" : "Open full workflow"]
					})
				})] })
			]
		})
	});
}
function Section({ title, children }) {
	if (!children) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-muted/30 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wider text-muted-foreground mb-1",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm whitespace-pre-wrap",
			children
		})]
	});
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 font-medium text-sm",
		children: value || "—"
	})] });
}
var SplitComponent = () => null;
//#endregion
export { SuggestionsList, SplitComponent as component };
