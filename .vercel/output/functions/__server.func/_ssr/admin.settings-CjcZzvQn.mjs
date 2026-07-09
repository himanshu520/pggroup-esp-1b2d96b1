import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { l as toast, t as Button } from "./button-yJoTZDYV.mjs";
import { t as Bell } from "./dist-DuWSCmUg.mjs";
import { M as PageHeader, u as AppShell } from "./app-shell-B-C1Zdxr.mjs";
import { n as Building2, t as ADMIN_NAV } from "./admin-nav-B2pYfMco.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-t6YZVJQv.mjs";
import { t as Input } from "./input-BikprJ8I.mjs";
import { t as Label } from "./label-Dn8LBOmq.mjs";
import { t as Switch } from "./switch-B4SUYH3E.mjs";
import { t as Mail } from "./mail-ZNisf-aq.mjs";
import { n as Save, r as SlidersVertical, t as RotateCcw } from "./sliders-vertical-B-7QDMFm.mjs";
import { t as Textarea } from "./textarea-B3s4Ny5G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-CjcZzvQn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULTS = {
	portalName: "PG Suggestion Portal",
	organization: "PG Group",
	supportEmail: "support@pggroup.com",
	welcomeMessage: "Share your ideas to improve safety, quality, and productivity across every plant.",
	defaultPriority: "medium",
	autoAssignPE: true,
	requireEvidence: true,
	reviewSlaDays: 5,
	implementationSlaDays: 30,
	notifyOnSubmit: true,
	notifyOnApproval: true,
	notifyOnImplementation: true,
	digestFrequency: "weekly"
};
var KEY = "esp.settings.v1";
function SettingsPage() {
	const [s, setS] = (0, import_react.useState)(DEFAULTS);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setS({
				...DEFAULTS,
				...JSON.parse(raw)
			});
		} catch {}
	}, []);
	function update(k, v) {
		setS((prev) => ({
			...prev,
			[k]: v
		}));
		setDirty(true);
	}
	function save() {
		localStorage.setItem(KEY, JSON.stringify(s));
		setDirty(false);
		toast.success("Settings saved");
	}
	function reset() {
		setS(DEFAULTS);
		setDirty(true);
		toast.info("Restored defaults — remember to save");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: "Global configuration for portal identity, workflow, and notifications.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" }), " Reset"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: !dirty,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " Save Changes"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					icon: Building2,
					title: "Portal Identity",
					desc: "How the portal introduces itself to employees.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Portal name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.portalName,
								onChange: (e) => update("portalName", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Organization",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.organization,
								onChange: (e) => update("organization", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Support email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: s.supportEmail,
								onChange: (e) => update("supportEmail", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Welcome message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: s.welcomeMessage,
								onChange: (e) => update("welcomeMessage", e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					icon: SlidersVertical,
					title: "Workflow Defaults",
					desc: "Default rules applied when a suggestion is submitted.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Default priority",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: s.defaultPriority,
								onValueChange: (v) => update("defaultPriority", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "low",
										children: "Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "medium",
										children: "Medium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "high",
										children: "High"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "critical",
										children: "Critical"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Review SLA (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 90,
								value: s.reviewSlaDays,
								onChange: (e) => update("reviewSlaDays", Number(e.target.value) || 1)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Implementation SLA (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 365,
								value: s.implementationSlaDays,
								onChange: (e) => update("implementationSlaDays", Number(e.target.value) || 1)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Auto-assign to PE for initial review",
							checked: s.autoAssignPE,
							onChange: (v) => update("autoAssignPE", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Require evidence before closure",
							checked: s.requireEvidence,
							onChange: (v) => update("requireEvidence", v)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					icon: Bell,
					title: "Notifications",
					desc: "Which lifecycle events send an in-app notification.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notify on submission",
							checked: s.notifyOnSubmit,
							onChange: (v) => update("notifyOnSubmit", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notify on approval",
							checked: s.notifyOnApproval,
							onChange: (v) => update("notifyOnApproval", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notify on implementation",
							checked: s.notifyOnImplementation,
							onChange: (v) => update("notifyOnImplementation", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Admin digest frequency",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: s.digestFrequency,
								onValueChange: (v) => update("digestFrequency", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "off",
										children: "Off"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "daily",
										children: "Daily"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "weekly",
										children: "Weekly"
									})
								] })]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					icon: Mail,
					title: "Email Delivery",
					desc: "Read-only summary of the transactional email channel.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Provider",
							v: "SMTP (Office 365)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "From address",
							v: s.supportEmail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "OTP delivery",
							v: "Enabled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Retry policy",
							v: "3 attempts, exponential backoff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground",
							children: "SMTP credentials are managed as encrypted backend secrets. Contact a super admin to rotate."
						})
					]
				})
			]
		})]
	});
}
function Section({ icon: Icon, title, desc, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center w-9 h-9 rounded-md bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-base font-bold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: desc
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
			children: label
		}), children]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: v
		})]
	});
}
var SplitComponent = () => null;
//#endregion
export { SettingsPage, SplitComponent as component };
