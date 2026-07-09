import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Power, O as PowerOff, S as Search, a as UserX, d as Trash2, g as Shield, k as Plus, o as UserPlus } from "../_libs/lucide-react.mjs";
import { C as PageHeader, d as DialogContent, f as DialogDescription, g as DialogTrigger, h as DialogTitle, l as AppShell, m as DialogHeader, p as DialogFooter, u as Dialog, w as ROLE_LABEL } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
import { t as ExportMenu } from "./export-menu-uQzy2Rlg.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { a as inviteUser, c as removeRole, i as deleteUser, s as listUsersWithRoles, t as addRole, u as setEmployeeActive } from "./user-admin.functions-DqY3QfsF.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-CfpNDPcW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-B5v4uJOj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"super_admin",
	"corporate_admin",
	"location_admin",
	"plant_admin",
	"department_admin",
	"pe_user",
	"dept_user",
	"mgmt_viewer",
	"employee"
];
function UsersPage() {
	const qc = useQueryClient();
	const listFn = useServerFn(listUsersWithRoles);
	const removeRoleFn = useServerFn(removeRole);
	const toggleActiveFn = useServerFn(setEmployeeActive);
	const deleteUserFn = useServerFn(deleteUser);
	const { data, isLoading } = useQuery({
		queryKey: ["users-and-roles"],
		queryFn: () => listFn()
	});
	const { data: locations = [] } = useQuery({
		queryKey: ["loc-all"],
		queryFn: async () => (await supabase.from("locations").select("id,location").order("location")).data ?? []
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["plants-all"],
		queryFn: async () => (await supabase.from("plants").select("id,name,location_id").order("name")).data ?? []
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["depts-all-u"],
		queryFn: async () => (await supabase.from("departments").select("id,name,plant_id").is("deleted_at", null).order("name")).data ?? []
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [inviteOpen, setInviteOpen] = (0, import_react.useState)(false);
	const [addRoleFor, setAddRoleFor] = (0, import_react.useState)(null);
	const [revokeRole, setRevokeRole] = (0, import_react.useState)(null);
	const [deleteUserFor, setDeleteUserFor] = (0, import_react.useState)(null);
	const users = data?.users ?? [];
	const roles = data?.roles ?? [];
	const employees = data?.employees ?? [];
	const rowsByUser = (0, import_react.useMemo)(() => {
		const empByUser = /* @__PURE__ */ new Map();
		for (const e of employees) if (e.user_id) empByUser.set(e.user_id, e);
		const rolesByUser = /* @__PURE__ */ new Map();
		for (const r of roles) {
			const arr = rolesByUser.get(r.user_id) ?? [];
			arr.push(r);
			rolesByUser.set(r.user_id, arr);
		}
		return users.map((u) => ({
			...u,
			employee: empByUser.get(u.user_id) ?? null,
			roles: rolesByUser.get(u.user_id) ?? []
		}));
	}, [
		users,
		employees,
		roles
	]);
	const filtered = q ? rowsByUser.filter((r) => {
		return `${r.email} ${r.employee?.name ?? ""} ${r.employee?.employee_code ?? ""}`.toLowerCase().includes(q.toLowerCase());
	}) : rowsByUser;
	const invalidate = () => qc.invalidateQueries({ queryKey: ["users-and-roles"] });
	const toggleActive = useMutation({
		mutationFn: (v) => toggleActiveFn({ data: v }),
		onSuccess: () => {
			toast.success("Employee status updated.");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const removeRoleM = useMutation({
		mutationFn: (id) => removeRoleFn({ data: { id } }),
		onSuccess: () => {
			toast.success("Role revoked", { description: revokeRole ? `${revokeRole.label} was removed successfully.` : "The role was removed successfully." });
			setRevokeRole(null);
			invalidate();
		},
		onError: (e) => {
			toast.error("Could not revoke role", { description: e?.message || "An unexpected error occurred. Please try again." });
		}
	});
	const deleteU = useMutation({
		mutationFn: (user_id) => deleteUserFn({ data: { user_id } }),
		onSuccess: () => {
			toast.success("User deleted.");
			setDeleteUserFor(null);
			invalidate();
		},
		onError: (e) => {
			console.error("[deleteUser] failed", e);
			const msg = e instanceof Error && e.message ? e.message : typeof e === "string" ? e : e?.message ?? "Failed to delete user.";
			toast.error(msg);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Users & Roles",
				description: "Add dashboard users and assign roles scoped to location, plant, or department. Users and employees are managed separately — adding a user here does not create an employee record.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {
						data: filtered.flatMap((u) => u.roles.length ? u.roles.map((r) => ({
							email: u.email,
							name: u.employee?.name ?? "",
							code: u.employee?.employee_code ?? "",
							role: ROLE_LABEL[r.role],
							location: r.locations?.location ?? "",
							plant: r.plants?.name ?? "",
							department: r.departments?.name ?? "",
							last_sign_in: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"
						})) : [{
							email: u.email,
							name: u.employee?.name ?? "",
							code: u.employee?.employee_code ?? "",
							role: "— none —",
							location: "",
							plant: "",
							department: "",
							last_sign_in: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"
						}]),
						columns: [
							{
								key: "email",
								header: "Email"
							},
							{
								key: "name",
								header: "Name"
							},
							{
								key: "code",
								header: "Employee ID"
							},
							{
								key: "role",
								header: "Role"
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
								key: "last_sign_in",
								header: "Last sign-in"
							}
						],
						filename: "users_and_roles",
						title: "Users & Roles",
						subtitle: "Enterprise user access matrix"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: inviteOpen,
						onOpenChange: setInviteOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4 mr-1.5" }), "Add user"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteDialog, {
							onClose: () => setInviteOpen(false),
							locations,
							plants,
							departments,
							onInvited: () => {
								invalidate();
								setInviteOpen(false);
							}
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by email, name or employee ID",
						className: "pl-8",
						value: q,
						onChange: (e) => setQ(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground ml-auto",
					children: [
						filtered.length,
						" user",
						filtered.length === 1 ? "" : "s"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 border-b border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"User",
							"Employee",
							"Roles & scope",
							"Last sign-in",
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
							children: "Loading users…"
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "text-center py-12 text-sm text-muted-foreground",
							children: "No users found."
						}) }) : filtered.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30 align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: u.email
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] font-mono text-muted-foreground mt-0.5",
										children: [u.user_id.slice(0, 8), "…"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: u.employee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: u.employee.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [u.employee.employee_code, u.employee.designation ? ` · ${u.employee.designation}` : ""]
										}),
										!u.employee.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "destructive",
											className: "mt-1 text-[10px]",
											children: "Inactive"
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground italic",
										children: "No employee record"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: u.roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground italic",
										children: "No roles assigned"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-1",
										children: u.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "secondary",
													className: "text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3 h-3 mr-1" }), ROLE_LABEL[r.role]]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground",
													children: [
														r.locations?.location,
														r.plants?.name,
														r.departments?.name
													].filter(Boolean).join(" › ") || "Global"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "text-muted-foreground hover:text-destructive",
													onClick: () => setRevokeRole({
														id: r.id,
														label: ROLE_LABEL[r.role]
													}),
													title: "Revoke role",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})
											]
										}, r.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap",
									children: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setAddRoleFor({
													user_id: u.user_id,
													email: u.email
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5 mr-1" }), "Role"]
											}),
											u.employee && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => toggleActive.mutate({
													employee_id: u.employee.id,
													active: !u.employee.active
												}),
												title: u.employee.active ? "Deactivate employee" : "Reactivate employee",
												children: u.employee.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerOff, { className: "w-3.5 h-3.5 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 text-success" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => setDeleteUserFor({
													user_id: u.user_id,
													email: u.email
												}),
												title: "Delete user permanently",
												className: "text-destructive hover:text-destructive hover:bg-destructive/10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "w-3.5 h-3.5" })
											})
										]
									})
								})
							]
						}, u.user_id))
					})]
				})
			}),
			addRoleFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddRoleDialog, {
				open: !!addRoleFor,
				onClose: () => setAddRoleFor(null),
				user: addRoleFor,
				locations,
				plants,
				departments,
				onAdded: () => {
					invalidate();
					setAddRoleFor(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!revokeRole,
				onOpenChange: (o) => !o && setRevokeRole(null),
				title: "Revoke role?",
				description: revokeRole ? `This will remove the "${revokeRole.label}" role. The user will immediately lose access granted by this role.` : "",
				confirmLabel: "Revoke",
				destructive: true,
				loading: removeRoleM.isPending,
				onConfirm: () => {
					if (revokeRole) removeRoleM.mutate(revokeRole.id);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!deleteUserFor,
				onOpenChange: (o) => !o && setDeleteUserFor(null),
				title: "Delete user permanently?",
				description: deleteUserFor ? `This will permanently delete "${deleteUserFor.email}" — including their auth account, employee record, and all assigned roles. This action cannot be undone.` : "",
				confirmLabel: "Delete user",
				destructive: true,
				loading: deleteU.isPending,
				onConfirm: () => {
					if (deleteUserFor) deleteU.mutate(deleteUserFor.user_id);
				}
			})
		]
	});
}
function ScopePicker({ role, locations, plants, departments, value, onChange }) {
	const needsLoc = role === "location_admin" || role === "plant_admin" || role === "department_admin" || role === "dept_user";
	const needsPlant = role === "plant_admin" || role === "department_admin" || role === "dept_user";
	const needsDept = role === "department_admin" || role === "dept_user";
	const filteredPlants = value.location_id ? plants.filter((p) => p.location_id === value.location_id) : plants;
	const filteredDepts = value.plant_id ? departments.filter((d) => d.plant_id === value.plant_id) : departments;
	if (!needsLoc && !needsPlant && !needsDept) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground bg-muted/50 rounded p-2",
		children: "This role is global (no location / plant / department scope required)."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			needsLoc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Location"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: value.location_id ?? "",
				onValueChange: (v) => onChange({
					location_id: v || null,
					plant_id: null,
					department_id: null
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "h-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select location" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: locations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: l.id,
					children: l.location
				}, l.id)) })]
			})] }),
			needsPlant && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Plant"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: value.plant_id ?? "",
				onValueChange: (v) => onChange({
					...value,
					plant_id: v || null,
					department_id: null
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "h-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select plant" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filteredPlants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: p.id,
					children: p.name
				}, p.id)) })]
			})] }),
			needsDept && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Department"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: value.department_id ?? "",
				onValueChange: (v) => onChange({
					...value,
					department_id: v || null
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "h-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select department" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filteredDepts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: d.id,
					children: d.name
				}, d.id)) })]
			})] })
		]
	});
}
function InviteDialog({ onClose, onInvited, locations, plants, departments }) {
	const inviteFn = useServerFn(inviteUser);
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("employee");
	const [scope, setScope] = (0, import_react.useState)({
		location_id: null,
		plant_id: null,
		department_id: null
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		if (!email) return toast.error("Email is required.");
		setBusy(true);
		try {
			await inviteFn({ data: {
				email,
				roles: [{
					role,
					location_id: scope.location_id,
					plant_id: scope.plant_id,
					department_id: scope.department_id
				}]
			} });
			toast.success("User added. They can sign in with OTP on this email.");
			onInvited();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add a user" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Creates a dashboard user with the chosen role and scope. The user can sign in from the login page by entering this email and the OTP sent to it. No invite email is sent, and no employee record is created — manage employees separately from the Employees page." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Email address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "name@company.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Initial role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: role,
						onValueChange: (v) => {
							setRole(v);
							setScope({
								location_id: null,
								plant_id: null,
								department_id: null
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: ROLE_LABEL[r]
						}, r)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopePicker, {
						role,
						locations,
						plants,
						departments,
						value: scope,
						onChange: setScope
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: onClose,
				disabled: busy,
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: busy,
				children: busy ? "Adding…" : "Add user"
			})] })
		]
	});
}
function AddRoleDialog({ open, onClose, user, onAdded, locations, plants, departments }) {
	const addRoleFn = useServerFn(addRole);
	const [role, setRole] = (0, import_react.useState)("dept_user");
	const [scope, setScope] = (0, import_react.useState)({
		location_id: null,
		plant_id: null,
		department_id: null
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		setBusy(true);
		try {
			await addRoleFn({ data: {
				user_id: user.user_id,
				role,
				location_id: scope.location_id,
				plant_id: scope.plant_id,
				department_id: scope.department_id
			} });
			toast.success("Role assigned.");
			onAdded();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Assign role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: user.email })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: role,
						onValueChange: (v) => {
							setRole(v);
							setScope({
								location_id: null,
								plant_id: null,
								department_id: null
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: ROLE_LABEL[r]
						}, r)) })]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopePicker, {
						role,
						locations,
						plants,
						departments,
						value: scope,
						onChange: setScope
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					disabled: busy,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: busy,
					children: busy ? "Saving…" : "Assign role"
				})] })
			]
		})
	});
}
var SplitComponent = () => null;
//#endregion
export { UsersPage, SplitComponent as component };
