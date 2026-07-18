import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type SuggestionStatus = Database["public"]["Enums"]["suggestion_status"];

async function insertHistory(
  supabase: any,
  suggestionId: string,
  from: SuggestionStatus | null,
  to: SuggestionStatus,
  actorId: string,
  remarks: string | null,
  fromDept?: string | null,
  toDept?: string | null,
) {
  await supabase.from("suggestion_history").insert({
    suggestion_id: suggestionId,
    from_status: from,
    to_status: to,
    actor_id: actorId,
    remarks,
    from_department_id: fromDept ?? null,
    to_department_id: toDept ?? null,
  });
  await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action: `suggestion.${to}`,
    entity_type: "suggestion",
    entity_id: suggestionId,
    meta: { from, to, remarks },
  });
}

// PE transfers a submitted suggestion to a target department (concern department)
export const peTransferSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      suggestion_id: z.string().uuid(),
      target_department_id: z.string().uuid(),
      remarks: z.string().max(2000).optional(),
      budget_tier: z.string(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug, error } = await supabase.from("suggestions").select("id,status,current_department_id").eq("id", data.suggestion_id).single();
    if (error || !sug) throw new Error("Suggestion not found");
    const { error: uErr } = await supabase.from("suggestions").update({
      current_department_id: data.target_department_id,
      status: "dept_review" satisfies SuggestionStatus,
      budget_tier: data.budget_tier,
    }).eq("id", data.suggestion_id);
    if (uErr) throw new Error(uErr.message);
    await insertHistory(supabase, data.suggestion_id, sug.status, "dept_review", userId, data.remarks ?? null, sug.current_department_id, data.target_department_id);
    const { notifyForSuggestion } = await import("./notify.server");
    await notifyForSuggestion({
      suggestion_id: data.suggestion_id,
      title: "Suggestion transferred to your department",
      body: data.remarks ?? undefined,
      event_type: "transfer",
      audience: ["target_dept", "submitter"],
      target_department_id: data.target_department_id,
    });
    return { ok: true };
  });

// PE rejects a submitted suggestion
export const peRejectSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      suggestion_id: z.string().uuid(),
      remarks: z.string().max(2000).optional(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug, error } = await supabase.from("suggestions").select("id,status").eq("id", data.suggestion_id).single();
    if (error || !sug) throw new Error("Suggestion not found");
    const { error: uErr } = await supabase.from("suggestions").update({
      status: "rejected" satisfies SuggestionStatus,
    }).eq("id", data.suggestion_id);
    if (uErr) throw new Error(uErr.message);
    await insertHistory(supabase, data.suggestion_id, sug.status, "rejected", userId, data.remarks ?? null);
    const { notifyForSuggestion } = await import("./notify.server");
    await notifyForSuggestion({
      suggestion_id: data.suggestion_id,
      title: "Your suggestion was rejected by PE",
      body: data.remarks ?? undefined,
      event_type: "reject",
      audience: ["submitter"],
    });
    return { ok: true };
  });

// PE rejects a return claim and sends the suggestion back to the department that returned it
export const peRejectReturn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      suggestion_id: z.string().uuid(),
      remarks: z.string().max(2000).optional(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug, error } = await supabase.from("suggestions").select("id,status,current_department_id").eq("id", data.suggestion_id).single();
    if (error || !sug) throw new Error("Suggestion not found");

    // Fetch the last history record where the suggestion was returned to PE
    const { data: lastReturn } = await supabase
      .from("suggestion_history")
      .select("from_department_id")
      .eq("suggestion_id", data.suggestion_id)
      .eq("to_status", "pe_review" as SuggestionStatus)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const targetDeptId = lastReturn?.from_department_id || sug.current_department_id;
    if (!targetDeptId) throw new Error("Could not find the department to return this suggestion to");

    const { error: uErr } = await supabase.from("suggestions").update({
      current_department_id: targetDeptId,
      status: "dept_review" as SuggestionStatus,
    }).eq("id", data.suggestion_id);
    if (uErr) throw new Error(uErr.message);

    await insertHistory(supabase, data.suggestion_id, sug.status, "dept_review", userId, data.remarks ?? "Return rejected by PE", null, targetDeptId);

    const { notifyForSuggestion } = await import("./notify.server");
    await notifyForSuggestion({
      suggestion_id: data.suggestion_id,
      title: "Returned suggestion sent back to your department",
      body: data.remarks ?? undefined,
      event_type: "transfer",
      audience: ["target_dept", "submitter"],
      target_department_id: targetDeptId,
    });

    return { ok: true };
  });

