import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ROLE = z.enum([
  "super_admin",
  "corporate_admin",
  "location_admin",
  "plant_admin",
  "department_admin",
  "pe_user",
  "dept_user",
  "mgmt_viewer",
  "employee",
]);

async function requireAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const ok = (data ?? []).some((r) => r.role === "super_admin" || r.role === "corporate_admin");
  if (!ok) throw new Error("Forbidden — admin access required.");
  return supabaseAdmin;
}

// List users with roles + employee record (admin view)
export const listUsersWithRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const [{ data: roles }, { data: employees }, authList] = await Promise.all([
      supabaseAdmin
        .from("user_roles")
        .select("id,user_id,role,location_id,plant_id,department_id,created_at, locations(location), plants(name), departments(name)")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("employees").select("id,user_id,name,email,employee_code,designation,active,location_id,plant_id,department_id"),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);
    const users = authList.data.users.map((u) => ({
      user_id: u.id,
      email: u.email ?? "",
      last_sign_in_at: u.last_sign_in_at ?? null,
      created_at: u.created_at,
      invited_at: (u as any).invited_at ?? null,
    }));
    return {
      users,
      roles: roles ?? [],
      employees: employees ?? [],
    };
  });

// Directly create a dashboard user (no magic-link invite). The user can sign
// in with the OTP flow on the auth page using this email. This does NOT touch
// the employees table — users and employees are managed separately.
export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        email: z.string().email().transform((s) => s.trim().toLowerCase()),
        roles: z
          .array(
            z.object({
              role: ROLE,
              location_id: z.string().uuid().nullable().optional(),
              plant_id: z.string().uuid().nullable().optional(),
              department_id: z.string().uuid().nullable().optional(),
            }),
          )
          .default([]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);

    // Reuse an existing auth user with the same email, otherwise create one
    // pre-confirmed so they can immediately request an OTP on the auth page.
    const list = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    let uid: string | undefined = list.data.users.find((u) => u.email?.toLowerCase() === data.email)?.id;

    if (!uid) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
      });
      if (error) throw new Error(error.message);
      uid = created.user?.id;
    }
    if (!uid) throw new Error("Failed to create user.");

    if (data.roles.length) {
      const rows = data.roles.map((r) => ({
        user_id: uid!,
        role: r.role,
        location_id: r.location_id ?? null,
        plant_id: r.plant_id ?? null,
        department_id: r.department_id ?? null,
      }));
      const { error } = await supabaseAdmin.from("user_roles").upsert(rows, {
        onConflict: "user_id,role,location_id,plant_id,department_id",
        ignoreDuplicates: true,
      });
      if (error) throw new Error(error.message);
    }
    return { user_id: uid };
  });

export const addRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        user_id: z.string().uuid(),
        role: ROLE,
        location_id: z.string().uuid().nullable().optional(),
        plant_id: z.string().uuid().nullable().optional(),
        department_id: z.string().uuid().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("user_roles").upsert(
      {
        user_id: data.user_id,
        role: data.role,
        location_id: data.location_id ?? null,
        plant_id: data.plant_id ?? null,
        department_id: data.department_id ?? null,
      },
      {
        onConflict: "user_id,role,location_id,plant_id,department_id",
        ignoreDuplicates: true,
      },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resendInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().email() }).parse(d))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

async function writeAudit(
  actor_id: string,
  action: string,
  entity_type: string,
  entity_id: string,
  meta: Record<string, any> = {},
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("audit_logs").insert({ actor_id, action, entity_type, entity_id, meta });
}

export const setEmployeeActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ employee_id: z.string().uuid(), active: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: before } = await supabaseAdmin
      .from("employees")
      .select("name,email,active,location_id,plant_id,department_id")
      .eq("id", data.employee_id)
      .maybeSingle();
    const { error } = await supabaseAdmin
      .from("employees")
      .update({ active: data.active })
      .eq("id", data.employee_id);
    if (error) throw new Error(error.message);
    await writeAudit(
      context.userId,
      data.active ? "employee.activate" : "employee.deactivate",
      "employees",
      data.employee_id,
      {
        name: before?.name,
        email: before?.email,
        location_id: before?.location_id,
        plant_id: before?.plant_id,
        department_id: before?.department_id,
      },
    );
    return { ok: true };
  });

