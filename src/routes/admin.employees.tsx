import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useCanManage } from "@/lib/session";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  listEmployeesAdmin,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
  setEmployeeActive,
} from "@/lib/user-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2, Power, PowerOff, Users, Undo2 } from "lucide-react";
import { ExportMenu } from "@/components/export-menu";

export const Route = createFileRoute("/admin/employees")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "employees" } as any }); },
  component: () => null,
});

type Gender = "male" | "female" | "other" | "prefer_not_to_say";

const GENDER_LABEL: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

type Emp = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  employee_code: string;
  designation: string | null;
  mobile: string | null;
  gender: Gender | null;
  active: boolean;
  deleted_at: string | null;
  location_id: string | null;
  plant_id: string | null;
  department_id: string | null;
  locations?: { location: string } | null;
  plants?: { name: string } | null;
  departments?: { name: string } | null;
};

type Form = {
  id?: string;
  name: string;
  email: string;
  employee_code: string;
  designation: string;
  mobile: string;
  gender: "" | Gender;
  location_id: string;
  plant_id: string;
  department_id: string;
  active: boolean;
};

const EMPTY: Form = {
  name: "",
  email: "",
  employee_code: "",
  designation: "",
  mobile: "",
  gender: "",
  location_id: "",
  plant_id: "",
  department_id: "",
  active: true,
};

