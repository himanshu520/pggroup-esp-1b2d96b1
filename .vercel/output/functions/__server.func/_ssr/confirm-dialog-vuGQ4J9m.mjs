import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { a as cn, o as createLucideIcon } from "./button-yJoTZDYV.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, k as LoaderCircle, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./app-shell-B-C1Zdxr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirm-dialog-vuGQ4J9m.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Plus = createLucideIcon("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Power = createLucideIcon("power", [["path", {
	d: "M12 2v10",
	key: "mnfbl"
}], ["path", {
	d: "M18.4 6.6a9 9 0 1 1-12.77.04",
	key: "obofu9"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trash2 = createLucideIcon("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]);
var import_jsx_runtime = require_jsx_runtime();
/**
* Shared confirmation dialog for destructive / irreversible actions in admin pages.
* Replaces window.confirm/alert with a styled, accessible AlertDialog.
*
* - `description` is rendered as **plain text** (React auto-escapes).
* - Buttons are disabled and show a spinner while `loading` is true.
* - Closing via ESC / overlay click is blocked while loading.
*/
function ConfirmDialog({ open, onOpenChange, title, description, body, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive = false, loading = false, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open,
		onOpenChange: (o) => {
			if (loading) return;
			onOpenChange(o);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: title }), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
				className: "whitespace-pre-wrap break-words",
				children: description
			})] }),
			body,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
				disabled: loading,
				children: cancelLabel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				disabled: loading,
				className: cn(destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90"),
				onClick: (e) => {
					e.preventDefault();
					onConfirm();
				},
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-1.5 animate-spin" }), "Working…"] }) : confirmLabel
			})] })
		] })
	});
}
//#endregion
export { Trash2 as i, Plus as n, Power as r, ConfirmDialog as t };
