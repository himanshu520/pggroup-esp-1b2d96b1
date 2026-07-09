import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BEab6JLj.mjs";
import { A as useQuery, E as useCanManage, j as useQueryClient, k as useMutation } from "./dist-BCwtjUtj.mjs";
import { M as PageHeader, _ as DialogFooter, a as AlertDialogDescription, c as AlertDialogTitle, g as DialogDescription, h as DialogContent, i as AlertDialogContent, m as Dialog, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as AppShell, v as DialogHeader, y as DialogTitle } from "./app-shell-uI3AfMIW.mjs";
import { t as ADMIN_NAV } from "./admin-nav-ipU9T7Tj.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C6CLyVyr.mjs";
import { n as Undo2, t as Pencil } from "./undo-2-CGPn4rmQ.mjs";
import { i as Trash2, n as Plus, r as Power, t as ConfirmDialog } from "./confirm-dialog-B1SmO3ny.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { t as Label } from "./label-BTwUWmq0.mjs";
import { t as Switch } from "./switch-DKEb2IYG.mjs";
import { a as TabsContent, i as Tabs, n as ArrowRightLeft, o as TabsList, r as ArrowUp, s as TabsTrigger, t as ArrowDown } from "./tabs-hTzytgJN.mjs";
import { t as TriangleAlert } from "./triangle-alert-DmLBobpN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.masters-CJ5BjlO0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function audit(action, entity_type, entity_id, meta = {}) {
	const { data } = await supabase.auth.getUser();
	if (!data.user) return;
	await supabase.from("audit_logs").insert({
		actor_id: data.user.id,
		action,
		entity_type,
		entity_id,
		meta
	});
}
function friendlyError(e) {
	if (e?.code === "23503") return "This record is still referenced elsewhere. Deactivate it or reassign its children first.";
	return e?.message ?? "Operation failed";
}
function MastersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Master Data",
			description: "Manage hierarchy safely — deactivate or soft-delete records instead of breaking references. All changes are logged."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "locations",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "locations",
						children: "Locations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "plants",
						children: "Plants"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "departments",
						children: "Departments"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "categories",
						children: "Categories"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "locations",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "plants",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "departments",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "categories",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesTab, {})
				})
			]
		})]
	});
}
function CrudTable({ rows, cols, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-card overflow-hidden mt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/50 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [cols.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: c.label
				}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Actions"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: cols.length + 1,
					className: "text-center py-8 text-sm text-muted-foreground",
					children: "No records."
				}) }) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-muted/30 " + (r.deleted_at ? "opacity-50" : r.active === false ? "opacity-70" : ""),
					children: [cols.map((c) => {
						const v = c.render ? c.render(r) : r[c.key];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-sm",
							children: typeof v === "boolean" ? v ? "Yes" : "No" : v ?? "—"
						}, c.key);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2 text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end gap-1",
							children: actions(r)
						})
					})]
				}, r.id))
			})]
		})
	});
}
function TabHeader({ title, onAdd, canAdd = true, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [right, canAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Add"]
			})]
		})]
	});
}
function LocationsTab() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey: ["m-locations", showDeleted],
		queryFn: async () => {
			let q = supabase.from("locations").select("*").order("location");
			if (!showDeleted) q = q.is("deleted_at", null);
			return (await q).data ?? [];
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		state: "",
		location: "",
		active: true
	});
	const [depCheck, setDepCheck] = (0, import_react.useState)(null);
	const [reassign, setReassign] = (0, import_react.useState)(null);
	function openNew() {
		setEditing(null);
		setForm({
			state: "",
			location: "",
			active: true
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			state: r.state,
			location: r.location,
			active: r.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				state: form.state.trim(),
				location: form.location.trim(),
				active: form.active
			};
			if (!payload.state || !payload.location) throw new Error("State and location are required.");
			if (editing) {
				const { error } = await supabase.from("locations").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("location.update", "locations", editing.id, {
					before: {
						state: editing.state,
						location: editing.location,
						active: editing.active
					},
					after: payload
				});
			} else {
				const { data, error } = await supabase.from("locations").insert(payload).select("id").single();
				if (error) throw error;
				await audit("location.create", "locations", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Location updated" : "Location added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-locations"] });
			qc.invalidateQueries({ queryKey: ["locs"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("locations").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "location.activate" : "location.deactivate", "locations", r.id, {
				location: r.location,
				state: r.state
			});
		},
		onSuccess: () => {
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["m-locations"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const softDelete = useMutation({
		mutationFn: async (r) => {
			const { data: deps } = await supabase.from("plants").select("id,name,code").eq("location_id", r.id).is("deleted_at", null);
			if (deps && deps.length > 0) {
				setDepCheck({
					loc: r,
					plants: deps
				});
				throw new Error("__blocked__");
			}
			const { error } = await supabase.from("locations").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				active: false
			}).eq("id", r.id);
			if (error) throw error;
			await audit("location.soft_delete", "locations", r.id, {
				location: r.location,
				state: r.state
			});
		},
		onSuccess: () => {
			toast.success("Location moved to Trash");
			setPendingDelete(null);
			qc.invalidateQueries({ queryKey: ["m-locations"] });
		},
		onError: (e) => {
			if (e?.message !== "__blocked__") toast.error(friendlyError(e));
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("locations").update({
				deleted_at: null,
				active: true
			}).eq("id", r.id);
			if (error) throw error;
			await audit("location.restore", "locations", r.id, {
				location: r.location,
				state: r.state
			});
		},
		onSuccess: () => {
			toast.success("Location restored");
			qc.invalidateQueries({ queryKey: ["m-locations"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Locations",
			onAdd: openNew,
			canAdd: canManage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showDeleted,
					onCheckedChange: setShowDeleted
				}), "Show Trash"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "state",
					label: "State"
				},
				{
					key: "location",
					label: "Location"
				},
				{
					key: "active",
					label: "Active"
				},
				{
					key: "status",
					label: "Status",
					render: (r) => r.deleted_at ? "In Trash" : r.active ? "Active" : "Inactive"
				}
			],
			actions: (r) => !canManage ? null : r.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => restore.mutate(r),
				title: "Restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => toggleActive.mutate(r),
					title: r.active ? "Deactivate" : "Activate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => openEdit(r),
					title: "Edit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete(r),
					title: "Move to Trash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!pendingDelete,
			onOpenChange: (o) => !o && setPendingDelete(null),
			title: "Move location to Trash?",
			description: pendingDelete ? `"${pendingDelete.location}" will be moved to Trash. You can restore it from the Show Trash view. Plants under this location must be reassigned first.` : "",
			confirmLabel: "Move to Trash",
			destructive: true,
			loading: softDelete.isPending,
			onConfirm: () => {
				if (pendingDelete) softDelete.mutate(pendingDelete);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Location" : "New Location" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.state,
							onChange: (e) => setForm((f) => ({
								...f,
								state: e.target.value
							})),
							placeholder: "MH"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.location,
							onChange: (e) => setForm((f) => ({
								...f,
								location: e.target.value
							})),
							placeholder: "Mumbai"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!depCheck,
			onOpenChange: (o) => !o && setDepCheck(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-warning" }),
						" Cannot delete “",
						depCheck?.loc.location,
						"”"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"This location is used by ",
					depCheck?.plants.length,
					" active plant",
					depCheck?.plants.length === 1 ? "" : "s",
					". Reassign them to another location, or deactivate this one instead of deleting."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: depCheck?.plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: p.code
							})]
						}, p.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							if (depCheck) {
								toggleActive.mutate(depCheck.loc);
								setDepCheck(null);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-4 h-4" }), " Deactivate instead"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
						onClick: () => {
							if (depCheck) {
								setReassign({
									loc: depCheck.loc,
									plants: depCheck.plants,
									targetId: ""
								});
								setDepCheck(null);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-4 h-4" }), " Reassign plants…"]
					})
				] })
			] })
		}),
		reassign && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReassignPlantsDialog, {
			state: reassign,
			onClose: () => setReassign(null),
			onDone: () => {
				setReassign(null);
				qc.invalidateQueries({ queryKey: ["m-locations"] });
				qc.invalidateQueries({ queryKey: ["m-plants"] });
			}
		})
	] });
}
function ReassignPlantsDialog({ state, onClose, onDone }) {
	const [targetId, setTargetId] = (0, import_react.useState)(state.targetId);
	const [alsoDelete, setAlsoDelete] = (0, import_react.useState)(true);
	const { data: options = [] } = useQuery({
		queryKey: ["reassign-loc-options", state.loc.id],
		queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).eq("active", true).neq("id", state.loc.id).order("location")).data ?? []
	});
	const run = useMutation({
		mutationFn: async () => {
			if (!targetId) throw new Error("Choose a target location.");
			const plantIds = state.plants.map((p) => p.id);
			const { error } = await supabase.from("plants").update({ location_id: targetId }).in("id", plantIds);
			if (error) throw error;
			await audit("plant.reassign", "locations", state.loc.id, {
				from: state.loc.id,
				to: targetId,
				plant_ids: plantIds
			});
			if (alsoDelete) {
				const { error: e2 } = await supabase.from("locations").update({
					deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
					active: false
				}).eq("id", state.loc.id);
				if (e2) throw e2;
				await audit("location.soft_delete", "locations", state.loc.id, {
					location: state.loc.location,
					after_reassign: true
				});
			}
		},
		onSuccess: () => {
			toast.success(alsoDelete ? "Plants reassigned and location deleted" : "Plants reassigned");
			onDone();
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"Reassign plants from “",
				state.loc.location,
				"”"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Move ",
				state.plants.length,
				" plant",
				state.plants.length === 1 ? "" : "s",
				" to another location."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: targetId,
						onValueChange: setTargetId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select destination" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2 py-1.5 text-xs text-muted-foreground",
							children: "No other active locations. Create one first."
						}) : options.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: l.id,
							children: l.location
						}, l.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-muted/30 p-2 text-xs max-h-32 overflow-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold mb-1",
							children: "Plants to move"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: state.plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"• ",
							p.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"(",
									p.code,
									")"
								]
							})
						] }, p.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Also delete original location after reassign" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: alsoDelete,
							onCheckedChange: setAlsoDelete
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => run.mutate(),
				disabled: run.isPending || !targetId,
				children: run.isPending ? "Working…" : "Reassign"
			})] })
		] })
	});
}
function PlantsTab() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey: ["m-plants", showDeleted],
		queryFn: async () => {
			let q = supabase.from("plants").select("*, locations(location)").order("name");
			if (!showDeleted) q = q.is("deleted_at", null);
			return (await q).data ?? [];
		}
	});
	const { data: locations = [] } = useQuery({
		queryKey: ["m-locations-active"],
		queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).order("location")).data ?? []
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		code: "",
		name: "",
		location_id: "",
		active: true
	});
	const [depCheck, setDepCheck] = (0, import_react.useState)(null);
	function openNew() {
		setEditing(null);
		setForm({
			code: "",
			name: "",
			location_id: "",
			active: true
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			code: r.code,
			name: r.name,
			location_id: r.location_id,
			active: r.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				code: form.code.trim(),
				name: form.name.trim(),
				location_id: form.location_id,
				active: form.active
			};
			if (!payload.code || !payload.name || !payload.location_id) throw new Error("All fields required.");
			if (editing) {
				const { error } = await supabase.from("plants").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("plant.update", "plants", editing.id, { after: payload });
			} else {
				const { data, error } = await supabase.from("plants").insert(payload).select("id").single();
				if (error) throw error;
				await audit("plant.create", "plants", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Plant updated" : "Plant added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-plants"] });
			qc.invalidateQueries({ queryKey: ["plants"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("plants").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "plant.activate" : "plant.deactivate", "plants", r.id, {
				name: r.name,
				code: r.code,
				location_id: r.location_id
			});
		},
		onSuccess: () => {
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["m-plants"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const softDelete = useMutation({
		mutationFn: async (r) => {
			const { data: deps } = await supabase.from("departments").select("id,name,code").eq("plant_id", r.id).eq("active", true);
			if (deps && deps.length > 0) {
				setDepCheck({
					plant: r,
					depts: deps
				});
				throw new Error("__blocked__");
			}
			const { error } = await supabase.from("plants").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				active: false
			}).eq("id", r.id);
			if (error) throw error;
			await audit("plant.soft_delete", "plants", r.id, {
				name: r.name,
				code: r.code,
				location_id: r.location_id
			});
		},
		onSuccess: () => {
			toast.success("Plant moved to Trash");
			setPendingDelete(null);
			qc.invalidateQueries({ queryKey: ["m-plants"] });
		},
		onError: (e) => {
			if (e?.message !== "__blocked__") toast.error(friendlyError(e));
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("plants").update({
				deleted_at: null,
				active: true
			}).eq("id", r.id);
			if (error) throw error;
			await audit("plant.restore", "plants", r.id, {
				name: r.name,
				code: r.code,
				location_id: r.location_id
			});
		},
		onSuccess: () => {
			toast.success("Plant restored");
			qc.invalidateQueries({ queryKey: ["m-plants"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Plants",
			onAdd: openNew,
			canAdd: canManage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showDeleted,
					onCheckedChange: setShowDeleted
				}), "Show Trash"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "code",
					label: "Code"
				},
				{
					key: "name",
					label: "Name"
				},
				{
					key: "location",
					label: "Location",
					render: (r) => r.locations?.location
				},
				{
					key: "status",
					label: "Status",
					render: (r) => r.deleted_at ? "In Trash" : r.active ? "Active" : "Inactive"
				}
			],
			actions: (r) => !canManage ? null : r.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => restore.mutate(r),
				title: "Restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => toggleActive.mutate(r),
					title: r.active ? "Deactivate" : "Activate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => openEdit(r),
					title: "Edit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete(r),
					title: "Move to Trash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!pendingDelete,
			onOpenChange: (o) => !o && setPendingDelete(null),
			title: "Move plant to Trash?",
			description: pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.code}) will be moved to Trash. Departments under this plant must be deactivated first.` : "",
			confirmLabel: "Move to Trash",
			destructive: true,
			loading: softDelete.isPending,
			onConfirm: () => {
				if (pendingDelete) softDelete.mutate(pendingDelete);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Plant" : "New Plant" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.location_id,
							onValueChange: (v) => setForm((f) => ({
								...f,
								location_id: v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select location" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: locations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: l.id,
								children: l.location
							}, l.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.code,
							onChange: (e) => setForm((f) => ({
								...f,
								code: e.target.value
							})),
							placeholder: "PLT-01"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Plant A"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!depCheck,
			onOpenChange: (o) => !o && setDepCheck(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-warning" }),
						" Cannot delete “",
						depCheck?.plant.name,
						"”"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"This plant has ",
					depCheck?.depts.length,
					" active department",
					depCheck?.depts.length === 1 ? "" : "s",
					". Deactivate them (or this plant) before deleting."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: depCheck?.depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: d.code
							})]
						}, d.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
					onClick: () => {
						if (depCheck) {
							toggleActive.mutate(depCheck.plant);
							setDepCheck(null);
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-4 h-4" }), " Deactivate plant instead"]
				})] })
			] })
		})
	] });
}
function DepartmentsTab() {
	const qc = useQueryClient();
	const canManage = useCanManage();
	const [showDeleted, setShowDeleted] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey: ["m-depts", showDeleted],
		queryFn: async () => {
			let q = supabase.from("departments").select("*, plants(name)").order("name");
			if (!showDeleted) q = q.is("deleted_at", null);
			return (await q).data ?? [];
		}
	});
	const { data: plants = [] } = useQuery({
		queryKey: ["m-plants-lite"],
		queryFn: async () => (await supabase.from("plants").select("id,name").is("deleted_at", null).order("name")).data ?? []
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		code: "",
		name: "",
		plant_id: "",
		is_pe: false,
		active: true
	});
	function openNew() {
		setEditing(null);
		setForm({
			code: "",
			name: "",
			plant_id: "",
			is_pe: false,
			active: true
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			code: r.code,
			name: r.name,
			plant_id: r.plant_id,
			is_pe: r.is_pe,
			active: r.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				code: form.code.trim(),
				name: form.name.trim(),
				plant_id: form.plant_id,
				is_pe: form.is_pe,
				active: form.active
			};
			if (!payload.code || !payload.name || !payload.plant_id) throw new Error("All fields required.");
			if (editing) {
				const { error } = await supabase.from("departments").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("department.update", "departments", editing.id, { after: payload });
			} else {
				const { data, error } = await supabase.from("departments").insert(payload).select("id").single();
				if (error) throw error;
				await audit("department.create", "departments", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Department updated" : "Department added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-depts"] });
			qc.invalidateQueries({ queryKey: ["depts-all"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("departments").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "department.activate" : "department.deactivate", "departments", r.id, {
				name: r.name,
				code: r.code,
				plant_id: r.plant_id
			});
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["m-depts"] }),
		onError: (e) => toast.error(friendlyError(e))
	});
	const softDelete = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("departments").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				active: false
			}).eq("id", r.id);
			if (error) throw error;
			await audit("department.soft_delete", "departments", r.id, {
				name: r.name,
				code: r.code,
				plant_id: r.plant_id
			});
		},
		onSuccess: () => {
			toast.success("Department moved to Trash");
			setPendingDelete(null);
			qc.invalidateQueries({ queryKey: ["m-depts"] });
			qc.invalidateQueries({ queryKey: ["depts-all"] });
		},
		onError: (e) => {
			toast.error(friendlyError(e));
			setPendingDelete(null);
		}
	});
	const restore = useMutation({
		mutationFn: async (r) => {
			const { error } = await supabase.from("departments").update({
				deleted_at: null,
				active: true
			}).eq("id", r.id);
			if (error) throw error;
			await audit("department.restore", "departments", r.id, {
				name: r.name,
				code: r.code,
				plant_id: r.plant_id
			});
		},
		onSuccess: () => {
			toast.success("Department restored");
			qc.invalidateQueries({ queryKey: ["m-depts"] });
			qc.invalidateQueries({ queryKey: ["depts-all"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Departments",
			onAdd: openNew,
			canAdd: canManage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showDeleted,
					onCheckedChange: setShowDeleted
				}), "Show Trash"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "code",
					label: "Code"
				},
				{
					key: "name",
					label: "Name"
				},
				{
					key: "plant",
					label: "Plant",
					render: (r) => r.plants?.name
				},
				{
					key: "is_pe",
					label: "PE?"
				},
				{
					key: "status",
					label: "Status",
					render: (r) => r.deleted_at ? "In Trash" : r.active ? "Active" : "Inactive"
				}
			],
			actions: (r) => !canManage ? null : r.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => restore.mutate(r),
				title: "Restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" }), " Restore"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => toggleActive.mutate(r),
					title: r.active ? "Deactivate" : "Activate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => openEdit(r),
					title: "Edit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete(r),
					title: "Move to Trash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!pendingDelete,
			onOpenChange: (o) => !o && setPendingDelete(null),
			title: "Move department to Trash?",
			description: pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.code}) will be moved to Trash. Linked suggestions remain intact and can be viewed by admins.` : "",
			confirmLabel: "Move to Trash",
			destructive: true,
			loading: softDelete.isPending,
			onConfirm: () => {
				if (pendingDelete) softDelete.mutate(pendingDelete);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Department" : "New Department" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.plant_id,
							onValueChange: (v) => setForm((f) => ({
								...f,
								plant_id: v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select plant" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.id,
								children: p.name
							}, p.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.code,
							onChange: (e) => setForm((f) => ({
								...f,
								code: e.target.value
							})),
							placeholder: "PROD"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Production"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PE Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.is_pe,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									is_pe: v
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		})
	] });
}
function CategoriesTab() {
	const qc = useQueryClient();
	const { data: rows = [] } = useQuery({
		queryKey: ["m-cats"],
		queryFn: async () => (await supabase.from("categories").select("*").order("sort_order").order("name")).data ?? []
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		active: true,
		sort_order: 0
	});
	function openNew() {
		setEditing(null);
		const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order ?? 0)) + 10 : 10;
		setForm({
			name: "",
			active: true,
			sort_order: nextOrder
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		setForm({
			name: r.name,
			active: r.active,
			sort_order: r.sort_order ?? 0
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				name: form.name.trim(),
				active: form.active,
				sort_order: Number(form.sort_order) || 0
			};
			if (!payload.name) throw new Error("Name is required.");
			if (editing) {
				const { error } = await supabase.from("categories").update(payload).eq("id", editing.id);
				if (error) throw error;
				await audit("category.update", "categories", editing.id, { after: payload });
			} else {
				const { data, error } = await supabase.from("categories").insert(payload).select("id").single();
				if (error) throw error;
				await audit("category.create", "categories", data.id, payload);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Category updated" : "Category added");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["m-cats"] });
			qc.invalidateQueries({ queryKey: ["cats"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	const toggleActive = useMutation({
		mutationFn: async (r) => {
			const next = !r.active;
			const { error } = await supabase.from("categories").update({ active: next }).eq("id", r.id);
			if (error) throw error;
			await audit(next ? "category.activate" : "category.deactivate", "categories", r.id, { name: r.name });
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["m-cats"] }),
		onError: (e) => toast.error(friendlyError(e))
	});
	const swapOrder = useMutation({
		mutationFn: async ({ a, b }) => {
			const ao = a.sort_order ?? 0;
			const bo = b.sort_order ?? 0;
			const { error: e1 } = await supabase.from("categories").update({ sort_order: bo }).eq("id", a.id);
			if (e1) throw e1;
			const { error: e2 } = await supabase.from("categories").update({ sort_order: ao }).eq("id", b.id);
			if (e2) throw e2;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["m-cats"] });
			qc.invalidateQueries({ queryKey: ["cats"] });
		},
		onError: (e) => toast.error(friendlyError(e))
	});
	function move(r, dir) {
		const idx = rows.findIndex((x) => x.id === r.id);
		const target = rows[idx + dir];
		if (!target) return;
		swapOrder.mutate({
			a: r,
			b: target
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabHeader, {
			title: "Categories",
			onAdd: openNew
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
			rows,
			cols: [
				{
					key: "sort_order",
					label: "Order"
				},
				{
					key: "name",
					label: "Name"
				},
				{
					key: "active",
					label: "Active"
				}
			],
			actions: (r) => {
				const idx = rows.findIndex((x) => x.id === r.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: idx === 0 || swapOrder.isPending,
						onClick: () => move(r, -1),
						title: "Move up",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-3.5 h-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: idx === rows.length - 1 || swapOrder.isPending,
						onClick: () => move(r, 1),
						title: "Move down",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => toggleActive.mutate(r),
						title: r.active ? "Deactivate" : "Activate",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => openEdit(r),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
					})
				] });
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Category" : "New Category" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Safety"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display Order" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.sort_order,
								onChange: (e) => setForm((f) => ({
									...f,
									sort_order: Number(e.target.value)
								})),
								placeholder: "10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Lower numbers appear first."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									active: v
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})] })
			] })
		})
	] });
}
var SplitComponent = () => null;
//#endregion
export { MastersPage, SplitComponent as component };
