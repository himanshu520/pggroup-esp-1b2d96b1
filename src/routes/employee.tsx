import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { loadSession } from "@/lib/session";
import { EmployeeShell } from "@/components/employee-shell";

// Employee portal layout. Client-gated (Supabase session lives in localStorage).
export const Route = createFileRoute("/employee")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const isLoginPath =
      location.pathname === "/employee/login" || location.pathname.startsWith("/employee/login/");

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      if (isLoginPath) return;
      throw redirect({ to: "/employee/login" });
    }

    const s = await loadSession();
    if (!s) {
      if (isLoginPath) return;
      throw redirect({ to: "/employee/login" });
    }

    // Admins are strictly routed to /admin dashboard
    if (s.isAdmin) {
      throw redirect({ to: "/admin" });
    }

    // Logged-in employees visiting /employee/login are redirected to employee home
    if (isLoginPath) {
      throw redirect({ to: "/employee" });
    }
  },
  component: EmployeeLayout,
});

function EmployeeLayout() {
  const loc = useLocation();
  // Login page has no shell.
  if (loc.pathname === "/employee/login" || loc.pathname.startsWith("/employee/login/")) {
    return <Outlet />;
  }
  return (
    <EmployeeShell>
      <Outlet />
    </EmployeeShell>
  );
}
