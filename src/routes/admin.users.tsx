import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  listUsersWithRoles,
  inviteUser,
  addRole,
  removeRole,
  
  setEmployeeActive,
  deleteUser,
} from "@/lib/user-admin.functions";
import { ROLE_LABEL, type AppRole } from "@/lib/statuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { Search, UserPlus, Shield, Trash2, Plus, PowerOff, Power, UserX } from "lucide-react";
import { ExportMenu } from "@/components/export-menu";

export const Route = createFileRoute("/admin/users")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "users" } as any }); },
  component: () => null,
});

const ROLES: AppRole[] = [
  "super_admin",
  "corporate_admin",
  "location_admin",
  "plant_admin",
  "department_admin",
  "pe_user",
  "dept_user",
  "mgmt_viewer",
  "employee",
];

type RoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  location_id: string | null;
  plant_id: string | null;
  department_id: string | null;
  locations?: { location: string } | null;
  plants?: { name: string } | null;
  departments?: { name: string } | null;
};

type EmployeeLite = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  employee_code: string;
  designation: string | null;
  active: boolean;
  location_id: string | null;
  plant_id: string | null;
  department_id: string | null;
};

export function UsersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listUsersWithRoles);
  const removeRoleFn = useServerFn(removeRole);
  
  const toggleActiveFn = useServerFn(setEmployeeActive);
  const deleteUserFn = useServerFn(deleteUser);

  const { data, isLoading } = useQuery({
    queryKey: ["users-and-roles"],
    queryFn: () => listFn(),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["loc-all"],
    queryFn: async () => (await supabase.from("locations").select("id,location").order("location")).data ?? [],
  });
  const { data: plants = [] } = useQuery({
    queryKey: ["plants-all"],
    queryFn: async () => (await supabase.from("plants").select("id,name,location_id").order("name")).data ?? [],
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["depts-all-u"],
    queryFn: async () => (await supabase.from("departments").select("id,name,plant_id").is("deleted_at", null).order("name")).data ?? [],
  });

  const [q, setQ] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addRoleFor, setAddRoleFor] = useState<{ user_id: string; email: string } | null>(null);
  const [revokeRole, setRevokeRole] = useState<{ id: string; label: string } | null>(null);
  const [deleteUserFor, setDeleteUserFor] = useState<{ user_id: string; email: string } | null>(null);

  const users = data?.users ?? [];
  const roles = (data?.roles ?? []) as RoleRow[];
  const employees = (data?.employees ?? []) as EmployeeLite[];

  const rowsByUser = useMemo(() => {
    const empByUser = new Map<string, EmployeeLite>();
    for (const e of employees) if (e.user_id) empByUser.set(e.user_id, e);
    const rolesByUser = new Map<string, RoleRow[]>();
    for (const r of roles) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r);
      rolesByUser.set(r.user_id, arr);
    }
    return users.map((u) => ({
      ...u,
      employee: empByUser.get(u.user_id) ?? null,
      roles: rolesByUser.get(u.user_id) ?? [],
    }));
  }, [users, employees, roles]);

  const filtered = q
    ? rowsByUser.filter((r) => {
        const hay = `${r.email} ${r.employee?.name ?? ""} ${r.employee?.employee_code ?? ""}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
    : rowsByUser;

  const invalidate = () => qc.invalidateQueries({ queryKey: ["users-and-roles"] });


  const toggleActive = useMutation({
    mutationFn: (v: { employee_id: string; active: boolean }) => toggleActiveFn({ data: v }),
    onSuccess: () => {
      toast.success("Employee status updated.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRoleM = useMutation({
    mutationFn: (id: string) => removeRoleFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Role revoked", {
        description: revokeRole
          ? `${revokeRole.label} was removed successfully.`
          : "The role was removed successfully.",
      });
      setRevokeRole(null);
      invalidate();
    },
    onError: (e: Error) => {
      toast.error("Could not revoke role", {
        description: e?.message || "An unexpected error occurred. Please try again.",
      });
    },
  });

  const deleteU = useMutation({
    mutationFn: (user_id: string) => deleteUserFn({ data: { user_id } }),
    onSuccess: () => {
      toast.success("User deleted.");
      setDeleteUserFor(null);
      invalidate();
    },
    onError: (e: unknown) => {
      console.error("[deleteUser] failed", e);
      const msg =
        e instanceof Error && e.message
          ? e.message
          : typeof e === "string"
            ? e
            : (e as { message?: string })?.message ?? "Failed to delete user.";
      toast.error(msg);
    },
  });

  // Export columns
  const exportRows = filtered.flatMap((u) =>
    u.roles.length
      ? u.roles.map((r) => ({
          email: u.email,
          name: u.employee?.name ?? "",
          code: u.employee?.employee_code ?? "",
          role: ROLE_LABEL[r.role],
          location: r.locations?.location ?? "",
          plant: r.plants?.name ?? "",
          department: r.departments?.name ?? "",
          last_sign_in: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never",
        }))
      : [
          {
            email: u.email,
            name: u.employee?.name ?? "",
            code: u.employee?.employee_code ?? "",
            role: "— none —",
            location: "",
            plant: "",
            department: "",
            last_sign_in: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never",
          },
        ],
  );

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Users & Roles"
        description="Add dashboard users and assign roles scoped to location, plant, or department. Users and employees are managed separately — adding a user here does not create an employee record."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu
              data={exportRows}
              columns={[
                { key: "email", header: "Email" },
                { key: "name", header: "Name" },
                { key: "code", header: "Employee ID" },
                { key: "role", header: "Role" },
                { key: "location", header: "Location" },
                { key: "plant", header: "Plant" },
                { key: "department", header: "Department" },
                { key: "last_sign_in", header: "Last sign-in" },
              ]}
              filename="users_and_roles"
              title="Users & Roles"
              subtitle="Enterprise user access matrix"
            />
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add user
                </Button>
              </DialogTrigger>
              <InviteDialog
                onClose={() => setInviteOpen(false)}
                locations={locations}
                plants={plants}
                departments={departments}
                onInvited={() => {
                  invalidate();
                  setInviteOpen(false);
                }}
              />
            </Dialog>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by email, name or employee ID"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground ml-auto">
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["User", "Employee", "Roles & scope", "Last sign-in", "Actions"].map((h) => (
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
                  Loading users…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.user_id} className="hover:bg-muted/30 align-top">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{u.email}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {u.user_id.slice(0, 8)}…
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.employee ? (
                      <div>
                        <div className="text-sm font-medium">{u.employee.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.employee.employee_code}
                          {u.employee.designation ? ` · ${u.employee.designation}` : ""}
                        </div>
                        {!u.employee.active && (
                          <Badge variant="destructive" className="mt-1 text-[10px]">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No employee record</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.roles.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">No roles assigned</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {u.roles.map((r) => (
                          <div key={r.id} className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              {ROLE_LABEL[r.role]}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              {[r.locations?.location, r.plants?.name, r.departments?.name]
                                .filter(Boolean)
                                .join(" › ") || "Global"}
                            </span>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => setRevokeRole({ id: r.id, label: ROLE_LABEL[r.role] })}
                              title="Revoke role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAddRoleFor({ user_id: u.user_id, email: u.email })}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Role
                      </Button>
                      {u.employee && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toggleActive.mutate({
                              employee_id: u.employee!.id,
                              active: !u.employee!.active,
                            })
                          }
                          title={u.employee.active ? "Deactivate employee" : "Reactivate employee"}
                        >
                          {u.employee.active ? (
                            <PowerOff className="w-3.5 h-3.5 text-destructive" />
                          ) : (
                            <Power className="w-3.5 h-3.5 text-success" />
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteUserFor({ user_id: u.user_id, email: u.email })}
                        title="Delete user permanently"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {addRoleFor && (
        <AddRoleDialog
          open={!!addRoleFor}
          onClose={() => setAddRoleFor(null)}
          user={addRoleFor}
          locations={locations}
          plants={plants}
          departments={departments}
          onAdded={() => {
            invalidate();
            setAddRoleFor(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!revokeRole}
        onOpenChange={(o) => !o && setRevokeRole(null)}
        title="Revoke role?"
        description={
          revokeRole
            ? `This will remove the "${revokeRole.label}" role. The user will immediately lose access granted by this role.`
            : ""
        }
        confirmLabel="Revoke"
        destructive
        loading={removeRoleM.isPending}
        onConfirm={() => {
          if (revokeRole) removeRoleM.mutate(revokeRole.id);
        }}
      />

      <ConfirmDialog
        open={!!deleteUserFor}
        onOpenChange={(o) => !o && setDeleteUserFor(null)}
        title="Delete user permanently?"
        description={
          deleteUserFor
            ? `This will permanently delete "${deleteUserFor.email}" — including their auth account, employee record, and all assigned roles. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete user"
        destructive
        loading={deleteU.isPending}
        onConfirm={() => {
          if (deleteUserFor) {
            deleteU.mutate(deleteUserFor.user_id);
          }
        }}
      />
    </AppShell>
  );
}

