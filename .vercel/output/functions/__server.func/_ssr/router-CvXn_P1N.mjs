import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DfqwfaTb.mjs";
import { n as pg_logo_png_asset_default, t as esp_logo_png_asset_default } from "./pg-logo.png.asset-BiUWTVCG.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as loadSession } from "./session-DHPGTdIs.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { _ as Route$5$1, b as Route$8$1, c as Route$14, d as Route$11, f as Route$12, g as Route$4$1, h as Route$3$1, l as Route$1$1, m as Route$2$1, p as Route$13, u as Route$10, v as Route$6$1, x as Route$9, y as Route$7$1 } from "./admin.suggestions._id-IBHBAAhk.mjs";
import { n as LanguageProvider } from "./employee-shell-CcFVNx6P.mjs";
import { a as Route$2$15, i as Route$1$8, o as Route$3$14, r as Route$16, s as Route$4$13 } from "./employee.my-DBZYyIG6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CvXn_P1N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DCJXDQuH.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var SESSION_KEY = "esp-splash-shown";
function SplashScreen() {
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [leaving, setLeaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			if (sessionStorage.getItem(SESSION_KEY) === "1") return;
			sessionStorage.setItem(SESSION_KEY, "1");
		} catch {}
		setVisible(true);
		const t1 = setTimeout(() => setLeaving(true), 1600);
		const t2 = setTimeout(() => setVisible(false), 2200);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: esp_logo_png_asset_default.url,
				alt: "ESP",
				className: "w-40 h-40 object-contain esp-splash-logo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-lg font-bold tracking-wide esp-splash-text",
				style: { color: "#0f1b3d" },
				children: "EMPLOYEE SUGGESTION PORTAL"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-sm font-semibold esp-splash-text-2",
				style: { color: "#f97316" },
				children: "— ESP —"
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-6xl font-semibold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: "Return home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try again or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-input px-4 py-2 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Employee Suggestion Portal (ESP)" },
			{
				name: "description",
				content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant."
			},
			{
				property: "og:title",
				content: "Employee Suggestion Portal (ESP)"
			},
			{
				property: "og:description",
				content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Employee Suggestion Portal (ESP)"
			},
			{
				name: "twitter:description",
				content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Xtgjz4wmJlYnE0E185Q2wdT3x553/social-images/social-1783225025676-ESP_(2).webp"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Xtgjz4wmJlYnE0E185Q2wdT3x553/social-images/social-1783225025676-ESP_(2).webp"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "preload",
				as: "image",
				href: pg_logo_png_asset_default.url,
				fetchpriority: "high"
			},
			{
				rel: "preload",
				as: "image",
				href: esp_logo_png_asset_default.url,
				fetchpriority: "high"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LanguageProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-right"
			})
		] })
	});
}
var $$splitComponentImporter$7 = () => import("./employee-blqqHYe3.mjs");
var Route$7 = createFileRoute("/employee")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		if (location.pathname === "/employee/login" || location.pathname.startsWith("/employee/login/")) return;
		const { data } = await supabase.auth.getSession();
		if (!data.session) throw redirect({ to: "/employee/login" });
		if (!await loadSession()) throw redirect({ to: "/employee/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./auth-CZBceDqw.mjs");
var Route$6 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [{ title: "Dashboard Sign in — ESP" }, {
		name: "description",
		content: "Secure OTP sign-in for the ESP administration dashboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin-4I9bVZyn.mjs");
var Route$5 = createFileRoute("/admin")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getSession();
		if (!data.session) throw redirect({ to: "/auth" });
		const s = await loadSession();
		if (!s) throw redirect({ to: "/auth" });
		if (!s.isAdmin) throw redirect({ to: "/employee" });
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./routes-D3Wacgzj.mjs");
var Route$4 = createFileRoute("/")({
	ssr: false,
	head: () => ({ meta: [{ title: "Employee Suggestion Portal (ESP)" }, {
		name: "description",
		content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant."
	}] }),
	beforeLoad: async () => {
		const { data } = await supabase.auth.getSession();
		if (!data.session) throw redirect({ to: "/auth" });
		const session = await loadSession();
		if (!session) throw redirect({ to: "/auth" });
		if (session.isAdmin) throw redirect({ to: "/admin" });
		throw redirect({ to: "/employee" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./employee.notifications-BUDgVUN_.mjs");
var Route$3 = createFileRoute("/employee/notifications")({
	ssr: false,
	head: () => ({ meta: [{ title: "Notifications — ESP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./employee.login-BgDC61iS.mjs");
var Route$2 = createFileRoute("/employee/login")({
	ssr: false,
	head: () => ({ meta: [{ title: "Employee Sign in — ESP" }, {
		name: "description",
		content: "Sign in to submit and track your improvement suggestions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.suggestions-BvBL_sTj.mjs");
var Route$1 = createFileRoute("/admin/suggestions")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.notifications-DqCgPk3L.mjs");
var Route = createFileRoute("/admin/notifications")({
	ssr: false,
	head: () => ({ meta: [{ title: "Notifications — ESP" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var EmployeeRoute = Route$7.update({
	id: "/employee",
	path: "/employee",
	getParentRoute: () => Route$8
});
var AuthRoute = Route$6.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$8
});
var AdminRoute = Route$5.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$8
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$8
});
var EmployeeIndexRoute = Route$4$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => EmployeeRoute
});
var AdminIndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var EmployeeTrackRoute = Route$3$14.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => EmployeeRoute
});
var EmployeeSubmitRoute = Route$2$15.update({
	id: "/submit",
	path: "/submit",
	getParentRoute: () => EmployeeRoute
});
var EmployeeProfileRoute = Route$1$8.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => EmployeeRoute
});
var EmployeeNotificationsRoute = Route$3.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => EmployeeRoute
});
var EmployeeMyRoute = Route$16.update({
	id: "/my",
	path: "/my",
	getParentRoute: () => EmployeeRoute
});
var EmployeeLoginRoute = Route$2.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => EmployeeRoute
});
var AdminWorkflowRoute = Route$12.update({
	id: "/workflow",
	path: "/workflow",
	getParentRoute: () => AdminRoute
});
var AdminUsersRoute = Route$11.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var AdminSuggestionsRoute = Route$1.update({
	id: "/suggestions",
	path: "/suggestions",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$10.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminSecurityRoute = Route$9.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => AdminRoute
});
var AdminPlantsRoute = Route$8$1.update({
	id: "/plants",
	path: "/plants",
	getParentRoute: () => AdminRoute
});
var AdminNotificationsRoute = Route.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AdminRoute
});
var AdminMastersRoute = Route$7$1.update({
	id: "/masters",
	path: "/masters",
	getParentRoute: () => AdminRoute
});
var AdminLocationsRoute = Route$6$1.update({
	id: "/locations",
	path: "/locations",
	getParentRoute: () => AdminRoute
});
var AdminEmployeesRoute = Route$5$1.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => AdminRoute
});
var AdminDepartmentsRoute = Route$4$1.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => AdminRoute
});
var AdminAuditRoute = Route$3$1.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AdminRoute
});
var AdminAnalyticsRoute = Route$2$1.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AdminRoute
});
var AdminSuggestionsIndexRoute = Route$1$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminSuggestionsRoute
});
var AdminSuggestionsRouteChildren = {
	AdminSuggestionsIdRoute: Route$14.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => AdminSuggestionsRoute
	}),
	AdminSuggestionsIndexRoute
};
var AdminRouteChildren = {
	AdminAnalyticsRoute,
	AdminAuditRoute,
	AdminDepartmentsRoute,
	AdminEmployeesRoute,
	AdminLocationsRoute,
	AdminMastersRoute,
	AdminNotificationsRoute,
	AdminPlantsRoute,
	AdminSecurityRoute,
	AdminSettingsRoute,
	AdminSuggestionsRoute: AdminSuggestionsRoute._addFileChildren(AdminSuggestionsRouteChildren),
	AdminUsersRoute,
	AdminWorkflowRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var EmployeeRouteChildren = {
	EmployeeLoginRoute,
	EmployeeMyRoute,
	EmployeeNotificationsRoute,
	EmployeeProfileRoute,
	EmployeeSubmitRoute,
	EmployeeTrackRoute,
	EmployeeIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	AuthRoute,
	EmployeeRoute: EmployeeRoute._addFileChildren(EmployeeRouteChildren)
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadDelay: 0,
		defaultPreloadStaleTime: 0,
		defaultPendingMs: 0
	});
};
//#endregion
export { getRouter };
