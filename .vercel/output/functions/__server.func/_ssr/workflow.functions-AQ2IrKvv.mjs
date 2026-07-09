import { c as createServerFn } from "./createServerFn-BOrDV9mr.mjs";
import { a as objectType, i as numberType, o as requireSupabaseAuth, r as enumType, s as stringType, t as arrayType } from "./types-Bb_8hVAz.mjs";
import { t as createServerRpc } from "./createServerRpc-BiMAX0JB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflow.functions-AQ2IrKvv.js
async function insertHistory(supabase, suggestionId, from, to, actorId, remarks, fromDept, toDept) {
	await supabase.from("suggestion_history").insert({
		suggestion_id: suggestionId,
		from_status: from,
		to_status: to,
		actor_id: actorId,
		remarks,
		from_department_id: fromDept ?? null,
		to_department_id: toDept ?? null
	});
	await supabase.from("audit_logs").insert({
		actor_id: actorId,
		action: `suggestion.${to}`,
		entity_type: "suggestion",
		entity_id: suggestionId,
		meta: {
			from,
			to,
			remarks
		}
	});
}
var peTransferSuggestion_createServerFn_handler = createServerRpc({
	id: "6a68985faa316b77c9ec92779e4265d0bb8415b5b711bdfdd658eba1f00c10de",
	name: "peTransferSuggestion",
	filename: "src/lib/workflow.functions.ts"
}, (opts) => peTransferSuggestion.__executeServer(opts));
var peTransferSuggestion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	target_department_id: stringType().uuid(),
	remarks: stringType().max(2e3).optional()
}).parse(d)).handler(peTransferSuggestion_createServerFn_handler, async ({ context, data }) => {
	const { supabase, userId } = context;
	const { data: sug, error } = await supabase.from("suggestions").select("id,status,current_department_id").eq("id", data.suggestion_id).single();
	if (error || !sug) throw new Error("Suggestion not found");
	const { error: uErr } = await supabase.from("suggestions").update({
		current_department_id: data.target_department_id,
		status: "dept_review"
	}).eq("id", data.suggestion_id);
	if (uErr) throw new Error(uErr.message);
	await insertHistory(supabase, data.suggestion_id, sug.status, "dept_review", userId, data.remarks ?? null, sug.current_department_id, data.target_department_id);
	const { notifyForSuggestion } = await import("./notify.server-DnPdIb7W.mjs");
	await notifyForSuggestion({
		suggestion_id: data.suggestion_id,
		title: "Suggestion transferred to your department",
		body: data.remarks ?? void 0,
		event_type: "transfer",
		audience: ["target_dept", "submitter"],
		target_department_id: data.target_department_id
	});
	return { ok: true };
});
var deptDecide_createServerFn_handler = createServerRpc({
	id: "ec6702da2ff71c618ad3a90b9521f5f7142ab932a3122e5f0d2c6492b61ada8e",
	name: "deptDecide",
	filename: "src/lib/workflow.functions.ts"
}, (opts) => deptDecide.__executeServer(opts));
var deptDecide = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	decision: enumType([
		"approve",
		"reject",
		"transfer"
	]),
	target_department_id: stringType().uuid().nullable().optional(),
	remarks: stringType().max(2e3).optional()
}).parse(d)).handler(deptDecide_createServerFn_handler, async ({ context, data }) => {
	const { supabase, userId } = context;
	const { data: sug } = await supabase.from("suggestions").select("status,current_department_id").eq("id", data.suggestion_id).single();
	if (!sug) throw new Error("Not found");
	const { notifyForSuggestion } = await import("./notify.server-DnPdIb7W.mjs");
	if (data.decision === "approve") {
		await supabase.from("suggestions").update({ status: "approved" }).eq("id", data.suggestion_id);
		await insertHistory(supabase, data.suggestion_id, sug.status, "approved", userId, data.remarks ?? null);
		await notifyForSuggestion({
			suggestion_id: data.suggestion_id,
			title: "Your suggestion was approved",
			body: data.remarks ?? void 0,
			event_type: "approve",
			audience: ["submitter", "pe"]
		});
	} else if (data.decision === "reject") {
		await supabase.from("suggestions").update({ status: "rejected" }).eq("id", data.suggestion_id);
		await insertHistory(supabase, data.suggestion_id, sug.status, "rejected", userId, data.remarks ?? null);
		await notifyForSuggestion({
			suggestion_id: data.suggestion_id,
			title: "Your suggestion was rejected",
			body: data.remarks ?? void 0,
			event_type: "reject",
			audience: ["submitter", "pe"]
		});
	} else {
		if (!data.target_department_id) throw new Error("target_department_id required");
		await supabase.from("suggestions").update({
			current_department_id: data.target_department_id,
			status: "transferred"
		}).eq("id", data.suggestion_id);
		await insertHistory(supabase, data.suggestion_id, sug.status, "transferred", userId, data.remarks ?? null, sug.current_department_id, data.target_department_id);
		await notifyForSuggestion({
			suggestion_id: data.suggestion_id,
			title: "Suggestion transferred to your department",
			body: data.remarks ?? void 0,
			event_type: "transfer",
			audience: [
				"target_dept",
				"submitter",
				"pe"
			],
			target_department_id: data.target_department_id
		});
	}
	return { ok: true };
});
var deptStartImplementation_createServerFn_handler = createServerRpc({
	id: "bd689f297bc387ab62b358f5fed966bcbcccc9c0b69a5068467a883162270f42",
	name: "deptStartImplementation",
	filename: "src/lib/workflow.functions.ts"
}, (opts) => deptStartImplementation.__executeServer(opts));
var deptStartImplementation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ suggestion_id: stringType().uuid() }).parse(d)).handler(deptStartImplementation_createServerFn_handler, async ({ context, data }) => {
	const { supabase, userId } = context;
	const { data: sug } = await supabase.from("suggestions").select("status").eq("id", data.suggestion_id).single();
	await supabase.from("suggestions").update({ status: "implementation" }).eq("id", data.suggestion_id);
	await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "implementation", userId, null);
	const { notifyForSuggestion } = await import("./notify.server-DnPdIb7W.mjs");
	await notifyForSuggestion({
		suggestion_id: data.suggestion_id,
		title: "Implementation started",
		event_type: "transfer",
		audience: ["submitter", "pe"]
	});
	return { ok: true };
});
var deptSubmitEvidence_createServerFn_handler = createServerRpc({
	id: "ffd4ac5e6116d57652e3dd1d393b77046e9555b3a3ab2e2e63abbe0a3c547304",
	name: "deptSubmitEvidence",
	filename: "src/lib/workflow.functions.ts"
}, (opts) => deptSubmitEvidence.__executeServer(opts));
var deptSubmitEvidence = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	remarks: stringType().max(2e3).optional(),
	completion_date: stringType().optional(),
	actual_cost: numberType().nullable().optional(),
	benefits_achieved: stringType().optional(),
	attachment_ids: arrayType(stringType().uuid()).max(10).optional(),
	file_names: arrayType(stringType()).max(10).optional()
}).parse(d)).handler(deptSubmitEvidence_createServerFn_handler, async ({ context, data }) => {
	const { supabase, userId } = context;
	const { data: sug } = await supabase.from("suggestions").select("status").eq("id", data.suggestion_id).single();
	const { data: latest } = await supabase.from("evidence").select("version").eq("suggestion_id", data.suggestion_id).order("version", { ascending: false }).limit(1).maybeSingle();
	const nextVersion = (latest?.version ?? 0) + 1;
	const { data: evRow, error: evErr } = await supabase.from("evidence").insert({
		suggestion_id: data.suggestion_id,
		remarks: data.remarks,
		completion_date: data.completion_date ?? null,
		actual_cost: data.actual_cost ?? null,
		benefits_achieved: data.benefits_achieved,
		submitted_by: userId,
		version: nextVersion
	}).select("id, version").single();
	if (evErr || !evRow) throw new Error(evErr?.message ?? "Failed to insert evidence");
	if (data.attachment_ids && data.attachment_ids.length > 0) await supabase.from("attachments").update({ evidence_id: evRow.id }).in("id", data.attachment_ids);
	await supabase.from("suggestions").update({
		status: "pe_verification",
		actual_cost: data.actual_cost ?? null,
		actual_benefits: data.benefits_achieved ?? null
	}).eq("id", data.suggestion_id);
	await supabase.from("audit_logs").insert({
		actor_id: userId,
		action: "evidence.submitted",
		entity_type: "evidence",
		entity_id: evRow.id,
		meta: {
			suggestion_id: data.suggestion_id,
			version: nextVersion,
			remarks: data.remarks ?? null,
			file_names: data.file_names ?? [],
			file_count: data.file_names?.length ?? 0
		}
	});
	await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "pe_verification", userId, `Evidence v${nextVersion} submitted${data.remarks ? ` — ${data.remarks}` : ""}${data.file_names?.length ? ` (${data.file_names.length} file${data.file_names.length > 1 ? "s" : ""})` : ""}`);
	const { notifyForSuggestion } = await import("./notify.server-DnPdIb7W.mjs");
	await notifyForSuggestion({
		suggestion_id: data.suggestion_id,
		title: `Evidence submitted (v${nextVersion}) — awaiting PE verification`,
		body: data.remarks ?? void 0,
		event_type: "evidence",
		audience: ["pe", "submitter"]
	});
	return {
		ok: true,
		evidence_id: evRow.id,
		version: nextVersion
	};
});
var peVerify_createServerFn_handler = createServerRpc({
	id: "d03f4a6511447cc1958453ff58ce6349b0ba0dfe17a179f083d66848d87b3e89",
	name: "peVerify",
	filename: "src/lib/workflow.functions.ts"
}, (opts) => peVerify.__executeServer(opts));
var peVerify = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	outcome: enumType(["implemented", "fake_closure"]),
	remarks: stringType().max(2e3).optional()
}).parse(d)).handler(peVerify_createServerFn_handler, async ({ context, data }) => {
	const { supabase, userId } = context;
	const { data: sug } = await supabase.from("suggestions").select("status").eq("id", data.suggestion_id).single();
	const { notifyForSuggestion } = await import("./notify.server-DnPdIb7W.mjs");
	if (data.outcome === "implemented") {
		await supabase.from("suggestions").update({
			status: "implemented",
			completed_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", data.suggestion_id);
		await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "implemented", userId, data.remarks ?? null);
		await notifyForSuggestion({
			suggestion_id: data.suggestion_id,
			title: "Your suggestion is implemented 🎉",
			body: data.remarks ?? void 0,
			event_type: "verification",
			audience: ["submitter", "current_dept"]
		});
	} else {
		await supabase.from("suggestions").update({ status: "fake_closure" }).eq("id", data.suggestion_id);
		await insertHistory(supabase, data.suggestion_id, sug?.status ?? null, "fake_closure", userId, data.remarks ?? null);
		await notifyForSuggestion({
			suggestion_id: data.suggestion_id,
			title: "Evidence flagged as fake closure — please re-check",
			body: data.remarks ?? void 0,
			event_type: "verification",
			audience: ["current_dept", "submitter"]
		});
	}
	return { ok: true };
});
var notifyNewSuggestion_createServerFn_handler = createServerRpc({
	id: "abdf06348a919dbf37f418a701325b31e1de0c6c615a481e213d95378f35c8f4",
	name: "notifyNewSuggestion",
	filename: "src/lib/workflow.functions.ts"
}, (opts) => notifyNewSuggestion.__executeServer(opts));
var notifyNewSuggestion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ suggestion_id: stringType().uuid() }).parse(d)).handler(notifyNewSuggestion_createServerFn_handler, async ({ data }) => {
	const { notifyForSuggestion } = await import("./notify.server-DnPdIb7W.mjs");
	await notifyForSuggestion({
		suggestion_id: data.suggestion_id,
		title: "New suggestion submitted",
		event_type: "submit",
		audience: ["pe", "super_admin"]
	});
	return { ok: true };
});
//#endregion
export { deptDecide_createServerFn_handler, deptStartImplementation_createServerFn_handler, deptSubmitEvidence_createServerFn_handler, notifyNewSuggestion_createServerFn_handler, peTransferSuggestion_createServerFn_handler, peVerify_createServerFn_handler };
