import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ROLE = z.enum([
  "super_admin",
  "corporate_admin",
  "hr",
  "admin",
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

async function requireEmployeeAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const ok = (data ?? []).some((r) => r.role === "super_admin" || r.role === "corporate_admin" || r.role === "hr");
  if (!ok) throw new Error("Forbidden — HR or Admin access required.");
  return supabaseAdmin;
}

// List users with roles (admin view)
export const listUsersWithRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const [{ data: roles }, authList] = await Promise.all([
      supabaseAdmin
        .from("user_roles")
        .select("id,user_id,role,location_id,plant_id,department_id,created_at, locations(location), plants(name), departments(name)")
        .order("created_at", { ascending: false }),
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
              plant_ids: z.array(z.string().uuid()).nullable().optional(),
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
      const rows = data.roles.flatMap((r) => {
        const pids = r.plant_ids && r.plant_ids.length ? r.plant_ids : [r.plant_id ?? null];
        return pids.map((pid) => ({
          user_id: uid!,
          role: r.role,
          location_id: r.location_id ?? null,
          plant_id: pid,
          department_id: r.department_id ?? null,
        }));
      });
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
        plant_ids: z.array(z.string().uuid()).nullable().optional(),
        department_id: z.string().uuid().nullable().optional(),
      })
      .parse(d ?? {})
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const pids = data.plant_ids && data.plant_ids.length ? data.plant_ids : [data.plant_id ?? null];
    const rows = pids.map((pid) => ({
      user_id: data.user_id,
      role: data.role,
      location_id: data.location_id ?? null,
      plant_id: pid,
      department_id: data.department_id ?? null,
    }));
    const { error } = await supabaseAdmin.from("user_roles").upsert(
      rows,
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
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d ?? {}))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resendInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().email() }).parse(d ?? {}))
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
    z.object({ employee_id: z.string().uuid(), active: z.boolean() }).parse(d ?? {}),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireEmployeeAdmin(context.userId);
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
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d ?? {}))
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
    const supabaseAdmin = await requireEmployeeAdmin(context.userId);
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

function parseGender(val: unknown): "male" | "female" | "other" | "prefer_not_to_say" | null {
  if (!val || typeof val !== "string") return null;
  const s = val.trim().toLowerCase();
  if (["male", "m", "man", "boy", "purush", "पुरुष"].includes(s)) return "male";
  if (["female", "f", "woman", "girl", "mahila", "महिला"].includes(s)) return "female";
  if (["other", "o", "anya"].includes(s)) return "other";
  if (["prefer_not_to_say", "prefer not to say", "prefer_not", "n/a", "na", "not specified"].includes(s)) return "prefer_not_to_say";
  return null;
}

const GENDER = z.enum(["male", "female", "other", "prefer_not_to_say"]);
const GENDER_INPUT = z.preprocess(parseGender, GENDER.nullable().optional());

const EMPLOYEE_INPUT = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  employee_code: z.string().trim().min(1),
  designation: z.string().trim().nullable().optional(),
  mobile: z.string().trim().nullable().optional(),
  gender: GENDER_INPUT,
  location_id: z.string().uuid().nullable().optional(),
  plant_id: z.string().uuid().nullable().optional(),
  department_id: z.string().uuid().nullable().optional(),
  active: z.boolean().default(true),
});

