import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { n as pg_logo_png_asset_default, t as esp_logo_png_asset_default } from "./pg-logo.png.asset-BiUWTVCG.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime, _ as DialogTrigger$1, a as Overlay2, c as Title2, d as DialogClose, f as DialogContent$1, g as DialogTitle$1, h as DialogPortal$1, i as Description2, l as Trigger2, m as DialogOverlay$1, n as Cancel, o as Portal2, p as DialogDescription$1, r as Content2, s as Root2, t as Action, u as Dialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useSession } from "./session-DHPGTdIs.mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { _ as useNavigate, g as Link, l as useLocation, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as LogOut, N as Menu, R as LoaderCircle, _t as Bell, b as Settings2, i as User, mt as CheckCheck, nt as Circle, pt as Check, t as X, ut as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2$1, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2$1, o as Portal2$1, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as Trigger$1, n as Portal, r as Root2$2, t as Content2$2 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-D3p4__nB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	submitted: "Submitted",
	pe_review: "PE Review",
	transferred: "Transferred",
	dept_review: "Department Review",
	approved: "Approved",
	evaluation: "Evaluation",
	implementation: "Implementation",
	evidence_pending: "Evidence Pending",
	evidence_submitted: "Evidence Submitted",
	pe_verification: "PE Verification",
	implemented: "Implemented",
	rejected: "Rejected",
	fake_closure: "Fake Closure",
	reopened: "Reopened",
	closed: "Closed"
};
var STATUS_STYLES = {
	submitted: "bg-muted text-muted-foreground border-border",
	pe_review: "bg-info/10 text-info border-info/30",
	transferred: "bg-info/10 text-info border-info/30",
	dept_review: "bg-info/10 text-info border-info/30",
	approved: "bg-success/10 text-success border-success/30",
	evaluation: "bg-warning/10 text-warning border-warning/30",
	implementation: "bg-warning/10 text-warning border-warning/30",
	evidence_pending: "bg-warning/10 text-warning border-warning/30",
	evidence_submitted: "bg-info/10 text-info border-info/30",
	pe_verification: "bg-info/10 text-info border-info/30",
	implemented: "bg-success/10 text-success border-success/30",
	rejected: "bg-destructive/10 text-destructive border-destructive/30",
	fake_closure: "bg-destructive/10 text-destructive border-destructive/30",
	reopened: "bg-warning/10 text-warning border-warning/30",
	closed: "bg-success/10 text-success border-success/30"
};
var PRIORITY_LABEL = {
	low: "Low",
	medium: "Medium",
	high: "High",
	critical: "Critical"
};
var PRIORITY_STYLES = {
	low: "bg-muted text-muted-foreground border-border",
	medium: "bg-info/10 text-info border-info/30",
	high: "bg-warning/10 text-warning border-warning/30",
	critical: "bg-destructive/10 text-destructive border-destructive/30"
};
var ROLE_LABEL = {
	super_admin: "Super Admin",
	corporate_admin: "Corporate Admin",
	location_admin: "Location Admin",
	plant_admin: "Plant Admin",
	department_admin: "Department Admin",
	pe_user: "PE Department",
	dept_user: "Department User",
	mgmt_viewer: "Management (Viewer)",
	employee: "Employee"
};
var Popover = Root2$2;
var PopoverTrigger = Trigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2$2.displayName;
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(iso).toLocaleDateString();
}
function NotificationBell() {
	const { data: session } = useSession();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { data = [] } = useQuery({
		queryKey: ["notifications", session?.userId],
		enabled: !!session?.userId,
		refetchInterval: 6e4,
		queryFn: async () => {
			const { data } = await supabase.from("notifications").select("id, title, body, link, read, created_at").order("created_at", { ascending: false }).limit(30);
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (!session?.userId) return;
		const channel = supabase.channel(`notifications:${session.userId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "notifications",
			filter: `user_id=eq.${session.userId}`
		}, () => {
			qc.invalidateQueries({ queryKey: ["notifications", session.userId] });
			qc.invalidateQueries({ queryKey: ["notifications-page", session.userId] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [session?.userId, qc]);
	const unread = (0, import_react.useMemo)(() => data.filter((n) => !n.read).length, [data]);
	const markOne = useMutation({
		mutationFn: async (id) => {
			await supabase.from("notifications").update({ read: true }).eq("id", id);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", session?.userId] })
	});
	const markAll = useMutation({
		mutationFn: async () => {
			await supabase.from("notifications").update({ read: true }).eq("read", false);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", session?.userId] })
	});
	function handleClick(n) {
		if (!n.read) markOne.mutate(n.id);
		if (n.link && typeof window !== "undefined") window.location.assign(n.link);
	}
	function goToPage() {
		const dest = session?.isAdmin ? "/admin/notifications" : "/employee/notifications";
		navigate({ to: dest });
	}
	if (!session?.userId) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "icon",
			className: "relative h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-200 hover:scale-110",
			"aria-label": "Notifications",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center",
				children: unread > 9 ? "9+" : unread
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "end",
		className: "w-80 p-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-3 py-2 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Notifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => markAll.mutate(),
						className: "text-xs text-primary hover:underline flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3 h-3" }), " Mark all read"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: goToPage,
						className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1",
						"aria-label": "Notification settings",
						title: "Open notifications page",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "w-3 h-3" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-96 overflow-y-auto",
				children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-8 text-center text-xs text-muted-foreground",
					children: "You're all caught up."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: data.slice(0, 8).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleClick(n),
						className: cn("w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors flex gap-2", !n.read && "bg-primary/5"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1.5 w-2 h-2 rounded-full shrink-0", !n.read ? "bg-primary" : "bg-transparent") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium leading-snug",
									children: n.title
								}),
								n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5 line-clamp-2",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: goToPage,
					className: "w-full text-xs text-center py-2 text-primary hover:bg-muted/50",
					children: "View all notifications"
				})
			})
		]
	})] });
}
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var AppShellContext = (0, import_react.createContext)(false);
function AppShell(props) {
	if ((0, import_react.useContext)(AppShellContext)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: props.children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShellContext.Provider, {
		value: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShellInner, { ...props })
	});
}
function AppShellInner({ navGroups, title, children, collapsible = true }) {
	const { data: session } = useSession();
	const loc = useLocation();
	const navigate = useNavigate();
	const router = useRouter();
	const qc = useQueryClient();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [collapsed, setCollapsed] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return collapsible;
		const v = window.localStorage.getItem("esp:sidebar-collapsed");
		if (v === "1") return true;
		if (v === "0") return false;
		return collapsible;
	});
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") window.localStorage.setItem("esp:sidebar-collapsed", collapsed ? "1" : "0");
	}, [collapsed]);
	const [logoutOpen, setLogoutOpen] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [isLoggingOut, setIsLoggingOut] = (0, import_react.useState)(false);
	const [pgLoaded, setPgLoaded] = (0, import_react.useState)(false);
	const [espLoaded, setEspLoaded] = (0, import_react.useState)(false);
	const pgImgRef = (0, import_react.useCallback)((el) => {
		if (el && el.complete && el.naturalWidth > 0) setPgLoaded(true);
	}, []);
	const espImgRef = (0, import_react.useCallback)((el) => {
		if (el && el.complete && el.naturalWidth > 0) setEspLoaded(true);
	}, []);
	async function signOut() {
		const loginPath = typeof window !== "undefined" && window.location.pathname.startsWith("/employee") ? "/employee/login" : "/auth";
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		if (typeof window !== "undefined") {
			try {
				window.localStorage.clear();
			} catch {}
			try {
				window.sessionStorage.clear();
			} catch {}
		}
		router.invalidate();
		toast.success("You have been signed out", {
			description: "Your session has been cleared.",
			action: {
				label: "Back to login",
				onClick: () => navigate({
					to: loginPath,
					replace: true
				})
			}
		});
		navigate({
			to: loginPath,
			replace: true
		});
	}
	async function handleLogout() {
		setIsLoggingOut(true);
		await signOut();
	}
	const initials = (session?.employee?.name ?? session?.email ?? "U").slice(0, 2).toUpperCase();
	const sidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col w-64", "lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]", "fixed inset-y-0 left-0 z-50 h-screen transition-all duration-200", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", collapsible && collapsed && "lg:w-16"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:hidden flex items-center justify-between px-4 h-14 border-b border-sidebar-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-sidebar-foreground truncate",
					children: "Menu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMobileOpen(false),
					className: "p-2 -mr-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent",
					"aria-label": "Close menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 overflow-y-auto py-4 px-3 space-y-5",
				children: navGroups.filter((g) => g.label !== "Administration" || session?.primaryRole === "super_admin").map((g, gi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [g.label && (!collapsible || !collapsed) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50",
					children: g.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: g.items.map((item) => {
						const isIndexRoute = item.to === "/admin" || item.to === "/employee" || item.to === "/";
						const currentSection = loc.search?.section;
						const pathActive = isIndexRoute ? loc.pathname === item.to : loc.pathname === item.to || loc.pathname.startsWith(item.to + "/");
						const active = item.section !== void 0 || currentSection !== void 0 ? pathActive && (item.section ?? void 0) === (currentSection ?? void 0) : pathActive;
						const Icon = item.icon;
						const showLabel = !collapsible || !collapsed;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							search: item.section ? { section: item.section } : void 0,
							onClick: () => setMobileOpen(false),
							title: collapsible && collapsed ? item.label : void 0,
							className: cn("group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1", active && "bg-primary/10 text-primary font-semibold border-l-2 border-primary", collapsible && collapsed && "lg:justify-center lg:px-0"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" }), showLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}, item.to + ":" + (item.section ?? ""));
					})
				})] }, gi))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("border-t border-sidebar-border p-3", collapsible && collapsed && "lg:hidden"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-muted/50 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid place-items-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0",
							children: initials
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1",
							children: session?.primaryRole && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary",
								children: ROLE_LABEL[session.primaryRole]
							})
						})]
					})
				})
			})
		]
	});
	function toggleSidebar() {
		if (window.matchMedia("(min-width: 1024px)").matches) {
			if (collapsible) setCollapsed((c) => !c);
		} else setMobileOpen((o) => !o);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 w-full h-16 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between px-2 sm:px-4 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 sm:gap-3 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: toggleSidebar,
					className: "shrink-0 grid place-items-center w-8 h-8 sm:w-9 sm:h-9 -ml-1 rounded-md hover:bg-muted",
					"aria-label": "Toggle menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-3 min-w-0",
					role: "img",
					"aria-label": "PG Group — Employee Suggestion Portal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative bg-white rounded-md px-1 sm:px-2 h-8 sm:h-10 w-[52px] sm:w-[92px] flex items-center justify-center shadow-sm shrink-0 border border-border/60",
							children: [!pgLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"aria-hidden": "true",
								className: "absolute inset-1 rounded bg-muted/60 animate-pulse"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								ref: pgImgRef,
								src: pg_logo_png_asset_default.url,
								alt: "PG Group company logo",
								width: 184,
								height: 80,
								decoding: "async",
								fetchPriority: "high",
								onLoad: () => setPgLoaded(true),
								className: cn("brand-logo h-6 sm:h-9 w-auto max-w-full object-contain hover-scale", pgLoaded && "is-loaded")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative bg-white rounded-md px-1 sm:px-2 h-8 sm:h-10 w-[52px] sm:w-[92px] flex items-center justify-center shadow-sm shrink-0 border border-border/60",
							children: [!espLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"aria-hidden": "true",
								className: "absolute inset-1 rounded bg-muted/60 animate-pulse"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								ref: espImgRef,
								src: esp_logo_png_asset_default.url,
								alt: "Employee Suggestion Portal logo",
								width: 184,
								height: 80,
								decoding: "async",
								fetchPriority: "high",
								onLoad: () => setEspLoaded(true),
								className: cn("brand-logo brand-logo-delay h-6 sm:h-9 w-auto max-w-full object-contain hover-scale", espLoaded && "is-loaded")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex flex-col leading-tight min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-foreground truncate",
								children: "Employee Suggestion Portal (ESP)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground truncate",
								children: title
							})]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-200 hover:scale-110",
							"aria-label": "User menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
								className: "font-normal",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: session?.employee?.name ?? session?.email ?? "User"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground truncate",
										children: session?.email
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => setProfileOpen(true),
								className: "cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 mr-2" }), " My Profile"]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, {
						open: logoutOpen,
						onOpenChange: setLogoutOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-8 sm:h-9 px-1.5 sm:px-3 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden md:inline font-medium",
									children: "Logout"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Confirm logout" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Are you sure you want to log out?" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							disabled: isLoggingOut,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							onClick: handleLogout,
							disabled: isLoggingOut,
							className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
							children: isLoggingOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }), " Logging out…"] }) : "Logout"
						})] })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
						open: profileOpen,
						onOpenChange: setProfileOpen,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "sm:max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "My Profile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Your account and role details." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
										label: "Name",
										value: session?.employee?.name ?? session?.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
										label: "Email",
										value: session?.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
										label: "Role",
										value: session?.primaryRole ? ROLE_LABEL[session.primaryRole] : void 0
									}),
									session?.employee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
											label: "Employee ID",
											value: session.employee.employee_code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
											label: "Designation",
											value: session.employee.designation
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
											label: "Mobile",
											value: session.employee.mobile
										})
									] })
								]
							})]
						})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 min-w-0",
			children: [
				sidebar,
				mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
					onClick: () => setMobileOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto page-fade-in",
					children
				})
			]
		})]
	});
}
function ProfileRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-2 border-b border-border last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-foreground text-right",
			children: value ?? "—"
		})]
	});
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-start justify-between gap-4 flex-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-foreground",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: description
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 flex-wrap",
			children: actions
		})]
	});
}
var TONE_STYLES = {
	default: {
		bar: "bg-primary",
		num: "text-foreground"
	},
	info: {
		bar: "bg-info",
		num: "text-info"
	},
	success: {
		bar: "bg-success",
		num: "text-success"
	},
	warning: {
		bar: "bg-warning",
		num: "text-warning"
	},
	destructive: {
		bar: "bg-destructive",
		num: "text-destructive"
	},
	accent: {
		bar: "bg-[color:oklch(0.60_0.20_300)]",
		num: "text-[color:oklch(0.55_0.20_300)]"
	}
};
function StatCard({ label, value, hint, tone = "default", icon: Icon }) {
	const t = TONE_STYLES[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card overflow-hidden shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1", t.bar) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mt-2 text-3xl font-bold leading-none", t.num),
						children: value
					}),
					hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-1.5",
						children: hint
					})
				]
			}), Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("shrink-0 grid place-items-center w-9 h-9 rounded-md bg-muted/60", t.num),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" })
			})]
		})]
	});
}
//#endregion
export { PageHeader as C, StatCard as D, STATUS_STYLES as E, PRIORITY_STYLES as S, STATUS_LABEL as T, DropdownMenu as _, AlertDialogDescription as a, DropdownMenuTrigger as b, AlertDialogTitle as c, DialogContent as d, DialogDescription as f, DialogTrigger as g, DialogTitle as h, AlertDialogContent as i, AppShell as l, DialogHeader as m, AlertDialogAction as n, AlertDialogFooter as o, DialogFooter as p, AlertDialogCancel as r, AlertDialogHeader as s, AlertDialog as t, Dialog as u, DropdownMenuContent as v, ROLE_LABEL as w, PRIORITY_LABEL as x, DropdownMenuItem as y };
