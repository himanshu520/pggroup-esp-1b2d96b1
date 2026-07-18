import { createFileRoute, redirect } from "@tanstack/react-router";
import { SubmitForm } from "./employee.submit";
import { MySuggestions } from "./employee.my";
import { TrackPage } from "./employee.track";
import { NotificationsPage } from "@/components/notifications-page";
import { ProfilePage } from "./employee.profile";
import { LeaderboardView } from "@/components/leaderboard";

type EmployeeSearch = { section?: string; code?: string };

const SECTION_TITLES: Record<string, string> = {
  submit: "Submit suggestion — ESP",
  my: "My suggestions — ESP",
  track: "Track suggestion — ESP",
  notifications: "Notifications — ESP",
  profile: "Profile — ESP",
  leaderboard: "Performance Leaderboard — ESP",
};

export const Route = createFileRoute("/employee/")({
  validateSearch: (s: Record<string, unknown>): EmployeeSearch => ({
    section: typeof s.section === "string" ? s.section : undefined,
    code: typeof s.code === "string" ? s.code : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (!(search as EmployeeSearch).section) {
      throw redirect({ to: "/employee", search: { section: "submit" } as any, replace: true });
    }
  },
  head: ({ match }) => {
    const s = (match.search as EmployeeSearch | undefined)?.section ?? "submit";
    return { meta: [{ title: SECTION_TITLES[s] ?? SECTION_TITLES.submit }] };
  },
  component: EmployeeHome,
});

function EmployeeHome() {
  const { section, code } = Route.useSearch();
  switch (section) {
    case "my":            return <MySuggestions />;
    case "track":         return <TrackPage initialCode={code} />;
    case "notifications": return <NotificationsPage />;
    case "profile":       return <ProfilePage />;
    case "leaderboard":   return <LeaderboardView adminMode={false} />;
    case "submit":
    default:              return <SubmitForm />;
  }
}
