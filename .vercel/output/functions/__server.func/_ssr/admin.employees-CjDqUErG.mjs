import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { A as useQuery, E as useCanManage, j as useQueryClient, k as useMutation } from "./dist-DuWSCmUg.mjs";
import { M as PageHeader, _ as DialogFooter, g as DialogDescription, h as DialogContent, m as Dialog, u as AppShell, v as DialogHeader, y as DialogTitle } from "./app-shell-B-C1Zdxr.mjs";
import { r as Users, t as ADMIN_NAV } from "./admin-nav-B2pYfMco.mjs";
import { t as ExportMenu } from "./export-menu-DY-TMX0z.mjs";
import { t as useServerFn } from "./useServerFn-DnQ7jNw3.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-t6YZVJQv.mjs";
import { n as Undo2, t as Pencil } from "./undo-2-CGPn4rmQ.mjs";
import { i as Trash2, n as Plus, r as Power, t as ConfirmDialog } from "./confirm-dialog-vuGQ4J9m.mjs";
import { d as setEmployeeActive, f as updateEmployee, i as deleteEmployee, r as createEmployee, s as listEmployeesAdmin, t as PowerOff, u as restoreEmployee } from "./user-admin.functions-f2nqXFpV.mjs";
import { t as Search } from "./search-CEsBOJfy.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { t as Label } from "./label-Dn8LBOmq.mjs";
import { t as Badge } from "./badge-ZqdsFWIG.mjs";
import { t as Switch } from "./switch-B4SUYH3E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.employees-CjDqUErG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GENDER_LABEL = {
	male: "Male",
	female: "Female",
	other: "Other",
	prefer_not_to_say: "Prefer not to say"
};
var EMPTY = {
	name: "",
	email: "",
	employee_code: "",
	designation: "",
	mobile: "",
	gender: "",
	location_id: "",
	plant_id: "",
	department_id: "",
	active: true
};
function EmployeesPage() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const listFn = useServerFn(listEmployeesAdmin);
	const createFn = useServerFn(createEmployee);
	const updateFn = useServerFn(updateEmployee);
	const deleteFn = useServerFn(deleteEmployee);
	const restoreFn = useServerFn(restoreEmployee);
	const toggleFn = useServerFn(setEmployeeActive);
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["admin-employees", showDeleted],
		queryFn: () => listFn({ data: { showDeleted } })
	});
	const { data: locations = [] } = useQuery({
		queryKey: ["loc-all-emp"],
		queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).order("location")).data ?? []
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["plants-all-emp"],
		queryFn: async () => (await supabase.from("plants").select("id,name,location_id").is("deleted_at", null).order("name")).data ?? []
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["depts-all-emp"],
		queryFn: async () => (await supabase.from("departments").select("id,name,plant_id").is("deleted_at", null).order("name")).data ?? []
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const editing = !!form.id;
	const filtered = (0, import_react.useMemo)(() => {
		const list = rows;
		if (!q) return list;
		const s = q.toLowerCase();
		return list.filter((e) => `${e.name} ${e.email} ${e.employee_code} ${e.designation ?? ""}`.toLowerCase().includes(s));
	}, [rows, q]);
	const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-employees"] });
	const save = useMutation({
		mutationFn: async (v) => {
			const payload = {
				name: v.name,
				email: v.email,
				employee_code: v.employee_code,
				designation: v.designation || null,
				mobile: v.mobile || null,
				gender: v.gender || null,
				location_id: v.location_id || null,
				plant_id: v.plant_id || null,
				department_id: v.department_id || null,
				active: v.active
			};
			if (v.id) return updateFn({ data: {
				id: v.id,
				...payload
			} });
			return createFn({ data: payload });
		},
		onSuccess: () => {
			toast.success(editing ? "Employee updated." : "Employee added.");
			setOpen(false);
			setForm(EMPTY);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: (id) => deleteFn({ data: { id } }),
		onSuccess: (r) => {
			if (r?.softDeleted && r.reason) toast.warning(r.reason);
			else toast.success("Employee moved to Trash.");
			setPendingDelete(null);
			invalidate();
		},
		onError: (e) => {
			toast.error(e.message);
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: (id) => restoreFn({ data: { id } }),
		onSuccess: () => {
			toast.success("Employee restored.");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: (v) => toggleFn({ data: v }),
		onSuccess: () => {
			toast.success("Status updated.");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const exportRows = filtered.map((e) => ({
		employee_code: e.employee_code,
		name: e.name,
		email: e.email,
		designation: e.designation ?? "",
		mobile: e.mobile ?? "",
		gender: e.gender ? GENDER_LABEL[e.gender] : "",
		location: e.locations?.location ?? "",
		plant: e.plants?.name ?? "",
		department: e.departments?.name ?? "",
		active: e.active ? "Yes" : "No",
		linked_user: e.user_id ? "Yes" : "No"
	}));
	function openAdd() {
		setForm(EMPTY);
		setOpen(true);
	}
	function openEdit(e) {
		setForm({
			id: e.id,
			name: e.name,
			email: e.email,
			employee_code: e.employee_code,
			designation: e.designation ?? "",
			mobile: e.mobile ?? "",
			gender: e.gender ?? "",
			location_id: e.location_id ?? "",
			plant_id: e.plant_id ?? "",
			department_id: e.department_id ?? "",
			active: e.active
		});
		setOpen(true);
	}
	const filteredPlants = form.location_id ? plants.filter((p) => p.location_id === form.location_id) : plants;
	const filteredDepts = form.plant_id ? departments.filter((d) => d.plant_id === form.plant_id) : departments;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Employees",
				description: "Add, edit, deactivate, and remove employees. Employees created here can be linked to a sign-in user from Users & Roles.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
						data: exportRows,
						columns: [
							{
								key: "employee_code",
								header: "Employee ID"
							},
							{
								key: "name",
								header: "Name"
							},
							{
								key: "email",
								header: "Email"
							},
							{
								key: "designation",
								header: "Designation"
							},
							{
								key: "mobile",
								header: "Mobile"
							},
							{
								key: "location",
								header: "Location"
							},
							{
								key: "plant",
								header: "Plant"
							},
							{
								key: "department",
								header: "Department"
							},
							{
								key: "active",
								header: "Active"
							},
							{
								key: "linked_user",
								header: "Has user account"
							}
						],
						filename: "employees",
						title: "Employees"
					}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: openAdd,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-1.5" }), "Add employee"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by name, email, or employee ID",
							className: "pl-8",
							value: q,
							onChange: (e) => setQ(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: showDeleted,
							onCheckedChange: setShowDeleted
						}), "Show Trash"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground ml-auto",
						children: [
							filtered.length,
							" employee",
							filtered.length === 1 ? "" : "s"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 border-b border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Employee",
							"Contact",
							"Scope",
							"Status",
							"Actions"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "text-center py-12 text-sm text-muted-foreground",
							children: "Loading employees…"
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "text-center py-12 text-sm text-muted-foreground",
							children: "No employees found."
						}) }) : filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30 " + (e.deleted_at ? "opacity-50" : e.active ? "" : "opacity-60"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 align-top",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: e.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [e.employee_code, e.designation ? ` · ${e.designation}` : ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 align-top",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs",
										children: e.email
									}), e.mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: e.mobile
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 align-top text-xs",
									children: [
										e.locations?.location,
										e.plants?.name,
										e.departments?.name
									].filter(Boolean).join(" › ") || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground italic",
										children: "Unassigned"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 align-top",
									children: [e.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										className: "text-[10px]",
										children: "In Trash"
									}) : e.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: "Active"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										className: "text-[10px]",
										children: "Inactive"
									}), e.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[10px] ml-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3 h-3 mr-0.5" }), "User linked"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 align-top",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1",
										children: !canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "View only"
										}) : e.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => restore.mutate(e.id),
											title: "Restore",
											disabled: restore.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => openEdit(e),
												title: "Edit",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => toggle.mutate({
													employee_id: e.id,
													active: !e.active
												}),
												title: e.active ? "Deactivate" : "Reactivate",
												disabled: toggle.isPending,
												children: e.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerOff, { className: "w-3.5 h-3.5 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 text-success" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => setPendingDelete(e),
												title: "Move to Trash",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
											})
										] })
									})
								})
							]
						}, e.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!pendingDelete,
				onOpenChange: (o) => !o && setPendingDelete(null),
				title: "Move employee to Trash?",
				description: pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.employee_code}) will be deactivated and moved to Trash. You can restore them anytime from the Show Trash view. This action is audit-logged.` : "",
				confirmLabel: "Move to Trash",
				destructive: true,
				loading: del.isPending,
				onConfirm: () => {
					if (pendingDelete) del.mutate(pendingDelete.id);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: (v) => {
					if (!v) {
						setOpen(false);
						setForm(EMPTY);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit employee" : "Add employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Employee records store organizational identity. To grant sign-in access, invite the user in Users & Roles using the same email." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Employee ID *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.employee_code,
										onChange: (e) => setForm({
											...form,
											employee_code: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Full name *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.name,
										onChange: (e) => setForm({
											...form,
											name: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										value: form.email,
										onChange: (e) => setForm({
											...form,
											email: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Mobile",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.mobile,
										onChange: (e) => setForm({
											...form,
											mobile: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Designation",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.designation,
										onChange: (e) => setForm({
											...form,
											designation: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Gender",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.gender || void 0,
										onValueChange: (v) => setForm({
											...form,
											gender: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(GENDER_LABEL).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: g,
											children: GENDER_LABEL[g]
										}, g)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Location",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.location_id,
										onValueChange: (v) => setForm({
											...form,
											location_id: v,
											plant_id: "",
											department_id: ""
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: locations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: l.id,
											children: l.location
										}, l.id)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Plant",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.plant_id,
										onValueChange: (v) => setForm({
											...form,
											plant_id: v,
											department_id: ""
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filteredPlants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p.id,
											children: p.name
										}, p.id)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Department",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.department_id,
										onValueChange: (v) => setForm({
											...form,
											department_id: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filteredDepts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: d.id,
											children: d.name
										}, d.id)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: form.active,
										onCheckedChange: (v) => setForm({
											...form,
											active: v
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Active"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								setOpen(false);
								setForm(EMPTY);
							},
							disabled: save.isPending,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!form.name.trim() || !form.email.trim() || !form.employee_code.trim()) return toast.error("Name, email and employee ID are required.");
								save.mutate(form);
							},
							disabled: save.isPending,
							children: save.isPending ? "Saving…" : editing ? "Save changes" : "Add employee"
						})] })
					]
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs",
		children: label
	}), children] });
}
var SplitComponent = () => null;
//#endregion
export { EmployeesPage, SplitComponent as component };
