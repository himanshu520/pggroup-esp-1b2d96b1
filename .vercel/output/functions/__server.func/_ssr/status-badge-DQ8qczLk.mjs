import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { E as STATUS_STYLES, S as PRIORITY_STYLES, T as STATUS_LABEL, x as PRIORITY_LABEL } from "./app-shell-D3p4__nB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-DQ8qczLk.js
var import_jsx_runtime = require_jsx_runtime();
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("status-pill", STATUS_STYLES[status], className),
		children: STATUS_LABEL[status]
	});
}
function PriorityBadge({ priority, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("status-pill", PRIORITY_STYLES[priority], className),
		children: PRIORITY_LABEL[priority]
	});
}
//#endregion
export { StatusBadge as n, PriorityBadge as t };
