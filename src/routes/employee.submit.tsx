import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, FileText, Lightbulb, Sparkles, Wrench, TrendingUp, AlertCircle, User, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";
import { notifyNewSuggestion } from "@/lib/workflow.functions";
import { useT } from "@/lib/i18n";

type Priority = Database["public"]["Enums"]["priority_level"];

export const Route = createFileRoute("/employee/submit")({
  beforeLoad: () => { throw redirect({ to: "/employee", search: { section: "submit" } as any }); },
  component: () => null,
});

export function SubmitForm() {
  const { data: session } = useSession();
  const emp = session?.employee;
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const t = useT();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").eq("active", true).order("sort_order").order("name")).data ?? [],
  });
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => (await supabase.from("locations").select("*").eq("active", true).order("location")).data ?? [],
  });
  const { data: plants = [] } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => (await supabase.from("plants").select("*").eq("active", true).order("name")).data ?? [],
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await supabase.from("departments").select("*").eq("active", true).order("name")).data ?? [],
  });

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    problem: "",
    current_method: "",
    suggested_method: "",
    expected_benefits: "",
    expected_saving: "",
    implementation_cost: "",
    priority: "medium" as Priority,
    budget_tier: "" as "" | "no_cost" | "low_cost" | "investment",
    location_id: emp?.location_id ?? "",
    plant_id: emp?.plant_id ?? "",
    department_id: emp?.department_id ?? "",
    mobile: emp?.mobile ?? "",
    gender: (emp?.gender === "male" || emp?.gender === "female" || emp?.gender === "other" ? emp.gender : "") as "" | "male" | "female" | "other",
  });
  const [files, setFiles] = useState<File[]>([]);

  // Auto-populate hierarchy + gender + mobile from employee record once loaded
  if (emp && !form.location_id && emp.location_id) {
    setForm((f) => ({
      ...f,
      location_id: emp.location_id ?? "",
      plant_id: emp.plant_id ?? "",
      department_id: emp.department_id ?? "",
      mobile: f.mobile || (emp.mobile ?? ""),
      gender: f.gender || (emp.gender === "male" || emp.gender === "female" || emp.gender === "other" ? emp.gender : ""),
    }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const arr = Array.from(fileList);
    setFiles((prev) => [...prev, ...arr].slice(0, 10));
  }

  async function submit() {
    if (!emp) return toast.error("Employee record missing");
    if (!form.title.trim()) return toast.error("Please enter a title");
    if (!form.suggested_method.trim()) return toast.error("Please describe your proposed solution");
    if (!form.location_id || !form.plant_id || !form.department_id) {
      return toast.error("Please select state, unit and department");
    }
    setSubmitting(true);
    try {
      const { data: inserted, error } = await supabase.from("suggestions").insert({
        employee_id: emp.id,
        title: form.title.trim(),
        category_id: form.category_id || null,
        problem: form.problem || null,
        current_method: form.current_method || null,
        suggested_method: form.suggested_method,
        expected_benefits: form.expected_benefits || null,
        expected_saving: form.expected_saving ? Number(form.expected_saving) : null,
        implementation_cost: form.implementation_cost ? Number(form.implementation_cost) : null,
        priority: form.priority,
        location_id: form.location_id,
        plant_id: form.plant_id,
        department_id: form.department_id,
        status: "pe_review",
      }).select("id, code").single();
      if (error) throw error;

      for (const file of files) {
        const path = `${inserted.id}/${crypto.randomUUID()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("suggestion-files").upload(path, file, { contentType: file.type });
        if (upErr) { toast.warning(`Failed to upload ${file.name}`); continue; }
        await supabase.from("attachments").insert({
          suggestion_id: inserted.id,
          file_path: path,
          file_name: file.name,
          content_type: file.type,
          kind: "attachment",
          uploaded_by: session?.userId,
        });
      }

      await supabase.from("suggestion_history").insert({
        suggestion_id: inserted.id,
        from_status: "submitted",
        to_status: "pe_review",
        actor_id: session?.userId,
        remarks: "Submitted by employee",
      });

      try { await notifyNewSuggestion({ data: { suggestion_id: inserted.id } }); } catch { /* non-fatal */ }

      toast.success(`Suggestion ${inserted.code} submitted successfully`);
      qc.invalidateQueries({ queryKey: ["my-suggestions"] });
      navigate({ to: "/employee/my" });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <EmployeeShell>
      <PageHeader
        title={t("submit_title")}
        description={t("submit_desc")}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="space-y-5 pb-24"
      >
        {/* Section: Employee & Location */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="primary"
            icon={<User className="w-4.5 h-4.5" />}
            index="1"
            title="Employee & Work Location"
            subtitle="Your identity and posting"
          />
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <RefField label="Full Name" required>
              <Input value={emp?.name ?? ""} disabled className="h-11 bg-accent/40 border-accent" />
            </RefField>
            <RefField label="Employee ID" required>
              <Input value={emp?.employee_code ?? ""} disabled className="h-11 bg-accent/40 border-accent" />
            </RefField>
            <RefField label="Email Address">
              <Input value={emp?.email ?? ""} disabled className="h-11 bg-accent/40 border-accent" />
            </RefField>
            <RefField label="Mobile Number" required>
              <Input
                type="tel"
                inputMode="tel"
                placeholder="—"
                value={form.mobile}
                disabled
                className="h-11 bg-accent/40 border-accent cursor-not-allowed"
              />
            </RefField>
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-bold uppercase tracking-wide">Gender</Label>
                <span className="text-destructive">*</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(["male", "female", "other"] as const).map((g) => {
                  const active = form.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      disabled
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border h-11 px-2 sm:px-3 text-sm font-medium capitalize transition-all cursor-not-allowed opacity-60",
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary text-primary opacity-100 font-bold"
                          : "border-accent bg-accent/40 text-foreground",
                      )}
                    >
                      <span className={cn(
                        "grid place-items-center w-4 h-4 rounded-full border-2 shrink-0",
                        active ? "border-primary" : "border-muted-foreground/40",
                      )}>
                        {active && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </span>
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
            <RefField label="State / Location" required>
              <Select value={form.location_id} disabled>
                <SelectTrigger className="h-11 bg-accent/40 border-accent"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}</SelectContent>
              </Select>
            </RefField>
            <RefField label="Unit / Plant" required>
              <Select value={form.plant_id} disabled>
                <SelectTrigger className="h-11 bg-accent/40 border-accent"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{plants.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </RefField>
            <RefField label="Department" required>
              <Select value={form.department_id} disabled>
                <SelectTrigger className="h-11 bg-accent/40 border-accent"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </RefField>
          </div>
        </section>

        {/* Section: Classification & Budget */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="warning"
            icon={<Lightbulb className="w-4.5 h-4.5" />}
            index="2"
            title="Classification & Budget"
            subtitle="Categorise your idea"
          />
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Idea Category <span className="text-destructive">*</span></Label>
              <div className="text-[11px] text-muted-foreground">Which category does your idea fall under?</div>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Implementation Budget <span className="text-destructive">*</span></Label>
              <div className="text-[11px] text-muted-foreground">Estimated budget to execute this</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "no_cost", label: "No Cost", hint: "Method changes only" },
                  { id: "low_cost", label: "Low Cost", hint: "Minor expense" },
                  { id: "investment", label: "Investment", hint: "Budget required" },
                ].map((b) => {
                  const active = form.budget_tier === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setForm({ ...form, budget_tier: b.id as any })}
                      className={cn(
                        "text-left rounded-lg border p-2.5 transition-all",
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                          : "border-border bg-background hover:border-primary/40",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-3 h-3 rounded-full border-2 shrink-0", active ? "border-primary bg-primary" : "border-muted-foreground/40")} />
                        <div className="text-xs font-semibold">{b.label}</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{b.hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Idea Description */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="primary"
            icon={<Sparkles className="w-4.5 h-4.5" />}
            index="3"
            title="Idea Description"
            subtitle="Tell us about your improvement"
          />
          <div className="p-4 sm:p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Suggestion Title / Subject <span className="text-destructive">*</span></Label>
              <div className="text-[11px] text-muted-foreground">A clear, concise headline</div>
              <Input
                placeholder="Short, descriptive title for your idea..."
                value={form.title}
                maxLength={200}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11"
              />
            </div>

            <AccentField
              tone="destructive"
              icon={<AlertCircle className="w-4 h-4" />}
              label="Current Problem / Situation"
              hint="Concern, bottleneck, defect, or safety hazard"
              required
            >
              <Textarea
                rows={3}
                placeholder="Describe the current issue in detail..."
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
              />
            </AccentField>

            <AccentField
              tone="primary"
              icon={<Wrench className="w-4 h-4" />}
              label="Your Proposed Solution"
              hint="How would you solve or improve this?"
              required
            >
              <Textarea
                rows={3}
                placeholder="Explain your idea to solve the problem..."
                value={form.suggested_method}
                onChange={(e) => setForm({ ...form, suggested_method: e.target.value })}
              />
            </AccentField>

            <AccentField
              tone="success"
              icon={<TrendingUp className="w-4 h-4" />}
              label="Expected Benefits / Impact"
              hint="Cost savings, safety, cycle time, quality..."
              required
            >
              <Textarea
                rows={3}
                placeholder="Positive impacts of your idea..."
                value={form.expected_benefits}
                onChange={(e) => setForm({ ...form, expected_benefits: e.target.value })}
              />
            </AccentField>

          </div>
        </section>

        {/* Section: Attachments */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="primary"
            icon={<Paperclip className="w-4.5 h-4.5" />}
            index="4"
            title="Attachments (Optional)"
            subtitle="Images, PDF, Excel, video — up to 10 files"
          />
          <div className="p-4 sm:p-5 space-y-3">
            <label className="block border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm font-medium">Tap or drop files here</div>
              <div className="text-xs text-muted-foreground mt-1">Up to 10 files</div>
            </label>
            {files.length > 0 && (
              <ul className="divide-y divide-border rounded-md border border-border">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 px-3 py-2">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button type="button" className="p-1 hover:bg-muted rounded shrink-0" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Sticky submit bar (mobile-friendly) */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background/95 backdrop-blur border-t border-border p-3 sm:p-4 z-20">
          <div className="max-w-[1500px] mx-auto flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm({
                  title: "",
                  category_id: "",
                  problem: "",
                  current_method: "",
                  suggested_method: "",
                  expected_benefits: "",
                  expected_saving: "",
                  implementation_cost: "",
                  priority: "medium",
                  budget_tier: "",
                  location_id: emp?.location_id ?? "",
                  plant_id: emp?.plant_id ?? "",
                  department_id: emp?.department_id ?? "",
                  mobile: emp?.mobile ?? "",
                  gender: (emp?.gender === "male" || emp?.gender === "female" || emp?.gender === "other" ? emp.gender : "") as any,
                });
                setFiles([]);
              }}
              className="h-11 px-4"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 px-6 bg-success hover:bg-success/90 text-success-foreground"
            >
              {submitting ? "Submitting…" : "Submit Suggestion"}
            </Button>
          </div>
        </div>
      </form>
    </EmployeeShell>
  );
}

function RefField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <Label className="text-xs font-bold uppercase tracking-wide">{label}</Label>
        {required && <span className="text-destructive">*</span>}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({
  tone,
  icon,
  index,
  title,
  subtitle,
}: {
  tone: "primary" | "warning";
  icon: React.ReactNode;
  index: string;
  title: string;
  subtitle: string;
}) {
  const bg = tone === "warning" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary";
  return (
    <header className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-border">
      <div className={cn("grid place-items-center w-9 h-9 rounded-lg shrink-0", bg)}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Section {index}</div>
        <div className="text-sm font-semibold truncate">{title}</div>
        <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>
      </div>
    </header>
  );
}

const TONE_MAP = {
  destructive: { bar: "before:bg-destructive", text: "text-destructive", ring: "border-destructive/20", bg: "bg-destructive/5" },
  primary: { bar: "before:bg-primary", text: "text-primary", ring: "border-primary/20", bg: "bg-primary/5" },
  success: { bar: "before:bg-success", text: "text-success", ring: "border-success/20", bg: "bg-success/5" },
} as const;

function AccentField({
  tone,
  icon,
  label,
  hint,
  required,
  children,
}: {
  tone: keyof typeof TONE_MAP;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const t = TONE_MAP[tone];
  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 pl-5",
        "before:content-[''] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-r",
        t.ring,
        t.bg,
        t.bar,
      )}
    >
      <div className={cn("flex items-center gap-2 text-xs font-semibold", t.text)}>
        {icon}
        <span>
          {label} {required && <span className="text-destructive">*</span>}
        </span>
      </div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}
