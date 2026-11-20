/**
 * /login → redirects to /employee/login (canonical login page)
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  ssr: false,
  beforeLoad: async () => {
    throw redirect({ to: "/employee/login", replace: true });
  },
  component: () => null,
});
