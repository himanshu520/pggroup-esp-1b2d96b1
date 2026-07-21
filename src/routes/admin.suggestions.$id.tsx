import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, BudgetBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession, isSuggestionAccessible } from "@/lib/session";
import { STATUS_LABEL, getHistoryActionText, getEffectiveHistory } from "@/lib/statuses";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { peTransferSuggestion, peRejectSuggestion, deptDecide, deptStartImplementation, deptSubmitEvidence, peVerify, peRejectReturn, selectBestSuggestion } from "@/lib/workflow.functions";
import { toast } from "sonner";
import { Send, ThumbsUp, ThumbsDown, PlayCircle, Upload, Check, AlertTriangle, Loader2, Paperclip, X, FileText, History, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeBadges } from "@/components/employee-badges";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getDeptDisplay = (dept: any) => {
  if (!dept) return "—";
  return dept.name + (dept.code ? ` (${dept.code})` : "");
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
      const { data, error } = await supabase.from("suggestions").select("*, employees(name, employee_code, email), categories(name), departments!suggestions_department_id_fkey(name, code), current_departments:departments!suggestions_current_department_id_fkey(name, code), plants(name), locations(location)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const { data: history = [], isLoading: histLoading } = useQuery({
    enabled: validId,
    queryKey: ["suggestion-history", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("suggestion_history")
        .select("*, from_dept:departments!suggestion_history_from_department_id_fkey(name, code), to_dept:departments!suggestion_history_to_department_id_fkey(name, code)")
        .eq("suggestion_id", id)
        .order("created_at");
      return data ?? [];
    },
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
  const rejectPEFn = useServerFn(peRejectSuggestion);
  const rejectReturnFn = useServerFn(peRejectReturn);
  const decideFn = useServerFn(deptDecide);
  const startFn = useServerFn(deptStartImplementation);
  const evidenceFn = useServerFn(deptSubmitEvidence);
  const verifyFn = useServerFn(peVerify);
  const selectBestFn = useServerFn(selectBestSuggestion);

  const { data: existingBestList = [] } = useQuery({
    enabled: validId,
    queryKey: ["best-suggestion-for-id", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("best_suggestions" as any)
        .select("*")
        .eq("suggestion_id", id!);
      return (data as any[]) ?? [];
    },
  });

  const [bestCategory, setBestCategory] = useState<"month" | "year" | "foolproofing">("month");
  const [bestMonth, setBestMonth] = useState(new Date().getMonth() + 1);
  const [bestYear, setBestYear] = useState(new Date().getFullYear());
  const [bestReason, setBestReason] = useState("");
  const [isEditingBest, setIsEditingBest] = useState(false);

  const [remarks, setRemarks] = useState("");
  const [targetDept, setTargetDept] = useState("");
  const [evidenceRemarks, setEvidenceRemarks] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [benefits, setBenefits] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [peApproved, setPeApproved] = useState(false);
  const [peBudgetTier, setPeBudgetTier] = useState("");
  const [showNotRelatedForm, setShowNotRelatedForm] = useState(false);
  const [suggestedDeptId, setSuggestedDeptId] = useState("");
  const [peVerificationFiles, setPeVerificationFiles] = useState<File[]>([]);
  const [peDragOver, setPeDragOver] = useState(false);

  // Find if this suggestion was returned to PE
  const lastReturnHistory = [...history]
    .reverse()
    .find((h: any) => h.to_status === "pe_review" && (h.from_status === "dept_review" || h.from_status === "transferred"));

  let returnFromDeptName = "";
  let returnFromDeptId = "";
  let returnSuggestedDeptId = "";
  let returnSuggestedDeptName = "";
  let returnRemarks = "";

  if (lastReturnHistory) {
    returnFromDeptId = lastReturnHistory.from_department_id;
    returnFromDeptName = lastReturnHistory.from_dept?.name || "Unknown Department";
    returnRemarks = lastReturnHistory.remarks || "";
    if (lastReturnHistory.remarks?.startsWith("REJECT_SUGGESTED_DEPT:")) {
      const match = lastReturnHistory.remarks.match(/^REJECT_SUGGESTED_DEPT:([^|]*)\|(.*)$/);
      if (match) {
        returnSuggestedDeptId = match[1];
        returnRemarks = match[2];
        const suggestedDept = departments.find((d: any) => d.id === returnSuggestedDeptId);
        returnSuggestedDeptName = suggestedDept?.name || "Unknown Department";
      }
    }
  }

  useEffect(() => {
    if (sug) {
      if (sug.budget_tier) {
        setPeBudgetTier(sug.budget_tier);
        setPeApproved(true);
      }
    }
  }, [sug]);

  // Pre-populate targetDept with the suggested department if it's a returned suggestion
  useEffect(() => {
    if (returnSuggestedDeptId) {
      setTargetDept(returnSuggestedDeptId);
    }
  }, [returnSuggestedDeptId]);

  // Accepted evidence file types
  const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ACCEPTED_ATTR = "image/*";
  const MAX_FILE_MB = 20;
  const MAX_FILES = 3;

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
    if (evidenceFiles.length === 0) {
      return toast.error("Please attach at least one evidence file");
    }
    
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
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["suggestion", id] }),
        qc.invalidateQueries({ queryKey: ["suggestion-history", id] }),
        qc.invalidateQueries({ queryKey: ["suggestion-evidence", id] })
      ]);
    } catch (e: any) {
      toast.error("Failed to submit evidence", { description: e.message ?? "Unknown error" });
    } finally {
      setUploading(false);
    }
  }

  function handlePeVerificationFiles(list: FileList | null) {
    if (!list) return;
    const { valid, errors } = validateFiles(Array.from(list));
    errors.forEach((e) => toast.error("File rejected", { description: e }));
    setPeVerificationFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > 3) {
        toast.warning("Only 3 files allowed", { description: "Extra files ignored." });
      }
      return combined.slice(0, 3);
    });
  }

  async function peSubmitVerification(outcome: "implemented" | "fake_closure") {
    if (!remarks.trim()) {
      return toast.error("Please enter verification remarks");
    }
    if (peVerificationFiles.length > 3) {
      return toast.error("Maximum 3 verification images allowed");
    }

    setUploading(true);
    setIsPending(true);
    const attachmentIds: string[] = [];
    const uploadedNames: string[] = [];
    try {
      if (peVerificationFiles.length > 0) {
        for (const file of peVerificationFiles) {
          const path = `${id}/pe-verification/${crypto.randomUUID()}-${file.name}`;
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
      }

      await verifyFn({ data: {
        suggestion_id: id,
        outcome,
        remarks,
        attachment_ids: attachmentIds.length > 0 ? attachmentIds : undefined,
        file_names: uploadedNames.length > 0 ? uploadedNames : undefined,
      } });

      toast.success(outcome === "implemented" ? "Marked implemented" : "Marked fake closure");
      setPeVerificationFiles([]);
      setRemarks("");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["suggestion", id] }),
        qc.invalidateQueries({ queryKey: ["suggestion-history", id] }),
        qc.invalidateQueries({ queryKey: ["suggestion-evidence", id] })
      ]);
    } catch (e: any) {
      toast.error("Failed to submit verification", { description: e.message ?? "Unknown error" });
    } finally {
      setUploading(false);
      setIsPending(false);
    }
  }


  function startEditBest(existing?: any) {
    if (existing) {
      setBestCategory(existing.category || "month");
      setBestMonth(existing.month || new Date().getMonth() + 1);
      setBestYear(existing.year || new Date().getFullYear());
      setBestReason(existing.selection_reason || "");
    }
    setIsEditingBest(true);
  }

  async function handleBestSuggestionSubmit(remove = false) {
    if (isPending) return;
    setIsPending(true);
    try {
      await selectBestFn({
        data: {
          suggestion_id: id,
          category: bestCategory,
          month: bestMonth,
          year: bestYear,
          reason: bestReason || undefined,
          remove,
        },
      });
      if (remove) {
        toast.success("Best Suggestion recognition removed");
      } else {
        toast.success("Best Suggestion selection saved successfully!");
      }
      setIsEditingBest(false);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["best-suggestion-for-id", id] }),
        qc.invalidateQueries({ queryKey: ["best-suggestion-of-month"] }),
      ]);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save best suggestion");
    } finally {
      setIsPending(false);
    }
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
  const isCurrentDept = session?.roles?.some(r => 
    r.role === "super_admin" || 
    r.role === "corporate_admin" || 
    (!!sug.current_department_id && r.department_id === sug.current_department_id)
  ) || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin";
  const status = sug.status;



  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title={sug.title}
        description={<span className="font-mono text-xs">{sug.code}</span> as any}
        actions={<div className="flex items-center gap-2"><StatusBadge status={sug.status} />{sug.budget_tier && <BudgetBadge tier={sug.budget_tier} />}</div>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {isPE && (
                <Meta 
                  label="Employee" 
                  value={
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{sug.employees?.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">({sug.employees?.employee_code})</span>
                      <EmployeeBadges employeeId={sug.employee_id} />
                    </div>
                  } 
                />
              )}
              <Meta label="Category" value={sug.categories?.name} />
              <Meta label="Owner department" value={getDeptDisplay(sug.current_departments || sug.departments)} />
              <Meta label="Plant" value={sug.plants?.name} />
              <Meta label="Location" value={sug.locations?.location} />
              {sug.budget_tier && (
                <Meta 
                  label="Budget Tier" 
                  value={
                    sug.budget_tier === "no_cost" ? "No Cost" :
                    sug.budget_tier === "low_cost" ? "Low Cost" :
                    sug.budget_tier === "investment" ? "Investment" :
                    sug.budget_tier
                  } 
                />
              )}
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
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">PE — Initial Review</div>
                
                {lastReturnHistory && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 max-w-xl">
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Returned by {returnFromDeptName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Reason: </span>
                      {returnRemarks || "No remarks provided"}
                    </div>
                    {returnSuggestedDeptName && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Suggested Department: </span>
                        {returnSuggestedDeptName}
                      </div>
                    )}
                  </div>
                )}

                {!peApproved ? (
                  <div className="space-y-2">
                    <Textarea placeholder="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="max-w-lg" disabled={isPending} />
                    <div className="flex gap-2">
                      <Button disabled={isPending} onClick={() => setPeApproved(true)}>
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {lastReturnHistory ? "Approve Return" : "Approve"}
                      </Button>
                      
                      {lastReturnHistory ? (
                        <Button variant="destructive" disabled={isPending} onClick={() => {
                          if (!remarks.trim()) {
                            toast.error("Please enter remarks/reason why you are rejecting the return");
                            return;
                          }
                          run(() => rejectReturnFn({ data: { suggestion_id: id, remarks } }), "Returned suggestion to department");
                        }}>
                          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4 mr-1" />}
                          Reject Return (Send Back)
                        </Button>
                      ) : (
                        <Button variant="destructive" disabled={isPending} onClick={() => run(() => rejectPEFn({ data: { suggestion_id: id, remarks } }), "Rejected suggestion")}>
                          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4 mr-1" />}
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Implementation Budget Option */}
                    <div className="space-y-1.5 max-w-md">
                      <Label className="text-xs font-semibold">Implementation Budget <span className="text-destructive">*</span></Label>
                      <div className="flex gap-2 items-center">
                        <Select value={peBudgetTier} onValueChange={setPeBudgetTier} disabled={isPending}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select implementation budget tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_cost">No Cost (Method changes only)</SelectItem>
                            <SelectItem value="low_cost">Low Cost (Minor expense)</SelectItem>
                            <SelectItem value="investment">Investment (Budget required)</SelectItem>
                          </SelectContent>
                        </Select>
                        {!peBudgetTier && (
                          <Button variant="ghost" disabled={isPending} onClick={() => { setPeApproved(false); setPeBudgetTier(""); }}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Show department transfer ONLY after budget tier is selected */}
                    {peBudgetTier && (
                      <div className="space-y-2 pt-1 border-t border-border mt-3">
                        <div className="text-xs text-muted-foreground">Select department to transfer:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Select value={targetDept} onValueChange={setTargetDept} disabled={isPending}>
                            <SelectTrigger className="w-64"><SelectValue placeholder="Select department" /></SelectTrigger>
                            <SelectContent>
                              {departments
                                .filter((d: any) => d.plant_id === sug.plant_id)
                                .map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name} {d.code ? `(${d.code})` : ""}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Textarea placeholder="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-[38px] max-w-md" disabled={isPending} />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button disabled={isPending || !targetDept} onClick={() => run(() => transferFn({ data: { suggestion_id: id, target_department_id: targetDept, remarks, budget_tier: peBudgetTier } }), "Transferred to department")}>
                              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              Transfer
                            </Button>
                            <Button variant="ghost" disabled={isPending} onClick={() => { setPeApproved(false); setPeBudgetTier(""); }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {isCurrentDept && (status === "dept_review" || status === "transferred") && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-semibold">Department — Decide</div>
                
                {!showNotRelatedForm ? (
                  <div className="space-y-2">
                    <Textarea placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="max-w-lg" disabled={isPending} />
                    <div className="flex flex-wrap gap-2">
                      <Button disabled={isPending} onClick={() => run(() => decideFn({ data: { suggestion_id: id, decision: "approve", remarks } }), "Approved")}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                        Approve
                      </Button>
                      <Button variant="destructive" disabled={isPending} onClick={() => {
                        if (!remarks.trim()) {
                          toast.error("Please enter remarks/reason for rejection");
                          return;
                        }
                        run(() => decideFn({ data: { suggestion_id: id, decision: "reject", remarks } }), "Rejected");
                      }}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
                        Reject
                      </Button>
                      <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" disabled={isPending} onClick={() => setShowNotRelatedForm(true)}>
                        <X className="w-4 h-4 mr-1" />
                        Not related to my department
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border p-4 bg-muted/20 space-y-3 max-w-lg">
                    <div className="text-xs font-semibold text-foreground">Return suggestion to PE (Not related)</div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground">Select suggested related department <span className="text-destructive">*</span></label>
                      <Select value={suggestedDeptId} onValueChange={setSuggestedDeptId} disabled={isPending}>
                        <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select suggested department" /></SelectTrigger>
                        <SelectContent>
                          {departments
                            .filter((d: any) => d.plant_id === sug.plant_id && d.id !== sug.current_department_id) // Limit to suggestion's plant and exclude current department
                            .map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name} {d.code ? `(${d.code})` : ""}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground font-semibold">Remarks / Reason why this is not related <span className="text-destructive">*</span></label>
                      <Textarea placeholder="Explain why this suggestion does not belong to your department..." value={remarks} onChange={(e) => setRemarks(e.target.value)} className="bg-background min-h-[80px]" disabled={isPending} />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" disabled={isPending} onClick={() => {
                        if (!suggestedDeptId) {
                          toast.error("Please select a suggested related department");
                          return;
                        }
                        if (!remarks.trim()) {
                          toast.error("Please enter remarks/reason why this is not related");
                          return;
                        }
                        const payloadRemarks = `REJECT_SUGGESTED_DEPT:${suggestedDeptId}|${remarks}`;
                        run(() => decideFn({ data: { suggestion_id: id, decision: "not_related", remarks: payloadRemarks } }), "Returned to PE");
                        setShowNotRelatedForm(false);
                        setSuggestedDeptId("");
                      }}>
                        Submit to PE
                      </Button>
                      <Button variant="ghost" size="sm" disabled={isPending} onClick={() => { setShowNotRelatedForm(false); setSuggestedDeptId(""); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isCurrentDept && status === "approved" && (
              <div className="flex items-center gap-2">
                <Button disabled={isPending} onClick={() => run(() => startFn({ data: { suggestion_id: id } }), "Implementation started")}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  Start implementation
                </Button>
              </div>
            )}

            {isCurrentDept && (status === "implementation" || status === "evidence_pending" || status === "fake_closure" || status === "reopened") && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Department — Submit evidence</div>
                <div className="grid md:grid-cols-2 gap-2 max-w-2xl">
                  <input type="number" placeholder="Actual cost (₹)" value={actualCost} onChange={(e) => setActualCost(e.target.value)} className="border border-input rounded-md px-3 py-1.5 text-sm bg-background" disabled={uploading || isPending} />
                  <input type="text" placeholder="Benefits achieved" value={benefits} onChange={(e) => setBenefits(e.target.value)} className="border border-input rounded-md px-3 py-1.5 text-sm bg-background" disabled={uploading || isPending} />
                </div>
                <Textarea placeholder="Completion remarks" value={evidenceRemarks} onChange={(e) => setEvidenceRemarks(e.target.value)} className="max-w-2xl" disabled={uploading || isPending} />
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (!uploading && !isPending) handleEvidenceFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "max-w-2xl block border-2 border-dashed rounded-lg p-5 text-center transition-colors",
                    (uploading || isPending) ? "bg-muted cursor-not-allowed border-muted-foreground/30" : dragOver ? "border-primary bg-primary/5 cursor-pointer" : "border-border hover:border-primary/50 cursor-pointer",
                  )}
                >
                  <input type="file" multiple accept={ACCEPTED_ATTR} className="hidden" onChange={(e) => handleEvidenceFiles(e.target.files)} disabled={uploading || isPending} />
                  <Paperclip className="w-6 h-6 mx-auto text-muted-foreground mb-1.5" />
                  <div className="text-sm font-medium">Drag & drop evidence images here, or click to browse</div>
                  <div className="text-xs text-muted-foreground mt-1">Accepts images only (.jpg, .png, .webp, .gif)</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Max {MAX_FILES} images · up to {MAX_FILE_MB}MB each · {evidenceFiles.length}/{MAX_FILES} selected</div>
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
                        <button type="button" className="p-1 hover:bg-muted rounded shrink-0" onClick={() => setEvidenceFiles(evidenceFiles.filter((_, j) => j !== i))} disabled={uploading || isPending}>
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <Button disabled={uploading || isPending} onClick={submitEvidenceWithFiles}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Submitting…" : "Submit evidence"}
                </Button>
              </div>
            )}

            {isPE && (status === "pe_verification" || status === "evidence_submitted") && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-semibold">PE — Final verification (Remarks are mandatory, verification images are optional)</div>
                <Textarea placeholder="Verification remarks (mandatory)" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="max-w-lg" disabled={uploading || isPending} />
                
                <label
                  onDragOver={(e) => { e.preventDefault(); setPeDragOver(true); }}
                  onDragLeave={() => setPeDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setPeDragOver(false);
                    if (!uploading && !isPending) handlePeVerificationFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "max-w-lg block border-2 border-dashed rounded-lg p-5 text-center transition-colors",
                    (uploading || isPending) ? "bg-muted cursor-not-allowed border-muted-foreground/30" : peDragOver ? "border-primary bg-primary/5 cursor-pointer" : "border-border hover:border-primary/50 cursor-pointer",
                  )}
                >
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePeVerificationFiles(e.target.files)} disabled={uploading || isPending} />
                  <Paperclip className="w-6 h-6 mx-auto text-muted-foreground mb-1.5" />
                  <div className="text-sm font-medium">Drag & drop verification images here, or click to browse</div>
                  <div className="text-xs text-muted-foreground mt-1">Accepts images only (.jpg, .png, .webp, .gif)</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Max 3 images · up to {MAX_FILE_MB}MB each · {peVerificationFiles.length}/3 selected</div>
                </label>
                
                {peVerificationFiles.length > 0 && (
                  <ul className="max-w-lg divide-y divide-border rounded-md border border-border">
                    {peVerificationFiles.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 px-3 py-2">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <button type="button" className="p-1 hover:bg-muted rounded shrink-0" onClick={() => setPeVerificationFiles(peVerificationFiles.filter((_, j) => j !== i))} disabled={uploading || isPending}>
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="flex gap-2">
                  <Button disabled={uploading || isPending} onClick={() => peSubmitVerification("implemented")}>
                    {uploading || isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Mark implemented
                  </Button>
                  <Button variant="destructive" disabled={uploading || isPending} onClick={() => peSubmitVerification("fake_closure")}>
                    {uploading || isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                    Fake closure
                  </Button>
                </div>
              </div>
            )}

            {(status === "implemented" || status === "closed" || status === "rejected") && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">This suggestion is closed — no further actions.</div>
                
                {(session?.primaryRole === "super_admin" || session?.primaryRole === "admin" || session?.roles?.some(r => ["super_admin", "corporate_admin", "admin", "pe_user", "location_admin"].includes(r))) && status === "implemented" && (
                  <div className="rounded-xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/10 via-background to-amber-500/5 p-5 space-y-4 max-w-xl shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        Recognition & Best Suggestion Selection
                      </div>
                      {existingBestList.length > 0 && !isEditingBest && (
                        <Button size="sm" variant="outline" className="h-7 text-xs border-amber-500/50 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold" onClick={() => startEditBest(existingBestList[0])}>
                          Edit Selection
                        </Button>
                      )}
                    </div>

                    {existingBestList.length > 0 && !isEditingBest ? (
                      <div className="space-y-3 border-t border-amber-500/20 pt-3">
                        <div className="text-xs font-medium text-muted-foreground">This suggestion is selected for organizational recognition:</div>
                        <div className="space-y-2">
                          {existingBestList.map((item: any) => {
                            const cat = item.category || "month";
                            const catLabel = cat === "year" ? "Best Suggestion of the Year" : cat === "foolproofing" ? "Best Foolproofing Suggestion" : "Best Suggestion of the Month";
                            const icon = cat === "year" ? <Trophy className="w-3.5 h-3.5" /> : cat === "foolproofing" ? <Check className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />;
                            return (
                              <div key={item.id} className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                                  {icon}
                                  {catLabel}: {cat === "year" ? item.year : `${MONTHS[item.month - 1]} ${item.year}`}
                                </div>
                                {item.selection_reason && (
                                  <div className="text-xs text-foreground/90 italic">
                                    "{item.selection_reason}"
                                  </div>
                                )}
                                <div className="text-[10px] text-muted-foreground pt-0.5">
                                  Selected on {new Date(item.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 border-t border-amber-500/20 pt-3">
                        <div className="text-xs text-muted-foreground">
                          {existingBestList.length > 0 ? "Edit or update the recognition award for this suggestion:" : "Feature this suggestion under organizational recognition categories:"}
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Award Category</label>
                            <select
                              value={bestCategory}
                              onChange={(e) => setBestCategory(e.target.value as any)}
                              className="w-full h-9 rounded border border-border bg-background px-2.5 text-xs font-semibold"
                            >
                              <option value="month">🏆 Best Suggestion of the Month</option>
                              <option value="year">🎖️ Best Suggestion of the Year</option>
                              <option value="foolproofing">🛡️ Best Foolproofing Suggestion</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            {bestCategory !== "year" && (
                              <div className="flex-1 space-y-1">
                                <label className="text-xs font-semibold">Month</label>
                                <select
                                  value={bestMonth}
                                  onChange={(e) => setBestMonth(Number(e.target.value))}
                                  className="w-full h-9 rounded border border-border bg-background px-2 text-xs font-semibold"
                                >
                                  {MONTHS.map((m, idx) => (
                                    <option key={m} value={idx + 1}>{m}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-semibold">Year</label>
                              <select
                                value={bestYear}
                                onChange={(e) => setBestYear(Number(e.target.value))}
                                className="w-full h-9 rounded border border-border bg-background px-2 text-xs font-semibold"
                              >
                                {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Selection Reason / Remarks (Optional)</label>
                            <Textarea
                              placeholder="Reason/remarks for awarding this recognition"
                              value={bestReason}
                              onChange={(e) => setBestReason(e.target.value)}
                              className="text-xs h-16"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
                              onClick={() => handleBestSuggestionSubmit(false)}
                              disabled={isPending}
                            >
                              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Trophy className="w-3.5 h-3.5 mr-1.5" />}
                              {existingBestList.length > 0 ? "Update Selection" : "Save Selection"}
                            </Button>
                            {existingBestList.length > 0 && (
                              <>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBestSuggestionSubmit(true)}
                                  disabled={isPending}
                                >
                                  Remove Selection
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingBest(false)}
                                  disabled={isPending}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
          {(() => {
            const effectiveHistory = getEffectiveHistory(history, sug);
            return (
              <ol className="space-y-4 relative">
                {effectiveHistory.map((h: any, i: number) => (
                  <li key={h.id} className="relative pl-6">
                    <div className="absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" />
                    {i < effectiveHistory.length - 1 && <div className="absolute left-2 top-3 bottom-[-1rem] w-px bg-border" />}
                    <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                    <div className="text-sm font-medium">{getHistoryActionText(h as any)}</div>
                    {h.remarks && <div className="text-xs text-muted-foreground mt-0.5">{h.remarks}</div>}
                  </li>
                ))}
                {effectiveHistory.length === 0 && <li className="text-xs text-muted-foreground">No activity yet.</li>}
              </ol>
            );
          })()}
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
  return (<div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-0.5 font-medium break-all">{value || "—"}</div></div>);
}
