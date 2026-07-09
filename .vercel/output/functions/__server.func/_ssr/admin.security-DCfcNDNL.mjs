import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { t as supabase } from "./client-BEab6JLj.mjs";
import { A as useQuery } from "./dist-BCwtjUtj.mjs";
import { F as ROLE_LABEL, M as PageHeader, V as StatCard, u as AppShell } from "./app-shell-uI3AfMIW.mjs";
import { r as Users, t as ADMIN_NAV } from "./admin-nav-ipU9T7Tj.mjs";
import { t as Badge } from "./badge-ZqdsFWIG.mjs";
import { a as TableBody, c as TableHeader, i as Table, l as TableRow, n as Lock, o as TableCell, r as ShieldCheck, s as TableHead, t as Activity } from "./table-CdZDdplB.mjs";
import { t as KeyRound } from "./key-round-ZhtWgGPi.mjs";
import { t as TriangleAlert } from "./triangle-alert-DmLBobpN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.security-DCfcNDNL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var SplitComponent = () => null;
//#endregion
export { SecurityPage, SplitComponent as component };