export function EmployeesPage() {
  const qc = useQueryClient();
  const canManage = useCanManage();
  const listFn = useServerFn(listEmployeesAdmin);
  const createFn = useServerFn(createEmployee);
  const updateFn = useServerFn(updateEmployee);
  const deleteFn = useServerFn(deleteEmployee);
  const restoreFn = useServerFn(restoreEmployee);
  const toggleFn = useServerFn(setEmployeeActive);

  const [showDeleted, setShowDeleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Emp | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-employees", showDeleted],
    queryFn: () => listFn({ data: { showDeleted } }),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["loc-all-emp"],
    queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).order("location")).data ?? [],
  });
  const { data: plants = [] } = useQuery({
    queryKey: ["plants-all-emp"],
    queryFn: async () => (await supabase.from("plants").select("id,name,location_id").is("deleted_at", null).order("name")).data ?? [],
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["depts-all-emp"],
    queryFn: async () => (await supabase.from("departments").select("id,name,plant_id").is("deleted_at", null).order("name")).data ?? [],
  });

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const editing = !!form.id;

  const filtered = useMemo(() => {
    const list = rows as Emp[];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((e) =>
      `${e.name} ${e.email} ${e.employee_code} ${e.designation ?? ""}`.toLowerCase().includes(s),
    );
  }, [rows, q]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-employees"] });

  const save = useMutation({
    mutationFn: async (v: Form) => {
      const payload = {
        name: v.name,
        email: v.email,
        employee_code: v.employee_code,
        designation: v.designation || null,
        mobile: v.mobile || null,
        gender: v.gender || null,
        location_id: v.location_id || null,
        plant_id: v.plant_id || null,
        department_id: v.department_id || null,
        active: v.active,
      };
      if (v.id) return updateFn({ data: { id: v.id, ...payload } });
      return createFn({ data: payload });
    },
    onSuccess: () => {
      toast.success(editing ? "Employee updated." : "Employee added.");
      setOpen(false);
      setForm(EMPTY);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: (r) => {
      if (r?.softDeleted && r.reason) toast.warning(r.reason);
      else toast.success("Employee moved to Trash.");
      setPendingDelete(null);
      invalidate();
    },
    onError: (e: Error) => { toast.error(e.message); setPendingDelete(null); },
  });

  const restore = useMutation({
    mutationFn: (id: string) => restoreFn({ data: { id } }),
    onSuccess: () => { toast.success("Employee restored."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: (v: { employee_id: string; active: boolean }) => toggleFn({ data: v }),
    onSuccess: () => {
      toast.success("Status updated.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportRows = filtered.map((e) => ({
    employee_code: e.employee_code,
    name: e.name,
    email: e.email,
    designation: e.designation ?? "",
    mobile: e.mobile ?? "",
    gender: e.gender ? GENDER_LABEL[e.gender] : "",
    location: e.locations?.location ?? "",
    plant: e.plants?.name ?? "",
    department: e.departments?.name ?? "",
    active: e.active ? "Yes" : "No",
    linked_user: e.user_id ? "Yes" : "No",
  }));

  function openAdd() {
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(e: Emp) {
    setForm({
      id: e.id,
      name: e.name,
      email: e.email,
      employee_code: e.employee_code,
      designation: e.designation ?? "",
      mobile: e.mobile ?? "",
      gender: e.gender ?? "",
      location_id: e.location_id ?? "",
      plant_id: e.plant_id ?? "",
      department_id: e.department_id ?? "",
      active: e.active,
    });
    setOpen(true);
  }

  const filteredPlants = form.location_id ? plants.filter((p) => p.location_id === form.location_id) : plants;
  const filteredDepts = form.plant_id ? departments.filter((d) => d.plant_id === form.plant_id) : departments;

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Employees"
        description="Add, edit, deactivate, and remove employees. Employees created here can be linked to a sign-in user from Users & Roles."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu
              data={exportRows}
              columns={[
                { key: "employee_code", header: "Employee ID" },
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
                { key: "designation", header: "Designation" },
                { key: "mobile", header: "Mobile" },
                { key: "location", header: "Location" },
                { key: "plant", header: "Plant" },
                { key: "department", header: "Department" },
                { key: "active", header: "Active" },
                { key: "linked_user", header: "Has user account" },
              ]}
              filename="employees"
              title="Employees"
            />
            {canManage && (
              <Button size="sm" onClick={openAdd}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add employee
              </Button>
            )}
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or employee ID"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
          Show Trash
        </label>
        <div className="text-xs text-muted-foreground ml-auto">
          {filtered.length} employee{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["Employee", "Contact", "Scope", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  Loading employees…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className={"hover:bg-muted/30 " + (e.deleted_at ? "opacity-50" : e.active ? "" : "opacity-60")}>
                  <td className="px-4 py-3 align-top">
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.employee_code}
                      {e.designation ? ` · ${e.designation}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs">{e.email}</div>
                    {e.mobile && <div className="text-xs text-muted-foreground">{e.mobile}</div>}
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {[e.locations?.location, e.plants?.name, e.departments?.name].filter(Boolean).join(" › ") || (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {e.deleted_at ? (
                      <Badge variant="destructive" className="text-[10px]">In Trash</Badge>
                    ) : e.active ? (
                      <Badge variant="secondary" className="text-[10px]">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">Inactive</Badge>
                    )}
                    {e.user_id && (
                      <Badge variant="outline" className="text-[10px] ml-1">
                        <Users className="w-3 h-3 mr-0.5" />
                        User linked
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-1">
                      {!canManage ? (
                        <span className="text-[11px] text-muted-foreground">View only</span>
                      ) : e.deleted_at ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => restore.mutate(e.id)}
                          title="Restore"
                          disabled={restore.isPending}
                        >
                          <Undo2 className="w-3.5 h-3.5" /> Restore
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(e)} title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggle.mutate({ employee_id: e.id, active: !e.active })}
                            title={e.active ? "Deactivate" : "Reactivate"}
                            disabled={toggle.isPending}
                          >
                            {e.active ? (
                              <PowerOff className="w-3.5 h-3.5 text-destructive" />
                            ) : (
                              <Power className="w-3.5 h-3.5 text-success" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPendingDelete(e)}
                            title="Move to Trash"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Move employee to Trash?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" (${pendingDelete.employee_code}) will be deactivated and moved to Trash. You can restore them anytime from the Show Trash view. This action is audit-logged.`
            : ""
        }
        confirmLabel="Move to Trash"
        destructive
        loading={del.isPending}
        onConfirm={() => { if (pendingDelete) del.mutate(pendingDelete.id); }}
      />


      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setForm(EMPTY); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit employee" : "Add employee"}</DialogTitle>
            <DialogDescription>
              Employee records store organizational identity. To grant sign-in access, invite the user in Users & Roles using the same email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <Field label="Employee ID *">
              <Input value={form.employee_code} onChange={(e) => setForm({ ...form, employee_code: e.target.value })} />
            </Field>
            <Field label="Full name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email *">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Mobile">
              <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </Field>
            <Field label="Designation">
              <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </Field>
            <Field label="Gender">
              <Select
                value={form.gender || undefined}
                onValueChange={(v) => setForm({ ...form, gender: v as Gender })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(GENDER_LABEL) as Gender[]).map((g) => (
                    <SelectItem key={g} value={g}>{GENDER_LABEL[g]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Location">
              <Select
                value={form.location_id}
                onValueChange={(v) => setForm({ ...form, location_id: v, plant_id: "", department_id: "" })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Plant">
              <Select
                value={form.plant_id}
                onValueChange={(v) => setForm({ ...form, plant_id: v, department_id: "" })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {filteredPlants.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Department">
              <Select
                value={form.department_id}
                onValueChange={(v) => setForm({ ...form, department_id: v })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {filteredDepts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="col-span-2 flex items-center gap-2 pt-1">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label className="text-xs">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setOpen(false); setForm(EMPTY); }} disabled={save.isPending}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.name.trim() || !form.email.trim() || !form.employee_code.trim())
                  return toast.error("Name, email and employee ID are required.");
                save.mutate(form);
              }}
              disabled={save.isPending}
            >
              {save.isPending ? "Saving…" : editing ? "Save changes" : "Add employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
