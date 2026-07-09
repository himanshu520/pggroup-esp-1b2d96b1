import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { M as Minus } from "../_libs/lucide-react.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CURrBV8R.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { n as jt, t as Lt } from "../_libs/input-otp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-otp-Cq9q0LpN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Server-side existence check. Returns the real email only inside the trusted
* server runtime — never returned to the client. Generic "not found" errors
* prevent enumeration.
*/
/**
* Admin OTP: caller supplies an email. We only send the OTP if the address
* already belongs to an active employee or an existing role-bearing user.
* Unknown emails receive a generic error — no user is auto-created.
*/
var sendCustomOtp = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	email: stringType().trim().email(),
	name: stringType().optional()
}).parse(d)).handler(createSsrRpc("759e0e7908753e9657fdb90467a31d3a3fc59e5d04b7d42b24ba91f0e7d81e90"));
/**
* Starts the employee OTP flow. Resolves the employee_code to an email
* server-side and sends the OTP. Never returns the full email — only a masked
* form for user confirmation ("th***@company.com").
*/
var startEmployeeOtp = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ employee_code: stringType().trim().min(1).max(64) }).parse(d)).handler(createSsrRpc("c6b38b6982da3e7328ce1c144c328d1e62a84742e647689dcd156c38d7e7ee4f"));
/**
* Verifies the employee OTP server-side (the real email never touches the
* browser). Returns session tokens the client hands to
* `supabase.auth.setSession`.
*/
var verifyEmployeeOtp = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	employee_code: stringType().trim().min(1).max(64),
	token: stringType().trim().min(6).max(10)
}).parse(d)).handler(createSsrRpc("08fb33d0ed9cdbeb4e09170a1331433ae5363ba9d87b55857928a86eb2ca77b1"));
var linkAuthUserToEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("db83bdda2605b4594220971b5f56128bb73b65cda2efbbf4a94e126f19f04bc4"));
var InputOTP = import_react.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lt, {
	ref,
	containerClassName: cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName),
	className: cn("disabled:cursor-not-allowed", className),
	...props
}));
InputOTP.displayName = "InputOTP";
var InputOTPGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center", className),
	...props
}));
InputOTPGroup.displayName = "InputOTPGroup";
var InputOTPSlot = import_react.forwardRef(({ index, className, ...props }, ref) => {
	const { char, hasFakeCaret, isActive } = import_react.useContext(jt).slots[index];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", isActive && "z-10 ring-1 ring-ring", className),
		...props,
		children: [char, hasFakeCaret && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" })
		})]
	});
});
InputOTPSlot.displayName = "InputOTPSlot";
var InputOTPSeparator = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "separator",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
}));
InputOTPSeparator.displayName = "InputOTPSeparator";
//#endregion
export { sendCustomOtp as a, linkAuthUserToEmployee as i, InputOTPGroup as n, startEmployeeOtp as o, InputOTPSlot as r, verifyEmployeeOtp as s, InputOTP as t };
