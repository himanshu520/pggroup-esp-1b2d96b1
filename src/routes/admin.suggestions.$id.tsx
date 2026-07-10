import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession, isSuggestionAccessible } from "@/lib/session";
import { STATUS_LABEL } from "@/lib/statuses";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { peTransferSuggestion, deptDecide, deptStartImplementation, deptSubmitEvidence, peVerify } from "@/lib/workflow.functions";
import { toast } from "sonner";
import { Send, ThumbsUp, ThumbsDown, PlayCircle, Upload, Check, AlertTriangle, Loader2, Paperclip, X, FileText, History } from "lucide-react";
import { cn } from "@/lib/utils";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/admin/suggestions/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/admin", search: { section: "suggestion", id: params.id } as any });
  },
  component: () => null,
});

export function SuggestionDetail({ id }: { id: string }) {
  const validId = !!id && UUID_RE.test(id);

  useEffect(() => {
    if (!validId) toast.error("Invalid suggestion link", { description: "Missing or malformed suggestion ID." });
  }, [validId]);

  const { data: session } = useSession();
  const qc = useQueryClient();

  const { data: sug, isLoading: sugLoading, isError: sugError } = useQuery({
    enabled: validId,
    queryKey: ["suggestion", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("suggestions").select("*, employees(name, employee_code, email), categories(name), departments!suggestions_department_id_fkey(name), plants(name), locations(location)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const { data: history = [], isLoading: histLoading } = useQuery({
    enabled: validId,
    queryKey: ["suggestion-history", id],
    queryFn: async () => (await supabase.from("suggestion_history").select("*").eq("suggestion_id", id).order("created_at")).data ?? [],
  });
  const { data: evidenceVersions = [] } = useQuery({
    enabled: validId,
    queryKey: ["suggestion-evidence", id],
    queryFn: async () => {
      const { data: evs } = await supabase
        .from("evidence")
        .select("*")
        .eq("suggestion_id", id)
        .order("version", { ascending: false });
      const ids = (evs ?? []).map((e: any) => e.id);
      const { data: atts } = ids.length
        ? await supabase.from("attachments").select("*").in("evidence_id", ids)
        : { data: [] as any[] };
      return (evs ?? []).map((e: any) => ({
        ...e,
        attachments: (atts ?? []).filter((a: any) => a.evidence_id === e.id),
      }));
    },
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["depts"],
    queryFn: async () => (await supabase.from("departments").select("*").eq("active", true)).data ?? [],
  });

  const transferFn = useServerFn(peTransferSuggestion);
  const decideFn = useServerFn(deptDecide);
  const startFn = useServerFn(deptStartImplementation);
  const evidenceFn = useServerFn(deptSubmitEvidence);
  const verifyFn = useServerFn(peVerify);

  const [remarks, setRemarks] = useState("");
  const [targetDept, setTargetDept] = useState("");
  const [evidenceRemarks, setEvidenceRemarks] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [benefits, setBenefits] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Accepted evidence file types
  const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".mp4", ".mov"];
  const ACCEPTED_ATTR = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,video/mp4,video/quicktime";
  const MAX_FILE_MB = 20;
  const MAX_FILES = 10;

  function validateFiles(files: File[]): { valid: File[]; errors: string[] } {
    const errors: string[] = [];
    const valid: File[] = [];
    for (const f of files) {
      const ext = ("." + (f.name.split(".").pop() ?? "")).toLowerCase();
      if (!ACCEPTED_EXT.includes(ext)) {
        errors.push(`${f.name}: unsupported type`);
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        errors.push(`${f.name}: exceeds ${MAX_FILE_MB}MB`);
        continue;
      }
      valid.push(f);
    }
    return { valid, errors };
  }

  function handleEvidenceFiles(list: FileList | null) {
    if (!list) return;
    const { valid, errors } = validateFiles(Array.from(list));
    errors.forEach((e) => toast.error("File rejected", { description: e }));
    setEvidenceFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_FILES) {
        toast.warning(`Only ${MAX_FILES} files allowed`, { description: `Extra files ignored.` });
      }
      return combined.slice(0, MAX_FILES);
    });
  }

  async function submitEvidenceWithFiles() {
    setUploading(true);
    const attachmentIds: string[] = [];
    const uploadedNames: string[] = [];
    try {
      for (const file of evidenceFiles) {
        const path = `${id}/evidence/${crypto.randomUUID()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("suggestion-files").upload(path, file, { contentType: file.type });
        if (upErr) {
          toast.error(`Upload failed: ${file.name}`, { description: upErr.message });
          continue;
        }
        const { data: attRow, error: attErr } = await supabase.from("attachments").insert({
          suggestion_id: id,
          file_path: path,
          file_name: file.name,
          content_type: file.type,
          kind: "evidence",
          uploaded_by: session?.userId,
        }).select("id").single();
        if (attErr || !attRow) {
          toast.error(`Failed to record: ${file.name}`, { description: attErr?.message });
          continue;
        }
        attachmentIds.push((attRow as any).id);
        uploadedNames.push(file.name);
      }
      await evidenceFn({ data: {
        suggestion_id: id,
        remarks: evidenceRemarks,
        actual_cost: actualCost ? Number(actualCost) : null,
        benefits_achieved: benefits,
        attachment_ids: attachmentIds,
        file_names: uploadedNames,
      } });
      toast.success("Evidence submitted", { description: `${uploadedNames.length} file${uploadedNames.length === 1 ? "" : "s"} attached` });
      setEvidenceFiles([]);
      setEvidenceRemarks(""); setActualCost(""); setBenefits("");
      qc.invalidateQueries({ queryKey: ["suggestion", id] });
      qc.invalidateQueries({ queryKey: ["suggestion-history", id] });
      qc.invalidateQueries({ queryKey: ["suggestion-evidence", id] });
    } catch (e: any) {
      toast.error("Failed to submit evidence", { description: e.message ?? "Unknown error" });
    } finally {
      setUploading(false);
    }
  }

  async function run(fn: () => Promise<any>, label: string) {
    try {
      await fn();
      toast.success(label);
      qc.invalidateQueries({ queryKey: ["suggestion", id] });
      qc.invalidateQueries({ queryKey: ["suggestion-history", id] });
    } catch (e: any) { toast.error(e.message ?? "Action failed"); }
  }

  if (!validId) {
    return (
      <AppShell navGroups={ADMIN_NAV} title="Admin Console">
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm">
          <div className="font-medium text-destructive mb-1">Invalid suggestion link</div>
          <div className="text-muted-foreground">The suggestion ID is missing or malformed. Please open the suggestion from the list.</div>
        </div>
      </AppShell>
    );
  }

  if (sugLoading || histLoading) {
    return (
      <AppShell navGroups={ADMIN_NAV} title="Admin Console">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading suggestion…</div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-24 rounded-lg border border-border bg-muted/30 animate-pulse" />
              <div className="h-32 rounded-lg border border-border bg-muted/30 animate-pulse" />
              <div className="h-32 rounded-lg border border-border bg-muted/30 animate-pulse" />
            </div>
            <div className="h-64 rounded-lg border border-border bg-muted/30 animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (sugError || !sug) {
    return (
      <AppShell navGroups={ADMIN_NAV} title="Admin Console">
        <div className="rounded-lg border border-border bg-card p-6 text-sm">
          <div className="font-medium mb-1">Suggestion not found</div>
          <div className="text-muted-foreground">It may have been removed, or you don't have access.</div>
        </div>
      </AppShell>
    );
  }

  if (session?.roles && !isSuggestionAccessible(sug, session.roles)) {
    return (
      <AppShell navGroups={ADMIN_NAV} title="Admin Console">
        <div className="rounded-lg border border-border bg-card p-6 text-sm">
          <div className="font-medium mb-1">Access Denied</div>
          <div className="text-muted-foreground">You do not have access to view this suggestion.</div>
        </div>
      </AppShell>
    );
  }

  const isPE = session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin";
  const status = sug.status;

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title={sug.title}
        description={<span className="font-mono text-xs">{sug.code}</span> as any}
        actions={<div className="flex items-center gap-2"><StatusBadge status={sug.status} /><PriorityBadge priority={sug.priority} /></div>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {isPE && <Meta label="Employee" value={`${sug.employees?.name} (${sug.employees?.employee_code})`} />}
              <Meta label="Category" value={sug.categories?.name} />
              <Meta label="Owner department" value={sug.departments?.name} />
              <Meta label="Plant" value={sug.plants?.name} />
              <Meta label="Location" value={sug.locations?.location} />
            </div>
          </Card>

          <Card title="Problem">{sug.problem}</Card>
          <Card title="Current method">{sug.current_method}</Card>
          <Card title="Suggested method">{sug.suggested_method}</Card>
          <Card title="Expected benefits">{sug.expected_benefits}</Card>

          {/* Actions */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="text-sm font-medium">Actions</div>

            {isPE && (status === "submitted" || status === "pe_review") && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">PE — Transfer to concern department</div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={targetDept} onValueChange={setTargetDept}>
                    <SelectTrigger className="w-64"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{departments.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Textarea placeholder="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-[38px] max-w-md" />
                  <Button disabled={!targetDept} onClick={() => run(() => transferFn({ data: { suggestion_id: id, target_department_id: targetDept, remarks } }), "Transferred to department")}><Send className="w-4 h-4" /> Transfer</Button>
                </div>
              </div>
            )}

            {(status === "dept_review" || status === "transferred") && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Department — Decide</div>
                <Textarea placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="max-w-lg" />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => run(() => decideFn({ data: { suggestion_id: id, decision: "approve", remarks } }), "Approved")}><ThumbsUp className="w-4 h-4" /> Approve</Button>
                  <Button variant="destructive" onClick={() => run(() => decideFn({ data: { suggestion_id: id, decision: "reject", remarks } }), "Rejected")}><ThumbsDown className="w-4 h-4" /> Reject</Button>
                  <Select value={targetDept} onValueChange={setTargetDept}>
                    <SelectTrigger className="w-56"><SelectValue placeholder="Or transfer to…" /></SelectTrigger>
                    <SelectContent>{departments.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="outline" disabled={!targetDept} onClick={() => run(() => decideFn({ data: { suggestion_id: id, decision: "transfer", target_department_id: targetDept, remarks } }), "Transferred")}><Send className="w-4 h-4" /> Transfer</Button>
                </div>
              </div>
            )}

            {status === "approved" && (
              <div className="flex items-center gap-2">
                <Button onClick={() => run(() => startFn({ data: { suggestion_id: id } }), "Implementation started")}><PlayCircle className="w-4 h-4" /> Start implementation</Button>
              </div>
            )}

            {(status === "implementation" || status === "evidence_pending" || status === "fake_closure" || status === "reopened") && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Department — Submit evidence</div>
                <div className="grid md:grid-cols-2 gap-2 max-w-2xl">
                  <input type="number" placeholder="Actual cost (₹)" value={actualCost} onChange={(e) => setActualCost(e.target.value)} className="border border-input rounded-md px-3 py-1.5 text-sm bg-background" />
                  <input type="text" placeholder="Benefits achieved" value={benefits} onChange={(e) => setBenefits(e.target.value)} className="border border-input rounded-md px-3 py-1.5 text-sm bg-background" />
                </div>
                <Textarea placeholder="Completion remarks" value={evidenceRemarks} onChange={(e) => setEvidenceRemarks(e.target.value)} className="max-w-2xl" />
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleEvidenceFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "max-w-2xl block border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors",
                    dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  )}
                >
                  <input type="file" multiple accept={ACCEPTED_ATTR} className="hidden" onChange={(e) => handleEvidenceFiles(e.target.files)} />
                  <Paperclip className="w-6 h-6 mx-auto text-muted-foreground mb-1.5" />
                  <div className="text-sm font-medium">Drag & drop files here, or click to browse</div>
                  <div className="text-xs text-muted-foreground mt-1">Images, PDF, Word, Excel, PowerPoint, MP4/MOV, TXT, CSV</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Max {MAX_FILES} files · up to {MAX_FILE_MB}MB each · {evidenceFiles.length}/{MAX_FILES} selected</div>
                </label>
                {evidenceFiles.length > 0 && (
                  <ul className="max-w-2xl divide-y divide-border rounded-md border border-border">
                    {evidenceFiles.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 px-3 py-2">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <button type="button" className="p-1 hover:bg-muted rounded shrink-0" onClick={() => setEvidenceFiles(evidenceFiles.filter((_, j) => j !== i))}>
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <Button disabled={uploading} onClick={submitEvidenceWithFiles}><Upload className="w-4 h-4" /> {uploading ? "Submitting…" : "Submit evidence"}</Button>
              </div>
            )}

            {isPE && (status === "pe_verification" || status === "evidence_submitted") && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">PE — Final verification</div>
                <Textarea placeholder="Verification remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="max-w-lg" />
                <div className="flex gap-2">
                  <Button onClick={() => run(() => verifyFn({ data: { suggestion_id: id, outcome: "implemented", remarks } }), "Marked implemented")}><Check className="w-4 h-4" /> Mark implemented</Button>
                  <Button variant="destructive" onClick={() => run(() => verifyFn({ data: { suggestion_id: id, outcome: "fake_closure", remarks } }), "Marked fake closure")}><AlertTriangle className="w-4 h-4" /> Fake closure</Button>
                </div>
              </div>
            )}

            {(status === "implemented" || status === "closed" || status === "rejected") && (
              <div className="text-sm text-muted-foreground">This suggestion is closed — no further actions.</div>
            )}
          </div>

          {/* Evidence history (versioned) */}
          {evidenceVersions.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-primary" />
                <div className="text-sm font-medium">Evidence History</div>
                <span className="text-xs text-muted-foreground">({evidenceVersions.length} version{evidenceVersions.length === 1 ? "" : "s"})</span>
              </div>
              <div className="space-y-3">
                {evidenceVersions.map((ev: any, idx: number) => (
                  <div key={ev.id} className={cn(
                    "rounded-md border p-3",
                    idx === 0 ? "border-primary/40 bg-primary/5" : "border-border bg-background",
                  )}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5">v{ev.version}</span>
                        {idx === 0 && <span className="text-[11px] font-medium text-primary">Latest</span>}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{new Date(ev.created_at).toLocaleString()}</div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      {ev.actual_cost != null && <div><span className="text-muted-foreground">Actual cost:</span> ₹ {Number(ev.actual_cost).toLocaleString()}</div>}
                      {ev.benefits_achieved && <div><span className="text-muted-foreground">Benefits:</span> {ev.benefits_achieved}</div>}
                    </div>
                    {ev.remarks && <div className="text-xs mt-1"><span className="text-muted-foreground">Remarks:</span> {ev.remarks}</div>}
                    {ev.attachments?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {ev.attachments.map((a: any) => (
                          <li key={a.id} className="flex items-center gap-2 text-xs">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <button
                              type="button"
                              className="text-primary hover:underline truncate text-left"
                              onClick={async () => {
                                const { data, error } = await supabase.storage.from("suggestion-files").createSignedUrl(a.file_path, 3600);
                                if (error || !data?.signedUrl) return toast.error("Could not open file");
                                window.open(data.signedUrl, "_blank");
                              }}
                            >{a.file_name}</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* Timeline */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-sm font-medium mb-3">Timeline</div>
          <ol className="space-y-4 relative">
            {history.map((h, i) => (
              <li key={h.id} className="relative pl-6">
                <div className="absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" />
                {i < history.length - 1 && <div className="absolute left-2 top-3 bottom-[-1rem] w-px bg-border" />}
                <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                <div className="text-sm font-medium">{STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL]}</div>
                {h.remarks && <div className="text-xs text-muted-foreground mt-0.5">{h.remarks}</div>}
              </li>
            ))}
            {history.length === 0 && <li className="text-xs text-muted-foreground">No activity yet.</li>}
          </ol>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      {title && <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</div>}
      <div className="text-sm whitespace-pre-wrap">{children}</div>
    </div>
  );
}
function Meta({ label, value }: { label: string; value: any }) {
  return (<div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-0.5 font-medium">{value || "—"}</div></div>);
}