// Department approves (moves to evaluation/implementation) or rejects
export const deptDecide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      suggestion_id: z.string().uuid(),
      decision: z.enum(["approve","reject","transfer","not_related"]),
      target_department_id: z.string().uuid().nullable().optional(),
      remarks: z.string().max(2000).optional(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug } = await supabase.from("suggestions").select("status,current_department_id").eq("id", data.suggestion_id).single();
    if (!sug) throw new Error("Not found");
    const { notifyForSuggestion } = await import("./notify.server");

    if ((data.decision === "reject" || data.decision === "not_related") && (!data.remarks || !data.remarks.trim())) {
      throw new Error("Remarks/reason is required for this decision");
    }

    if (data.decision === "approve") {
      await supabase.from("suggestions").update({ status: "approved" as SuggestionStatus }).eq("id", data.suggestion_id);
      await insertHistory(supabase, data.suggestion_id, sug.status, "approved", userId, data.remarks ?? null);
      await notifyForSuggestion({ suggestion_id: data.suggestion_id, title: "Your suggestion was approved", body: data.remarks ?? undefined, event_type: "approve", audience: ["submitter", "pe"] });
    } else if (data.decision === "reject") {
      await supabase.from("suggestions").update({ status: "pe_review" as SuggestionStatus }).eq("id", data.suggestion_id);
      await insertHistory(supabase, data.suggestion_id, sug.status, "pe_review", userId, data.remarks ?? null);
      await notifyForSuggestion({ suggestion_id: data.suggestion_id, title: "Your suggestion was rejected by the department", body: data.remarks ?? undefined, event_type: "reject", audience: ["submitter", "pe"] });
    } else if (data.decision === "not_related") {
      await supabase.from("suggestions").update({
        status: "pe_review" as SuggestionStatus,
        current_department_id: null,
      }).eq("id", data.suggestion_id);
      await insertHistory(supabase, data.suggestion_id, sug.status, "pe_review", userId, data.remarks ?? "Not related to department");
      await notifyForSuggestion({
        suggestion_id: data.suggestion_id,
        title: "Suggestion returned to PE (Not related to department)",
        body: data.remarks ?? undefined,
        event_type: "transfer",
        audience: ["submitter", "pe"],
      });
    } else {
      if (!data.target_department_id) throw new Error("target_department_id required");
      await supabase.from("suggestions").update({
        current_department_id: data.target_department_id,
        status: "transferred" as SuggestionStatus,
      }).eq("id", data.suggestion_id);
      await insertHistory(supabase, data.suggestion_id, sug.status, "transferred", userId, data.remarks ?? null, sug.current_department_id, data.target_department_id);
      await notifyForSuggestion({
        suggestion_id: data.suggestion_id,
        title: "Suggestion transferred to your department",
        body: data.remarks ?? undefined,
        event_type: "transfer", audience: ["target_dept", "submitter", "pe"],
        target_department_id: data.target_department_id,
      });
    }
    return { ok: true };
  });

// Department starts implementation
export const deptStartImplementation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ suggestion_id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug } = await supabase.from("suggestions").select("status").eq("id", data.suggestion_id).single();
    await supabase.from("suggestions").update({ status: "implementation" as SuggestionStatus }).eq("id", data.suggestion_id);
    await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "implementation", userId, null);
    const { notifyForSuggestion } = await import("./notify.server");
    await notifyForSuggestion({ suggestion_id: data.suggestion_id, title: "Implementation started", event_type: "transfer", audience: ["submitter", "pe"] });
    return { ok: true };
  });

