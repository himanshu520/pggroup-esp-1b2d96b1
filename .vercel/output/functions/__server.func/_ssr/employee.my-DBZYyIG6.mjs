import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useSession } from "./session-DHPGTdIs.mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { _ as useNavigate, j as redirect, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Lightbulb, J as FileText, S as Search, ct as CircleAlert, i as User, j as Paperclip, m as Sparkles, n as Wrench, s as Upload, t as X, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { C as PageHeader, T as STATUS_LABEL, d as DialogContent, f as DialogDescription, h as DialogTitle, m as DialogHeader, p as DialogFooter, u as Dialog } from "./app-shell-D3p4__nB.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-DQ8qczLk.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { i as notifyNewSuggestion } from "./workflow.functions-CflT6ZNR.mjs";
import { i as useT, r as useLang, t as EmployeeShell } from "./employee-shell-CcFVNx6P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.my-DBZYyIG6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter$4 = () => import("./employee.index-YN56WDAS.mjs");
var SECTION_TITLES = {
	submit: "Submit suggestion — ESP",
	my: "My suggestions — ESP",
	track: "Track suggestion — ESP",
	notifications: "Notifications — ESP",
	profile: "Profile — ESP"
};
var Route$4 = createFileRoute("/employee/")({
	validateSearch: (s) => ({
		section: typeof s.section === "string" ? s.section : void 0,
		code: typeof s.code === "string" ? s.code : void 0
	}),
	beforeLoad: ({ search }) => {
		if (!search.section) throw redirect({
			to: "/employee",
			search: { section: "submit" },
			replace: true
		});
	},
	head: ({ match }) => {
		return { meta: [{ title: SECTION_TITLES[match.search?.section ?? "submit"] ?? SECTION_TITLES.submit }] };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./employee.track-DVrNQBeM.mjs");
var Route$3 = createFileRoute("/employee/track")({
	beforeLoad: ({ search }) => {
		const code = search?.code;
		throw redirect({
			to: "/employee",
			search: {
				section: "track",
				...code ? { code } : {}
			}
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
								label: "Employee",
								value: `${result.employees?.name} (${result.employees?.employee_code})`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
								label: "Category",
								value: result.categories?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
								label: "Department",
								value: result.departments?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
								label: "Plant",
								value: result.plants?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
								label: "Location",
								value: result.locations?.location ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
								label: "Expected saving",
								value: result.expected_saving ? `₹ ${Number(result.expected_saving).toLocaleString()}` : "—"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-3 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
								title: "Problem",
								body: result.problem
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
								title: "Suggested method",
								body: result.suggested_method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
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
function Meta$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5",
		children: value
	})] });
}
function Section$1({ title, body }) {
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-sm whitespace-pre-wrap",
		children: body
	})] });
}
var $$splitComponentImporter$2 = () => import("./employee.submit-CLBjSh1L.mjs");
var Route$2 = createFileRoute("/employee/submit")({
	beforeLoad: () => {
		throw redirect({
			to: "/employee",
			search: { section: "submit" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
function SubmitForm() {
	const { data: session } = useSession();
	const emp = session?.employee;
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	const navigate = useNavigate();
	const t = useT();
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => (await supabase.from("categories").select("*").eq("active", true).order("sort_order").order("name")).data ?? []
	});
	const { data: locations = [] } = useQuery({
		queryKey: ["locations"],
		queryFn: async () => (await supabase.from("locations").select("*").eq("active", true).order("location")).data ?? []
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["plants"],
		queryFn: async () => (await supabase.from("plants").select("*").eq("active", true).order("name")).data ?? []
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["departments"],
		queryFn: async () => (await supabase.from("departments").select("*").eq("active", true).order("name")).data ?? []
	});
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		category_id: "",
		problem: "",
		current_method: "",
		suggested_method: "",
		expected_benefits: "",
		expected_saving: "",
		implementation_cost: "",
		priority: "medium",
		budget_tier: "",
		location_id: emp?.location_id ?? "",
		plant_id: emp?.plant_id ?? "",
		department_id: emp?.department_id ?? "",
		mobile: emp?.mobile ?? "",
		gender: emp?.gender === "male" || emp?.gender === "female" || emp?.gender === "other" ? emp.gender : ""
	});
	const [files, setFiles] = (0, import_react.useState)([]);
	if (emp && !form.location_id && emp.location_id) setForm((f) => ({
		...f,
		location_id: emp.location_id ?? "",
		plant_id: emp.plant_id ?? "",
		department_id: emp.department_id ?? "",
		gender: f.gender || (emp.gender === "male" || emp.gender === "female" || emp.gender === "other" ? emp.gender : "")
	}));
	function handleFiles(fileList) {
		if (!fileList) return;
		const arr = Array.from(fileList);
		setFiles((prev) => [...prev, ...arr].slice(0, 10));
	}
	async function submit() {
		if (!emp) return toast.error("Employee record missing");
		if (!form.title.trim()) return toast.error("Please enter a title");
		if (!form.suggested_method.trim()) return toast.error("Please describe your proposed solution");
		if (!form.location_id || !form.plant_id || !form.department_id) return toast.error("Please select state, unit and department");
		setSubmitting(true);
		try {
			const { data: inserted, error } = await supabase.from("suggestions").insert({
				employee_id: emp.id,
				title: form.title.trim(),
				category_id: form.category_id || null,
				problem: form.problem || null,
				current_method: form.current_method || null,
				suggested_method: form.suggested_method,
				expected_benefits: form.expected_benefits || null,
				expected_saving: form.expected_saving ? Number(form.expected_saving) : null,
				implementation_cost: form.implementation_cost ? Number(form.implementation_cost) : null,
				priority: form.priority,
				location_id: form.location_id,
				plant_id: form.plant_id,
				department_id: form.department_id,
				status: "pe_review"
			}).select("id, code").single();
			if (error) throw error;
			for (const file of files) {
				const path = `${inserted.id}/${crypto.randomUUID()}-${file.name}`;
				const { error: upErr } = await supabase.storage.from("suggestion-files").upload(path, file, { contentType: file.type });
				if (upErr) {
					toast.warning(`Failed to upload ${file.name}`);
					continue;
				}
				await supabase.from("attachments").insert({
					suggestion_id: inserted.id,
					file_path: path,
					file_name: file.name,
					content_type: file.type,
					kind: "attachment",
					uploaded_by: session?.userId
				});
			}
			await supabase.from("suggestion_history").insert({
				suggestion_id: inserted.id,
				from_status: "submitted",
				to_status: "pe_review",
				actor_id: session?.userId,
				remarks: "Submitted by employee"
			});
			try {
				await notifyNewSuggestion({ data: { suggestion_id: inserted.id } });
			} catch {}
			toast.success(`Suggestion ${inserted.code} submitted successfully`);
			qc.invalidateQueries({ queryKey: ["my-suggestions"] });
			navigate({ to: "/employee/my" });
		} catch (e) {
			toast.error(e.message ?? "Failed to submit");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmployeeShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: t("submit_title"),
		description: t("submit_desc")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			submit();
		},
		className: "space-y-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					tone: "primary",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4.5 h-4.5" }),
					index: "1",
					title: "Employee & Work Location",
					subtitle: "Your identity and posting"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "Full Name",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: emp?.name ?? "",
								disabled: true,
								className: "h-11 bg-accent/40 border-accent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "Employee ID",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: emp?.employee_code ?? "",
								disabled: true,
								className: "h-11 bg-accent/40 border-accent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "Email Address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: emp?.email ?? "",
								disabled: true,
								className: "h-11 bg-accent/40 border-accent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "Mobile Number",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "tel",
								inputMode: "tel",
								placeholder: "Enter mobile number",
								value: form.mobile,
								onChange: (e) => setForm({
									...form,
									mobile: e.target.value.replace(/[^0-9+ -]/g, "")
								}),
								className: "h-11 bg-accent/40 border-accent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wide",
									children: "Gender"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2 sm:gap-3",
								children: [
									"male",
									"female",
									"other"
								].map((g) => {
									const active = form.gender === g;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setForm({
											...form,
											gender: g
										}),
										className: cn("flex items-center justify-center gap-2 rounded-lg border h-11 px-2 sm:px-3 text-sm font-medium capitalize transition-all", active ? "border-primary bg-primary/5 ring-1 ring-primary text-primary" : "border-accent bg-accent/40 text-foreground hover:border-primary/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("grid place-items-center w-4 h-4 rounded-full border-2 shrink-0", active ? "border-primary" : "border-muted-foreground/40"),
											children: active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-primary" })
										}), g]
									}, g);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "State / Location",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.location_id,
								disabled: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 bg-accent/40 border-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "—" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: locations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: l.id,
									children: l.location
								}, l.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "Unit / Plant",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.plant_id,
								disabled: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 bg-accent/40 border-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "—" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.id,
									children: p.name
								}, p.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefField, {
							label: "Department",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.department_id,
								disabled: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 bg-accent/40 border-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "—" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: d.id,
									children: d.name
								}, d.id)) })]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					tone: "warning",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "w-4.5 h-4.5" }),
					index: "2",
					title: "Classification & Budget",
					subtitle: "Categorise your idea"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs font-semibold",
								children: ["Idea Category ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "Which category does your idea fall under?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.category_id,
								onValueChange: (v) => setForm({
									...form,
									category_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a category" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id)) })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs font-semibold",
								children: ["Implementation Budget ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "Estimated budget to execute this"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										id: "no_cost",
										label: "No Cost",
										hint: "Method changes only"
									},
									{
										id: "low_cost",
										label: "Low Cost",
										hint: "Minor expense"
									},
									{
										id: "investment",
										label: "Investment",
										hint: "Budget required"
									}
								].map((b) => {
									const active = form.budget_tier === b.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setForm({
											...form,
											budget_tier: b.id
										}),
										className: cn("text-left rounded-lg border p-2.5 transition-all", active ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" : "border-border bg-background hover:border-primary/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("w-3 h-3 rounded-full border-2 shrink-0", active ? "border-primary bg-primary" : "border-muted-foreground/40") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-semibold",
												children: b.label
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground mt-1 leading-tight",
											children: b.hint
										})]
									}, b.id);
								})
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					tone: "primary",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4.5 h-4.5" }),
					index: "3",
					title: "Idea Description",
					subtitle: "Tell us about your improvement"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-semibold",
									children: ["Suggestion Title / Subject ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: "A clear, concise headline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Short, descriptive title for your idea...",
									value: form.title,
									maxLength: 200,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									}),
									className: "h-11"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccentField, {
							tone: "destructive",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4" }),
							label: "Current Problem / Situation",
							hint: "Concern, bottleneck, defect, or safety hazard",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								placeholder: "Describe the current issue in detail...",
								value: form.problem,
								onChange: (e) => setForm({
									...form,
									problem: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccentField, {
							tone: "primary",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-4 h-4" }),
							label: "Your Proposed Solution",
							hint: "How would you solve or improve this?",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								placeholder: "Explain your idea to solve the problem...",
								value: form.suggested_method,
								onChange: (e) => setForm({
									...form,
									suggested_method: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccentField, {
							tone: "success",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }),
							label: "Expected Benefits / Impact",
							hint: "Cost savings, safety, cycle time, quality...",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								placeholder: "Positive impacts of your idea...",
								value: form.expected_benefits,
								onChange: (e) => setForm({
									...form,
									expected_benefits: e.target.value
								})
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					tone: "primary",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4.5 h-4.5" }),
					index: "4",
					title: "Attachments (Optional)",
					subtitle: "Images, PDF, Excel, video — up to 10 files"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-primary/50 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								multiple: true,
								className: "hidden",
								onChange: (e) => handleFiles(e.target.files)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-8 h-8 mx-auto text-muted-foreground mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: "Tap or drop files here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Up to 10 files"
							})
						]
					}), files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border rounded-md border border-border",
						children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm truncate",
										children: f.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [(f.size / 1024).toFixed(1), " KB"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "p-1 hover:bg-muted rounded shrink-0",
									onClick: () => setFiles(files.filter((_, j) => j !== i)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 text-muted-foreground" })
								})
							]
						}, i))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-0 left-0 right-0 lg:left-64 bg-background/95 backdrop-blur border-t border-border p-3 sm:p-4 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[1500px] mx-auto flex items-center justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							setForm({
								title: "",
								category_id: "",
								problem: "",
								current_method: "",
								suggested_method: "",
								expected_benefits: "",
								expected_saving: "",
								implementation_cost: "",
								priority: "medium",
								budget_tier: "",
								location_id: emp?.location_id ?? "",
								plant_id: emp?.plant_id ?? "",
								department_id: emp?.department_id ?? "",
								mobile: emp?.mobile ?? "",
								gender: ""
							});
							setFiles([]);
						},
						className: "h-11 px-4",
						children: "Reset Form"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: submitting,
						className: "h-11 px-6 bg-success hover:bg-success/90 text-success-foreground",
						children: submitting ? "Submitting…" : "Submit Suggestion"
					})]
				})
			})
		]
	})] });
}
function RefField({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs font-bold uppercase tracking-wide",
				children: label
			}), required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				children: "*"
			})]
		}), children]
	});
}
function SectionHeader({ tone, icon, index, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid place-items-center w-9 h-9 rounded-lg shrink-0", tone === "warning" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"),
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: ["Section ", index]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold truncate",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground truncate",
					children: subtitle
				})
			]
		})]
	});
}
var TONE_MAP = {
	destructive: {
		bar: "before:bg-destructive",
		text: "text-destructive",
		ring: "border-destructive/20",
		bg: "bg-destructive/5"
	},
	primary: {
		bar: "before:bg-primary",
		text: "text-primary",
		ring: "border-primary/20",
		bg: "bg-primary/5"
	},
	success: {
		bar: "before:bg-success",
		text: "text-success",
		ring: "border-success/20",
		bg: "bg-success/5"
	}
};
function AccentField({ tone, icon, label, hint, required, children }) {
	const t = TONE_MAP[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative rounded-lg border p-4 pl-5", "before:content-[''] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-r", t.ring, t.bg, t.bar),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-2 text-xs font-semibold", t.text),
				children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					label,
					" ",
					required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-destructive",
						children: "*"
					})
				] })]
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground mt-0.5",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-1",
				children
			})
		]
	});
}
var $$splitComponentImporter$1 = () => import("./employee.profile-CdTYnjt4.mjs");
var Route$1 = createFileRoute("/employee/profile")({
	beforeLoad: () => {
		throw redirect({
			to: "/employee",
			search: { section: "profile" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function ProfilePage() {
	const { data: s } = useSession();
	const e = s?.employee;
	const t = useT();
	const { lang, setLang } = useLang();
	const genderLabel = e?.gender ? t(`gender_${e.gender}`) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmployeeShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: t("profile_title"),
		description: t("profile_desc")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-6 grid md:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_emp_id"),
					value: e?.employee_code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_name"),
					value: e?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_email"),
					value: e?.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_mobile"),
					value: e?.mobile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_designation"),
					value: e?.designation
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: t("profile_gender"),
					value: genderLabel
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: t("profile_language")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: t("profile_language_desc")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: lang === "en" ? "default" : "outline",
						onClick: () => setLang("en"),
						children: "English"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: lang === "hi" ? "default" : "outline",
						onClick: () => setLang("hi"),
						children: "हिन्दी (Hindi)"
					})]
				})
			]
		})]
	})] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 text-sm",
		children: value ?? "—"
	})] });
}
var $$splitComponentImporter = () => import("./employee.my-DVgTmKYB.mjs");
var Route = createFileRoute("/employee/my")({
	beforeLoad: () => {
		throw redirect({
			to: "/employee",
			search: { section: "my" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
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
//#endregion
export { Route$2 as a, SubmitForm as c, Route$1 as i, TrackPage as l, ProfilePage as n, Route$3 as o, Route as r, Route$4 as s, MySuggestions as t };
