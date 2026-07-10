import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { AppRole } from "@/lib/statuses";

export type SessionProfile = {
  userId: string;
  email: string;
  employee: Tables<"employees"> | null;
  roles: Array<{ role: AppRole; location_id: string | null; plant_id: string | null; department_id: string | null }>;
  isAdmin: boolean;
  isPE: boolean;
  primaryRole: AppRole;
};

export async function loadSession(): Promise<SessionProfile | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const [{ data: employee }, { data: rolesRaw }] = await Promise.all([
    supabase.from("employees").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role,location_id,plant_id,department_id").eq("user_id", user.id),
  ]);

  const roles = (rolesRaw ?? []) as SessionProfile["roles"];
  const adminRoles: AppRole[] = ["super_admin","corporate_admin","location_admin","plant_admin","department_admin","pe_user","dept_user","mgmt_viewer"];
  const isAdmin = roles.some((r) => adminRoles.includes(r.role));
  const isPE = roles.some((r) => r.role === "pe_user");
  // Ranked
  const rank: AppRole[] = ["super_admin","corporate_admin","location_admin","plant_admin","department_admin","pe_user","dept_user","mgmt_viewer","employee"];
  const primaryRole = rank.find((r) => roles.some((x) => x.role === r)) ?? "employee";

  return {
    userId: user.id,
    email: user.email ?? "",
    employee: employee ?? null,
    roles,
    isAdmin,
    isPE,
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

export function isLocationAccessible(locationId: string | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => r.location_id === locationId);
}

export function isPlantAccessible(plantId: string | null, locationId: string | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => {
    if (r.role === "location_admin") return r.location_id === locationId;
    return r.plant_id === plantId;
  });
}

export function isDeptAccessible(deptId: string | null, plantId: string | null, locationId: string | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => {
    if (r.role === "location_admin") return r.location_id === locationId;
    if (r.role === "plant_admin" || r.role === "pe_user" || r.role === "mgmt_viewer") return r.plant_id === plantId;
    return r.department_id === deptId;
  });
}

export function isSuggestionAccessible(sug: { location_id: string | null; plant_id: string | null; department_id: string | null; current_department_id?: string | null } | null, roles: SessionProfile["roles"] | undefined): boolean {
  if (!sug || !roles) return false;
  if (roles.some((r) => r.role === "super_admin" || r.role === "corporate_admin")) return true;
  return roles.some((r) => {
    if (r.role === "location_admin") return r.location_id === sug.location_id;
    if (r.role === "plant_admin" || r.role === "pe_user" || r.role === "mgmt_viewer") {
      return r.location_id === sug.location_id && r.plant_id === sug.plant_id;
    }
    const deptId = sug.current_department_id || sug.department_id;
    return r.location_id === sug.location_id && r.plant_id === sug.plant_id && r.department_id === deptId;
  });
}