export const createEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => EMPLOYEE_INPUT.parse(d))
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireEmployeeAdmin(context.userId);

    // Pre-check for duplicate employee_code (including soft-deleted records)
    const { data: existingCode } = await supabaseAdmin
      .from("employees")
      .select("id, name, employee_code, deleted_at")
      .ilike("employee_code", data.employee_code.trim())
      .maybeSingle();

    if (existingCode) {
      if (existingCode.deleted_at) {
        throw new Error(
          `Employee Code "${data.employee_code}" belongs to trashed employee "${existingCode.name}". Please restore or rename that record.`
        );
      }
      throw new Error(
        `Employee Code "${data.employee_code}" is already assigned to employee "${existingCode.name}". Please enter a unique code.`
      );
    }

    // Pre-check for duplicate email
    const { data: existingEmail } = await supabaseAdmin
      .from("employees")
      .select("id, name, email")
      .ilike("email", data.email.trim())
      .maybeSingle();

    if (existingEmail) {
      throw new Error(`Email "${data.email}" is already assigned to employee "${existingEmail.name}".`);
    }

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

    if (error) {
      if (error.code === "23505" || error.message.includes("employees_employee_code_key")) {
        throw new Error(`Employee Code "${data.employee_code}" is already taken. Please enter a unique Employee Code.`);
      }
      if (error.message.includes("employees_email_key")) {
        throw new Error(`Email "${data.email}" is already assigned to another employee.`);
      }
      throw new Error(error.message);
    }
    return row;
  });

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    EMPLOYEE_INPUT.extend({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireEmployeeAdmin(context.userId);
    const { id, ...rest } = data;

    // Check duplicate code on other employees
    const { data: existingCode } = await supabaseAdmin
      .from("employees")
      .select("id, name")
      .ilike("employee_code", rest.employee_code.trim())
      .neq("id", id)
      .maybeSingle();

    if (existingCode) {
      throw new Error(`Employee Code "${rest.employee_code}" is already assigned to employee "${existingCode.name}". Please enter a unique code.`);
    }

    // Fetch the current record to check for email updates and linked user_id
    const { data: before } = await supabaseAdmin
      .from("employees")
      .select("email, user_id")
      .eq("id", id)
      .maybeSingle();

    if (before && before.user_id && before.email.toLowerCase() !== rest.email.toLowerCase()) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(before.user_id, {
        email: rest.email,
        email_confirm: true,
      });
      if (authError) {
        throw new Error(`Failed to update auth user email: ${authError.message}`);
      }
    }

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
    if (error) {
      if (error.code === "23505" || error.message.includes("employees_employee_code_key")) {
        throw new Error(`Employee Code "${rest.employee_code}" is already taken by another employee.`);
      }
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d ?? {}))
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
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d ?? {}))
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

/* ============ BULK CREATE EMPLOYEES ============ */

