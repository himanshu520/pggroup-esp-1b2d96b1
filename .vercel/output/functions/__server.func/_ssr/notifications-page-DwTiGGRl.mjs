import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { a as cn, d as useNavigate, l as toast, o as createLucideIcon, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BEab6JLj.mjs";
import { A as useQuery, M as useSession, c as Settings2, j as useQueryClient, k as useMutation, n as CheckCheck, r as ChevronRight, t as Bell } from "./dist-BCwtjUtj.mjs";
import { t as Switch } from "./switch-DKEb2IYG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-page-DwTiGGRl.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronLeft = createLucideIcon("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Inbox = createLucideIcon("inbox", [["polyline", {
	points: "22 12 16 12 14 15 10 15 8 12 2 12",
	key: "o97t9d"
}], ["path", {
	d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
	key: "oot6mr"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EVENT_TYPES = [
	{
		key: "submit",
		label: "New suggestion submitted",
		hint: "PE / super admin get notified when an employee submits"
	},
	{
		key: "transfer",
		label: "Transfer / routing",
		hint: "When a suggestion is transferred between departments"
	},
	{
		key: "approve",
		label: "Approval",
		hint: "When a department approves a suggestion"
	},
	{
		key: "reject",
		label: "Rejection",
		hint: "When a suggestion is rejected"
	},
	{
		key: "evidence",
		label: "Evidence submitted",
		hint: "When implementation evidence is uploaded"
	},
	{
		key: "verification",
		label: "PE verification",
		hint: "Final verification outcome — implemented or fake closure"
	}
];
var PAGE_SIZE = 20;
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(iso).toLocaleString();
}
function NotificationsPage() {
	const { data: session } = useSession();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(0);
	const [showPrefs, setShowPrefs] = (0, import_react.useState)(false);
	const { data: list } = useQuery({
		queryKey: [
			"notifications-page",
			session?.userId,
			filter,
			page
		],
		enabled: !!session?.userId,
		queryFn: async () => {
			let q = supabase.from("notifications").select("id, title, body, link, read, created_at, event_type, suggestion_id", { count: "exact" }).order("created_at", { ascending: false }).range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
			if (filter === "unread") q = q.eq("read", false);
			if (filter === "new") q = q.eq("read", false).gt("created_at", (/* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3)).toISOString());
			const { data, count } = await q;
			return {
				rows: data ?? [],
				count: count ?? 0
			};
		}
	});
	const rows = list?.rows ?? [];
	const total = list?.count ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const markOne = useMutation({
		mutationFn: async (id) => {
			await supabase.from("notifications").update({ read: true }).eq("id", id);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications-page", session?.userId] });
			qc.invalidateQueries({ queryKey: ["notifications", session?.userId] });
		}
	});
	const markAll = useMutation({
		mutationFn: async () => {
			await supabase.from("notifications").update({ read: true }).eq("read", false);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications-page", session?.userId] });
			qc.invalidateQueries({ queryKey: ["notifications", session?.userId] });
			toast.success("All notifications marked as read");
		}
	});
	function open(n) {
		if (!n.read) markOne.mutate(n.id);
		if (n.link) {
			if (n.link.startsWith("/")) navigate({ to: n.link });
			else if (typeof window !== "undefined") window.location.assign(n.link);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-6 h-6" }), " Notifications"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: ["All workflow updates for your account. ", total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"· ",
						total,
						" total"
					] })]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setShowPrefs((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "w-4 h-4 mr-1" }), " Preferences"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => markAll.mutate(),
						disabled: markAll.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-4 h-4 mr-1" }), " Mark all read"]
					})]
				})]
			}),
			showPrefs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 rounded-lg bg-muted p-1 w-fit",
				children: [
					"new",
					"unread",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setFilter(f);
						setPage(0);
					},
					className: cn("px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors", filter === f ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"),
					children: f
				}, f))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-card",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-sm text-muted-foreground flex flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "w-8 h-8" }), "You're all caught up."]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: rows.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => open(n),
						className: cn("w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex gap-3", !n.read && "bg-primary/5"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1.5 w-2 h-2 rounded-full shrink-0", !n.read ? "bg-primary" : "bg-transparent") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium leading-snug",
										children: n.title
									}), n.event_type && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded text-muted-foreground",
										children: n.event_type
									})]
								}),
								n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground mt-1",
									children: timeAgo(n.created_at)
								})
							]
						})]
					}) }, n.id))
				})
			}),
			total > PAGE_SIZE && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Page ",
					page + 1,
					" of ",
					totalPages
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page === 0,
						onClick: () => setPage((p) => Math.max(0, p - 1)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3 h-3" }), " Prev"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page + 1 >= totalPages,
						onClick: () => setPage((p) => p + 1),
						children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
					})]
				})]
			})
		]
	});
}
function PreferencesPanel() {
	const { data: session } = useSession();
	const qc = useQueryClient();
	const isAdminOrPE = !!session?.isAdmin || !!session?.isPE;
	const visibleEvents = (0, import_react.useMemo)(() => EVENT_TYPES.filter((ev) => ev.key === "submit" ? isAdminOrPE : true), [isAdminOrPE]);
	const key = ["notification-prefs", session?.userId];
	const { data: prefs } = useQuery({
		queryKey: key,
		enabled: !!session?.userId,
		queryFn: async () => {
			const { data } = await supabase.from("notification_preferences").select("event_type, in_app, email").eq("user_id", session.userId);
			return data ?? [];
		}
	});
	const map = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		(prefs ?? []).forEach((p) => m.set(p.event_type, {
			in_app: p.in_app,
			email: p.email
		}));
		return m;
	}, [prefs]);
	const update = useMutation({
		mutationFn: async (v) => {
			if (!session?.userId) return;
			await supabase.from("notification_preferences").upsert({
				user_id: session.userId,
				event_type: v.event_type,
				in_app: v.in_app,
				email: v.email
			}, { onConflict: "user_id,event_type" });
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: key }),
		onError: (e) => toast.error(e.message ?? "Could not save preference")
	});
	function toggle(event_type, channel, value) {
		const next = {
			...map.get(event_type) ?? {
				in_app: true,
				email: true
			},
			[channel]: value
		};
		update.mutate({
			event_type,
			in_app: next.in_app,
			email: next.email
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-4 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: "Notification preferences"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-0.5",
			children: "Choose which events reach you in-app and by email. Changes save automatically."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "divide-y divide-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_80px_80px] items-center py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Event" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "In-app"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Email"
					})
				]
			}), visibleEvents.map((ev) => {
				const p = map.get(ev.key) ?? {
					in_app: true,
					email: true
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_80px_80px] items-center py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 pr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: ev.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: ev.hint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: p.in_app,
								onCheckedChange: (v) => toggle(ev.key, "in_app", v)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: p.email,
								onCheckedChange: (v) => toggle(ev.key, "email", v)
							})
						})
					]
				}, ev.key);
			})]
		})]
	});
}
//#endregion
export { NotificationsPage as t };
