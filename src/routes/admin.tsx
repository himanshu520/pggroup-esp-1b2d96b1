import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { loadSession } from "@/lib/session";
import { AppShell } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
    const s = await loadSession();
    if (!s) throw redirect({ to: "/auth" });
    if (!s.isAdmin) throw redirect({ to: "/employee" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <Outlet />
    </AppShell>
  );
}
