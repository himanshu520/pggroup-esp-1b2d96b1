import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { d as useNavigate, l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as supabase } from "./client-BpOPyYCh.mjs";
import { t as useServerFn } from "./useServerFn-DnQ7jNw3.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { t as KeyRound } from "./key-round-ZhtWgGPi.mjs";
import { i as linkAuthUserToEmployee, n as InputOTPGroup, o as startEmployeeOtp, r as InputOTPSlot, s as verifyEmployeeOtp, t as InputOTP } from "./input-otp-CL1v-9Yi.mjs";
import { t as BrandLogos } from "./brand-logos-CoQqwro8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.login-VX8kVIh6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var T = {
	en: {
		welcome: "Welcome",
		subtitle: "Employee Suggestion Portal",
		intro: "Share your ideas. Improve your workplace. Get recognised.",
		continueQ: "Do you want to continue?",
		yes: "Yes, continue",
		switch: "हिन्दी में देखें",
		enterId: "Enter your Employee ID",
		idHint: "We'll verify your access and send a login OTP code.",
		empId: "Employee ID",
		sendOtp: "Send OTP",
		verify: "Verify OTP",
		verifyHint: "Enter the 8-digit code sent to",
		resendIn: "Resend code in",
		resend: "Resend OTP",
		resending: "Resending…",
		back: "Back",
		verifyBtn: "Verify & sign in",
		admin: "Admin?",
		signInHere: "Sign in here"
	},
	hi: {
		welcome: "स्वागत है",
		subtitle: "कर्मचारी सुझाव पोर्टल",
		intro: "अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ। सम्मान पाएँ।",
		continueQ: "क्या आप जारी रखना चाहते हैं?",
		yes: "हाँ, जारी रखें",
		switch: "View in English",
		enterId: "अपना कर्मचारी आईडी दर्ज करें",
		idHint: "हम आपकी पहचान सत्यापित करेंगे और लॉगिन ओटीपी भेजेंगे।",
		empId: "कर्मचारी आईडी",
		sendOtp: "ओटीपी भेजें",
		verify: "ओटीपी सत्यापित करें",
		verifyHint: "इस पते पर भेजा गया 8-अंकीय कोड दर्ज करें",
		resendIn: "पुनः भेजें",
		resend: "ओटीपी पुनः भेजें",
		resending: "भेज रहे हैं…",
		back: "वापस",
		verifyBtn: "सत्यापित करें और साइन इन करें",
		admin: "एडमिन?",
		signInHere: "यहाँ साइन इन करें"
	}
};
function EmployeeLogin() {
	const [lang] = (0, import_react.useState)("en");
	const [stage, setStage] = (0, import_react.useState)("id");
	const t = T[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[color:oklch(0.18_0.05_260)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogos, {
					className: "justify-center mb-4",
					imgClassName: "h-14 sm:h-16"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-bold text-center text-[color:oklch(0.18_0.05_260)]",
					children: "Employee Suggestion Portal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-muted-foreground text-sm mt-1 mb-8",
					children: "Share your ideas. Improve your workplace."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeFlow, {
					t,
					stage,
					setStage
				})
			]
		})
	});
}
var RESEND_SECONDS = 30;
function EmployeeFlow({ t, stage, setStage }) {
	const [empCode, setEmpCode] = (0, import_react.useState)("");
	const [maskedEmail, setMaskedEmail] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const start = useServerFn(startEmployeeOtp);
	const verify = useServerFn(verifyEmployeeOtp);
	const link = useServerFn(linkAuthUserToEmployee);
	const navigate = useNavigate();
	const sendOtp = (0, import_react.useCallback)(async (code) => {
		const res = await start({ data: { employee_code: code } });
		setMaskedEmail(res.maskedEmail);
		return res.maskedEmail;
	}, [start]);
	async function requestOtp() {
		const code = empCode.trim();
		if (!code) return;
		setLoading(true);
		try {
			const masked = await sendOtp(code);
			toast.success(`OTP sent to ${masked}`);
			setStage("otp");
		} catch (e) {
			toast.error(e.message ?? "Could not send OTP");
		} finally {
			setLoading(false);
		}
	}
	async function resendOtp() {
		try {
			const masked = await sendOtp(empCode.trim());
			toast.success(`OTP resent to ${masked}`);
		} catch (e) {
			toast.error(e.message ?? "Could not resend OTP");
			throw e;
		}
	}
	async function verifyOtp() {
		if (otp.length !== 8) return;
		setLoading(true);
		try {
			const { access_token, refresh_token } = await verify({ data: {
				employee_code: empCode.trim(),
				token: otp
			} });
			const { error } = await supabase.auth.setSession({
				access_token,
				refresh_token
			});
			if (error) throw error;
			await link({ data: void 0 }).catch(() => {});
			toast.success("Signed in");
			navigate({ to: "/employee" });
		} catch (e) {
			toast.error(e.message ?? "Invalid or expired OTP");
		} finally {
			setLoading(false);
		}
	}
	return stage === "id" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-[color:oklch(0.18_0.05_260)]",
				children: t.enterId
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: t.idHint
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-semibold",
					children: t.empId
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "e.g. EMP00123",
					value: empCode,
					onChange: (e) => setEmpCode(e.target.value),
					className: "h-12 bg-muted/40",
					autoFocus: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full h-12 text-base bg-primary hover:bg-primary/90",
				disabled: loading || !empCode.trim(),
				onClick: requestOtp,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4 h-4" }),
					" ",
					t.sendOtp
				]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OtpStage, {
		t,
		email: maskedEmail,
		otp,
		setOtp,
		onBack: () => {
			setStage("id");
			setOtp("");
		},
		onVerify: verifyOtp,
		onResend: resendOtp,
		loading
	});
}
function OtpStage({ t, email, otp, setOtp, onBack, onVerify, onResend, loading }) {
	const [remaining, setRemaining] = (0, import_react.useState)(RESEND_SECONDS);
	const [resending, setResending] = (0, import_react.useState)(false);
	const startedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!startedRef.current) {
			startedRef.current = true;
			setRemaining(RESEND_SECONDS);
		}
		if (remaining <= 0) return;
		const int = setInterval(() => setRemaining((r) => r > 0 ? r - 1 : 0), 1e3);
		return () => clearInterval(int);
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
				children: t.verify
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: [
					t.verifyHint,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: email
					})
				]
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
					children: [
						t.resendIn,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-foreground",
							children: [remaining, "s"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleResend,
					disabled: resending,
					className: "font-semibold text-primary hover:underline disabled:opacity-60",
					children: resending ? t.resending : t.resend
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-12",
					onClick: onBack,
					children: t.back
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1 h-12 text-base bg-primary hover:bg-primary/90",
					onClick: onVerify,
					disabled: loading || otp.length !== 8,
					children: t.verifyBtn
				})]
			})
		]
	});
}
//#endregion
export { EmployeeLogin as component };
