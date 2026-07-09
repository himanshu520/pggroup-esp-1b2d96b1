import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Admin-only: create a new employee AND (optionally) grant roles
export const createEmployeeWithRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      employee_code: z.string().trim().min(1),
      name: z.string().trim().min(1),
      email: z.string().email(),
      mobile: z.string().optional().nullable(),
      designation: z.string().optional().nullable(),
      location_id: z.string().uuid(),
      plant_id: z.string().uuid(),
      department_id: z.string().uuid(),
      roles: z.array(
        z.object({
          role: z.enum([
            "super_admin","corporate_admin","location_admin","plant_admin",
            "department_admin","pe_user","dept_user","mgmt_viewer","employee",
          ]),
          location_id: z.string().uuid().nullable().optional(),
          plant_id: z.string().uuid().nullable().optional(),
          department_id: z.string().uuid().nullable().optional(),
        })
      ).default([]),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Must be super_admin or corporate_admin
    const { data: myRoles } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId);
    const allowed = (myRoles ?? []).some((r) => r.role === "super_admin" || r.role === "corporate_admin");
    if (!allowed) throw new Error("Forbidden");

    const { data: emp, error } = await supabaseAdmin.from("employees").insert({
      employee_code: data.employee_code,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      designation: data.designation,
      location_id: data.location_id,
      plant_id: data.plant_id,
      department_id: data.department_id,
    }).select("id").single();
    if (error) throw new Error(error.message);

    if (data.roles.length) {
      // We need auth.users.id first; create the user via admin API (they'll sign in with OTP)
      const { data: u } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
      });
      const uid = u.user?.id;
      if (uid) {
        await supabaseAdmin.from("employees").update({ user_id: uid }).eq("id", emp.id);
        await supabaseAdmin.from("user_roles").insert(
          data.roles.map((r) => ({ ...r, user_id: uid })),
        );
      }
    }

    return { id: emp.id };
  });
