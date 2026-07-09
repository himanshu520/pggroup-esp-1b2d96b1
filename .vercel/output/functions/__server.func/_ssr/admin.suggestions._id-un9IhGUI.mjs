import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { i as redirect } from "./redirect-SIDaGvS3.mjs";
import { a as cn, l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BEab6JLj.mjs";
import { A as useQuery, E as useCanManage, M as useSession, j as useQueryClient, k as useMutation, t as Bell } from "./dist-BCwtjUtj.mjs";
import { A as PRIORITY_LABEL, F as ROLE_LABEL, M as PageHeader, O as Link, U as X, V as StatCard, _ as DialogFooter, a as AlertDialogDescription, b as DialogTrigger, c as AlertDialogTitle, f as Check, g as DialogDescription, h as DialogContent, i as AlertDialogContent, k as LoaderCircle, m as Dialog, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as AppShell, v as DialogHeader, y as DialogTitle, z as STATUS_LABEL } from "./app-shell-uI3AfMIW.mjs";
import { n as Building2, r as Users, t as ADMIN_NAV } from "./admin-nav-ipU9T7Tj.mjs";
import { t as FileText } from "./file-text-Bm93_xKY.mjs";
import { t as ExportMenu } from "./export-menu-D58AzYSR.mjs";
import { _ as YAxis, d as Legend, f as Pie, g as XAxis, h as Tooltip, i as Cell, m as ResponsiveContainer, n as BarChart, p as PieChart, r as CartesianGrid, t as Bar } from "./PieChart-Eqb2yVAj.mjs";
import { t as useServerFn } from "./useServerFn-DnQ7jNw3.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C6CLyVyr.mjs";
import { n as Undo2, t as Pencil } from "./undo-2-CGPn4rmQ.mjs";
import { i as Trash2, n as Plus, r as Power, t as ConfirmDialog } from "./confirm-dialog-B1SmO3ny.mjs";
import { a as deleteUser, c as listUsersWithRoles, d as setEmployeeActive, f as updateEmployee, i as deleteEmployee, l as removeRole, n as addRole, o as inviteUser, r as createEmployee, s as listEmployeesAdmin, t as PowerOff, u as restoreEmployee } from "./user-admin.functions-B-ljf1OG.mjs";
import { t as Search } from "./search-CEsBOJfy.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { t as Label } from "./label-BTwUWmq0.mjs";
import { t as Badge } from "./badge-ZqdsFWIG.mjs";
import { t as Switch } from "./switch-DKEb2IYG.mjs";
import { r as lazyRouteComponent, t as createFileRoute } from "./lazyRouteComponent-BfQsN5oL.mjs";
import { a as TableBody, c as TableHeader, i as Table, l as TableRow, n as Lock, o as TableCell, r as ShieldCheck, s as TableHead, t as Activity } from "./table-CdZDdplB.mjs";
import { a as TabsContent, i as Tabs, n as ArrowRightLeft, o as TabsList, r as ArrowUp, s as TabsTrigger, t as ArrowDown } from "./tabs-hTzytgJN.mjs";
import { a as ThumbsUp, i as ThumbsDown, n as History, r as Send, t as CirclePlay } from "./thumbs-up-CZuONeO_.mjs";
import { t as ExternalLink } from "./external-link-tE10wuoN.mjs";
import { t as KeyRound } from "./key-round-ZhtWgGPi.mjs";
import { t as Mail } from "./mail-ZNisf-aq.mjs";
import { a as deptSubmitEvidence, c as peVerify, i as deptStartImplementation, n as Upload, r as deptDecide, s as peTransferSuggestion, t as Paperclip } from "./workflow.functions-JMzjZxue.mjs";
import { n as Save, r as SlidersVertical, t as RotateCcw } from "./sliders-vertical-B-7QDMFm.mjs";
import { n as UserPlus, r as UserX, t as Shield } from "./user-x-vUOdvu9T.mjs";
import { t as TriangleAlert } from "./triangle-alert-DmLBobpN.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-BVCVIuvZ.mjs";
import { t as Textarea } from "./textarea-B3s4Ny5G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.suggestions._id-un9IhGUI.js
var $$splitComponentImporter$13 = () => import("./admin.index-BnIH6ygz.mjs");
var SECTION_TITLES = {
	overview: "Overview Analytics — ESP Admin",
	suggestions: "Suggestions — ESP Admin",
	suggestion: "Suggestion — ESP Admin",
	workflow: "Workflow Queue — ESP Admin",
	departments: "Department Performance — ESP",
	plants: "Plant Performance — ESP",
	locations: "Location Performance — ESP",
	analytics: "Analytics — ESP",
	masters: "Masters — ESP",
	employees: "Employees — ESP",
	users: "Users & Roles — ESP",
	audit: "Audit Logs — ESP",
	security: "Security — ESP Admin",
	settings: "Settings — ESP Admin"
};
var Route$13 = createFileRoute("/admin/")({
	validateSearch: (s) => ({
		section: typeof s.section === "string" ? s.section : void 0,
		id: typeof s.id === "string" ? s.id : void 0
	}),
	head: ({ match }) => {
		return { meta: [{ title: SECTION_TITLES[match.search?.section ?? "overview"] ?? SECTION_TITLES.overview }] };
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter$12 = () => import("./admin.workflow-DI-s_DJR.mjs");
var QUEUES = [
	{
		key: "pe_in",
		label: "PE Inbox",
		statuses: ["pe_review", "submitted"],
		forPE: true
	},
	{
		key: "dept",
		label: "Department Review",
		statuses: ["dept_review", "transferred"]
	},
	{
		key: "impl",
		label: "Implementation",
		statuses: [
			"approved",
			"implementation",
			"evidence_pending"
		]
	},
	{
		key: "pe_verify",
		label: "PE Verification",
		statuses: ["pe_verification", "evidence_submitted"],
		forPE: true
	},
	{
		key: "fake",
		label: "Fake Closure — Reopen",
		statuses: ["fake_closure", "reopened"]
	}
];
var Route$12 = createFileRoute("/admin/workflow")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "workflow" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
function WorkflowPage() {
	const { data: session } = useSession();
	const { data = [] } = useQuery({
		queryKey: ["workflow-queue"],
		queryFn: async () => (await supabase.from("suggestions").select("*, employees(name), departments!suggestions_department_id_fkey(name)").order("created_at", { ascending: false })).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Workflow Queue",
			description: "Everything waiting on someone. PE queues show only for PE / Super / Corporate roles."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: QUEUES.filter((q) => !q.forPE || session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin").map((q) => {
				const items = data.filter((s) => q.statuses.includes(s.status));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 border-b border-border flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: q.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [items.length, " pending"]
						})]
					}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-xs text-muted-foreground",
						children: "Queue is clear."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: items.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 font-mono text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin",
											search: {
												section: "suggestion",
												id: s.id
											},
											className: "text-primary hover:underline",
											children: s.code
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 max-w-md truncate",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 text-xs",
										children: s.departments?.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: s.priority })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 text-xs text-muted-foreground text-right",
										children: new Date(s.created_at).toLocaleDateString()
									})
								]
							}, s.id))
						})
					})]
				}, q.key);
			})
		})]
	});
}
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var $$splitComponentImporter$11 = () => import("./admin.users-CLqfe32g.mjs");
var Route$11 = createFileRoute("/admin/users")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "users" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
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
var $$splitComponentImporter$10 = () => import("./admin.settings-DgTl5KUR.mjs");
var Route$10 = createFileRoute("/admin/settings")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "settings" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var DEFAULTS = {
	portalName: "PG Suggestion Portal",
	organization: "PG Group",
	supportEmail: "support@pggroup.com",
	welcomeMessage: "Share your ideas to improve safety, quality, and productivity across every plant.",
	defaultPriority: "medium",
	autoAssignPE: true,
	requireEvidence: true,
	reviewSlaDays: 5,
	implementationSlaDays: 30,
	notifyOnSubmit: true,
	notifyOnApproval: true,
	notifyOnImplementation: true,
	digestFrequency: "weekly"
};
var KEY = "esp.settings.v1";
function SettingsPage() {
	const [s, setS] = (0, import_react.useState)(DEFAULTS);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setS({
				...DEFAULTS,
				...JSON.parse(raw)
			});
		} catch {}
	}, []);
	function update(k, v) {
		setS((prev) => ({
			...prev,
			[k]: v
		}));
		setDirty(true);
	}
	function save() {
		localStorage.setItem(KEY, JSON.stringify(s));
		setDirty(false);
		toast.success("Settings saved");
	}
	function reset() {
		setS(DEFAULTS);
		setDirty(true);
		toast.info("Restored defaults — remember to save");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: "Global configuration for portal identity, workflow, and notifications.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" }), " Reset"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: !dirty,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " Save Changes"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
					icon: Building2,
					title: "Portal Identity",
					desc: "How the portal introduces itself to employees.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Portal name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.portalName,
								onChange: (e) => update("portalName", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Organization",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.organization,
								onChange: (e) => update("organization", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Support email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: s.supportEmail,
								onChange: (e) => update("supportEmail", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Welcome message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: s.welcomeMessage,
								onChange: (e) => update("welcomeMessage", e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
					icon: SlidersVertical,
					title: "Workflow Defaults",
					desc: "Default rules applied when a suggestion is submitted.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Default priority",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: s.defaultPriority,
								onValueChange: (v) => update("defaultPriority", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "low",
										children: "Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "medium",
										children: "Medium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "high",
										children: "High"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "critical",
										children: "Critical"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Review SLA (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 90,
								value: s.reviewSlaDays,
								onChange: (e) => update("reviewSlaDays", Number(e.target.value) || 1)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Implementation SLA (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 365,
								value: s.implementationSlaDays,
								onChange: (e) => update("implementationSlaDays", Number(e.target.value) || 1)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Auto-assign to PE for initial review",
							checked: s.autoAssignPE,
							onChange: (v) => update("autoAssignPE", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Require evidence before closure",
							checked: s.requireEvidence,
							onChange: (v) => update("requireEvidence", v)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
					icon: Bell,
					title: "Notifications",
					desc: "Which lifecycle events send an in-app notification.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notify on submission",
							checked: s.notifyOnSubmit,
							onChange: (v) => update("notifyOnSubmit", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notify on approval",
							checked: s.notifyOnApproval,
							onChange: (v) => update("notifyOnApproval", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notify on implementation",
							checked: s.notifyOnImplementation,
							onChange: (v) => update("notifyOnImplementation", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Admin digest frequency",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: s.digestFrequency,
								onValueChange: (v) => update("digestFrequency", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "off",
										children: "Off"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "daily",
										children: "Daily"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "weekly",
										children: "Weekly"
									})
								] })]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
					icon: Mail,
					title: "Email Delivery",
					desc: "Read-only summary of the transactional email channel.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Provider",
							v: "SMTP (Office 365)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "From address",
							v: s.supportEmail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "OTP delivery",
							v: "Enabled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Retry policy",
							v: "3 attempts, exponential backoff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground",
							children: "SMTP credentials are managed as encrypted backend secrets. Contact a super admin to rotate."
						})
					]
				})
			]
		})]
	});
}
function Section$1({ icon: Icon, title, desc, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center w-9 h-9 rounded-md bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-base font-bold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: desc
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children
		})]
	});
}
function Field$1({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
			children: label
		}), children]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: v
		})]
	});
}
var $$splitComponentImporter$9 = () => import("./admin.security-DCfcNDNL.mjs");
var Route$9 = createFileRoute("/admin/security")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "security" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var POLICY = [
	{
		icon: KeyRound,
		label: "Sign-in method",
		value: "Email + 8-digit OTP",
		tone: "text-info"
	},
	{
		icon: Lock,
		label: "OTP validity",
		value: "10 minutes",
		tone: "text-success"
	},
	{
		icon: ShieldCheck,
		label: "Session timeout",
		value: "24 hours (auto refresh)",
		tone: "text-success"
	},
	{
		icon: Users,
		label: "Anonymous sign-ups",
		value: "Disabled",
		tone: "text-success"
	},
	{
		icon: TriangleAlert,
		label: "Password reuse policy",
		value: "N/A (passwordless)",
		tone: "text-muted-foreground"
	},
	{
		icon: Activity,
		label: "Audit logging",
		value: "Enabled — all admin actions",
		tone: "text-success"
	}
];
var FILE_UPLOAD = [
	{
		k: "Max file size",
		v: "10 MB per file"
	},
	{
		k: "Allowed types",
		v: "PDF, DOCX, XLSX, PNG, JPG"
	},
	{
		k: "Storage bucket",
		v: "suggestion-files (private)"
	},
	{
		k: "Access control",
		v: "Row-Level Security enforced"
	}
];
function SecurityPage() {
	const { data: roles = [] } = useQuery({
		queryKey: ["sec-roles"],
		queryFn: async () => (await supabase.from("user_roles").select("role,user_id")).data ?? []
	});
	const { data: audits = [] } = useQuery({
		queryKey: ["sec-audits"],
		queryFn: async () => (await supabase.from("audit_logs").select("id,action,entity_type,entity_id,actor_id,created_at,meta").order("created_at", { ascending: false }).limit(15)).data ?? []
	});
	const stats = (0, import_react.useMemo)(() => {
		const admins = new Set(roles.filter((r) => [
			"super_admin",
			"corporate_admin",
			"location_admin",
			"plant_admin",
			"department_admin"
		].includes(r.role)).map((r) => r.user_id));
		const totalUsers = new Set(roles.map((r) => r.user_id)).size;
		const superAdmins = roles.filter((r) => r.role === "super_admin").length;
		return {
			admins: admins.size,
			totalUsers,
			superAdmins,
			roleAssignments: roles.length
		};
	}, [roles]);
	const roleBreakdown = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of roles) map.set(r.role, (map.get(r.role) ?? 0) + 1);
		return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
	}, [roles]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Security",
				description: "Session policy, authentication rules, and audit visibility."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Users",
						value: stats.totalUsers,
						tone: "info",
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Admin Users",
						value: stats.admins,
						tone: "accent",
						icon: ShieldCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Super Admins",
						value: stats.superAdmins,
						tone: "warning",
						icon: KeyRound
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Role Assignments",
						value: stats.roleAssignments,
						tone: "success",
						icon: Activity
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-4 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold mb-1",
							children: "Authentication Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mb-4",
							children: "Current sign-in and session configuration."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: POLICY.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 py-2 border-b border-border/50 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid place-items-center w-8 h-8 rounded-md bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: `w-4 h-4 ${p.tone}` })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 min-w-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: p.label
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `text-xs font-semibold ${p.tone}`,
										children: p.value
									})
								]
							}, p.label))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold mb-1",
							children: "File Upload Rules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mb-4",
							children: "Attachment constraints applied to all suggestions."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border/50",
							children: FILE_UPLOAD.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: r.k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: r.v
								})]
							}, r.k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-md bg-info/10 border border-info/30 p-3 text-xs text-info",
							children: "Row-Level Security policies ensure users can only access files linked to suggestions they are authorized to view."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-bold mb-4",
						children: "Role Distribution"
					}), roleBreakdown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground py-8 text-center",
						children: "No roles assigned yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: roleBreakdown.map(([role, count]) => {
							const pct = count / roleBreakdown[0][1] * 100;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: ROLE_LABEL[role]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: count
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary",
									style: { width: `${pct}%` }
								})
							})] }, role);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold mb-1",
							children: "Recent Audit Activity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mb-4",
							children: "Latest 15 system-tracked events."
						}),
						audits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground py-8 text-center",
							children: "No audit events recorded yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[380px] overflow-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Action" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Entity" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "When"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: audits.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "font-mono text-[10px]",
									children: a.action
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: a.entity_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right text-xs text-muted-foreground",
									children: new Date(a.created_at).toLocaleString()
								})
							] }, a.id)) })] })
						})
					]
				})]
			})
		]
	});
}
var $$splitComponentImporter$8 = () => import("./admin.plants-C1MgzmRw.mjs");
var Route$8 = createFileRoute("/admin/plants")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "plants" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
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
var $$splitComponentImporter$7 = () => import("./admin.masters-CJ5BjlO0.mjs");
var Route$7 = createFileRoute("/admin/masters")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "masters" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
async function audit(action, entity_type, entity_id, meta = {}) {
	const { data } = await supabase.auth.getUser();
	if (!data.user) return;
	await supabase.from("audit_logs").insert({
		actor_id: data.user.id,
		action,
		entity_type,
		entity_id,
		meta
	});
}
function friendlyError(e) {
	if (e?.code === "23503") return "This record is still referenced elsewhere. Deactivate it or reassign its children first.";
	return e?.message ?? "Operation failed";
}
function MastersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Master Data",
			description: "Manage hierarchy safely — deactivate or soft-delete records instead of breaking references. All changes are logged."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "locations",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "locations",
						children: "Locations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "plants",
						children: "Plants"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "departments",
						children: "Departments"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "categories",
						children: "Categories"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "locations",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "plants",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "departments",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "categories",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesTab, {})
				})
			]
		})]
	});
}
function CrudTable({ rows, cols, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-card overflow-hidden mt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/50 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [cols.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: c.label
				}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Actions"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: cols.length + 1,
					className: "text-center py-8 text-sm text-muted-foreground",
					children: "No records."
				}) }) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-muted/30 " + (r.deleted_at ? "opacity-50" : r.active === false ? "opacity-70" : ""),
					children: [cols.map((c) => {
						const v = c.render ? c.render(r) : r[c.key];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-sm",
							children: typeof v === "boolean" ? v ? "Yes" : "No" : v ?? "—"
						}, c.key);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2 text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end gap-1",
							children: actions(r)
						})
					})]
				}, r.id))
			})]
		})
	});
}
function TabHeader({ title, onAdd, canAdd = true, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [right, canAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Add"]
			})]
		})]
	});
}
function LocationsTab() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey: ["m-locations", showDeleted],
		queryFn: async () => {
			let q = supabase.from("locations").select("*").order("location");
			if (!showDeleted) q = q.is("deleted_at", null);
			return (await q).data ?? [];
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		state: "",
		location: "",
		active: true
	});
	const [depCheck, setDepCheck] = (0, import_react.useState)(null);
	const [reassign, setReassign] = (0, import_react.useState)(null);
	function openNew() {
		setEditing(null);
		setForm({
			state: "",
			location: "",
			active: true
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			state: r.state,
			location: r.location,
			active: r.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				state: form.state.trim(),
				location: form.location.trim(),
				active: form.active
			};
			if (!payload.state || !payload.location) throw new Error("State and location are required.");
			if (editing) {
				const { error } = await supabase.from("locations").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("location.update", "locations", editing.id, {
					before: {
						state: editing.state,
						location: editing.location,
						active: editing.active
					},
					after: payload
				});
			} else {
				const { data, error } = await supabase.from("locations").insert(payload).select("id").single();
				if (error) throw error;
				await audit("location.create", "locations", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Location updated" : "Location added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-locations"] });
			qc.invalidateQueries({ queryKey: ["locs"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("locations").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "location.activate" : "location.deactivate", "locations", r.id, {
				location: r.location,
				state: r.state
			});
		},
		onSuccess: () => {
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["m-locations"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const softDelete = useMutation({
		mutationFn: async (r) => {
			const { data: deps } = await supabase.from("plants").select("id,name,code").eq("location_id", r.id).is("deleted_at", null);
			if (deps && deps.length > 0) {
				setDepCheck({
					loc: r,
					plants: deps
				});
				throw new Error("__blocked__");
			}
			const { error } = await supabase.from("locations").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				active: false
			}).eq("id", r.id);
			if (error) throw error;
			await audit("location.soft_delete", "locations", r.id, {
				location: r.location,
				state: r.state
			});
		},
		onSuccess: () => {
			toast.success("Location moved to Trash");
			setPendingDelete(null);
			qc.invalidateQueries({ queryKey: ["m-locations"] });
		},
		onError: (e) => {
			if (e?.message !== "__blocked__") toast.error(friendlyError(e));
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("locations").update({
				deleted_at: null,
				active: true
			}).eq("id", r.id);
			if (error) throw error;
			await audit("location.restore", "locations", r.id, {
				location: r.location,
				state: r.state
			});
		},
		onSuccess: () => {
			toast.success("Location restored");
			qc.invalidateQueries({ queryKey: ["m-locations"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Locations",
			onAdd: openNew,
			canAdd: canManage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showDeleted,
					onCheckedChange: setShowDeleted
				}), "Show Trash"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "state",
					label: "State"
				},
				{
					key: "location",
					label: "Location"
				},
				{
					key: "active",
					label: "Active"
				},
				{
					key: "status",
					label: "Status",
					render: (r) => r.deleted_at ? "In Trash" : r.active ? "Active" : "Inactive"
				}
			],
			actions: (r) => !canManage ? null : r.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => restore.mutate(r),
				title: "Restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => toggleActive.mutate(r),
					title: r.active ? "Deactivate" : "Activate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => openEdit(r),
					title: "Edit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete(r),
					title: "Move to Trash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!pendingDelete,
			onOpenChange: (o) => !o && setPendingDelete(null),
			title: "Move location to Trash?",
			description: pendingDelete ? `"${pendingDelete.location}" will be moved to Trash. You can restore it from the Show Trash view. Plants under this location must be reassigned first.` : "",
			confirmLabel: "Move to Trash",
			destructive: true,
			loading: softDelete.isPending,
			onConfirm: () => {
				if (pendingDelete) softDelete.mutate(pendingDelete);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Location" : "New Location" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.state,
							onChange: (e) => setForm((f) => ({
								...f,
								state: e.target.value
							})),
							placeholder: "MH"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.location,
							onChange: (e) => setForm((f) => ({
								...f,
								location: e.target.value
							})),
							placeholder: "Mumbai"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!depCheck,
			onOpenChange: (o) => !o && setDepCheck(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-warning" }),
						" Cannot delete “",
						depCheck?.loc.location,
						"”"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"This location is used by ",
					depCheck?.plants.length,
					" active plant",
					depCheck?.plants.length === 1 ? "" : "s",
					". Reassign them to another location, or deactivate this one instead of deleting."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: depCheck?.plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: p.code
							})]
						}, p.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							if (depCheck) {
								toggleActive.mutate(depCheck.loc);
								setDepCheck(null);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-4 h-4" }), " Deactivate instead"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
						onClick: () => {
							if (depCheck) {
								setReassign({
									loc: depCheck.loc,
									plants: depCheck.plants,
									targetId: ""
								});
								setDepCheck(null);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-4 h-4" }), " Reassign plants…"]
					})
				] })
			] })
		}),
		reassign && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReassignPlantsDialog, {
			state: reassign,
			onClose: () => setReassign(null),
			onDone: () => {
				setReassign(null);
				qc.invalidateQueries({ queryKey: ["m-locations"] });
				qc.invalidateQueries({ queryKey: ["m-plants"] });
			}
		})
	] });
}
function ReassignPlantsDialog({ state, onClose, onDone }) {
	const [targetId, setTargetId] = (0, import_react.useState)(state.targetId);
	const [alsoDelete, setAlsoDelete] = (0, import_react.useState)(true);
	const { data: options = [] } = useQuery({
		queryKey: ["reassign-loc-options", state.loc.id],
		queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).eq("active", true).neq("id", state.loc.id).order("location")).data ?? []
	});
	const run = useMutation({
		mutationFn: async () => {
			if (!targetId) throw new Error("Choose a target location.");
			const plantIds = state.plants.map((p) => p.id);
			const { error } = await supabase.from("plants").update({ location_id: targetId }).in("id", plantIds);
			if (error) throw error;
			await audit("plant.reassign", "locations", state.loc.id, {
				from: state.loc.id,
				to: targetId,
				plant_ids: plantIds
			});
			if (alsoDelete) {
				const { error: e2 } = await supabase.from("locations").update({
					deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
					active: false
				}).eq("id", state.loc.id);
				if (e2) throw e2;
				await audit("location.soft_delete", "locations", state.loc.id, {
					location: state.loc.location,
					after_reassign: true
				});
			}
		},
		onSuccess: () => {
			toast.success(alsoDelete ? "Plants reassigned and location deleted" : "Plants reassigned");
			onDone();
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"Reassign plants from “",
				state.loc.location,
				"”"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Move ",
				state.plants.length,
				" plant",
				state.plants.length === 1 ? "" : "s",
				" to another location."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: targetId,
						onValueChange: setTargetId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select destination" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2 py-1.5 text-xs text-muted-foreground",
							children: "No other active locations. Create one first."
						}) : options.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: l.id,
							children: l.location
						}, l.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-muted/30 p-2 text-xs max-h-32 overflow-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold mb-1",
							children: "Plants to move"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: state.plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"• ",
							p.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"(",
									p.code,
									")"
								]
							})
						] }, p.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Also delete original location after reassign" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: alsoDelete,
							onCheckedChange: setAlsoDelete
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => run.mutate(),
				disabled: run.isPending || !targetId,
				children: run.isPending ? "Working…" : "Reassign"
			})] })
		] })
	});
}
function PlantsTab() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey: ["m-plants", showDeleted],
		queryFn: async () => {
			let q = supabase.from("plants").select("*, locations(location)").order("name");
			if (!showDeleted) q = q.is("deleted_at", null);
			return (await q).data ?? [];
		}
	});
	const { data: locations = [] } = useQuery({
		queryKey: ["m-locations-active"],
		queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).order("location")).data ?? []
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		code: "",
		name: "",
		location_id: "",
		active: true
	});
	const [depCheck, setDepCheck] = (0, import_react.useState)(null);
	function openNew() {
		setEditing(null);
		setForm({
			code: "",
			name: "",
			location_id: "",
			active: true
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			code: r.code,
			name: r.name,
			location_id: r.location_id,
			active: r.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				code: form.code.trim(),
				name: form.name.trim(),
				location_id: form.location_id,
				active: form.active
			};
			if (!payload.code || !payload.name || !payload.location_id) throw new Error("All fields required.");
			if (editing) {
				const { error } = await supabase.from("plants").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("plant.update", "plants", editing.id, { after: payload });
			} else {
				const { data, error } = await supabase.from("plants").insert(payload).select("id").single();
				if (error) throw error;
				await audit("plant.create", "plants", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Plant updated" : "Plant added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-plants"] });
			qc.invalidateQueries({ queryKey: ["plants"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("plants").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "plant.activate" : "plant.deactivate", "plants", r.id, {
				name: r.name,
				code: r.code,
				location_id: r.location_id
			});
		},
		onSuccess: () => {
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["m-plants"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const softDelete = useMutation({
		mutationFn: async (r) => {
			const { data: deps } = await supabase.from("departments").select("id,name,code").eq("plant_id", r.id).eq("active", true);
			if (deps && deps.length > 0) {
				setDepCheck({
					plant: r,
					depts: deps
				});
				throw new Error("__blocked__");
			}
			const { error } = await supabase.from("plants").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				active: false
			}).eq("id", r.id);
			if (error) throw error;
			await audit("plant.soft_delete", "plants", r.id, {
				name: r.name,
				code: r.code,
				location_id: r.location_id
			});
		},
		onSuccess: () => {
			toast.success("Plant moved to Trash");
			setPendingDelete(null);
			qc.invalidateQueries({ queryKey: ["m-plants"] });
		},
		onError: (e) => {
			if (e?.message !== "__blocked__") toast.error(friendlyError(e));
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("plants").update({
				deleted_at: null,
				active: true
			}).eq("id", r.id);
			if (error) throw error;
			await audit("plant.restore", "plants", r.id, {
				name: r.name,
				code: r.code,
				location_id: r.location_id
			});
		},
		onSuccess: () => {
			toast.success("Plant restored");
			qc.invalidateQueries({ queryKey: ["m-plants"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Plants",
			onAdd: openNew,
			canAdd: canManage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showDeleted,
					onCheckedChange: setShowDeleted
				}), "Show Trash"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "code",
					label: "Code"
				},
				{
					key: "name",
					label: "Name"
				},
				{
					key: "location",
					label: "Location",
					render: (r) => r.locations?.location
				},
				{
					key: "status",
					label: "Status",
					render: (r) => r.deleted_at ? "In Trash" : r.active ? "Active" : "Inactive"
				}
			],
			actions: (r) => !canManage ? null : r.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => restore.mutate(r),
				title: "Restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => toggleActive.mutate(r),
					title: r.active ? "Deactivate" : "Activate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => openEdit(r),
					title: "Edit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete(r),
					title: "Move to Trash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!pendingDelete,
			onOpenChange: (o) => !o && setPendingDelete(null),
			title: "Move plant to Trash?",
			description: pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.code}) will be moved to Trash. Departments under this plant must be deactivated first.` : "",
			confirmLabel: "Move to Trash",
			destructive: true,
			loading: softDelete.isPending,
			onConfirm: () => {
				if (pendingDelete) softDelete.mutate(pendingDelete);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Plant" : "New Plant" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.location_id,
							onValueChange: (v) => setForm((f) => ({
								...f,
								location_id: v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select location" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: locations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: l.id,
								children: l.location
							}, l.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.code,
							onChange: (e) => setForm((f) => ({
								...f,
								code: e.target.value
							})),
							placeholder: "PLT-01"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Plant A"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!depCheck,
			onOpenChange: (o) => !o && setDepCheck(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-warning" }),
						" Cannot delete “",
						depCheck?.plant.name,
						"”"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"This plant has ",
					depCheck?.depts.length,
					" active department",
					depCheck?.depts.length === 1 ? "" : "s",
					". Deactivate them (or this plant) before deleting."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: depCheck?.depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: d.code
							})]
						}, d.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
					onClick: () => {
						if (depCheck) {
							toggleActive.mutate(depCheck.plant);
							setDepCheck(null);
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-4 h-4" }), " Deactivate plant instead"]
				})] })
			] })
		})
	] });
}
function DepartmentsTab() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey: ["m-depts", showDeleted],
		queryFn: async () => {
			let q = supabase.from("departments").select("*, plants(name)").order("name");
			if (!showDeleted) q = q.is("deleted_at", null);
			return (await q).data ?? [];
		}
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["m-plants-lite"],
		queryFn: async () => (await supabase.from("plants").select("id,name").is("deleted_at", null).order("name")).data ?? []
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		code: "",
		name: "",
		plant_id: "",
		is_pe: false,
		active: true
	});
	function openNew() {
		setEditing(null);
		setForm({
			code: "",
			name: "",
			plant_id: "",
			is_pe: false,
			active: true
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			code: r.code,
			name: r.name,
			plant_id: r.plant_id,
			is_pe: r.is_pe,
			active: r.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				code: form.code.trim(),
				name: form.name.trim(),
				plant_id: form.plant_id,
				is_pe: form.is_pe,
				active: form.active
			};
			if (!payload.code || !payload.name || !payload.plant_id) throw new Error("All fields required.");
			if (editing) {
				const { error } = await supabase.from("departments").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("department.update", "departments", editing.id, { after: payload });
			} else {
				const { data, error } = await supabase.from("departments").insert(payload).select("id").single();
				if (error) throw error;
				await audit("department.create", "departments", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Department updated" : "Department added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-depts"] });
			qc.invalidateQueries({ queryKey: ["depts-all"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("departments").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "department.activate" : "department.deactivate", "departments", r.id, {
				name: r.name,
				code: r.code,
				plant_id: r.plant_id
			});
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["m-depts"] }),
		onError: (e) => toast.error(friendlyError(e))
	});
	const softDelete = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("departments").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				active: false
			}).eq("id", r.id);
			if (error) throw error;
			await audit("department.soft_delete", "departments", r.id, {
				name: r.name,
				code: r.code,
				plant_id: r.plant_id
			});
		},
		onSuccess: () => {
			toast.success("Department moved to Trash");
			setPendingDelete(null);
			qc.invalidateQueries({ queryKey: ["m-depts"] });
			qc.invalidateQueries({ queryKey: ["depts-all"] });
		},
		onError: (e) => {
			toast.error(friendlyError(e));
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("departments").update({
				deleted_at: null,
				active: true
			}).eq("id", r.id);
			if (error) throw error;
			await audit("department.restore", "departments", r.id, {
				name: r.name,
				code: r.code,
				plant_id: r.plant_id
			});
		},
		onSuccess: () => {
			toast.success("Department restored");
			qc.invalidateQueries({ queryKey: ["m-depts"] });
			qc.invalidateQueries({ queryKey: ["depts-all"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Departments",
			onAdd: openNew,
			canAdd: canManage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showDeleted,
					onCheckedChange: setShowDeleted
				}), "Show Trash"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "code",
					label: "Code"
				},
				{
					key: "name",
					label: "Name"
				},
				{
					key: "plant",
					label: "Plant",
					render: (r) => r.plants?.name
				},
				{
					key: "is_pe",
					label: "PE?"
				},
				{
					key: "status",
					label: "Status",
					render: (r) => r.deleted_at ? "In Trash" : r.active ? "Active" : "Inactive"
				}
			],
			actions: (r) => !canManage ? null : r.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => restore.mutate(r),
				title: "Restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => toggleActive.mutate(r),
					title: r.active ? "Deactivate" : "Activate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => openEdit(r),
					title: "Edit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete(r),
					title: "Move to Trash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!pendingDelete,
			onOpenChange: (o) => !o && setPendingDelete(null),
			title: "Move department to Trash?",
			description: pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.code}) will be moved to Trash. Linked suggestions remain intact and can be viewed by admins.` : "",
			confirmLabel: "Move to Trash",
			destructive: true,
			loading: softDelete.isPending,
			onConfirm: () => {
				if (pendingDelete) softDelete.mutate(pendingDelete);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Department" : "New Department" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.plant_id,
							onValueChange: (v) => setForm((f) => ({
								...f,
								plant_id: v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select plant" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.id,
								children: p.name
							}, p.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.code,
							onChange: (e) => setForm((f) => ({
								...f,
								code: e.target.value
							})),
							placeholder: "PROD"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Production"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PE Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.is_pe,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									is_pe: v
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		})
	] });
}
function CategoriesTab() {
	const qc = useQueryClient();
	const { data: rows = [] } = useQuery({
		queryKey: ["m-cats"],
		queryFn: async () => (await supabase.from("categories").select("*").order("sort_order").order("name")).data ?? []
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		active: true,
		sort_order: 0
	});
	function openNew() {
		setEditing(null);
		const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order ?? 0)) + 10 : 10;
		setForm({
			name: "",
			active: true,
			sort_order: nextOrder
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			name: r.name,
			active: r.active,
			sort_order: r.sort_order ?? 0
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				name: form.name.trim(),
				active: form.active,
				sort_order: Number(form.sort_order) || 0
			};
			if (!payload.name) throw new Error("Name is required.");
			if (editing) {
				const { error } = await supabase.from("categories").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("category.update", "categories", editing.id, { after: payload });
			} else {
				const { data, error } = await supabase.from("categories").insert(payload).select("id").single();
				if (error) throw error;
				await audit("category.create", "categories", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Category updated" : "Category added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-cats"] });
			qc.invalidateQueries({ queryKey: ["cats"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("categories").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "category.activate" : "category.deactivate", "categories", r.id, { name: r.name });
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["m-cats"] }),
		onError: (e) => toast.error(friendlyError(e))
	});
	const swapOrder = useMutation({
		mutationFn: async ({ a, b }) => {
			const ao = a.sort_order ?? 0;
			const bo = b.sort_order ?? 0;
			const { error: e1 } = await supabase.from("categories").update({ sort_order: bo }).eq("id", a.id);
			if (e1) throw e1;
			const { error: e2 } = await supabase.from("categories").update({ sort_order: ao }).eq("id", b.id);
			if (e2) throw e2;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["m-cats"] });
			qc.invalidateQueries({ queryKey: ["cats"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	function move(r, dir) {
		const idx = rows.findIndex((x) => x.id === r.id);
		const target = rows[idx + dir];
		if (!target) return;
		swapOrder.mutate({
			a: r,
			b: target
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Categories",
			onAdd: openNew
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "sort_order",
					label: "Order"
				},
				{
					key: "name",
					label: "Name"
				},
				{
					key: "active",
					label: "Active"
				}
			],
			actions: (r) => {
				const idx = rows.findIndex((x) => x.id === r.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: idx === 0 || swapOrder.isPending,
						onClick: () => move(r, -1),
						title: "Move up",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-3.5 h-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: idx === rows.length - 1 || swapOrder.isPending,
						onClick: () => move(r, 1),
						title: "Move down",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => toggleActive.mutate(r),
						title: r.active ? "Deactivate" : "Activate",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => openEdit(r),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
					})
				] });
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Category" : "New Category" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Safety"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display Order" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.sort_order,
								onChange: (e) => setForm((f) => ({
									...f,
									sort_order: Number(e.target.value)
								})),
								placeholder: "10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Lower numbers appear first."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		})
	] });
}
var $$splitComponentImporter$6 = () => import("./admin.locations-DAbldAe-.mjs");
var Route$6 = createFileRoute("/admin/locations")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "locations" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
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
var $$splitComponentImporter$5 = () => import("./admin.employees-2tjmO8OU.mjs");
var Route$5 = createFileRoute("/admin/employees")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "employees" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
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
var $$splitComponentImporter$4 = () => import("./admin.departments-egIiERto.mjs");
var Route$4 = createFileRoute("/admin/departments")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "departments" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
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
var $$splitComponentImporter$3 = () => import("./admin.audit-DxK8B1bb.mjs");
var Route$3 = createFileRoute("/admin/audit")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "audit" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function AuditPage() {
	const { data = [] } = useQuery({
		queryKey: ["audit-logs"],
		queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500)).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Audit Logs",
			description: "Complete action history — visible to super and corporate admins only."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "text-left",
						children: [
							"When",
							"Action",
							"Entity",
							"Meta"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: h
						}, h))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 4,
						className: "text-center py-12 text-sm text-muted-foreground",
						children: "No audit records yet, or you don't have permission to view them."
					}) }) : data.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-xs text-muted-foreground whitespace-nowrap",
							children: new Date(a.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 font-mono text-xs",
							children: a.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2 text-xs",
							children: [
								a.entity_type,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: a.entity_id?.slice(0, 8)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-xs text-muted-foreground max-w-md truncate",
							children: a.meta ? JSON.stringify(a.meta) : "—"
						})
					] }, a.id))
				})]
			})
		})]
	});
}
var $$splitComponentImporter$2 = () => import("./admin.analytics-BUCLebkZ.mjs");
var Route$2 = createFileRoute("/admin/analytics")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "analytics" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
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
var $$splitComponentImporter$1 = () => import("./admin.suggestions.index-ClYDaoUx.mjs");
var Route$1 = createFileRoute("/admin/suggestions/")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin",
			search: { section: "suggestions" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
									label: "Employee",
									value: sug.employees ? `${sug.employees.name} (${sug.employees.employee_code})` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
									label: "Category",
									value: sug.categories?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
									label: "Owner department",
									value: sug.departments?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
									label: "Plant",
									value: sug.plants?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
									label: "Location",
									value: sug.locations?.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta$1, {
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
function Meta$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 font-medium text-sm",
		children: value || "—"
	})] });
}
var $$splitComponentImporter = () => import("./admin.suggestions._id-CGm9C9F7.mjs");
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var Route = createFileRoute("/admin/suggestions/$id")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/admin",
			search: {
				section: "suggestion",
				id: params.id
			}
		});
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function SuggestionDetail({ id }) {
	const validId = !!id && UUID_RE.test(id);
	(0, import_react.useEffect)(() => {
		if (!validId) toast.error("Invalid suggestion link", { description: "Missing or malformed suggestion ID." });
	}, [validId]);
	const { data: session } = useSession();
	const qc = useQueryClient();
	const { data: sug, isLoading: sugLoading, isError: sugError } = useQuery({
		enabled: validId,
		queryKey: ["suggestion", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("suggestions").select("*, employees(name, employee_code, email), categories(name), departments!suggestions_department_id_fkey(name), plants(name), locations(location)").eq("id", id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: history = [], isLoading: histLoading } = useQuery({
		enabled: validId,
		queryKey: ["suggestion-history", id],
		queryFn: async () => (await supabase.from("suggestion_history").select("*").eq("suggestion_id", id).order("created_at")).data ?? []
	});
	const { data: evidenceVersions = [] } = useQuery({
		enabled: validId,
		queryKey: ["suggestion-evidence", id],
		queryFn: async () => {
			const { data: evs } = await supabase.from("evidence").select("*").eq("suggestion_id", id).order("version", { ascending: false });
			const ids = (evs ?? []).map((e) => e.id);
			const { data: atts } = ids.length ? await supabase.from("attachments").select("*").in("evidence_id", ids) : { data: [] };
			return (evs ?? []).map((e) => ({
				...e,
				attachments: (atts ?? []).filter((a) => a.evidence_id === e.id)
			}));
		}
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["depts"],
		queryFn: async () => (await supabase.from("departments").select("*").eq("active", true)).data ?? []
	});
	const transferFn = useServerFn(peTransferSuggestion);
	const decideFn = useServerFn(deptDecide);
	const startFn = useServerFn(deptStartImplementation);
	const evidenceFn = useServerFn(deptSubmitEvidence);
	const verifyFn = useServerFn(peVerify);
	const [remarks, setRemarks] = (0, import_react.useState)("");
	const [targetDept, setTargetDept] = (0, import_react.useState)("");
	const [evidenceRemarks, setEvidenceRemarks] = (0, import_react.useState)("");
	const [actualCost, setActualCost] = (0, import_react.useState)("");
	const [benefits, setBenefits] = (0, import_react.useState)("");
	const [evidenceFiles, setEvidenceFiles] = (0, import_react.useState)([]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const ACCEPTED_EXT = [
		".jpg",
		".jpeg",
		".png",
		".webp",
		".gif",
		".pdf",
		".doc",
		".docx",
		".xls",
		".xlsx",
		".ppt",
		".pptx",
		".txt",
		".csv",
		".mp4",
		".mov"
	];
	const ACCEPTED_ATTR = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,video/mp4,video/quicktime";
	const MAX_FILE_MB = 20;
	const MAX_FILES = 10;
	function validateFiles(files) {
		const errors = [];
		const valid = [];
		for (const f of files) {
			const ext = ("." + (f.name.split(".").pop() ?? "")).toLowerCase();
			if (!ACCEPTED_EXT.includes(ext)) {
				errors.push(`${f.name}: unsupported type`);
				continue;
			}
			if (f.size > MAX_FILE_MB * 1024 * 1024) {
				errors.push(`${f.name}: exceeds ${MAX_FILE_MB}MB`);
				continue;
			}
			valid.push(f);
		}
		return {
			valid,
			errors
		};
	}
	function handleEvidenceFiles(list) {
		if (!list) return;
		const { valid, errors } = validateFiles(Array.from(list));
		errors.forEach((e) => toast.error("File rejected", { description: e }));
		setEvidenceFiles((prev) => {
			const combined = [...prev, ...valid];
			if (combined.length > MAX_FILES) toast.warning(`Only ${MAX_FILES} files allowed`, { description: `Extra files ignored.` });
			return combined.slice(0, MAX_FILES);
		});
	}
	async function submitEvidenceWithFiles() {
		setUploading(true);
		const attachmentIds = [];
		const uploadedNames = [];
		try {
			for (const file of evidenceFiles) {
				const path = `${id}/evidence/${crypto.randomUUID()}-${file.name}`;
				const { error: upErr } = await supabase.storage.from("suggestion-files").upload(path, file, { contentType: file.type });
				if (upErr) {
					toast.error(`Upload failed: ${file.name}`, { description: upErr.message });
					continue;
				}
				const { data: attRow, error: attErr } = await supabase.from("attachments").insert({
					suggestion_id: id,
					file_path: path,
					file_name: file.name,
					content_type: file.type,
					kind: "evidence",
					uploaded_by: session?.userId
				}).select("id").single();
				if (attErr || !attRow) {
					toast.error(`Failed to record: ${file.name}`, { description: attErr?.message });
					continue;
				}
				attachmentIds.push(attRow.id);
				uploadedNames.push(file.name);
			}
			await evidenceFn({ data: {
				suggestion_id: id,
				remarks: evidenceRemarks,
				actual_cost: actualCost ? Number(actualCost) : null,
				benefits_achieved: benefits,
				attachment_ids: attachmentIds,
				file_names: uploadedNames
			} });
			toast.success("Evidence submitted", { description: `${uploadedNames.length} file${uploadedNames.length === 1 ? "" : "s"} attached` });
			setEvidenceFiles([]);
			setEvidenceRemarks("");
			setActualCost("");
			setBenefits("");
			qc.invalidateQueries({ queryKey: ["suggestion", id] });
			qc.invalidateQueries({ queryKey: ["suggestion-history", id] });
			qc.invalidateQueries({ queryKey: ["suggestion-evidence", id] });
		} catch (e) {
			toast.error("Failed to submit evidence", { description: e.message ?? "Unknown error" });
		} finally {
			setUploading(false);
		}
	}
	async function run(fn, label) {
		try {
			await fn();
			toast.success(label);
			qc.invalidateQueries({ queryKey: ["suggestion", id] });
			qc.invalidateQueries({ queryKey: ["suggestion-history", id] });
		} catch (e) {
			toast.error(e.message ?? "Action failed");
		}
	}
	if (!validId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium text-destructive mb-1",
				children: "Invalid suggestion link"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "The suggestion ID is missing or malformed. Please open the suggestion from the list."
			})]
		})
	});
	if (sugLoading || histLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " Loading suggestion…"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-lg border border-border bg-muted/30 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-lg border border-border bg-muted/30 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-lg border border-border bg-muted/30 animate-pulse" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-lg border border-border bg-muted/30 animate-pulse" })]
			})]
		})
	});
	if (sugError || !sug) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-6 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium mb-1",
				children: "Suggestion not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "It may have been removed, or you don't have access."
			})]
		})
	});
	const isPE = session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin";
	const status = sug.status;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: sug.title,
			description: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs",
				children: sug.code
			}),
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: sug.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: sug.priority })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Employee",
								value: `${sug.employees?.name} (${sug.employees?.employee_code})`
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
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Problem",
						children: sug.problem
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Current method",
						children: sug.current_method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Suggested method",
						children: sug.suggested_method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Expected benefits",
						children: sug.expected_benefits
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: "Actions"
							}),
							isPE && (status === "submitted" || status === "pe_review") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "PE — Transfer to concern department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: targetDept,
											onValueChange: setTargetDept,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-64",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select department" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: d.id,
												children: d.name
											}, d.id)) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											placeholder: "Remarks (optional)",
											value: remarks,
											onChange: (e) => setRemarks(e.target.value),
											className: "min-h-[38px] max-w-md"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											disabled: !targetDept,
											onClick: () => run(() => transferFn({ data: {
												suggestion_id: id,
												target_department_id: targetDept,
												remarks
											} }), "Transferred to department"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), " Transfer"]
										})
									]
								})]
							}),
							(status === "dept_review" || status === "transferred") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Department — Decide"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Remarks",
										value: remarks,
										onChange: (e) => setRemarks(e.target.value),
										className: "max-w-lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: () => run(() => decideFn({ data: {
													suggestion_id: id,
													decision: "approve",
													remarks
												} }), "Approved"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "w-4 h-4" }), " Approve"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "destructive",
												onClick: () => run(() => decideFn({ data: {
													suggestion_id: id,
													decision: "reject",
													remarks
												} }), "Rejected"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "w-4 h-4" }), " Reject"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: targetDept,
												onValueChange: setTargetDept,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-56",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Or transfer to…" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: d.id,
													children: d.name
												}, d.id)) })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												disabled: !targetDept,
												onClick: () => run(() => decideFn({ data: {
													suggestion_id: id,
													decision: "transfer",
													target_department_id: targetDept,
													remarks
												} }), "Transferred"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), " Transfer"]
											})
										]
									})
								]
							}),
							status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => run(() => startFn({ data: { suggestion_id: id } }), "Implementation started"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-4 h-4" }), " Start implementation"]
								})
							}),
							(status === "implementation" || status === "evidence_pending" || status === "fake_closure" || status === "reopened") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Department — Submit evidence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid md:grid-cols-2 gap-2 max-w-2xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											placeholder: "Actual cost (₹)",
											value: actualCost,
											onChange: (e) => setActualCost(e.target.value),
											className: "border border-input rounded-md px-3 py-1.5 text-sm bg-background"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "Benefits achieved",
											value: benefits,
											onChange: (e) => setBenefits(e.target.value),
											className: "border border-input rounded-md px-3 py-1.5 text-sm bg-background"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Completion remarks",
										value: evidenceRemarks,
										onChange: (e) => setEvidenceRemarks(e.target.value),
										className: "max-w-2xl"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										onDragOver: (e) => {
											e.preventDefault();
											setDragOver(true);
										},
										onDragLeave: () => setDragOver(false),
										onDrop: (e) => {
											e.preventDefault();
											setDragOver(false);
											handleEvidenceFiles(e.dataTransfer.files);
										},
										className: cn("max-w-2xl block border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors", dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												multiple: true,
												accept: ACCEPTED_ATTR,
												className: "hidden",
												onChange: (e) => handleEvidenceFiles(e.target.files)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-6 h-6 mx-auto text-muted-foreground mb-1.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: "Drag & drop files here, or click to browse"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground mt-1",
												children: "Images, PDF, Word, Excel, PowerPoint, MP4/MOV, TXT, CSV"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: [
													"Max ",
													MAX_FILES,
													" files · up to ",
													MAX_FILE_MB,
													"MB each · ",
													evidenceFiles.length,
													"/",
													MAX_FILES,
													" selected"
												]
											})
										]
									}),
									evidenceFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "max-w-2xl divide-y divide-border rounded-md border border-border",
										children: evidenceFiles.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
													onClick: () => setEvidenceFiles(evidenceFiles.filter((_, j) => j !== i)),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 text-muted-foreground" })
												})
											]
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: uploading,
										onClick: submitEvidenceWithFiles,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }),
											" ",
											uploading ? "Submitting…" : "Submit evidence"
										]
									})
								]
							}),
							isPE && (status === "pe_verification" || status === "evidence_submitted") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "PE — Final verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Verification remarks",
										value: remarks,
										onChange: (e) => setRemarks(e.target.value),
										className: "max-w-lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => run(() => verifyFn({ data: {
												suggestion_id: id,
												outcome: "implemented",
												remarks
											} }), "Marked implemented"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), " Mark implemented"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "destructive",
											onClick: () => run(() => verifyFn({ data: {
												suggestion_id: id,
												outcome: "fake_closure",
												remarks
											} }), "Marked fake closure"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" }), " Fake closure"]
										})]
									})
								]
							}),
							(status === "implemented" || status === "closed" || status === "rejected") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "This suggestion is closed — no further actions."
							})
						]
					}),
					evidenceVersions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Evidence History"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"(",
										evidenceVersions.length,
										" version",
										evidenceVersions.length === 1 ? "" : "s",
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: evidenceVersions.map((ev, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("rounded-md border p-3", idx === 0 ? "border-primary/40 bg-primary/5" : "border-border bg-background"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5",
												children: ["v", ev.version]
											}), idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-medium text-primary",
												children: "Latest"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: new Date(ev.created_at).toLocaleString()
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs",
										children: [ev.actual_cost != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Actual cost:"
											}),
											" ₹ ",
											Number(ev.actual_cost).toLocaleString()
										] }), ev.benefits_achieved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Benefits:"
											}),
											" ",
											ev.benefits_achieved
										] })]
									}),
									ev.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Remarks:"
											}),
											" ",
											ev.remarks
										]
									}),
									ev.attachments?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 space-y-1",
										children: ev.attachments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "text-primary hover:underline truncate text-left",
												onClick: async () => {
													const { data, error } = await supabase.storage.from("suggestion-files").createSignedUrl(a.file_path, 3600);
													if (error || !data?.signedUrl) return toast.error("Could not open file");
													window.open(data.signedUrl, "_blank");
												},
												children: a.file_name
											})]
										}, a.id))
									})
								]
							}, ev.id))
						})]
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
		})]
	});
}
function Card({ title, children }) {
	if (!children) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-5",
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
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
		className: "mt-0.5 font-medium",
		children: value || "—"
	})] });
}
//#endregion
export { SettingsPage as C, WorkflowPage as D, UsersPage as E, SecurityPage as S, SuggestionsList as T, Route$5 as _, LocationPerf as a, Route$8 as b, Route as c, Route$11 as d, Route$12 as f, Route$4 as g, Route$3 as h, EmployeesPage as i, Route$1 as l, Route$2 as m, AuditPage as n, MastersPage as o, Route$13 as p, DeptPerf as r, PlantPerf as s, AnalyticsPage as t, Route$10 as u, Route$6 as v, SuggestionDetail as w, Route$9 as x, Route$7 as y };
