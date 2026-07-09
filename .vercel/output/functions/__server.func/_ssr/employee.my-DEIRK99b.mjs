import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BEab6JLj.mjs";
import { A as useQuery, M as useSession } from "./dist-BCwtjUtj.mjs";
import { M as PageHeader, _ as DialogFooter, g as DialogDescription, h as DialogContent, m as Dialog, v as DialogHeader, y as DialogTitle, z as STATUS_LABEL } from "./app-shell-uI3AfMIW.mjs";
import { t as Search } from "./search-CEsBOJfy.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-BVCVIuvZ.mjs";
import { i as useT, t as EmployeeShell } from "./employee-shell-CbgHP3o1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.my-DEIRK99b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MySuggestions() {
	const { data: session } = useSession();
	const t = useT();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const { data = [], isLoading } = useQuery({
		queryKey: ["my-suggestions", session?.employee?.id],
		enabled: !!session?.employee?.id,
		queryFn: async () => (await supabase.from("suggestions").select("*, categories(name)").eq("employee_id", session.employee.id).order("created_at", { ascending: false })).data ?? []
	});
	const TERMINAL = /* @__PURE__ */ new Set([
		"approved",
		"implemented",
		"rejected",
		"closed",
		"fake_closure"
	]);
	const filtered = data.filter((s) => {
		if (status === "under_review") {
			if (TERMINAL.has(s.status)) return false;
		} else if (status && s.status !== status) return false;
		if (q && !`${s.title} ${s.code}`.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmployeeShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t("my_title"),
			description: t("my_desc")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-w-[200px] max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: t("my_search"),
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "pl-8"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: status,
				onChange: (e) => setStatus(e.target.value),
				className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("my_all_statuses")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "under_review",
						children: t("my_under_review")
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
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: t("my_loading")
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground text-center py-12 border border-dashed border-border rounded-lg",
			children: t("my_empty")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setSelectedId(s.id),
				className: "text-left block p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 transition-all",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-mono text-muted-foreground",
								children: s.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 font-medium truncate",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									s.categories?.name ?? "—",
									" · ",
									new Date(s.created_at).toLocaleDateString()
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: s.priority })]
					})]
				})
			}, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionDetailsDialog, {
			suggestionId: selectedId,
			onClose: () => setSelectedId(null)
		})
	] });
}
function SuggestionDetailsDialog({ suggestionId, onClose }) {
	const t = useT();
	const { data, isLoading } = useQuery({
		queryKey: ["my-suggestion-detail", suggestionId],
		enabled: !!suggestionId,
		queryFn: async () => {
			const [{ data: s }, { data: h }] = await Promise.all([supabase.from("suggestions").select("*, categories(name), departments!suggestions_department_id_fkey(name), plants(name), locations(location)").eq("id", suggestionId).maybeSingle(), supabase.from("suggestion_history").select("*").eq("suggestion_id", suggestionId).order("created_at")]);
			return {
				s,
				h: h ?? []
			};
		}
	});
	const s = data?.s;
	const history = data?.h ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!suggestionId,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[85vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: s?.title ?? "…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "font-mono text-xs",
					children: s?.code
				})] }),
				isLoading || !s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground py-6",
					children: t("my_loading")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: s.priority }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										t("submitted_on"),
										" ",
										new Date(s.created_at).toLocaleDateString()
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-3 gap-3 text-sm border-t border-border pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: t("category"),
									value: s.categories?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Department",
									value: s.departments?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Plant",
									value: s.plants?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: "Location",
									value: s.locations?.location ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									label: t("expected_saving"),
									value: s.expected_saving ? `₹ ${Number(s.expected_saving).toLocaleString()}` : "—"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-3 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: t("problem"),
									body: s.problem
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: t("suggested_method"),
									body: s.suggested_method
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: t("expected_benefits"),
									body: s.expected_benefits
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium mb-3",
								children: t("timeline")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "space-y-3 relative",
								children: [history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative pl-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" }),
										i < history.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-2 top-3 bottom-[-0.75rem] w-px bg-border" }),
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
									children: t("no_activity")
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: t("close")
				}) })
			]
		})
	});
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
export { MySuggestions, SplitComponent as component };
