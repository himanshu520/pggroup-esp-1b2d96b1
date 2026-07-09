import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCanManage } from "@/lib/session";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Plus, Pencil, Trash2, Power, Undo2, AlertTriangle, ArrowRightLeft, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/masters")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "masters" } as any }); },
  component: () => null,
});

/* ============ Audit helper ============ */

async function audit(action: string, entity_type: string, entity_id: string, meta: Record<string, any> = {}) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("audit_logs").insert({
    actor_id: data.user.id,
    action,
    entity_type,
    entity_id,
    meta,
  });
}

function friendlyError(e: any): string {
  if (e?.code === "23503") return "This record is still referenced elsewhere. Deactivate it or reassign its children first.";
  return e?.message ?? "Operation failed";
}

/* ============ Page ============ */

export function MastersPage() {
  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Master Data"
        description="Manage hierarchy safely — deactivate or soft-delete records instead of breaking references. All changes are logged."
      />
      <Tabs defaultValue="locations">
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="locations"><LocationsTab /></TabsContent>
        <TabsContent value="plants"><PlantsTab /></TabsContent>
        <TabsContent value="departments"><DepartmentsTab /></TabsContent>
        <TabsContent value="categories"><CategoriesTab /></TabsContent>
      </Tabs>
    </AppShell>
  );
}

/* ============ Reusable table ============ */

type Col = { key: string; label: string; render?: (r: any) => any };