/* ============ USER delete ============ */

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    if (data.user_id === context.userId) throw new Error("You cannot delete your own account.");
    const supabaseAdmin = await requireAdmin(context.userId);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    await supabaseAdmin.from("employees").update({ user_id: null }).eq("user_id", data.user_id);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    await writeAudit(context.userId, "user.delete", "auth.users", data.user_id, {});
    return { ok: true };
  });

/* ============ EMPLOYEES CRUD ============ */

export const listEmployeesAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ showDeleted: z.boolean().optional() }).optional().parse(d ?? {}),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    let q = supabaseAdmin
      .from("employees")
      .select(
        "id,user_id,name,email,employee_code,designation,mobile,gender,active,deleted_at,location_id,plant_id,department_id,created_at, locations(location), plants(name), departments(name)",
      )
      .order("created_at", { ascending: false });
    if (!data?.showDeleted) q = q.is("deleted_at", null);

    const [{ data: rows, error: rowsError }, { data: roles, error: rolesError }, authList] = await Promise.all([
      q,
      supabaseAdmin.from("user_roles").select("user_id"),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    if (rowsError) throw new Error(rowsError.message);
    if (rolesError) throw new Error(rolesError.message);

    const adminUserIds = new Set(roles?.map((r) => r.user_id).filter(Boolean) ?? []);
    const adminEmails = new Set(
      authList.data.users
        .filter((u) => adminUserIds.has(u.id))
        .map((u) => (u.email ?? "").toLowerCase())
    );

    const filteredRows = (rows ?? []).filter((e) => {
      if (e.user_id && adminUserIds.has(e.user_id)) return false;
      if (e.email && adminEmails.has(e.email.toLowerCase())) return false;
      return true;
    });

    return filteredRows;
  });

const GENDER = z.enum(["male", "female", "other", "prefer_not_to_say"]);

const EMPLOYEE_INPUT = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  employee_code: z.string().trim().min(1),
  designation: z.string().trim().nullable().optional(),
  mobile: z.string().trim().nullable().optional(),
  gender: GENDER.nullable().optional(),
  location_id: z.string().uuid().nullable().optional(),
  plant_id: z.string().uuid().nullable().optional(),
  department_id: z.string().uuid().nullable().optional(),
  active: z.boolean().default(true),
});

export const createEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => EMPLOYEE_INPUT.parse(d))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("employees")
      .insert({
        name: data.name,
        email: data.email,
        employee_code: data.employee_code,
        designation: data.designation ?? null,
        mobile: data.mobile ?? null,
        gender: data.gender ?? null,
        location_id: data.location_id ?? null,
        plant_id: data.plant_id ?? null,
        department_id: data.department_id ?? null,
        active: data.active,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    EMPLOYEE_INPUT.extend({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin
      .from("employees")
      .update({
        ...rest,
        designation: rest.designation ?? null,
        mobile: rest.mobile ?? null,
        gender: rest.gender ?? null,
        location_id: rest.location_id ?? null,
        plant_id: rest.plant_id ?? null,
        department_id: rest.department_id ?? null,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: before } = await supabaseAdmin
      .from("employees")
      .select("name,email,employee_code,location_id,plant_id,department_id")
      .eq("id", data.id)
      .maybeSingle();
    const { count } = await supabaseAdmin
      .from("suggestions")
      .select("id", { count: "exact", head: true })
      .eq("employee_id", data.id);
    if ((count ?? 0) > 0) {
      const { error } = await supabaseAdmin
        .from("employees")
        .update({ active: false, deleted_at: new Date().toISOString() })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      await writeAudit(context.userId, "employee.soft_delete", "employees", data.id, {
        ...(before ?? {}),
        linked_suggestions: count,
      });
      return { ok: true, softDeleted: true, reason: `Employee has ${count} suggestion(s); moved to Trash.` };
    }
    const { error } = await supabaseAdmin
      .from("employees")
      .update({ active: false, deleted_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(context.userId, "employee.soft_delete", "employees", data.id, before ?? {});
    return { ok: true, softDeleted: true };
  });

export const restoreEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: before } = await supabaseAdmin
      .from("employees")
      .select("name,email,location_id,plant_id,department_id")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await supabaseAdmin
      .from("employees")
      .update({ deleted_at: null, active: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(context.userId, "employee.restore", "employees", data.id, before ?? {});
    return { ok: true };
  });
