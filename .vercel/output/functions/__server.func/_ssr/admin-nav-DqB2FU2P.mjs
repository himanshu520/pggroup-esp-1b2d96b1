import { C as ScrollText, K as GitBranch, P as MapPin, V as LayoutDashboard, W as IdCard, Y as FileStack, Z as Factory, _t as Bell, et as Database, gt as Building2, ht as ChartColumn, r as Users, v as ShieldAlert, y as Settings } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-nav-DqB2FU2P.js
var ADMIN_NAV = [
	{ items: [
		{
			to: "/admin",
			label: "Overview",
			icon: LayoutDashboard
		},
		{
			to: "/admin",
			section: "suggestions",
			label: "Suggestions",
			icon: FileStack
		},
		{
			to: "/admin",
			section: "workflow",
			label: "Workflow Queue",
			icon: GitBranch
		},
		{
			to: "/admin/notifications",
			label: "Notifications",
			icon: Bell
		}
	] },
	{
		label: "Performance",
		items: [
			{
				to: "/admin",
				section: "departments",
				label: "Departments",
				icon: Building2
			},
			{
				to: "/admin",
				section: "plants",
				label: "Plants",
				icon: Factory
			},
			{
				to: "/admin",
				section: "locations",
				label: "Locations",
				icon: MapPin
			},
			{
				to: "/admin",
				section: "analytics",
				label: "Analytics",
				icon: ChartColumn
			}
		]
	},
	{
		label: "Administration",
		items: [
			{
				to: "/admin",
				section: "masters",
				label: "Masters",
				icon: Database
			},
			{
				to: "/admin",
				section: "employees",
				label: "Employees",
				icon: IdCard
			},
			{
				to: "/admin",
				section: "users",
				label: "Users & Roles",
				icon: Users
			},
			{
				to: "/admin",
				section: "audit",
				label: "Audit Logs",
				icon: ScrollText
			},
			{
				to: "/admin",
				section: "security",
				label: "Security",
				icon: ShieldAlert
			},
			{
				to: "/admin",
				section: "settings",
				label: "Settings",
				icon: Settings
			}
		]
	}
];
//#endregion
export { ADMIN_NAV as t };
