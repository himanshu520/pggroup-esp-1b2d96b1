import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useState, useMemo } from "react";
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

function getWordCount(val: string) {
  return val.trim() ? val.trim().split(/\s+/).length : 0;
}

function enforceWordLimit(val: string, maxWords: number) {
  let wordCount = 0;
  let inWord = false;
  for (let i = 0; i < val.length; i++) {
    if (/\s/.test(val[i])) {
      inWord = false;
    } else {
      if (!inWord) {
        wordCount++;
        if (wordCount > maxWords) {
          return val.slice(0, i);
        }
      }
      inWord = true;
    }
  }
  return val;
}

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
    location_id: emp?.location_id ?? "",
    plant_id: emp?.plant_id ?? "",
    department_id: emp?.department_id ?? "",
    mobile: emp?.mobile ?? "",
    gender: (emp?.gender === "male" || emp?.gender === "female" || emp?.gender === "other" ? emp.gender : "") as "" | "male" | "female" | "other",
  });
  const [files, setFiles] = useState<File[]>([]);

  const allowedLocationIds = useMemo(() => {
    const ids = new Set<string>();
    if (emp?.location_id) ids.add(emp.location_id);
    for (const r of session?.roles ?? []) {
      if (r.location_id) ids.add(r.location_id);
    }
    return Array.from(ids);
  }, [emp?.location_id, session?.roles]);

  const allowedPlantIds = useMemo(() => {
    const ids = new Set<string>();
    if (emp?.plant_id) ids.add(emp.plant_id);
    for (const r of session?.roles ?? []) {
      if (r.plant_id) ids.add(r.plant_id);
    }
    return Array.from(ids);
  }, [emp?.plant_id, session?.roles]);

  const allowedDepartmentIds = useMemo(() => {
    const ids = new Set<string>();
    if (emp?.department_id) ids.add(emp.department_id);
    for (const r of session?.roles ?? []) {
      if (r.department_id) ids.add(r.department_id);
    }
    return Array.from(ids);
  }, [emp?.department_id, session?.roles]);

  const hasMultiplePlants = allowedPlantIds.length > 1;

  const visibleLocations = useMemo(() => {
    return locations.filter((l) => allowedLocationIds.includes(l.id));
  }, [locations, allowedLocationIds]);

  const visiblePlants = useMemo(() => {
    let list = plants.filter((p) => allowedPlantIds.includes(p.id));
    if (form.location_id) {
      list = list.filter((p) => p.location_id === form.location_id);
    }
    return list;
  }, [plants, allowedPlantIds, form.location_id]);

  const visibleDepartments = useMemo(() => {
    let list = departments.filter((d) => allowedDepartmentIds.includes(d.id));
    if (form.plant_id) {
      list = list.filter((d) => d.plant_id === form.plant_id);
    }
    return list;
  }, [departments, allowedDepartmentIds, form.plant_id]);

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
    if (submitting) return; // Prevent double submissions
    if (!emp) return toast.error("Employee record missing");
    if (!form.title.trim()) return toast.error("Please enter a title");
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
        suggested_method: form.suggested_method.trim() || null,
        expected_benefits: form.expected_benefits.trim() || null,
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
        {/* Section: Classification */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="warning"
            icon={<Lightbulb className="w-4.5 h-4.5" />}
            index="1"
            title={t("sec_2_title")}
            subtitle={t("sec_2_sub")}
          />
          <div className="p-4 sm:p-5 grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("lbl_idea_category")} <span className="text-destructive">*</span></Label>
              <div className="text-[11px] text-muted-foreground">{t("hint_category")}</div>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger className="h-11"><SelectValue placeholder={t("opt_select_category")} /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{t(c.name)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Section: Idea Description */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="primary"
            icon={<Sparkles className="w-4.5 h-4.5" />}
            index="2"
            title={t("sec_3_title")}
            subtitle={t("sec_3_sub")}
          />
          <div className="p-4 sm:p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("lbl_suggestion_title")} <span className="text-destructive">*</span></Label>
              <div className="text-[11px] text-muted-foreground">{t("hint_title")}</div>
              <Input
                placeholder={t("ph_suggestion_title")}
                value={form.title}
                maxLength={200}
                onChange={(e) => setForm({ ...form, title: enforceWordLimit(e.target.value, 50) })}
                className="h-11"
              />
              <div className="text-[10px] text-right text-muted-foreground">
                {getWordCount(form.title)} / 50 {t("words") || "words"}
              </div>
            </div>

            <AccentField
              tone="destructive"
              icon={<AlertCircle className="w-4 h-4" />}
              label={t("lbl_current_problem")}
              hint={t("hint_problem")}
              required
            >
              <Textarea
                rows={3}
                placeholder={t("ph_problem")}
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: enforceWordLimit(e.target.value, 100) })}
              />
              <div className="text-[10px] text-right text-muted-foreground mt-1">
                {getWordCount(form.problem)} / 100 {t("words") || "words"}
              </div>
            </AccentField>

            <AccentField
              tone="primary"
              icon={<Wrench className="w-4 h-4" />}
              label={t("lbl_proposed_solution")}
              hint={t("hint_solution")}
            >
              <Textarea
                rows={3}
                placeholder={t("ph_solution")}
                value={form.suggested_method}
                onChange={(e) => setForm({ ...form, suggested_method: enforceWordLimit(e.target.value, 100) })}
              />
              <div className="text-[10px] text-right text-muted-foreground mt-1">
                {getWordCount(form.suggested_method)} / 100 {t("words") || "words"}
              </div>
            </AccentField>

            <AccentField
              tone="success"
              icon={<TrendingUp className="w-4 h-4" />}
              label={t("lbl_expected_benefits")}
              hint={t("hint_benefits")}
            >
              <Textarea
                rows={3}
                placeholder={t("ph_benefits")}
                value={form.expected_benefits}
                onChange={(e) => setForm({ ...form, expected_benefits: enforceWordLimit(e.target.value, 100) })}
              />
              <div className="text-[10px] text-right text-muted-foreground mt-1">
                {getWordCount(form.expected_benefits)} / 100 {t("words") || "words"}
              </div>
            </AccentField>
          </div>
        </section>

        {/* Section: Employee & Location */}
        <section className="rounded-xl border border-border bg-card">
          <SectionHeader
            tone="primary"
            icon={<User className="w-4.5 h-4.5" />}
            index="3"
            title={t("sec_1_title")}
            subtitle={t("sec_1_sub")}
          />
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <RefField label={t("lbl_full_name")} required>
              <Input value={emp?.name ?? ""} disabled className="h-11 bg-accent/40 border-accent" />
            </RefField>
            <RefField label={t("lbl_employee_id")} required>
              <Input value={emp?.employee_code ?? ""} disabled className="h-11 bg-accent/40 border-accent" />
            </RefField>
            <RefField label={t("lbl_email_address")}>
              <Input value={emp?.email ?? ""} disabled className="h-11 bg-accent/40 border-accent" />
            </RefField>
            <RefField label={t("lbl_mobile_number")} required>
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
                <Label className="text-xs font-bold uppercase tracking-wide">{t("lbl_gender")}</Label>
                <span className="text-destructive">*</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(["male", "female", "other"] as const).map((g) => {
                  const active = form.gender === g;
                  const genderLabel = g === "male" ? t("gender_male") : g === "female" ? t("gender_female") : t("gender_other");
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
                      {genderLabel}
                    </button>
                  );
                })}
              </div>
            </div>
            <RefField label={t("lbl_state_location")} required>
              <Select
                value={form.location_id}
                disabled={!hasMultiplePlants}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, location_id: v, plant_id: "", department_id: "" }));
                }}
              >
                <SelectTrigger className={cn("h-11 border-accent", !hasMultiplePlants && "bg-accent/40 cursor-not-allowed")}><SelectValue placeholder={t("opt_select_state")} /></SelectTrigger>
                <SelectContent>{visibleLocations.map((l) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}</SelectContent>
              </Select>
            </RefField>
            <RefField label={t("lbl_unit_plant")} required>
              <Select
                value={form.plant_id}
                disabled={!hasMultiplePlants || !form.location_id}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, plant_id: v, department_id: "" }));
                }}
              >
                <SelectTrigger className={cn("h-11 border-accent", (!hasMultiplePlants || !form.location_id) && "bg-accent/40 cursor-not-allowed")}><SelectValue placeholder={t("opt_select_plant")} /></SelectTrigger>
                <SelectContent>{visiblePlants.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </RefField>
            <RefField label={t("lbl_department")} required>
              <Select
                value={form.department_id}
                disabled={!hasMultiplePlants || !form.plant_id}
                onValueChange={(v) => setForm((f) => ({ ...f, department_id: v }))}
              >
                <SelectTrigger className={cn("h-11 border-accent", (!hasMultiplePlants || !form.plant_id) && "bg-accent/40 cursor-not-allowed")}><SelectValue placeholder={t("opt_select_dept")} /></SelectTrigger>
                <SelectContent>{visibleDepartments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name} {d.code ? `(${d.code})` : ""}</SelectItem>)}</SelectContent>
              </Select>
            </RefField>
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
              {t("btn_reset_form")}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 px-6 bg-success hover:bg-success/90 text-success-foreground"
            >
              {submitting ? (t("submitting") || "Submitting…") : t("btn_submit_suggestion")}
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