// Department submits evidence (versioned; links uploaded files to this evidence row)
export const deptSubmitEvidence = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    suggestion_id: z.string().uuid(),
    remarks: z.string().max(2000).optional(),
    completion_date: z.string().optional(),
    actual_cost: z.number().nullable().optional(),
    benefits_achieved: z.string().optional(),
    attachment_ids: z.array(z.string().uuid()).min(1, "At least one evidence file is required").max(10),
    file_names: z.array(z.string()).min(1).max(10),
  }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug } = await supabase.from("suggestions").select("status").eq("id", data.suggestion_id).single();

    // Compute next version
    const { data: latest } = await supabase
      .from("evidence")
      .select("version")
      .eq("suggestion_id", data.suggestion_id)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextVersion = ((latest as any)?.version ?? 0) + 1;

    const { data: evRow, error: evErr } = await supabase.from("evidence").insert({
      suggestion_id: data.suggestion_id,
      remarks: data.remarks,
      completion_date: data.completion_date ?? null,
      actual_cost: data.actual_cost ?? null,
      benefits_achieved: data.benefits_achieved,
      submitted_by: userId,
      version: nextVersion,
    } as any).select("id, version").single();
    if (evErr || !evRow) throw new Error(evErr?.message ?? "Failed to insert evidence");

    // Link uploaded attachments to this evidence version
    if (data.attachment_ids && data.attachment_ids.length > 0) {
      await supabase.from("attachments")
        .update({ evidence_id: (evRow as any).id } as any)
        .in("id", data.attachment_ids);
    }

    await supabase.from("suggestions").update({
      status: "pe_verification" as SuggestionStatus,
      actual_cost: data.actual_cost ?? null,
      actual_benefits: data.benefits_achieved ?? null,
    }).eq("id", data.suggestion_id);

    // Audit log with file details
    await supabase.from("audit_logs").insert({
      actor_id: userId,
      action: "evidence.submitted",
      entity_type: "evidence",
      entity_id: (evRow as any).id,
      meta: {
        suggestion_id: data.suggestion_id,
        version: nextVersion,
        remarks: data.remarks ?? null,
        file_names: data.file_names ?? [],
        file_count: data.file_names?.length ?? 0,
      },
    });

    await insertHistory(
      supabase,
      data.suggestion_id,
      sug?.status ?? null,
      "pe_verification",
      userId,
      `Evidence v${nextVersion} submitted${data.remarks ? ` — ${data.remarks}` : ""}${data.file_names?.length ? ` (${data.file_names.length} file${data.file_names.length > 1 ? "s" : ""})` : ""}`,
    );
    const { notifyForSuggestion } = await import("./notify.server");
    await notifyForSuggestion({
      suggestion_id: data.suggestion_id,
      title: `Evidence submitted (v${nextVersion}) — awaiting PE verification`,
      body: data.remarks ?? undefined,
      event_type: "evidence",
      audience: ["pe", "submitter"],
    });
    return { ok: true, evidence_id: (evRow as any).id, version: nextVersion };
  });

// PE final verification: implemented OR fake closure
export const peVerify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    suggestion_id: z.string().uuid(),
    outcome: z.enum(["implemented","fake_closure"]),
    remarks: z.string().max(2000).optional(),
  }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: sug } = await supabase.from("suggestions").select("status").eq("id", data.suggestion_id).single();
    const { notifyForSuggestion } = await import("./notify.server");
    if (data.outcome === "implemented") {
      await supabase.from("suggestions").update({
        status: "implemented" as SuggestionStatus,
        completed_at: new Date().toISOString(),
      }).eq("id", data.suggestion_id);
      await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "implemented", userId, data.remarks ?? null);
      await notifyForSuggestion({ suggestion_id: data.suggestion_id, title: "Your suggestion is implemented 🎉", body: data.remarks ?? undefined, event_type: "verification", audience: ["submitter", "current_dept"] });
    } else {
      // Fake closure - return to concern department
      await supabase.from("suggestions").update({
        status: "fake_closure" as SuggestionStatus,
      }).eq("id", data.suggestion_id);
      await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "fake_closure", userId, data.remarks ?? null);
      await notifyForSuggestion({ suggestion_id: data.suggestion_id, title: "Evidence flagged as fake closure — please re-check", body: data.remarks ?? undefined, event_type: "verification", audience: ["current_dept", "submitter"] });
    }
    return { ok: true };
  });

// Fired from the client after an employee creates a new suggestion, so PE
// users (and super admins) see it in their notification bell.
export const notifyNewSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ suggestion_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { notifyForSuggestion } = await import("./notify.server");
    await notifyForSuggestion({
      suggestion_id: data.suggestion_id,
      title: "New suggestion submitted",
      event_type: "submit",
      audience: ["pe", "super_admin"],
    });
    return { ok: true };
  });