function CrudTable({
  rows, cols, actions,
}: { rows: any[]; cols: Col[]; actions: (r: any) => React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden mt-3">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {cols.map((c) => <th key={c.key} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</th>)}
            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length + 1} className="text-center py-8 text-sm text-muted-foreground">No records.</td></tr>
          ) : rows.map((r) => (
            <tr key={r.id} className={"hover:bg-muted/30 " + (r.deleted_at ? "opacity-50" : r.active === false ? "opacity-70" : "")}>
              {cols.map((c) => {
                const v = c.render ? c.render(r) : r[c.key];
                return <td key={c.key} className="px-4 py-2 text-sm">{typeof v === "boolean" ? (v ? "Yes" : "No") : (v ?? "—")}</td>;
              })}
              <td className="px-4 py-2 text-right"><div className="flex justify-end gap-1">{actions(r)}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabHeader({ title, onAdd, canAdd = true, right }: { title: string; onAdd: () => void; canAdd?: boolean; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="flex items-center gap-2">
        {right}
        {canAdd && <Button size="sm" onClick={onAdd}><Plus className="w-4 h-4" /> Add</Button>}
      </div>
    </div>
  );
}

/* ============ LOCATIONS ============ */

function LocationsTab() {
  const qc = useQueryClient();
  const canManage = useCanManage();
  const [showDeleted, setShowDeleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["m-locations", showDeleted],
    queryFn: async () => {
      let q = supabase.from("locations").select("*").order("location");
      if (!showDeleted) q = q.is("deleted_at", null);
      return (await q).data ?? [];
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ state: "", location: "", active: true });

  const [depCheck, setDepCheck] = useState<{ loc: any; plants: any[] } | null>(null);
  const [reassign, setReassign] = useState<{ loc: any; plants: any[]; targetId: string } | null>(null);

  function openNew() { setEditing(null); setForm({ state: "", location: "", active: true }); setOpen(true); }
  function openEdit(r: any) { setEditing(r); setForm({ state: r.state, location: r.location, active: r.active }); setOpen(true); }

  const save = useMutation({
    mutationFn: async () => {
      const payload = { state: form.state.trim(), location: form.location.trim(), active: form.active };
      if (!payload.state || !payload.location) throw new Error("State and location are required.");
      if (editing) {
        const { error } = await supabase.from("locations").update(payload).eq("id", editing.id);
        if (error) throw error;
        await audit("location.update", "locations", editing.id, { before: { state: editing.state, location: editing.location, active: editing.active }, after: payload });
      } else {
        const { data, error } = await supabase.from("locations").insert(payload).select("id").single();
        if (error) throw error;
        await audit("location.create", "locations", data.id, payload);
      }
    },
    onSuccess: () => { toast.success(editing ? "Location updated" : "Location added"); setOpen(false); qc.invalidateQueries({ queryKey: ["m-locations"] }); qc.invalidateQueries({ queryKey: ["locs"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const toggleActive = useMutation({
    mutationFn: async (r: any) => {
      const next = !r.active;
      const { error } = await supabase.from("locations").update({ active: next }).eq("id", r.id);
      if (error) throw error;
      await audit(next ? "location.activate" : "location.deactivate", "locations", r.id, { location: r.location, state: r.state });
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["m-locations"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const softDelete = useMutation({
    mutationFn: async (r: any) => {
      // Pre-check: fetch dependent (non-deleted) plants
      const { data: deps } = await supabase.from("plants").select("id,name,code").eq("location_id", r.id).is("deleted_at", null);
      if (deps && deps.length > 0) {
        setDepCheck({ loc: r, plants: deps });
        throw new Error("__blocked__");
      }
      const { error } = await supabase.from("locations").update({ deleted_at: new Date().toISOString(), active: false }).eq("id", r.id);
      if (error) throw error;
      await audit("location.soft_delete", "locations", r.id, { location: r.location, state: r.state });
    },
    onSuccess: () => { toast.success("Location moved to Trash"); setPendingDelete(null); qc.invalidateQueries({ queryKey: ["m-locations"] }); },
    onError: (e: any) => { if (e?.message !== "__blocked__") toast.error(friendlyError(e)); setPendingDelete(null); },
  });

  const restore = useMutation({
    mutationFn: async (r: any) => {
      const { error } = await supabase.from("locations").update({ deleted_at: null, active: true }).eq("id", r.id);
      if (error) throw error;
      await audit("location.restore", "locations", r.id, { location: r.location, state: r.state });
    },
    onSuccess: () => { toast.success("Location restored"); qc.invalidateQueries({ queryKey: ["m-locations"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  return (
    <>
      <TabHeader
        title="Locations"
        onAdd={openNew}
        canAdd={canManage}
        right={
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
            Show Trash
          </label>
        }
      />
      <CrudTable
        rows={rows}
        cols={[
          { key: "state", label: "State" },
          { key: "location", label: "Location" },
          { key: "active", label: "Active" },
          { key: "status", label: "Status", render: (r) => r.deleted_at ? "In Trash" : (r.active ? "Active" : "Inactive") },
        ]}
        actions={(r) => !canManage ? null : r.deleted_at ? (
          <Button variant="ghost" size="sm" onClick={() => restore.mutate(r)} title="Restore"><Undo2 className="w-3.5 h-3.5" /> Restore</Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => toggleActive.mutate(r)} title={r.active ? "Deactivate" : "Activate"}>
              <Power className={"w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(r)} title="Edit"><Pencil className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setPendingDelete(r)} title="Move to Trash">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Move location to Trash?"
        description={pendingDelete ? `"${pendingDelete.location}" will be moved to Trash. You can restore it from the Show Trash view. Plants under this location must be reassigned first.` : ""}
        confirmLabel="Move to Trash"
        destructive
        loading={softDelete.isPending}
        onConfirm={() => { if (pendingDelete) softDelete.mutate(pendingDelete); }}
      />


      {/* Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Location" : "New Location"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="MH" /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Mumbai" /></div>
            <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dependency block + reassign entry */}
      <AlertDialog open={!!depCheck} onOpenChange={(o) => !o && setDepCheck(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Cannot delete “{depCheck?.loc.location}”
            </AlertDialogTitle>
            <AlertDialogDescription>
              This location is used by {depCheck?.plants.length} active plant{depCheck?.plants.length === 1 ? "" : "s"}. Reassign them to another location, or deactivate this one instead of deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-sm">
            <ul className="space-y-1">
              {depCheck?.plants.map((p) => (
                <li key={p.id} className="flex justify-between"><span>{p.name}</span><span className="text-muted-foreground text-xs">{p.code}</span></li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={() => { if (depCheck) { toggleActive.mutate(depCheck.loc); setDepCheck(null); } }}>
              <Power className="w-4 h-4" /> Deactivate instead
            </Button>
            <AlertDialogAction onClick={() => { if (depCheck) { setReassign({ loc: depCheck.loc, plants: depCheck.plants, targetId: "" }); setDepCheck(null); } }}>
              <ArrowRightLeft className="w-4 h-4" /> Reassign plants…
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {reassign && <ReassignPlantsDialog state={reassign} onClose={() => setReassign(null)} onDone={() => { setReassign(null); qc.invalidateQueries({ queryKey: ["m-locations"] }); qc.invalidateQueries({ queryKey: ["m-plants"] }); }} />}
    </>
  );
}

function ReassignPlantsDialog({ state, onClose, onDone }: { state: { loc: any; plants: any[]; targetId: string }; onClose: () => void; onDone: () => void }) {
  const [targetId, setTargetId] = useState(state.targetId);
  const [alsoDelete, setAlsoDelete] = useState(true);
  const { data: options = [] } = useQuery({
    queryKey: ["reassign-loc-options", state.loc.id],
    queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).eq("active", true).neq("id", state.loc.id).order("location")).data ?? [],
  });

  const run = useMutation({
    mutationFn: async () => {
      if (!targetId) throw new Error("Choose a target location.");
      const plantIds = state.plants.map((p) => p.id);
      const { error } = await supabase.from("plants").update({ location_id: targetId }).in("id", plantIds);
      if (error) throw error;
      await audit("plant.reassign", "locations", state.loc.id, { from: state.loc.id, to: targetId, plant_ids: plantIds });
      if (alsoDelete) {
        const { error: e2 } = await supabase.from("locations").update({ deleted_at: new Date().toISOString(), active: false }).eq("id", state.loc.id);
        if (e2) throw e2;
        await audit("location.soft_delete", "locations", state.loc.id, { location: state.loc.location, after_reassign: true });
      }
    },
    onSuccess: () => { toast.success(alsoDelete ? "Plants reassigned and location deleted" : "Plants reassigned"); onDone(); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign plants from “{state.loc.location}”</DialogTitle>
          <DialogDescription>Move {state.plants.length} plant{state.plants.length === 1 ? "" : "s"} to another location.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Target location</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
              <SelectContent>
                {options.length === 0 ? <div className="px-2 py-1.5 text-xs text-muted-foreground">No other active locations. Create one first.</div>
                  : options.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-2 text-xs max-h-32 overflow-auto">
            <div className="font-semibold mb-1">Plants to move</div>
            <ul>{state.plants.map((p) => <li key={p.id}>• {p.name} <span className="text-muted-foreground">({p.code})</span></li>)}</ul>
          </div>
          <div className="flex items-center justify-between">
            <Label>Also delete original location after reassign</Label>
            <Switch checked={alsoDelete} onCheckedChange={setAlsoDelete} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => run.mutate()} disabled={run.isPending || !targetId}>
            {run.isPending ? "Working…" : "Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============ PLANTS ============ */

function PlantsTab() {
  const qc = useQueryClient();
  const canManage = useCanManage();
  const [showDeleted, setShowDeleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["m-plants", showDeleted],
    queryFn: async () => {
      let q = supabase.from("plants").select("*, locations(location)").order("name");
      if (!showDeleted) q = q.is("deleted_at", null);
      return (await q).data ?? [];
    },
  });
  const { data: locations = [] } = useQuery({
    queryKey: ["m-locations-active"],
    queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).order("location")).data ?? [],
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", name: "", location_id: "", active: true });
  const [depCheck, setDepCheck] = useState<{ plant: any; depts: any[] } | null>(null);

  function openNew() { setEditing(null); setForm({ code: "", name: "", location_id: "", active: true }); setOpen(true); }
  function openEdit(r: any) { setEditing(r); setForm({ code: r.code, name: r.name, location_id: r.location_id, active: r.active }); setOpen(true); }

  const save = useMutation({
    mutationFn: async () => {
      const payload = { code: form.code.trim(), name: form.name.trim(), location_id: form.location_id, active: form.active };
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
    onSuccess: () => { toast.success(editing ? "Plant updated" : "Plant added"); setOpen(false); qc.invalidateQueries({ queryKey: ["m-plants"] }); qc.invalidateQueries({ queryKey: ["plants"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const toggleActive = useMutation({
    mutationFn: async (r: any) => {
      const next = !r.active;
      const { error } = await supabase.from("plants").update({ active: next }).eq("id", r.id);
      if (error) throw error;
      await audit(next ? "plant.activate" : "plant.deactivate", "plants", r.id, { name: r.name, code: r.code, location_id: r.location_id });
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["m-plants"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const softDelete = useMutation({
    mutationFn: async (r: any) => {
      const { data: deps } = await supabase.from("departments").select("id,name,code").eq("plant_id", r.id).eq("active", true);
      if (deps && deps.length > 0) {
        setDepCheck({ plant: r, depts: deps });
        throw new Error("__blocked__");
      }
      const { error } = await supabase.from("plants").update({ deleted_at: new Date().toISOString(), active: false }).eq("id", r.id);
      if (error) throw error;
      await audit("plant.soft_delete", "plants", r.id, { name: r.name, code: r.code, location_id: r.location_id });
    },
    onSuccess: () => { toast.success("Plant moved to Trash"); setPendingDelete(null); qc.invalidateQueries({ queryKey: ["m-plants"] }); },
    onError: (e: any) => { if (e?.message !== "__blocked__") toast.error(friendlyError(e)); setPendingDelete(null); },
  });

  const restore = useMutation({
    mutationFn: async (r: any) => {
      const { error } = await supabase.from("plants").update({ deleted_at: null, active: true }).eq("id", r.id);
      if (error) throw error;
      await audit("plant.restore", "plants", r.id, { name: r.name, code: r.code, location_id: r.location_id });
    },
    onSuccess: () => { toast.success("Plant restored"); qc.invalidateQueries({ queryKey: ["m-plants"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  return (
    <>
      <TabHeader
        title="Plants"
        onAdd={openNew}
        canAdd={canManage}
        right={
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
            Show Trash
          </label>
        }
      />
      <CrudTable
        rows={rows}
        cols={[
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "location", label: "Location", render: (r) => r.locations?.location },
          { key: "status", label: "Status", render: (r) => r.deleted_at ? "In Trash" : (r.active ? "Active" : "Inactive") },
        ]}
        actions={(r) => !canManage ? null : r.deleted_at ? (
          <Button variant="ghost" size="sm" onClick={() => restore.mutate(r)} title="Restore"><Undo2 className="w-3.5 h-3.5" /> Restore</Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => toggleActive.mutate(r)} title={r.active ? "Deactivate" : "Activate"}>
              <Power className={"w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(r)} title="Edit"><Pencil className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setPendingDelete(r)} title="Move to Trash">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Move plant to Trash?"
        description={pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.code}) will be moved to Trash. Departments under this plant must be deactivated first.` : ""}
        confirmLabel="Move to Trash"
        destructive
        loading={softDelete.isPending}
        onConfirm={() => { if (pendingDelete) softDelete.mutate(pendingDelete); }}
      />


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Plant" : "New Plant"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Location</Label>
              <Select value={form.location_id} onValueChange={(v) => setForm((f) => ({ ...f, location_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>{locations.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="PLT-01" /></div>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Plant A" /></div>
            <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!depCheck} onOpenChange={(o) => !o && setDepCheck(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Cannot delete “{depCheck?.plant.name}”
            </AlertDialogTitle>
            <AlertDialogDescription>
              This plant has {depCheck?.depts.length} active department{depCheck?.depts.length === 1 ? "" : "s"}. Deactivate them (or this plant) before deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-sm">
            <ul className="space-y-1">
              {depCheck?.depts.map((d) => (
                <li key={d.id} className="flex justify-between"><span>{d.name}</span><span className="text-muted-foreground text-xs">{d.code}</span></li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (depCheck) { toggleActive.mutate(depCheck.plant); setDepCheck(null); } }}>
              <Power className="w-4 h-4" /> Deactivate plant instead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ============ DEPARTMENTS (unchanged behaviour) ============ */

function DepartmentsTab() {
  const qc = useQueryClient();
  const canManage = useCanManage();
  const [showDeleted, setShowDeleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["m-depts", showDeleted],
    queryFn: async () => {
      let q = supabase.from("departments").select("*, plants(name)").order("name");
      if (!showDeleted) q = q.is("deleted_at", null);
      return (await q).data ?? [];
    },
  });
  const { data: plants = [] } = useQuery({
    queryKey: ["m-plants-lite"],
    queryFn: async () => (await supabase.from("plants").select("id,name").is("deleted_at", null).order("name")).data ?? [],
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", name: "", plant_id: "", is_pe: false, active: true });

  function openNew() { setEditing(null); setForm({ code: "", name: "", plant_id: "", is_pe: false, active: true }); setOpen(true); }
  function openEdit(r: any) { setEditing(r); setForm({ code: r.code, name: r.name, plant_id: r.plant_id, is_pe: r.is_pe, active: r.active }); setOpen(true); }

  const save = useMutation({
    mutationFn: async () => {
      const payload = { code: form.code.trim(), name: form.name.trim(), plant_id: form.plant_id, is_pe: form.is_pe, active: form.active };
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
    onSuccess: () => { toast.success(editing ? "Department updated" : "Department added"); setOpen(false); qc.invalidateQueries({ queryKey: ["m-depts"] }); qc.invalidateQueries({ queryKey: ["depts-all"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const toggleActive = useMutation({
    mutationFn: async (r: any) => {
      const next = !r.active;
      const { error } = await supabase.from("departments").update({ active: next }).eq("id", r.id);
      if (error) throw error;
      await audit(next ? "department.activate" : "department.deactivate", "departments", r.id, { name: r.name, code: r.code, plant_id: r.plant_id });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["m-depts"] }),
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const softDelete = useMutation({
    mutationFn: async (r: any) => {
      const { error } = await supabase.from("departments").update({ deleted_at: new Date().toISOString(), active: false }).eq("id", r.id);
      if (error) throw error;
      await audit("department.soft_delete", "departments", r.id, { name: r.name, code: r.code, plant_id: r.plant_id });
    },
    onSuccess: () => { toast.success("Department moved to Trash"); setPendingDelete(null); qc.invalidateQueries({ queryKey: ["m-depts"] }); qc.invalidateQueries({ queryKey: ["depts-all"] }); },
    onError: (e: any) => { toast.error(friendlyError(e)); setPendingDelete(null); },
  });

  const restore = useMutation({
    mutationFn: async (r: any) => {
      const { error } = await supabase.from("departments").update({ deleted_at: null, active: true }).eq("id", r.id);
      if (error) throw error;
      await audit("department.restore", "departments", r.id, { name: r.name, code: r.code, plant_id: r.plant_id });
    },
    onSuccess: () => { toast.success("Department restored"); qc.invalidateQueries({ queryKey: ["m-depts"] }); qc.invalidateQueries({ queryKey: ["depts-all"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  return (
    <>
      <TabHeader
        title="Departments"
        onAdd={openNew}
        canAdd={canManage}
        right={
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
            Show Trash
          </label>
        }
      />
      <CrudTable
        rows={rows}
        cols={[
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "plant", label: "Plant", render: (r) => r.plants?.name },
          { key: "is_pe", label: "PE?" },
          { key: "status", label: "Status", render: (r) => r.deleted_at ? "In Trash" : (r.active ? "Active" : "Inactive") },
        ]}
        actions={(r) => !canManage ? null : r.deleted_at ? (
          <Button variant="ghost" size="sm" onClick={() => restore.mutate(r)} title="Restore"><Undo2 className="w-3.5 h-3.5" /> Restore</Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => toggleActive.mutate(r)} title={r.active ? "Deactivate" : "Activate"}>
              <Power className={"w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(r)} title="Edit"><Pencil className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setPendingDelete(r)} title="Move to Trash">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </>
        )}
      />
      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Move department to Trash?"
        description={pendingDelete ? `"${pendingDelete.name}" (${pendingDelete.code}) will be moved to Trash. Linked suggestions remain intact and can be viewed by admins.` : ""}
        confirmLabel="Move to Trash"
        destructive
        loading={softDelete.isPending}
        onConfirm={() => { if (pendingDelete) softDelete.mutate(pendingDelete); }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Department" : "New Department"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Plant</Label>
              <Select value={form.plant_id} onValueChange={(v) => setForm((f) => ({ ...f, plant_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select plant" /></SelectTrigger>
                <SelectContent>{plants.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="PROD" /></div>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Production" /></div>
            <div className="flex items-center justify-between"><Label>PE Department</Label><Switch checked={form.is_pe} onCheckedChange={(v) => setForm((f) => ({ ...f, is_pe: v }))} /></div>
            <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ============ CATEGORIES ============ */

function CategoriesTab() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["m-cats"],
    queryFn: async () =>
      (await supabase.from("categories").select("*").order("sort_order").order("name")).data ?? [],
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", active: true, sort_order: 0 });

  function openNew() {
    setEditing(null);
    const nextOrder = rows.length ? Math.max(...rows.map((r: any) => r.sort_order ?? 0)) + 10 : 10;
    setForm({ name: "", active: true, sort_order: nextOrder });
    setOpen(true);
  }
  function openEdit(r: any) {
    setEditing(r);
    setForm({ name: r.name, active: r.active, sort_order: r.sort_order ?? 0 });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name.trim(), active: form.active, sort_order: Number(form.sort_order) || 0 };
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
    onSuccess: () => { toast.success(editing ? "Category updated" : "Category added"); setOpen(false); qc.invalidateQueries({ queryKey: ["m-cats"] }); qc.invalidateQueries({ queryKey: ["cats"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const toggleActive = useMutation({
    mutationFn: async (r: any) => {
      const next = !r.active;
      const { error } = await supabase.from("categories").update({ active: next }).eq("id", r.id);
      if (error) throw error;
      await audit(next ? "category.activate" : "category.deactivate", "categories", r.id, { name: r.name });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["m-cats"] }),
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  const swapOrder = useMutation({
    mutationFn: async ({ a, b }: { a: any; b: any }) => {
      const ao = a.sort_order ?? 0;
      const bo = b.sort_order ?? 0;
      const { error: e1 } = await supabase.from("categories").update({ sort_order: bo }).eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("categories").update({ sort_order: ao }).eq("id", b.id);
      if (e2) throw e2;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["m-cats"] }); qc.invalidateQueries({ queryKey: ["cats"] }); },
    onError: (e: any) => toast.error(friendlyError(e)),
  });

  function move(r: any, dir: -1 | 1) {
    const idx = rows.findIndex((x: any) => x.id === r.id);
    const target = rows[idx + dir];
    if (!target) return;
    swapOrder.mutate({ a: r, b: target });
  }

  return (
    <>
      <TabHeader title="Categories" onAdd={openNew} />
      <CrudTable
        rows={rows}
        cols={[
          { key: "sort_order", label: "Order" },
          { key: "name", label: "Name" },
          { key: "active", label: "Active" },
        ]}
        actions={(r) => {
          const idx = rows.findIndex((x: any) => x.id === r.id);
          return (
            <>
              <Button variant="ghost" size="sm" disabled={idx === 0 || swapOrder.isPending} onClick={() => move(r, -1)} title="Move up">
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" disabled={idx === rows.length - 1 || swapOrder.isPending} onClick={() => move(r, 1)} title="Move down">
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleActive.mutate(r)} title={r.active ? "Deactivate" : "Activate"}>
                <Power className={"w-3.5 h-3.5 " + (r.active ? "text-success" : "text-muted-foreground")} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
            </>
          );
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Safety" /></div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} placeholder="10" />
              <div className="text-[11px] text-muted-foreground mt-1">Lower numbers appear first.</div>
            </div>
            <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