export const bulkCreateEmployees = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        employees: z.array(
          z.object({
            name: z.string().trim().min(1, "Name is required"),
            email: z.string().email("Invalid email").transform((s) => s.trim().toLowerCase()),
            employee_code: z.string().trim().min(1, "Employee ID is required"),
            designation: z.string().trim().nullable().optional(),
            mobile: z.string().trim().nullable().optional(),
            gender: GENDER_INPUT,
            location: z.string().trim().nullable().optional(),
            plant: z.string().trim().nullable().optional(),
            department: z.string().trim().nullable().optional(),
            location_id: z.string().uuid().nullable().optional(),
            plant_id: z.string().uuid().nullable().optional(),
            department_id: z.string().uuid().nullable().optional(),
            active: z.boolean().default(true),
          })
        ),
      })
      .parse(d ?? {})
  )
  .handler(async ({ context, data }) => {
    const supabaseAdmin = await requireEmployeeAdmin(context.userId);

    const [{ data: locations }, { data: plants }, { data: depts }, { data: existingEmps }] = await Promise.all([
      supabaseAdmin.from("locations").select("id,location").is("deleted_at", null),
      supabaseAdmin.from("plants").select("id,name,location_id").is("deleted_at", null),
      supabaseAdmin.from("departments").select("id,name,code,plant_id").is("deleted_at", null),
      supabaseAdmin.from("employees").select("employee_code,email"),
    ]);

    const existingCodeSet = new Set((existingEmps ?? []).map((e) => e.employee_code.toLowerCase()));
    const existingEmailSet = new Set((existingEmps ?? []).map((e) => e.email.toLowerCase()));

    const cleanStr = (s: string | null | undefined) => (s ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    const rowsToInsert: any[] = [];
    const errors: Array<{ index: number; code?: string; name?: string; error: string }> = [];

    const processedCodesInBatch = new Set<string>();
    const processedEmailsInBatch = new Set<string>();

    data.employees.forEach((emp, index) => {
      const codeKey = emp.employee_code.toLowerCase();
      const emailKey = emp.email.toLowerCase();

      if (existingCodeSet.has(codeKey) || processedCodesInBatch.has(codeKey)) {
        errors.push({ index: index + 1, code: emp.employee_code, name: emp.name, error: `Employee Code "${emp.employee_code}" already exists.` });
        return;
      }
      if (existingEmailSet.has(emailKey) || processedEmailsInBatch.has(emailKey)) {
        errors.push({ index: index + 1, code: emp.employee_code, name: emp.name, error: `Email "${emp.email}" already exists.` });
        return;
      }

      // 1. Match Location
      let locId: string | null = emp.location_id ?? null;
      if (!locId && emp.location) {
        const cleanLoc = cleanStr(emp.location);
        const foundLoc = (locations ?? []).find(
          (l) => l.id === emp.location || cleanStr(l.location) === cleanLoc
        );
        if (foundLoc) locId = foundLoc.id;
      }

      // 2. Match Plant (prefer plant in matched location)
      let plantId: string | null = emp.plant_id ?? null;
      if (!plantId && emp.plant) {
        const cleanPlt = cleanStr(emp.plant);
        let foundPlt = (plants ?? []).find(
          (p) => (p.id === emp.plant || cleanStr(p.name) === cleanPlt) && (locId ? p.location_id === locId : true)
        );
        if (!foundPlt) {
          foundPlt = (plants ?? []).find(
            (p) => p.id === emp.plant || cleanStr(p.name) === cleanPlt
          );
        }
        if (foundPlt) {
          plantId = foundPlt.id;
          if (!locId && foundPlt.location_id) locId = foundPlt.location_id;
        }
      }

      // 3. Match Department (prefer department under matched plant / location)
      let deptId: string | null = emp.department_id ?? null;
      if (!deptId && emp.department) {
        const cleanDept = cleanStr(emp.department);
        // Stage A: Match by plantId + name or code
        let foundDept = (depts ?? []).find(
          (d) =>
            (d.id === emp.department || cleanStr(d.name) === cleanDept || cleanStr(d.code) === cleanDept) &&
            (plantId ? d.plant_id === plantId : true)
        );
        // Stage B: Match by name or code across all departments
        if (!foundDept) {
          foundDept = (depts ?? []).find(
            (d) => d.id === emp.department || cleanStr(d.name) === cleanDept || cleanStr(d.code) === cleanDept
          );
        }
        // Stage C: Partial name match under plantId
        if (!foundDept && plantId) {
          foundDept = (depts ?? []).find(
            (d) =>
              d.plant_id === plantId &&
              (cleanStr(d.name).includes(cleanDept) || cleanDept.includes(cleanStr(d.name)))
          );
        }

        if (foundDept) {
          deptId = foundDept.id;
          if (!plantId && foundDept.plant_id) {
            plantId = foundDept.plant_id;
            const pInfo = (plants ?? []).find((p) => p.id === plantId);
            if (!locId && pInfo?.location_id) locId = pInfo.location_id;
          }
        }
      }

      processedCodesInBatch.add(codeKey);
      processedEmailsInBatch.add(emailKey);

      rowsToInsert.push({
        name: emp.name,
        email: emp.email,
        employee_code: emp.employee_code,
        designation: emp.designation ?? null,
        mobile: emp.mobile ?? null,
        gender: emp.gender ?? null,
        location_id: locId,
        plant_id: plantId,
        department_id: deptId,
        active: emp.active ?? true,
      });
    });

    let insertedCount = 0;
    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin.from("employees").insert(rowsToInsert);
      if (insertError) {
        throw new Error(`Bulk insert failed: ${insertError.message}`);
      }
      insertedCount = rowsToInsert.length;
      await writeAudit(context.userId, "employee.bulk_import", "employees", "bulk", { count: insertedCount });
    }

    return {
      successCount: insertedCount,
      skippedCount: errors.length,
      errors,
    };
  });
