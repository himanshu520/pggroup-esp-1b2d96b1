import type { NavItem } from "@/components/app-shell";
import {
  LayoutDashboard, FileStack, GitBranch, Building2, Factory, MapPin,
  Users, Database, ScrollText, BarChart3, Settings, ShieldAlert, IdCard, Bell,
} from "lucide-react";

// All admin sections live on a single URL: /admin. The active section is
// selected via ?section=… (undefined = overview).
export const ADMIN_NAV: Array<{ label?: string; items: NavItem[] }> = [
  { items: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin", section: "suggestions", label: "Suggestions", icon: FileStack },
    { to: "/admin", section: "workflow", label: "Workflow Queue", icon: GitBranch },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
  ]},
  { label: "Performance", items: [
    { to: "/admin", section: "departments", label: "Departments", icon: Building2 },
    { to: "/admin", section: "plants", label: "Plants", icon: Factory },
    { to: "/admin", section: "locations", label: "Locations", icon: MapPin },
    { to: "/admin", section: "analytics", label: "Analytics", icon: BarChart3 },
  ]},
  { label: "Administration", items: [
    { to: "/admin", section: "masters", label: "Masters", icon: Database },
    { to: "/admin/database", label: "Database Management", icon: Database },
    { to: "/admin", section: "employees", label: "Employees", icon: IdCard },
    { to: "/admin", section: "users", label: "Users & Roles", icon: Users },
    { to: "/admin", section: "audit", label: "Audit Logs", icon: ScrollText },
    { to: "/admin", section: "security", label: "Security", icon: ShieldAlert },
    { to: "/admin", section: "settings", label: "Settings", icon: Settings },
  ]},
];
