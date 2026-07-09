import { c as createServerFn } from "./createServerFn-BOrDV9mr.mjs";
import { a as objectType, n as booleanType, o as requireSupabaseAuth, r as enumType, s as stringType, t as arrayType } from "./types-BIoixYDB.mjs";
import { t as createServerRpc } from "./createServerRpc-BiMAX0JB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-admin.functions-iJElNQww.js
var ROLE = enumType([
	"super_admin",
	"corporate_admin",
	"location_admin",
	"plant_admin",
	"department_admin",
	"pe_user",
	"dept_user",
	"mgmt_viewer",
	"employee"
]);
async function requireAdmin(userId) {
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
	if (!(data ?? []).some((r) => r.role === "super_admin" || r.role === "corporate_admin")) throw new Error("Forbidden — admin access required.");
	return supabaseAdmin;
}
var listUsersWithRoles_createServerFn_handler = createServerRpc({
	id: "8206bb1489facac1047e468b8455cb9caa4c01b04951907ee1903bdf95bee3f7",
	name: "listUsersWithRoles",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => listUsersWithRoles.__executeServer(opts));
var listUsersWithRoles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listUsersWithRoles_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const [{ data: roles }, { data: employees }, authList] = await Promise.all([
		supabaseAdmin.from("user_roles").select("id,user_id,role,location_id,plant_id,department_id,created_at, locations(location), plants(name), departments(name)").order("created_at", { ascending: false }),
		supabaseAdmin.from("employees").select("id,user_id,name,email,employee_code,designation,active,location_id,plant_id,department_id"),
		supabaseAdmin.auth.admin.listUsers({ perPage: 1e3 })
	]);
	return {
		users: authList.data.users.map((u) => ({
			user_id: u.id,
			email: u.email ?? "",
			last_sign_in_at: u.last_sign_in_at ?? null,
			created_at: u.created_at,
			invited_at: u.invited_at ?? null
		})),
		roles: roles ?? [],
		employees: employees ?? []
	};
});
var inviteUser_createServerFn_handler = createServerRpc({
	id: "6c8b083b2b9d8b8e5719d14216486afd0107d2a71adeebaba03407811334e544",
	name: "inviteUser",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => inviteUser.__executeServer(opts));
var inviteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().email().transform((s) => s.trim().toLowerCase()),
	roles: arrayType(objectType({
		role: ROLE,
		location_id: stringType().uuid().nullable().optional(),
		plant_id: stringType().uuid().nullable().optional(),
		department_id: stringType().uuid().nullable().optional()
	})).default([])
}).parse(d)).handler(inviteUser_createServerFn_handler, async ({ context, data }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	let uid = (await supabaseAdmin.auth.admin.listUsers({ perPage: 1e3 })).data.users.find((u) => u.email?.toLowerCase() === data.email)?.id;
	if (!uid) {
		const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
			email: data.email,
			email_confirm: true
		});
		if (error) throw new Error(error.message);
		uid = created.user?.id;
	}
	if (!uid) throw new Error("Failed to create user.");
	if (data.roles.length) {
		const rows = data.roles.map((r) => ({
			user_id: uid,
			role: r.role,
			location_id: r.location_id ?? null,
			plant_id: r.plant_id ?? null,
			department_id: r.department_id ?? null
		}));
		const { error } = await supabaseAdmin.from("user_roles").upsert(rows, {
			onConflict: "user_id,role,location_id,plant_id,department_id",
			ignoreDuplicates: true
		});
		if (error) throw new Error(error.message);
	}
	return { user_id: uid };
});
var addRole_createServerFn_handler = createServerRpc({
	id: "6636a1d6a7fcbdc666c6d47673352025685cdbc6ffb2ec8da226399b42c6d631",
	name: "addRole",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => addRole.__executeServer(opts));
var addRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	user_id: stringType().uuid(),
	role: ROLE,
	location_id: stringType().uuid().nullable().optional(),
	plant_id: stringType().uuid().nullable().optional(),
	department_id: stringType().uuid().nullable().optional()
}).parse(d)).handler(addRole_createServerFn_handler, async ({ context, data }) => {
	const { error } = await (await requireAdmin(context.userId)).from("user_roles").upsert({
		user_id: data.user_id,
		role: data.role,
		location_id: data.location_id ?? null,
		plant_id: data.plant_id ?? null,
		department_id: data.department_id ?? null
	}, {
		onConflict: "user_id,role,location_id,plant_id,department_id",
		ignoreDuplicates: true
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var removeRole_createServerFn_handler = createServerRpc({
	id: "82ae23b0de7be3b36edd18694f05efbfe45633f631db9d141c0a4384d4d3c6ce",
	name: "removeRole",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => removeRole.__executeServer(opts));
var removeRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(removeRole_createServerFn_handler, async ({ context, data }) => {
	const { error } = await (await requireAdmin(context.userId)).from("user_roles").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var resendInvite_createServerFn_handler = createServerRpc({
	id: "72fa8e22f0761bef4c5850f7e8e2240411e694099c3a8d7fc16c3f94b376e248",
	name: "resendInvite",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => resendInvite.__executeServer(opts));
var resendInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ email: stringType().email() }).parse(d)).handler(resendInvite_createServerFn_handler, async ({ context, data }) => {
	const { error } = await (await requireAdmin(context.userId)).auth.admin.inviteUserByEmail(data.email);
	if (error) throw new Error(error.message);
	return { ok: true };
});
async function writeAudit(actor_id, action, entity_type, entity_id, meta = {}) {
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	await supabaseAdmin.from("audit_logs").insert({
		actor_id,
		action,
		entity_type,
		entity_id,
		meta
	});
}
var setEmployeeActive_createServerFn_handler = createServerRpc({
	id: "a92950909badc9f920a49ecbb53de5347afd48884f7345561df314d059d840e8",
	name: "setEmployeeActive",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => setEmployeeActive.__executeServer(opts));
var setEmployeeActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	employee_id: stringType().uuid(),
	active: booleanType()
}).parse(d)).handler(setEmployeeActive_createServerFn_handler, async ({ context, data }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: before } = await supabaseAdmin.from("employees").select("name,email,active,location_id,plant_id,department_id").eq("id", data.employee_id).maybeSingle();
	const { error } = await supabaseAdmin.from("employees").update({ active: data.active }).eq("id", data.employee_id);
	if (error) throw new Error(error.message);
	await writeAudit(context.userId, data.active ? "employee.activate" : "employee.deactivate", "employees", data.employee_id, {
		name: before?.name,
		email: before?.email,
		location_id: before?.location_id,
		plant_id: before?.plant_id,
		department_id: before?.department_id
	});
	return { ok: true };
});
var deleteUser_createServerFn_handler = createServerRpc({
	id: "272d2045b834b201d82f0a9035bcac4158b0eb0308e0cee81463859086b67c4d",
	name: "deleteUser",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => deleteUser.__executeServer(opts));
var deleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ user_id: stringType().uuid() }).parse(d)).handler(deleteUser_createServerFn_handler, async ({ context, data }) => {
	if (data.user_id === context.userId) throw new Error("You cannot delete your own account.");
	const supabaseAdmin = await requireAdmin(context.userId);
	await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
	await supabaseAdmin.from("employees").update({ user_id: null }).eq("user_id", data.user_id);
	const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
	if (error) throw new Error(error.message);
	await writeAudit(context.userId, "user.delete", "auth.users", data.user_id, {});
	return { ok: true };
});
var listEmployeesAdmin_createServerFn_handler = createServerRpc({
	id: "d73e3c9b980131bc1fb648aa099df9b80c1a3f3e2660a495a5f26126c4b7f37b",
	name: "listEmployeesAdmin",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => listEmployeesAdmin.__executeServer(opts));
var listEmployeesAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ showDeleted: booleanType().optional() }).optional().parse(d ?? {})).handler(listEmployeesAdmin_createServerFn_handler, async ({ context, data }) => {
	let q = (await requireAdmin(context.userId)).from("employees").select("id,user_id,name,email,employee_code,designation,mobile,gender,active,deleted_at,location_id,plant_id,department_id,created_at, locations(location), plants(name), departments(name)").order("created_at", { ascending: false });
	if (!data?.showDeleted) q = q.is("deleted_at", null);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var GENDER = enumType([
	"male",
	"female",
	"other",
	"prefer_not_to_say"
]);
var EMPLOYEE_INPUT = objectType({
	name: stringType().trim().min(1),
	email: stringType().email().transform((s) => s.trim().toLowerCase()),
	employee_code: stringType().trim().min(1),
	designation: stringType().trim().nullable().optional(),
	mobile: stringType().trim().nullable().optional(),
	gender: GENDER.nullable().optional(),
	location_id: stringType().uuid().nullable().optional(),
	plant_id: stringType().uuid().nullable().optional(),
	department_id: stringType().uuid().nullable().optional(),
	active: booleanType().default(true)
});
var createEmployee_createServerFn_handler = createServerRpc({
	id: "a327506d54fae889d706597af81f374e11d1d1795e05a5ea8568d347e0510d5c",
	name: "createEmployee",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => createEmployee.__executeServer(opts));
var createEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => EMPLOYEE_INPUT.parse(d)).handler(createEmployee_createServerFn_handler, async ({ context, data }) => {
	const { data: row, error } = await (await requireAdmin(context.userId)).from("employees").insert({
		name: data.name,
		email: data.email,
		employee_code: data.employee_code,
		designation: data.designation ?? null,
		mobile: data.mobile ?? null,
		gender: data.gender ?? null,
		location_id: data.location_id ?? null,
		plant_id: data.plant_id ?? null,
		department_id: data.department_id ?? null,
		active: data.active
	}).select("id").single();
	if (error) throw new Error(error.message);
	return row;
});
var updateEmployee_createServerFn_handler = createServerRpc({
	id: "60c472b58cb928b8c73e2720166997b89cd4926f204cd02ac6da74fabec8937c",
	name: "updateEmployee",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => updateEmployee.__executeServer(opts));
var updateEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => EMPLOYEE_INPUT.extend({ id: stringType().uuid() }).parse(d)).handler(updateEmployee_createServerFn_handler, async ({ context, data }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { id, ...rest } = data;
	const { error } = await supabaseAdmin.from("employees").update({
		...rest,
		designation: rest.designation ?? null,
		mobile: rest.mobile ?? null,
		gender: rest.gender ?? null,
		location_id: rest.location_id ?? null,
		plant_id: rest.plant_id ?? null,
		department_id: rest.department_id ?? null
	}).eq("id", id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteEmployee_createServerFn_handler = createServerRpc({
	id: "ce722c30cda2ac9aadb14cfa1b4963de75454f77f2da7b6b57a083410faa32b7",
	name: "deleteEmployee",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => deleteEmployee.__executeServer(opts));
var deleteEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteEmployee_createServerFn_handler, async ({ context, data }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: before } = await supabaseAdmin.from("employees").select("name,email,employee_code,location_id,plant_id,department_id").eq("id", data.id).maybeSingle();
	const { count } = await supabaseAdmin.from("suggestions").select("id", {
		count: "exact",
		head: true
	}).eq("employee_id", data.id);
	if ((count ?? 0) > 0) {
		const { error } = await supabaseAdmin.from("employees").update({
			active: false,
			deleted_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", data.id);
		if (error) throw new Error(error.message);
		await writeAudit(context.userId, "employee.soft_delete", "employees", data.id, {
			...before ?? {},
			linked_suggestions: count
		});
		return {
			ok: true,
			softDeleted: true,
			reason: `Employee has ${count} suggestion(s); moved to Trash.`
		};
	}
	const { error } = await supabaseAdmin.from("employees").update({
		active: false,
		deleted_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	await writeAudit(context.userId, "employee.soft_delete", "employees", data.id, before ?? {});
	return {
		ok: true,
		softDeleted: true
	};
});
var restoreEmployee_createServerFn_handler = createServerRpc({
	id: "f7d31f1d00f2cdc51416cb2885553f5a4fc1c36ae4b685864c55eae26f0d78e1",
	name: "restoreEmployee",
	filename: "src/lib/user-admin.functions.ts"
}, (opts) => restoreEmployee.__executeServer(opts));
var restoreEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(restoreEmployee_createServerFn_handler, async ({ context, data }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: before } = await supabaseAdmin.from("employees").select("name,email,location_id,plant_id,department_id").eq("id", data.id).maybeSingle();
	const { error } = await supabaseAdmin.from("employees").update({
		deleted_at: null,
		active: true
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	await writeAudit(context.userId, "employee.restore", "employees", data.id, before ?? {});
	return { ok: true };
});
//#endregion
export { addRole_createServerFn_handler, createEmployee_createServerFn_handler, deleteEmployee_createServerFn_handler, deleteUser_createServerFn_handler, inviteUser_createServerFn_handler, listEmployeesAdmin_createServerFn_handler, listUsersWithRoles_createServerFn_handler, removeRole_createServerFn_handler, resendInvite_createServerFn_handler, restoreEmployee_createServerFn_handler, setEmployeeActive_createServerFn_handler, updateEmployee_createServerFn_handler };