type Loc = { id: string; location: string };
type Plt = { id: string; name: string; location_id?: string };
type Dept = { id: string; name: string; plant_id?: string };

function ScopePicker({
  role,
  locations,
  plants,
  departments,
  value,
  onChange,
}: {
  role: AppRole;
  locations: Loc[];
  plants: Plt[];
  departments: Dept[];
  value: { location_id: string | null; plant_id: string | null; department_id: string | null };
  onChange: (v: { location_id: string | null; plant_id: string | null; department_id: string | null }) => void;
}) {
  const needsLoc = role === "location_admin" || role === "plant_admin" || role === "department_admin" || role === "dept_user";
  const needsPlant = role === "plant_admin" || role === "department_admin" || role === "dept_user";
  const needsDept = role === "department_admin" || role === "dept_user";

  const filteredPlants = value.location_id ? plants.filter((p) => p.location_id === value.location_id) : plants;
  const filteredDepts = value.plant_id ? departments.filter((d) => d.plant_id === value.plant_id) : departments;

  if (!needsLoc && !needsPlant && !needsDept) {
    return (
      <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
        This role is global (no location / plant / department scope required).
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {needsLoc && (
        <div>
          <Label className="text-xs">Location</Label>
          <Select
            value={value.location_id ?? ""}
            onValueChange={(v) => onChange({ location_id: v || null, plant_id: null, department_id: null })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {needsPlant && (
        <div>
          <Label className="text-xs">Plant</Label>
          <Select
            value={value.plant_id ?? ""}
            onValueChange={(v) => onChange({ ...value, plant_id: v || null, department_id: null })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select plant" />
            </SelectTrigger>
            <SelectContent>
              {filteredPlants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {needsDept && (
        <div>
          <Label className="text-xs">Department</Label>
          <Select
            value={value.department_id ?? ""}
            onValueChange={(v) => onChange({ ...value, department_id: v || null })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {filteredDepts.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

function InviteDialog({
  onClose,
  onInvited,
  locations,
  plants,
  departments,
}: {
  onClose: () => void;
  onInvited: () => void;
  locations: Loc[];
  plants: Plt[];
  departments: Dept[];
}) {
  const inviteFn = useServerFn(inviteUser);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("employee");
  const [scope, setScope] = useState<{ location_id: string | null; plant_id: string | null; department_id: string | null }>({
    location_id: null,
    plant_id: null,
    department_id: null,
  });
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email) return toast.error("Email is required.");
    setBusy(true);
    try {
      await inviteFn({
        data: {
          email,
          roles: [
            {
              role,
              location_id: scope.location_id,
              plant_id: scope.plant_id,
              department_id: scope.department_id,
            },
          ],
        },
      });
      toast.success("User added. They can sign in with OTP on this email.");
      onInvited();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add a user</DialogTitle>
        <DialogDescription>
          Creates a dashboard user with the chosen role and scope. The user can sign in from the login page by entering this email and the OTP sent to it. No invite email is sent, and no employee record is created — manage employees separately from the Employees page.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div>
          <Label className="text-xs">Email address</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />
        </div>
        <div>
          <Label className="text-xs">Initial role</Label>
          <Select value={role} onValueChange={(v) => { setRole(v as AppRole); setScope({ location_id: null, plant_id: null, department_id: null }); }}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ScopePicker
          role={role}
          locations={locations}
          plants={plants}
          departments={departments}
          value={scope}
          onChange={setScope}
        />
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={busy}>
          {busy ? "Adding…" : "Add user"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function AddRoleDialog({
  open,
  onClose,
  user,
  onAdded,
  locations,
  plants,
  departments,
}: {
  open: boolean;
  onClose: () => void;
  user: { user_id: string; email: string };
  onAdded: () => void;
  locations: Loc[];
  plants: Plt[];
  departments: Dept[];
}) {
  const addRoleFn = useServerFn(addRole);
  const [role, setRole] = useState<AppRole>("dept_user");
  const [scope, setScope] = useState<{ location_id: string | null; plant_id: string | null; department_id: string | null }>({
    location_id: null,
    plant_id: null,
    department_id: null,
  });
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addRoleFn({
        data: {
          user_id: user.user_id,
          role,
          location_id: scope.location_id,
          plant_id: scope.plant_id,
          department_id: scope.department_id,
        },
      });
      toast.success("Role assigned.");
      onAdded();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign role</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={(v) => { setRole(v as AppRole); setScope({ location_id: null, plant_id: null, department_id: null }); }}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScopePicker
            role={role}
            locations={locations}
            plants={plants}
            departments={departments}
            value={scope}
            onChange={setScope}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? "Saving…" : "Assign role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
