import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { R as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./app-shell-D3p4__nB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirm-dialog-CfpNDPcW.js
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
export { ConfirmDialog as t };
