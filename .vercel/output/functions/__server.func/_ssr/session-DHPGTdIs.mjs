import { t as supabase } from "./client-DfqwfaTb.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-DHPGTdIs.js
async function loadSession() {
	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;
	if (!user) return null;
	const [{ data: employee }, { data: rolesRaw }] = await Promise.all([supabase.from("employees").select("*").eq("user_id", user.id).maybeSingle(), supabase.from("user_roles").select("role,location_id,plant_id,department_id").eq("user_id", user.id)]);
	const roles = rolesRaw ?? [];
	const adminRoles = [
		"super_admin",
		"corporate_admin",
		"location_admin",
		"plant_admin",
		"department_admin",
		"pe_user",
		"dept_user",
		"mgmt_viewer"
	];
	const isAdmin = roles.some((r) => adminRoles.includes(r.role));
	const isPE = roles.some((r) => r.role === "pe_user");
	const primaryRole = [
		"super_admin",
		"corporate_admin",
		"location_admin",
		"plant_admin",
		"department_admin",
		"pe_user",
		"dept_user",
		"mgmt_viewer",
		"employee"
	].find((r) => roles.some((x) => x.role === r)) ?? "employee";
	return {
		userId: user.id,
		email: user.email ?? "",
		employee: employee ?? null,
		roles,
		isAdmin,
		isPE,
		primaryRole
	};
}
function useSession() {
	return useQuery({
		queryKey: ["session"],
		queryFn: loadSession,
		staleTime: 3e4
	});
}
/**
* True when the current user can manage master data / employees / users:
* super_admin or corporate_admin only. Used to gate delete + restore UI.
* RLS + admin server functions enforce the same rule server-side.
*/
function useCanManage() {
	const { data } = useSession();
	return (data?.roles ?? []).some((r) => r.role === "super_admin" || r.role === "corporate_admin");
}
//#endregion
export { useCanManage as n, useSession as r, loadSession as t };
