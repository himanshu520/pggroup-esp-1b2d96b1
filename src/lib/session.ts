import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { AppRole } from "@/lib/statuses";

export type SessionProfile = {
  userId: string;
  email: string;
  employee: (Tables<"employees"> & {
    locations?: { location: string } | null;
    plants?: { name: string } | null;
    departments?: { name: string } | null;
  }) | null;
  roles: Array<{
    role: AppRole;
    location_id: string | null;
    plant_id: string | null;
    department_id: string | null;
    locations?: { location: string } | null;
    plants?: { name: string } | null;
    departments?: { name: string } | null;
  }>;
  isAdmin: boolean;
  isPE: boolean;
  isMD: boolean;
  primaryRole: AppRole;
};

export async function loadSession(): Promise<SessionProfile | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const [{ data: employee }, { data: rolesRaw }] = await Promise.all([
    supabase
      .from("employees")
      .select("*, locations(location), plants(name), departments(name, code)")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("user_roles")
      .select("role,location_id,plant_id,department_id, locations(location), plants(name), departments(name, code)")
      .eq("user_id", user.id),
  ]);

  const rawRoles = (rolesRaw ?? []) as SessionProfile["roles"];
  const roles = rawRoles.map((r) => ({
    ...r,
    location_id: r.location_id ?? employee?.location_id ?? null,
    plant_id: r.plant_id ?? employee?.plant_id ?? null,
    department_id: r.department_id ?? employee?.department_id ?? null,
  }));
  const adminRoles: AppRole[] = ["super_admin","corporate_admin","hr","admin","location_admin","plant_admin","department_admin","pe_user","dept_user","mgmt_viewer","md"];
  const isAdmin = roles.some((r) => adminRoles.includes(r.role));
  const isPE = roles.some((r) => r.role === "pe_user");
  const isMD = roles.some((r) => r.role === "md");
  // Ranked
  const rank: AppRole[] = ["super_admin","corporate_admin","md","admin","location_admin","plant_admin","hr","department_admin","pe_user","dept_user","mgmt_viewer","employee"];
  const primaryRole = rank.find((r) => roles.some((x) => x.role === r)) ?? "employee";

  return {
    userId: user.id,
    email: user.email ?? "",
    employee: (employee as any) ?? null,
    roles,
    isAdmin,
    isPE,
    isMD,
    primaryRole,
  };
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: loadSession,
    staleTime: 30_000,
  });
}

/**
 * True when the current user can manage master data / employees / users:
 * super_admin or corporate_admin only. Used to gate delete + restore UI.
 * RLS + admin server functions enforce the same rule server-side.
 */
export function useCanManage(): boolean {
  const { data } = useSession();
  const roles = data?.roles ?? [];
  return roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin");
}

/**
 * True when the current user can view/add/edit employees (including Excel upload):
 * super_admin, corporate_admin, or hr.
 */
export function useCanManageEmployees(): boolean {
  const { data } = useSession();
  const roles = data?.roles ?? [];
  return roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin" || r.role === "hr");
}

export function isLocationAccessible(locationId: string | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => {
    if (!r.location_id && !r.plant_id && !r.department_id) return true;
    if (r.location_id) return r.location_id === locationId;
    return false;
  });
}

export function isPlantAccessible(plantId: string | null, locationId: string | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => {
    if (!r.location_id && !r.plant_id && !r.department_id) return true;
    if (r.plant_id) return r.plant_id === plantId;
    if (r.location_id) return r.location_id === locationId;
    return false;
  });
}

export function isDeptAccessible(deptId: string | null, plantId: string | null, locationId: string | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => {
    if (!r.location_id && !r.plant_id && !r.department_id) return true;
    if (r.department_id) return r.department_id === deptId;
    if (r.plant_id) return r.plant_id === plantId;
    if (r.location_id) return r.location_id === locationId;
    return false;
  });
}

export function isSuggestionAccessible(
  sug: {
    location_id: string | null;
    plant_id: string | null;
    department_id: string | null;
    current_department_id?: string | null;
    status?: string;
  } | null,
  roles: SessionProfile["roles"] | undefined
): boolean {
  if (!sug || !roles || roles.length === 0) return false;

  // Super Admin & Corporate Admin with no location/plant restrictions have full global visibility
  const hasGlobalAdmin = roles.some(
    (r) =>
      (r.role === "super_admin" || r.role === "corporate_admin") &&
      !r.location_id &&
      !r.plant_id &&
      !r.department_id
  );
  if (hasGlobalAdmin) return true;

  return roles.some((r) => {
    // MD can only view implemented or closed suggestions
    if (r.role === "md") {
      if (sug.status !== "implemented" && sug.status !== "closed") return false;
      if (r.location_id && r.location_id !== sug.location_id) return false;
      if (r.plant_id && r.plant_id !== sug.plant_id) return false;
      return true;
    }

    // Department match (e.g., dept_user, department_admin)
    if (r.department_id) {
      const match =
        sug.department_id === r.department_id ||
        sug.current_department_id === r.department_id;
      if (!match) return false;
    }

    // Plant match (e.g., plant_admin, plant-level pe_user, plant-level admin)
    if (r.plant_id) {
      if (sug.plant_id !== r.plant_id) return false;
    }

    // Location/State match (e.g., location_admin, state-level hr)
    if (r.location_id) {
      if (sug.location_id !== r.location_id) return false;
    }

    return true;
  });
}

