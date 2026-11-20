import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell, PageHeader, StatCard } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABEL, type AppRole } from "@/lib/statuses";
import { ShieldCheck, Users, KeyRound, AlertTriangle, Activity, Lock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/security")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "security" } as any }); },
  component: () => null,
});

const POLICY = [
  { icon: KeyRound, label: "Sign-in method", value: "Email + 8-digit OTP", tone: "text-info" },
  { icon: Lock, label: "OTP validity", value: "10 minutes", tone: "text-success" },
  { icon: ShieldCheck, label: "Session timeout", value: "24 hours (auto refresh)", tone: "text-success" },
  { icon: Users, label: "Anonymous sign-ups", value: "Disabled", tone: "text-success" },
  { icon: AlertTriangle, label: "Password reuse policy", value: "N/A (passwordless)", tone: "text-muted-foreground" },
  { icon: Activity, label: "Audit logging", value: "Enabled — all admin actions", tone: "text-success" },
];

const FILE_UPLOAD = [
  { k: "Max file size", v: "10 MB per file" },
  { k: "Allowed types", v: "PDF, DOCX, XLSX, PNG, JPG" },
  { k: "Storage bucket", v: "suggestion-files (private)" },
  { k: "Access control", v: "Row-Level Security enforced" },
];

export function SecurityPage() {
  const { data: roles = [] } = useQuery({
    queryKey: ["sec-roles"],
    queryFn: async () => (await supabase.from("user_roles").select("role,user_id")).data ?? [],
  });
  const { data: audits = [] } = useQuery({
    queryKey: ["sec-audits"],
    queryFn: async () =>
      (await supabase
        .from("audit_logs")
        .select("id,action,entity_type,entity_id,actor_id,created_at,meta")
        .order("created_at", { ascending: false })
        .limit(15)
      ).data ?? [],
  });

  const stats = useMemo(() => {
    const admins = new Set(roles.filter((r: any) => ["super_admin","corporate_admin","location_admin","plant_admin","department_admin"].includes(r.role)).map((r: any) => r.user_id));
    const totalUsers = new Set(roles.map((r: any) => r.user_id)).size;
    const superAdmins = roles.filter((r: any) => r.role === "super_admin").length;
    return { admins: admins.size, totalUsers, superAdmins, roleAssignments: roles.length };
  }, [roles]);

  const roleBreakdown = useMemo(() => {
    const map = new Map<AppRole, number>();
    for (const r of roles as any[]) map.set(r.role, (map.get(r.role) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [roles]);

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader title="Security" description="Session policy, authentication rules, and audit visibility." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={stats.totalUsers} tone="info" icon={Users} />
        <StatCard label="Admin Users" value={stats.admins} tone="accent" icon={ShieldCheck} />
        <StatCard label="Super Admins" value={stats.superAdmins} tone="warning" icon={KeyRound} />
        <StatCard label="Role Assignments" value={stats.roleAssignments} tone="success" icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-base font-bold mb-1">Authentication Policy</div>
          <div className="text-xs text-muted-foreground mb-4">Current sign-in and session configuration.</div>
          <div className="space-y-3">
            {POLICY.map((p) => (
              <div key={p.label} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="grid place-items-center w-8 h-8 rounded-md bg-muted"><p.icon className={`w-4 h-4 ${p.tone}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.label}</div>
                </div>
                <div className={`text-xs font-semibold ${p.tone}`}>{p.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-base font-bold mb-1">File Upload Rules</div>
          <div className="text-xs text-muted-foreground mb-4">Attachment constraints applied to all suggestions.</div>
          <div className="divide-y divide-border/50">
            {FILE_UPLOAD.map((r) => (
              <div key={r.k} className="flex items-center justify-between py-3 text-sm">
                <span className="text-muted-foreground">{r.k}</span>
                <span className="font-medium">{r.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-info/10 border border-info/30 p-3 text-xs text-info">
            Row-Level Security policies ensure users can only access files linked to suggestions they are authorized to view.
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-base font-bold mb-4">Role Distribution</div>
          {roleBreakdown.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No roles assigned yet.</div>
          ) : (
            <div className="space-y-2">
              {roleBreakdown.map(([role, count]) => {
                const max = roleBreakdown[0][1];
                const pct = (count / max) * 100;
                return (
                  <div key={role}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{ROLE_LABEL[role]}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-base font-bold mb-1">Recent Audit Activity</div>
          <div className="text-xs text-muted-foreground mb-4">Latest 15 system-tracked events.</div>
          {audits.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No audit events recorded yet.</div>
          ) : (
            <div className="max-h-[380px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audits.map((a: any) => (
                    <TableRow key={a.id}>
                      <TableCell><Badge variant="outline" className="font-mono text-[10px]">{a.action}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.entity_type}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
