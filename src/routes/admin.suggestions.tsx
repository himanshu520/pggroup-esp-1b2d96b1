import { createFileRoute, Outlet } from "@tanstack/react-router";

// Parent for /admin/suggestions/*. Children redirect to /admin?section=...,
// so this only needs to render an Outlet for the router to reach those redirects.
export const Route = createFileRoute("/admin/suggestions")({
  component: () => <Outlet />,
});
