import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { loadSession } from "@/lib/session";
import { EmployeeShell } from "@/components/employee-shell";

// Employee portal layout. Client-gated (Supabase session lives in localStorage).
export const Route = createFileRoute("/employee")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Public: /employee/login
    if (location.pathname === "/employee/login" || location.pathname.startsWith("/employee/login/")) {
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/employee/login" });
    const s = await loadSession();
    if (!s) throw redirect({ to: "/employee/login" });
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
