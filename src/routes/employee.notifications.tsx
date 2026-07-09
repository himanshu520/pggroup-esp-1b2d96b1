import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/notifications-page";

export const Route = createFileRoute("/employee/notifications")({
  ssr: false,
  head: () => ({ meta: [{ title: "Notifications — ESP" }] }),
  component: NotificationsPage,
});
