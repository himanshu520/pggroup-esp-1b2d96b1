import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { loadSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Employee Suggestion Portal (ESP)" },
      { name: "description", content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
    const session = await loadSession();
    if (!session) throw redirect({ to: "/auth" });
    if (session.isAdmin) throw redirect({ to: "/admin" });
    throw redirect({ to: "/employee" });
  },
  component: () => (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#64748b" }}>
      Loading ESP…
    </div>
  ),
});
