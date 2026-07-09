import { c as createServerFn } from "./createServerFn-BOrDV9mr.mjs";
import { a as objectType, o as requireSupabaseAuth, s as stringType } from "./types-BIoixYDB.mjs";
import { t as createServerRpc } from "./createServerRpc-BiMAX0JB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.functions-yndqJmp9.js
function maskEmail(email) {
	const [local, domain] = email.split("@");
	if (!local || !domain) return "***";
	const head = local.slice(0, Math.min(2, local.length));
	return `${head}${"*".repeat(Math.max(1, local.length - head.length))}@${domain}`;
}
/**
* Server-side existence check. Returns the real email only inside the trusted
* server runtime — never returned to the client. Generic "not found" errors
* prevent enumeration.
*/
async function resolveKnownEmail(rawEmail) {
	const email = rawEmail.trim().toLowerCase();
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	const { data: emp } = await supabaseAdmin.from("employees").select("email, name, active").ilike("email", email).maybeSingle();
	if (emp && emp.active) return {
		email: emp.email,
		name: emp.name
	};
	try {
		const { data: list } = await supabaseAdmin.auth.admin.listUsers({
			page: 1,
			perPage: 200
		});
		const authUser = list?.users?.find((u) => (u.email ?? "").toLowerCase() === email);
		if (!authUser) return null;
		const { data: roles } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", authUser.id).limit(1);
		if (roles && roles.length > 0) return {
			email,
			name: null
		};
	} catch {}
	return null;
}
async function generateAndSendOtp(email, name) {
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	const { sendOtpEmail } = await import("./otp.server-B94ZUJqL.mjs");
	const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email
	});
	if (error) throw new Error(error.message);
	const otp = link.properties?.email_otp;
	if (!otp) throw new Error("Failed to generate OTP");
	await sendOtpEmail(email, otp, name ?? void 0);
}
/**
* Admin OTP: caller supplies an email. We only send the OTP if the address
* already belongs to an active employee or an existing role-bearing user.
* Unknown emails receive a generic error — no user is auto-created.
*/
var sendCustomOtp_createServerFn_handler = createServerRpc({
	id: "759e0e7908753e9657fdb90467a31d3a3fc59e5d04b7d42b24ba91f0e7d81e90",
	name: "sendCustomOtp",
	filename: "src/lib/auth.functions.ts"
}, (opts) => sendCustomOtp.__executeServer(opts));
var sendCustomOtp = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	email: stringType().trim().email(),
	name: stringType().optional()
}).parse(d)).handler(sendCustomOtp_createServerFn_handler, async ({ data }) => {
	const known = await resolveKnownEmail(data.email);
	if (!known) throw new Error("This email is not authorised to sign in");
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	await supabaseAdmin.auth.admin.createUser({
		email: known.email,
		email_confirm: true
	}).catch(() => {});
	await generateAndSendOtp(known.email, known.name ?? data.name ?? null);
	return { sent: true };
});
var startEmployeeOtp_createServerFn_handler = createServerRpc({
	id: "c6b38b6982da3e7328ce1c144c328d1e62a84742e647689dcd156c38d7e7ee4f",
	name: "startEmployeeOtp",
	filename: "src/lib/auth.functions.ts"
}, (opts) => startEmployeeOtp.__executeServer(opts));
var startEmployeeOtp = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ employee_code: stringType().trim().min(1).max(64) }).parse(d)).handler(startEmployeeOtp_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	const { data: emp } = await supabaseAdmin.from("employees").select("email, name, active").ilike("employee_code", data.employee_code).maybeSingle();
	if (!emp || !emp.active || !emp.email) throw new Error("Employee ID not found or inactive");
	await supabaseAdmin.auth.admin.createUser({
		email: emp.email,
		email_confirm: true
	}).catch(() => {});
	await generateAndSendOtp(emp.email, emp.name);
	return { maskedEmail: maskEmail(emp.email) };
});
var verifyEmployeeOtp_createServerFn_handler = createServerRpc({
	id: "08fb33d0ed9cdbeb4e09170a1331433ae5363ba9d87b55857928a86eb2ca77b1",
	name: "verifyEmployeeOtp",
	filename: "src/lib/auth.functions.ts"
}, (opts) => verifyEmployeeOtp.__executeServer(opts));
var verifyEmployeeOtp = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	employee_code: stringType().trim().min(1).max(64),
	token: stringType().trim().min(6).max(10)
}).parse(d)).handler(verifyEmployeeOtp_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	const { data: emp } = await supabaseAdmin.from("employees").select("email, active").ilike("employee_code", data.employee_code).maybeSingle();
	if (!emp || !emp.active || !emp.email) throw new Error("Invalid or expired OTP");
	const { createClient } = await import("./dist-D9z6hDE-.mjs").then((n) => n.n).then((n) => n.n);
	const { data: verified, error } = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		storage: void 0
	} }).auth.verifyOtp({
		email: emp.email,
		token: data.token,
		type: "email"
	});
	if (error || !verified.session) throw new Error("Invalid or expired OTP");
	return {
		access_token: verified.session.access_token,
		refresh_token: verified.session.refresh_token
	};
});
var linkAuthUserToEmployee_createServerFn_handler = createServerRpc({
	id: "db83bdda2605b4594220971b5f56128bb73b65cda2efbbf4a94e126f19f04bc4",
	name: "linkAuthUserToEmployee",
	filename: "src/lib/auth.functions.ts"
}, (opts) => linkAuthUserToEmployee.__executeServer(opts));
var linkAuthUserToEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(linkAuthUserToEmployee_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-BT9SWz1A.mjs");
	const { data: user } = await supabaseAdmin.auth.admin.getUserById(context.userId);
	const email = user.user?.email;
	if (!email) return { linked: false };
	const { data: emp } = await supabaseAdmin.from("employees").select("id,user_id").ilike("email", email).maybeSingle();
	if (emp && !emp.user_id) await supabaseAdmin.from("employees").update({ user_id: context.userId }).eq("id", emp.id);
	return { linked: true };
});
//#endregion
export { linkAuthUserToEmployee_createServerFn_handler, sendCustomOtp_createServerFn_handler, startEmployeeOtp_createServerFn_handler, verifyEmployeeOtp_createServerFn_handler };
