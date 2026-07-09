import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RotateCcw, Building2, Bell, Sliders, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "settings" } as any }); },
  component: () => null,
});

type Settings = {
  portalName: string;
  organization: string;
  supportEmail: string;
  welcomeMessage: string;
  defaultPriority: "low" | "medium" | "high" | "critical";
  autoAssignPE: boolean;
  requireEvidence: boolean;
  reviewSlaDays: number;
  implementationSlaDays: number;
  notifyOnSubmit: boolean;
  notifyOnApproval: boolean;
  notifyOnImplementation: boolean;
  digestFrequency: "off" | "daily" | "weekly";
};

const DEFAULTS: Settings = {
  portalName: "PG Suggestion Portal",
  organization: "PG Group",
  supportEmail: "support@pggroup.com",
  welcomeMessage: "Share your ideas to improve safety, quality, and productivity across every plant.",
  defaultPriority: "medium",
  autoAssignPE: true,
  requireEvidence: true,
  reviewSlaDays: 5,
  implementationSlaDays: 30,
  notifyOnSubmit: true,
  notifyOnApproval: true,
  notifyOnImplementation: true,
  digestFrequency: "weekly",
};

const KEY = "esp.settings.v1";

export function SettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  function update<K extends keyof Settings>(k: K, v: Settings[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
    setDirty(true);
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(s));
    setDirty(false);
    toast.success("Settings saved");
  }

  function reset() {
    setS(DEFAULTS);
    setDirty(true);
    toast.info("Restored defaults — remember to save");
  }

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Settings"
        description="Global configuration for portal identity, workflow, and notifications."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4" /> Reset</Button>
            <Button onClick={save} disabled={!dirty}><Save className="w-4 h-4" /> Save Changes</Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Branding */}
        <Section icon={Building2} title="Portal Identity" desc="How the portal introduces itself to employees.">
          <Field label="Portal name">
            <Input value={s.portalName} onChange={(e) => update("portalName", e.target.value)} />
          </Field>
          <Field label="Organization">
            <Input value={s.organization} onChange={(e) => update("organization", e.target.value)} />
          </Field>
          <Field label="Support email">
            <Input type="email" value={s.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} />
          </Field>
          <Field label="Welcome message">
            <Textarea rows={3} value={s.welcomeMessage} onChange={(e) => update("welcomeMessage", e.target.value)} />
          </Field>
        </Section>

        {/* Workflow */}
        <Section icon={Sliders} title="Workflow Defaults" desc="Default rules applied when a suggestion is submitted.">
          <Field label="Default priority">
            <Select value={s.defaultPriority} onValueChange={(v) => update("defaultPriority", v as Settings["defaultPriority"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Review SLA (days)">
            <Input type="number" min={1} max={90} value={s.reviewSlaDays} onChange={(e) => update("reviewSlaDays", Number(e.target.value) || 1)} />
          </Field>
          <Field label="Implementation SLA (days)">
            <Input type="number" min={1} max={365} value={s.implementationSlaDays} onChange={(e) => update("implementationSlaDays", Number(e.target.value) || 1)} />
          </Field>
          <Toggle label="Auto-assign to PE for initial review" checked={s.autoAssignPE} onChange={(v) => update("autoAssignPE", v)} />
          <Toggle label="Require evidence before closure" checked={s.requireEvidence} onChange={(v) => update("requireEvidence", v)} />
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications" desc="Which lifecycle events send an in-app notification.">
          <Toggle label="Notify on submission" checked={s.notifyOnSubmit} onChange={(v) => update("notifyOnSubmit", v)} />
          <Toggle label="Notify on approval" checked={s.notifyOnApproval} onChange={(v) => update("notifyOnApproval", v)} />
          <Toggle label="Notify on implementation" checked={s.notifyOnImplementation} onChange={(v) => update("notifyOnImplementation", v)} />
          <Field label="Admin digest frequency">
            <Select value={s.digestFrequency} onValueChange={(v) => update("digestFrequency", v as Settings["digestFrequency"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Section>

        {/* Email */}
        <Section icon={Mail} title="Email Delivery" desc="Read-only summary of the transactional email channel.">
          <Row k="Provider" v="SMTP (Office 365)" />
          <Row k="From address" v={s.supportEmail} />
          <Row k="OTP delivery" v="Enabled" />
          <Row k="Retry policy" v="3 attempts, exponential backoff" />
          <div className="mt-3 rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
            SMTP credentials are managed as encrypted backend secrets. Contact a super admin to rotate.
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="grid place-items-center w-9 h-9 rounded-md bg-primary/10 text-primary"><Icon className="w-4 h-4" /></div>
        <div>
          <div className="text-base font-bold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <Label className="text-sm">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
