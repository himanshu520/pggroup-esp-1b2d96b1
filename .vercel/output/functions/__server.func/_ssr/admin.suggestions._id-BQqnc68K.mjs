import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { a as cn, l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { A as useQuery, M as useSession, j as useQueryClient } from "./dist-DuWSCmUg.mjs";
import { M as PageHeader, U as X, f as Check, k as LoaderCircle, u as AppShell, z as STATUS_LABEL } from "./app-shell-B-C1Zdxr.mjs";
import { t as ADMIN_NAV } from "./admin-nav-B2pYfMco.mjs";
import { t as FileText } from "./file-text-Bm93_xKY.mjs";
import { t as useServerFn } from "./useServerFn-DnQ7jNw3.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-t6YZVJQv.mjs";
import { a as ThumbsUp, i as ThumbsDown, n as History, r as Send, t as CirclePlay } from "./thumbs-up-CZuONeO_.mjs";
import { a as deptSubmitEvidence, c as peVerify, i as deptStartImplementation, n as Upload, r as deptDecide, s as peTransferSuggestion, t as Paperclip } from "./workflow.functions-DrKbnaau.mjs";
import { t as TriangleAlert } from "./triangle-alert-DmLBobpN.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./status-badge-BV0SE00h.mjs";
import { t as Textarea } from "./textarea-B3s4Ny5G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.suggestions._id-BQqnc68K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function SuggestionDetail({ id }) {
	const validId = !!id && UUID_RE.test(id);
	(0, import_react.useEffect)(() => {
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
		}
	});
	const { data: history = [], isLoading: histLoading } = useQuery({
		enabled: validId,
		queryKey: ["suggestion-history", id],
		queryFn: async () => (await supabase.from("suggestion_history").select("*").eq("suggestion_id", id).order("created_at")).data ?? []
	});
	const { data: evidenceVersions = [] } = useQuery({
		enabled: validId,
		queryKey: ["suggestion-evidence", id],
		queryFn: async () => {
			const { data: evs } = await supabase.from("evidence").select("*").eq("suggestion_id", id).order("version", { ascending: false });
			const ids = (evs ?? []).map((e) => e.id);
			const { data: atts } = ids.length ? await supabase.from("attachments").select("*").in("evidence_id", ids) : { data: [] };
			return (evs ?? []).map((e) => ({
				...e,
				attachments: (atts ?? []).filter((a) => a.evidence_id === e.id)
			}));
		}
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["depts"],
		queryFn: async () => (await supabase.from("departments").select("*").eq("active", true)).data ?? []
	});
	const transferFn = useServerFn(peTransferSuggestion);
	const decideFn = useServerFn(deptDecide);
	const startFn = useServerFn(deptStartImplementation);
	const evidenceFn = useServerFn(deptSubmitEvidence);
	const verifyFn = useServerFn(peVerify);
	const [remarks, setRemarks] = (0, import_react.useState)("");
	const [targetDept, setTargetDept] = (0, import_react.useState)("");
	const [evidenceRemarks, setEvidenceRemarks] = (0, import_react.useState)("");
	const [actualCost, setActualCost] = (0, import_react.useState)("");
	const [benefits, setBenefits] = (0, import_react.useState)("");
	const [evidenceFiles, setEvidenceFiles] = (0, import_react.useState)([]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const ACCEPTED_EXT = [
		".jpg",
		".jpeg",
		".png",
		".webp",
		".gif",
		".pdf",
		".doc",
		".docx",
		".xls",
		".xlsx",
		".ppt",
		".pptx",
		".txt",
		".csv",
		".mp4",
		".mov"
	];
	const ACCEPTED_ATTR = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,video/mp4,video/quicktime";
	const MAX_FILE_MB = 20;
	const MAX_FILES = 10;
	function validateFiles(files) {
		const errors = [];
		const valid = [];
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
		return {
			valid,
			errors
		};
	}
	function handleEvidenceFiles(list) {
		if (!list) return;
		const { valid, errors } = validateFiles(Array.from(list));
		errors.forEach((e) => toast.error("File rejected", { description: e }));
		setEvidenceFiles((prev) => {
			const combined = [...prev, ...valid];
			if (combined.length > MAX_FILES) toast.warning(`Only ${MAX_FILES} files allowed`, { description: `Extra files ignored.` });
			return combined.slice(0, MAX_FILES);
		});
	}
	async function submitEvidenceWithFiles() {
		setUploading(true);
		const attachmentIds = [];
		const uploadedNames = [];
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
					uploaded_by: session?.userId
				}).select("id").single();
				if (attErr || !attRow) {
					toast.error(`Failed to record: ${file.name}`, { description: attErr?.message });
					continue;
				}
				attachmentIds.push(attRow.id);
				uploadedNames.push(file.name);
			}
			await evidenceFn({ data: {
				suggestion_id: id,
				remarks: evidenceRemarks,
				actual_cost: actualCost ? Number(actualCost) : null,
				benefits_achieved: benefits,
				attachment_ids: attachmentIds,
				file_names: uploadedNames
			} });
			toast.success("Evidence submitted", { description: `${uploadedNames.length} file${uploadedNames.length === 1 ? "" : "s"} attached` });
			setEvidenceFiles([]);
			setEvidenceRemarks("");
			setActualCost("");
			setBenefits("");
			qc.invalidateQueries({ queryKey: ["suggestion", id] });
			qc.invalidateQueries({ queryKey: ["suggestion-history", id] });
			qc.invalidateQueries({ queryKey: ["suggestion-evidence", id] });
		} catch (e) {
			toast.error("Failed to submit evidence", { description: e.message ?? "Unknown error" });
		} finally {
			setUploading(false);
		}
	}
	async function run(fn, label) {
		try {
			await fn();
			toast.success(label);
			qc.invalidateQueries({ queryKey: ["suggestion", id] });
			qc.invalidateQueries({ queryKey: ["suggestion-history", id] });
		} catch (e) {
			toast.error(e.message ?? "Action failed");
		}
	}
	if (!validId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium text-destructive mb-1",
				children: "Invalid suggestion link"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "The suggestion ID is missing or malformed. Please open the suggestion from the list."
			})]
		})
	});
	if (sugLoading || histLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " Loading suggestion…"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-lg border border-border bg-muted/30 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-lg border border-border bg-muted/30 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-lg border border-border bg-muted/30 animate-pulse" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-lg border border-border bg-muted/30 animate-pulse" })]
			})]
		})
	});
	if (sugError || !sug) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-6 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium mb-1",
				children: "Suggestion not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "It may have been removed, or you don't have access."
			})]
		})
	});
	const isPE = session?.isPE || session?.primaryRole === "super_admin" || session?.primaryRole === "corporate_admin";
	const status = sug.status;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: sug.title,
			description: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs",
				children: sug.code
			}),
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: sug.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: sug.priority })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Employee",
								value: `${sug.employees?.name} (${sug.employees?.employee_code})`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Category",
								value: sug.categories?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Owner department",
								value: sug.departments?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Plant",
								value: sug.plants?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Location",
								value: sug.locations?.location
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Expected saving",
								value: sug.expected_saving ? `₹ ${Number(sug.expected_saving).toLocaleString()}` : "—"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Problem",
						children: sug.problem
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Current method",
						children: sug.current_method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Suggested method",
						children: sug.suggested_method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Expected benefits",
						children: sug.expected_benefits
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: "Actions"
							}),
							isPE && (status === "submitted" || status === "pe_review") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "PE — Transfer to concern department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: targetDept,
											onValueChange: setTargetDept,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-64",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select department" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: d.id,
												children: d.name
											}, d.id)) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											placeholder: "Remarks (optional)",
											value: remarks,
											onChange: (e) => setRemarks(e.target.value),
											className: "min-h-[38px] max-w-md"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											disabled: !targetDept,
											onClick: () => run(() => transferFn({ data: {
												suggestion_id: id,
												target_department_id: targetDept,
												remarks
											} }), "Transferred to department"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), " Transfer"]
										})
									]
								})]
							}),
							(status === "dept_review" || status === "transferred") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Department — Decide"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Remarks",
										value: remarks,
										onChange: (e) => setRemarks(e.target.value),
										className: "max-w-lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: () => run(() => decideFn({ data: {
													suggestion_id: id,
													decision: "approve",
													remarks
												} }), "Approved"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "w-4 h-4" }), " Approve"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "destructive",
												onClick: () => run(() => decideFn({ data: {
													suggestion_id: id,
													decision: "reject",
													remarks
												} }), "Rejected"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "w-4 h-4" }), " Reject"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: targetDept,
												onValueChange: setTargetDept,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-56",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Or transfer to…" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: d.id,
													children: d.name
												}, d.id)) })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												disabled: !targetDept,
												onClick: () => run(() => decideFn({ data: {
													suggestion_id: id,
													decision: "transfer",
													target_department_id: targetDept,
													remarks
												} }), "Transferred"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), " Transfer"]
											})
										]
									})
								]
							}),
							status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => run(() => startFn({ data: { suggestion_id: id } }), "Implementation started"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-4 h-4" }), " Start implementation"]
								})
							}),
							(status === "implementation" || status === "evidence_pending" || status === "fake_closure" || status === "reopened") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Department — Submit evidence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid md:grid-cols-2 gap-2 max-w-2xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											placeholder: "Actual cost (₹)",
											value: actualCost,
											onChange: (e) => setActualCost(e.target.value),
											className: "border border-input rounded-md px-3 py-1.5 text-sm bg-background"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "Benefits achieved",
											value: benefits,
											onChange: (e) => setBenefits(e.target.value),
											className: "border border-input rounded-md px-3 py-1.5 text-sm bg-background"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Completion remarks",
										value: evidenceRemarks,
										onChange: (e) => setEvidenceRemarks(e.target.value),
										className: "max-w-2xl"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										onDragOver: (e) => {
											e.preventDefault();
											setDragOver(true);
										},
										onDragLeave: () => setDragOver(false),
										onDrop: (e) => {
											e.preventDefault();
											setDragOver(false);
											handleEvidenceFiles(e.dataTransfer.files);
										},
										className: cn("max-w-2xl block border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors", dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												multiple: true,
												accept: ACCEPTED_ATTR,
												className: "hidden",
												onChange: (e) => handleEvidenceFiles(e.target.files)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-6 h-6 mx-auto text-muted-foreground mb-1.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: "Drag & drop files here, or click to browse"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground mt-1",
												children: "Images, PDF, Word, Excel, PowerPoint, MP4/MOV, TXT, CSV"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: [
													"Max ",
													MAX_FILES,
													" files · up to ",
													MAX_FILE_MB,
													"MB each · ",
													evidenceFiles.length,
													"/",
													MAX_FILES,
													" selected"
												]
											})
										]
									}),
									evidenceFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "max-w-2xl divide-y divide-border rounded-md border border-border",
										children: evidenceFiles.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-3 px-3 py-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm truncate",
														children: f.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-muted-foreground",
														children: [(f.size / 1024).toFixed(1), " KB"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "p-1 hover:bg-muted rounded shrink-0",
													onClick: () => setEvidenceFiles(evidenceFiles.filter((_, j) => j !== i)),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 text-muted-foreground" })
												})
											]
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: uploading,
										onClick: submitEvidenceWithFiles,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }),
											" ",
											uploading ? "Submitting…" : "Submit evidence"
										]
									})
								]
							}),
							isPE && (status === "pe_verification" || status === "evidence_submitted") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "PE — Final verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Verification remarks",
										value: remarks,
										onChange: (e) => setRemarks(e.target.value),
										className: "max-w-lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => run(() => verifyFn({ data: {
												suggestion_id: id,
												outcome: "implemented",
												remarks
											} }), "Marked implemented"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), " Mark implemented"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "destructive",
											onClick: () => run(() => verifyFn({ data: {
												suggestion_id: id,
												outcome: "fake_closure",
												remarks
											} }), "Marked fake closure"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" }), " Fake closure"]
										})]
									})
								]
							}),
							(status === "implemented" || status === "closed" || status === "rejected") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "This suggestion is closed — no further actions."
							})
						]
					}),
					evidenceVersions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Evidence History"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"(",
										evidenceVersions.length,
										" version",
										evidenceVersions.length === 1 ? "" : "s",
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: evidenceVersions.map((ev, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("rounded-md border p-3", idx === 0 ? "border-primary/40 bg-primary/5" : "border-border bg-background"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5",
												children: ["v", ev.version]
											}), idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-medium text-primary",
												children: "Latest"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: new Date(ev.created_at).toLocaleString()
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs",
										children: [ev.actual_cost != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Actual cost:"
											}),
											" ₹ ",
											Number(ev.actual_cost).toLocaleString()
										] }), ev.benefits_achieved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Benefits:"
											}),
											" ",
											ev.benefits_achieved
										] })]
									}),
									ev.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Remarks:"
											}),
											" ",
											ev.remarks
										]
									}),
									ev.attachments?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 space-y-1",
										children: ev.attachments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "text-primary hover:underline truncate text-left",
												onClick: async () => {
													const { data, error } = await supabase.storage.from("suggestion-files").createSignedUrl(a.file_path, 3600);
													if (error || !data?.signedUrl) return toast.error("Could not open file");
													window.open(data.signedUrl, "_blank");
												},
												children: a.file_name
											})]
										}, a.id))
									})
								]
							}, ev.id))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium mb-3",
					children: "Timeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "space-y-4 relative",
					children: [history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative pl-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" }),
							i < history.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-2 top-3 bottom-[-1rem] w-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: new Date(h.created_at).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: STATUS_LABEL[h.to_status]
							}),
							h.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: h.remarks
							})
						]
					}, h.id)), history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs text-muted-foreground",
						children: "No activity yet."
					})]
				})]
			})]
		})]
	});
}
function Card({ title, children }) {
	if (!children) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-5",
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm whitespace-pre-wrap",
			children
		})]
	});
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 font-medium",
		children: value || "—"
	})] });
}
var SplitComponent = () => null;
//#endregion
export { SuggestionDetail, SplitComponent as component };
