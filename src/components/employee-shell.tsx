import { AppShell, PageHeader, StatCard, type NavItem } from "@/components/app-shell";
import { EMPLOYEE_NAV } from "@/lib/employee-nav";
import { LanguageWelcomeModal } from "@/components/language-welcome-modal";
import { useT } from "@/lib/i18n";
import { useMemo, type ReactNode } from "react";

export { PageHeader, StatCard };

const LABEL_KEYS: Record<string, string> = {
  "Submit Suggestion": "nav_submit",
  "My Suggestions": "nav_my",
  "Track Suggestion": "nav_track",
  "Notifications": "nav_notifications",
  "Profile": "profile_title",
};

export function EmployeeShell({ children }: { children: ReactNode }) {
  const t = useT();
  const nav = useMemo(
    () =>
      EMPLOYEE_NAV.map((g) => ({
        ...g,
        items: g.items.map((it: NavItem) => ({
          ...it,
          label: LABEL_KEYS[it.label] ? t(LABEL_KEYS[it.label]) : it.label,
        })),
      })),
    [t],
  );
  return (
    <>
      <LanguageWelcomeModal />
      <AppShell navGroups={nav} title="Employee Portal" collapsible>
        {children}
      </AppShell>
    </>
  );
}
