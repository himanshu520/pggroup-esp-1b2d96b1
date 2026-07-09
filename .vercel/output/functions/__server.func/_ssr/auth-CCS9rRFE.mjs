import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { d as useNavigate, l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { t as useServerFn } from "./useServerFn-DnQ7jNw3.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { t as KeyRound } from "./key-round-ZhtWgGPi.mjs";
import { t as Mail } from "./mail-ZNisf-aq.mjs";
import { a as sendCustomOtp, i as linkAuthUserToEmployee, n as InputOTPGroup, r as InputOTPSlot, t as InputOTP } from "./input-otp-CL1v-9Yi.mjs";
import { t as BrandLogos } from "./brand-logos-CoQqwro8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CCS9rRFE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center p-6 bg-[color:oklch(0.18_0.05_260)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-white shadow-2xl p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogos, {
					className: "justify-center mb-6",
					imgClassName: "h-16"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold text-center text-[color:oklch(0.18_0.05_260)]",
					children: "Dashboard Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-muted-foreground text-sm mt-1 mb-8",
					children: "Administration & management access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFlow, {})
			]
		})
	});
}
var RESEND_SECONDS = 30;
function AdminFlow() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [stage, setStage] = (0, import_react.useState)("email");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const link = useServerFn(linkAuthUserToEmployee);
	const send = useServerFn(sendCustomOtp);
	const navigate = useNavigate();
	const sendOtp = (0, import_react.useCallback)(async (targetEmail) => {
		await send({ data: { email: targetEmail } });
	}, [send]);
	async function requestOtp() {
		if (!email.trim()) return;
		setLoading(true);
		try {
			await sendOtp(email.trim());
			toast.success(`OTP sent to ${maskEmail(email)}`);
			setStage("otp");
		} catch (e) {
			toast.error(e.message ?? "Could not send OTP");
		} finally {
			setLoading(false);
		}
	}
	async function resendOtp() {
		try {
			await sendOtp(email.trim());
			toast.success(`OTP resent to ${maskEmail(email)}`);
		} catch (e) {
			toast.error(e.message ?? "Could not resend OTP");
			throw e;
		}
	}
	async function verifyOtp() {
		if (otp.length !== 8) return;
		setLoading(true);
		try {
			const { error } = await supabase.auth.verifyOtp({
				email,
				token: otp,
				type: "email"
			});
			if (error) throw error;
			await link({ data: void 0 }).catch(() => {});
			toast.success("Signed in");
			navigate({ to: "/" });
		} catch (e) {
			toast.error(e.message ?? "Invalid or expired OTP");
		} finally {
			setLoading(false);
		}
	}
	return stage === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-[color:oklch(0.18_0.05_260)]",
				children: "Enter your email"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "We'll verify your access and send a login OTP code."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-semibold",
					children: "Admin Email Address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						placeholder: "admin@company.com",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "h-12 pl-9 bg-muted/40"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full h-12 text-base bg-primary hover:bg-primary/90",
				onClick: requestOtp,
				disabled: loading || !email.trim(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4 h-4" }), " Send OTP"]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OtpStage, {
		email,
		otp,
		setOtp,
		onBack: () => {
			setStage("email");
			setOtp("");
		},
		onVerify: verifyOtp,
		onResend: resendOtp,
		loading
	});
}
function OtpStage({ email, otp, setOtp, onBack, onVerify, onResend, loading }) {
	const [remaining, setRemaining] = (0, import_react.useState)(RESEND_SECONDS);
	const [resending, setResending] = (0, import_react.useState)(false);
	const startedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!startedRef.current) {
			startedRef.current = true;
			setRemaining(RESEND_SECONDS);
		}
		if (remaining <= 0) return;
		const t = setInterval(() => setRemaining((r) => r > 0 ? r - 1 : 0), 1e3);
		return () => clearInterval(t);
	}, [remaining]);
	async function handleResend() {
		if (remaining > 0 || resending) return;
		setResending(true);
		try {
			await onResend();
			setRemaining(RESEND_SECONDS);
		} catch {} finally {
			setResending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-[color:oklch(0.18_0.05_260)]",
				children: "Verify OTP"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: ["Enter the 8-digit code sent to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: maskEmail(email)
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTP, {
					maxLength: 8,
					value: otp,
					onChange: setOtp,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPGroup, { children: [
						0,
						1,
						2,
						3,
						4,
						5,
						6,
						7
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: i }, i)) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-sm",
				children: remaining > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: ["Resend code in ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground",
						children: [remaining, "s"]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleResend,
					disabled: resending,
					className: "font-semibold text-primary hover:underline disabled:opacity-60",
					children: resending ? "Resending…" : "Resend OTP"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-12",
					onClick: onBack,
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1 h-12 text-base bg-primary hover:bg-primary/90",
					onClick: onVerify,
					disabled: loading || otp.length !== 8,
					children: "Verify & sign in"
				})]
			})
		]
	});
}
function maskEmail(e) {
	const [local, domain] = e.split("@");
	if (!domain) return e;
	return `${local.slice(0, 2)}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;
}
//#endregion
export { AuthPage as component };
