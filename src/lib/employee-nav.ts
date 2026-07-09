import type { NavItem } from "@/components/app-shell";
import { PlusCircle, ListChecks, Search, Bell, UserCircle } from "lucide-react";

// All employee sections live on a single URL: /employee. The active section is
// selected via ?section=… (undefined = default submit).
export const EMPLOYEE_NAV: Array<{ label?: string; items: NavItem[] }> = [
  { items: [
    { to: "/employee", section: "submit", label: "Submit Suggestion", icon: PlusCircle },
    { to: "/employee", section: "my", label: "My Suggestions", icon: ListChecks },
    { to: "/employee", section: "track", label: "Track Suggestion", icon: Search },
    { to: "/employee/notifications", label: "Notifications", icon: Bell },
    { to: "/employee", section: "profile", label: "Profile", icon: UserCircle },
  ]},
];


