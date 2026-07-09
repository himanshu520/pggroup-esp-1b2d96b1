import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { a as cn, o as createLucideIcon } from "./button-yJoTZDYV.mjs";
import { c as createServerFn } from "./createServerFn-BOrDV9mr.mjs";
import { a as objectType, o as requireSupabaseAuth, s as stringType } from "./types-BIoixYDB.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BONw7kM2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-otp-DWsYhfwS.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Minus = createLucideIcon("minus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}]]);
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
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var Bt = Object.defineProperty;
var At = Object.defineProperties;
var kt = Object.getOwnPropertyDescriptors;
var Y = Object.getOwnPropertySymbols;
var gt = Object.prototype.hasOwnProperty;
var Et = Object.prototype.propertyIsEnumerable;
var vt = (r, s, e) => s in r ? Bt(r, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : r[s] = e;
var St = (r, s) => {
	for (var e in s || (s = {})) gt.call(s, e) && vt(r, e, s[e]);
	if (Y) for (var e of Y(s)) Et.call(s, e) && vt(r, e, s[e]);
	return r;
};
var bt = (r, s) => At(r, kt(s));
var Pt = (r, s) => {
	var e = {};
	for (var u in r) gt.call(r, u) && s.indexOf(u) < 0 && (e[u] = r[u]);
	if (r != null && Y) for (var u of Y(r)) s.indexOf(u) < 0 && Et.call(r, u) && (e[u] = r[u]);
	return e;
};
function ht(r) {
	return [
		setTimeout(r, 0),
		setTimeout(r, 10),
		setTimeout(r, 50)
	];
}
function _t(r) {
	let s = import_react.useRef();
	return import_react.useEffect(() => {
		s.current = r;
	}), s.current;
}
var Ot = 18;
var wt = 40;
var Gt = `${wt}px`;
var xt = [
	"[data-lastpass-icon-root]",
	"com-1password-button",
	"[data-dashlanecreated]",
	"[style$=\"2147483647 !important;\"]"
].join(",");
function Tt({ containerRef: r, inputRef: s, pushPasswordManagerStrategy: e, isFocused: u }) {
	let [P, D] = import_react.useState(!1), [G, H] = import_react.useState(!1), [F, W] = import_react.useState(!1), Z = import_react.useMemo(() => e === "none" ? !1 : (e === "increase-width" || e === "experimental-no-flickering") && P && G, [
		P,
		G,
		e
	]), T = import_react.useCallback(() => {
		let f = r.current, h = s.current;
		if (!f || !h || F || e === "none") return;
		let a = f, B = a.getBoundingClientRect().left + a.offsetWidth, A = a.getBoundingClientRect().top + a.offsetHeight / 2, z = B - Ot, q = A;
		document.querySelectorAll(xt).length === 0 && document.elementFromPoint(z, q) === f || (D(!0), W(!0));
	}, [
		r,
		s,
		F,
		e
	]);
	return import_react.useEffect(() => {
		let f = r.current;
		if (!f || e === "none") return;
		function h() {
			let A = window.innerWidth - f.getBoundingClientRect().right;
			H(A >= wt);
		}
		h();
		let a = setInterval(h, 1e3);
		return () => {
			clearInterval(a);
		};
	}, [r, e]), import_react.useEffect(() => {
		let f = u || document.activeElement === s.current;
		if (e === "none" || !f) return;
		let h = setTimeout(T, 0), a = setTimeout(T, 2e3), B = setTimeout(T, 5e3), A = setTimeout(() => {
			W(!0);
		}, 6e3);
		return () => {
			clearTimeout(h), clearTimeout(a), clearTimeout(B), clearTimeout(A);
		};
	}, [
		s,
		u,
		e,
		T
	]), {
		hasPWMBadge: P,
		willPushPWMBadge: Z,
		PWM_BADGE_SPACE_WIDTH: Gt
	};
}
var jt = import_react.createContext({});
var Lt = import_react.forwardRef((A, B) => {
	var z = A, { value: r, onChange: s, maxLength: e, textAlign: u = "left", pattern: P, placeholder: D, inputMode: G = "numeric", onComplete: H, pushPasswordManagerStrategy: F = "increase-width", pasteTransformer: W, containerClassName: Z, noScriptCSSFallback: T = Nt, render: f, children: h } = z, a = Pt(z, [
		"value",
		"onChange",
		"maxLength",
		"textAlign",
		"pattern",
		"placeholder",
		"inputMode",
		"onComplete",
		"pushPasswordManagerStrategy",
		"pasteTransformer",
		"containerClassName",
		"noScriptCSSFallback",
		"render",
		"children"
	]);
	var X, lt, ut, dt, ft;
	let [q, nt] = import_react.useState(typeof a.defaultValue == "string" ? a.defaultValue : ""), i = r != null ? r : q, I = _t(i), x = import_react.useCallback((t) => {
		s?.(t), nt(t);
	}, [s]), m = import_react.useMemo(() => P ? typeof P == "string" ? new RegExp(P) : P : null, [P]), l = import_react.useRef(null), K = import_react.useRef(null), J = import_react.useRef({
		value: i,
		onChange: x,
		isIOS: typeof window != "undefined" && ((lt = (X = window == null ? void 0 : window.CSS) == null ? void 0 : X.supports) == null ? void 0 : lt.call(X, "-webkit-touch-callout", "none"))
	}), V = import_react.useRef({ prev: [
		(ut = l.current) == null ? void 0 : ut.selectionStart,
		(dt = l.current) == null ? void 0 : dt.selectionEnd,
		(ft = l.current) == null ? void 0 : ft.selectionDirection
	] });
	import_react.useImperativeHandle(B, () => l.current, []), import_react.useEffect(() => {
		let t = l.current, o = K.current;
		if (!t || !o) return;
		J.current.value !== t.value && J.current.onChange(t.value), V.current.prev = [
			t.selectionStart,
			t.selectionEnd,
			t.selectionDirection
		];
		function d() {
			if (document.activeElement !== t) {
				L(null), N(null);
				return;
			}
			let c = t.selectionStart, b = t.selectionEnd, mt = t.selectionDirection, v = t.maxLength, C = t.value, _ = V.current.prev, g = -1, E = -1, w;
			if (C.length !== 0 && c !== null && b !== null) {
				let Dt = c === b, Ht = c === C.length && C.length < v;
				if (Dt && !Ht) {
					let y = c;
					if (y === 0) g = 0, E = 1, w = "forward";
					else if (y === v) g = y - 1, E = y, w = "backward";
					else if (v > 1 && C.length > 1) {
						let et = 0;
						if (_[0] !== null && _[1] !== null) {
							w = y < _[1] ? "backward" : "forward";
							let Wt = _[0] === _[1] && _[0] < v;
							w === "backward" && !Wt && (et = -1);
						}
						g = et + y, E = et + y + 1;
					}
				}
				g !== -1 && E !== -1 && g !== E && l.current.setSelectionRange(g, E, w);
			}
			let pt = g !== -1 ? g : c, Rt = E !== -1 ? E : b, yt = w != null ? w : mt;
			L(pt), N(Rt), V.current.prev = [
				pt,
				Rt,
				yt
			];
		}
		if (document.addEventListener("selectionchange", d, { capture: !0 }), d(), document.activeElement === t && Q(!0), !document.getElementById("input-otp-style")) {
			let c = document.createElement("style");
			if (c.id = "input-otp-style", document.head.appendChild(c), c.sheet) {
				let b = "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";
				$(c.sheet, "[data-input-otp]::selection { background: transparent !important; color: transparent !important; }"), $(c.sheet, `[data-input-otp]:autofill { ${b} }`), $(c.sheet, `[data-input-otp]:-webkit-autofill { ${b} }`), $(c.sheet, "@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }"), $(c.sheet, "[data-input-otp] + * { pointer-events: all !important; }");
			}
		}
		let R = () => {
			o && o.style.setProperty("--root-height", `${t.clientHeight}px`);
		};
		R();
		let p = new ResizeObserver(R);
		return p.observe(t), () => {
			document.removeEventListener("selectionchange", d, { capture: !0 }), p.disconnect();
		};
	}, []);
	let [ot, rt] = import_react.useState(!1), [j, Q] = import_react.useState(!1), [M, L] = import_react.useState(null), [k, N] = import_react.useState(null);
	import_react.useEffect(() => {
		ht(() => {
			var R, p, c, b;
			(R = l.current) == null || R.dispatchEvent(new Event("input"));
			let t = (p = l.current) == null ? void 0 : p.selectionStart, o = (c = l.current) == null ? void 0 : c.selectionEnd, d = (b = l.current) == null ? void 0 : b.selectionDirection;
			t !== null && o !== null && (L(t), N(o), V.current.prev = [
				t,
				o,
				d
			]);
		});
	}, [i, j]), import_react.useEffect(() => {
		I !== void 0 && i !== I && I.length < e && i.length === e && H?.(i);
	}, [
		e,
		H,
		I,
		i
	]);
	let O = Tt({
		containerRef: K,
		inputRef: l,
		pushPasswordManagerStrategy: F,
		isFocused: j
	}), st = import_react.useCallback((t) => {
		let o = t.currentTarget.value.slice(0, e);
		if (o.length > 0 && m && !m.test(o)) {
			t.preventDefault();
			return;
		}
		typeof I == "string" && o.length < I.length && document.dispatchEvent(new Event("selectionchange")), x(o);
	}, [
		e,
		x,
		I,
		m
	]), at = import_react.useCallback(() => {
		var t;
		if (l.current) {
			let o = Math.min(l.current.value.length, e - 1), d = l.current.value.length;
			(t = l.current) == null || t.setSelectionRange(o, d), L(o), N(d);
		}
		Q(!0);
	}, [e]), ct = import_react.useCallback((t) => {
		var g, E;
		let o = l.current;
		if (!W && (!J.current.isIOS || !t.clipboardData || !o)) return;
		let d = t.clipboardData.getData("text/plain"), R = W ? W(d) : d;
		t.preventDefault();
		let p = (g = l.current) == null ? void 0 : g.selectionStart, c = (E = l.current) == null ? void 0 : E.selectionEnd, v = (p !== c ? i.slice(0, p) + R + i.slice(c) : i.slice(0, p) + R + i.slice(p)).slice(0, e);
		if (v.length > 0 && m && !m.test(v)) return;
		o.value = v, x(v);
		let C = Math.min(v.length, e - 1), _ = v.length;
		o.setSelectionRange(C, _), L(C), N(_);
	}, [
		e,
		x,
		m,
		i
	]), It = import_react.useMemo(() => ({
		position: "relative",
		cursor: a.disabled ? "default" : "text",
		userSelect: "none",
		WebkitUserSelect: "none",
		pointerEvents: "none"
	}), [a.disabled]), it = import_react.useMemo(() => ({
		position: "absolute",
		inset: 0,
		width: O.willPushPWMBadge ? `calc(100% + ${O.PWM_BADGE_SPACE_WIDTH})` : "100%",
		clipPath: O.willPushPWMBadge ? `inset(0 ${O.PWM_BADGE_SPACE_WIDTH} 0 0)` : void 0,
		height: "100%",
		display: "flex",
		textAlign: u,
		opacity: "1",
		color: "transparent",
		pointerEvents: "all",
		background: "transparent",
		caretColor: "transparent",
		border: "0 solid transparent",
		outline: "0 solid transparent",
		boxShadow: "none",
		lineHeight: "1",
		letterSpacing: "-.5em",
		fontSize: "var(--root-height)",
		fontFamily: "monospace",
		fontVariantNumeric: "tabular-nums"
	}), [
		O.PWM_BADGE_SPACE_WIDTH,
		O.willPushPWMBadge,
		u
	]), Mt = import_react.useMemo(() => import_react.createElement("input", bt(St({ autoComplete: a.autoComplete || "one-time-code" }, a), {
		"data-input-otp": !0,
		"data-input-otp-placeholder-shown": i.length === 0 || void 0,
		"data-input-otp-mss": M,
		"data-input-otp-mse": k,
		inputMode: G,
		pattern: m == null ? void 0 : m.source,
		"aria-placeholder": D,
		style: it,
		maxLength: e,
		value: i,
		ref: l,
		onPaste: (t) => {
			var o;
			ct(t), (o = a.onPaste) == null || o.call(a, t);
		},
		onChange: st,
		onMouseOver: (t) => {
			var o;
			rt(!0), (o = a.onMouseOver) == null || o.call(a, t);
		},
		onMouseLeave: (t) => {
			var o;
			rt(!1), (o = a.onMouseLeave) == null || o.call(a, t);
		},
		onFocus: (t) => {
			var o;
			at(), (o = a.onFocus) == null || o.call(a, t);
		},
		onBlur: (t) => {
			var o;
			Q(!1), (o = a.onBlur) == null || o.call(a, t);
		}
	})), [
		st,
		at,
		ct,
		G,
		it,
		e,
		k,
		M,
		a,
		m == null ? void 0 : m.source,
		i
	]), tt = import_react.useMemo(() => ({
		slots: Array.from({ length: e }).map((t, o) => {
			var c;
			let d = j && M !== null && k !== null && (M === k && o === M || o >= M && o < k), R = i[o] !== void 0 ? i[o] : null;
			return {
				char: R,
				placeholderChar: i[0] !== void 0 ? null : (c = D == null ? void 0 : D[o]) != null ? c : null,
				isActive: d,
				hasFakeCaret: d && R === null
			};
		}),
		isFocused: j,
		isHovering: !a.disabled && ot
	}), [
		j,
		ot,
		e,
		k,
		M,
		a.disabled,
		i
	]), Ct = import_react.useMemo(() => f ? f(tt) : import_react.createElement(jt.Provider, { value: tt }, h), [
		h,
		tt,
		f
	]);
	return import_react.createElement(import_react.Fragment, null, T !== null && import_react.createElement("noscript", null, import_react.createElement("style", null, T)), import_react.createElement("div", {
		ref: K,
		"data-input-otp-container": !0,
		style: It,
		className: Z
	}, Ct, import_react.createElement("div", { style: {
		position: "absolute",
		inset: 0,
		pointerEvents: "none"
	} }, Mt)));
});
Lt.displayName = "Input";
function $(r, s) {
	try {
		r.insertRule(s);
	} catch (e) {
		console.error("input-otp could not insert CSS rule:", s);
	}
}
var Nt = `
[data-input-otp] {
  --nojs-bg: white !important;
  --nojs-fg: black !important;

  background-color: var(--nojs-bg) !important;
  color: var(--nojs-fg) !important;
  caret-color: var(--nojs-fg) !important;
  letter-spacing: .25em !important;
  text-align: center !important;
  border: 1px solid var(--nojs-fg) !important;
  border-radius: 4px !important;
  width: 100% !important;
}
@media (prefers-color-scheme: dark) {
  [data-input-otp] {
    --nojs-bg: black !important;
    --nojs-fg: white !important;
  }
}`;
var import_jsx_runtime = require_jsx_runtime();
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
