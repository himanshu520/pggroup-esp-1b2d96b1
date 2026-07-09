import { o as createLucideIcon } from "./button-yJoTZDYV.mjs";
import { c as createServerFn } from "./createServerFn-BOrDV9mr.mjs";
import { a as objectType, n as booleanType, o as requireSupabaseAuth, r as enumType, s as stringType, t as arrayType } from "./types-BIoixYDB.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BONw7kM2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-admin.functions-B-ljf1OG.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var PowerOff = createLucideIcon("power-off", [
	["path", {
		d: "M18.36 6.64A9 9 0 0 1 20.77 15",
		key: "dxknvb"
	}],
	["path", {
		d: "M6.16 6.16a9 9 0 1 0 12.68 12.68",
		key: "1x7qb5"
	}],
	["path", {
		d: "M12 2v4",
		key: "3427ic"
	}],
	["path", {
		d: "m2 2 20 20",
		key: "1ooewy"
	}]
]);
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
var listUsersWithRoles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8206bb1489facac1047e468b8455cb9caa4c01b04951907ee1903bdf95bee3f7"));
var inviteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().email().transform((s) => s.trim().toLowerCase()),
	roles: arrayType(objectType({
		role: ROLE,
		location_id: stringType().uuid().nullable().optional(),
		plant_id: stringType().uuid().nullable().optional(),
		department_id: stringType().uuid().nullable().optional()
	})).default([])
}).parse(d)).handler(createSsrRpc("6c8b083b2b9d8b8e5719d14216486afd0107d2a71adeebaba03407811334e544"));
var addRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	user_id: stringType().uuid(),
	role: ROLE,
	location_id: stringType().uuid().nullable().optional(),
	plant_id: stringType().uuid().nullable().optional(),
	department_id: stringType().uuid().nullable().optional()
}).parse(d)).handler(createSsrRpc("6636a1d6a7fcbdc666c6d47673352025685cdbc6ffb2ec8da226399b42c6d631"));
var removeRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("82ae23b0de7be3b36edd18694f05efbfe45633f631db9d141c0a4384d4d3c6ce"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ email: stringType().email() }).parse(d)).handler(createSsrRpc("72fa8e22f0761bef4c5850f7e8e2240411e694099c3a8d7fc16c3f94b376e248"));
var setEmployeeActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	employee_id: stringType().uuid(),
	active: booleanType()
}).parse(d)).handler(createSsrRpc("a92950909badc9f920a49ecbb53de5347afd48884f7345561df314d059d840e8"));
var deleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ user_id: stringType().uuid() }).parse(d)).handler(createSsrRpc("272d2045b834b201d82f0a9035bcac4158b0eb0308e0cee81463859086b67c4d"));
var listEmployeesAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ showDeleted: booleanType().optional() }).optional().parse(d ?? {})).handler(createSsrRpc("d73e3c9b980131bc1fb648aa099df9b80c1a3f3e2660a495a5f26126c4b7f37b"));
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
var createEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => EMPLOYEE_INPUT.parse(d)).handler(createSsrRpc("a327506d54fae889d706597af81f374e11d1d1795e05a5ea8568d347e0510d5c"));
var updateEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => EMPLOYEE_INPUT.extend({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("60c472b58cb928b8c73e2720166997b89cd4926f204cd02ac6da74fabec8937c"));
var deleteEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("ce722c30cda2ac9aadb14cfa1b4963de75454f77f2da7b6b57a083410faa32b7"));
var restoreEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("f7d31f1d00f2cdc51416cb2885553f5a4fc1c36ae4b685864c55eae26f0d78e1"));
//#endregion
export { deleteUser as a, listUsersWithRoles as c, setEmployeeActive as d, updateEmployee as f, deleteEmployee as i, removeRole as l, addRole as n, inviteUser as o, createEmployee as r, listEmployeesAdmin as s, PowerOff as t, restoreEmployee as u };
