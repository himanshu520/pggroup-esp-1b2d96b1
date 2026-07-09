import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { a as cn } from "./button-yJoTZDYV.mjs";
import { A as PRIORITY_LABEL, B as STATUS_STYLES, j as PRIORITY_STYLES, z as STATUS_LABEL } from "./app-shell-uI3AfMIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BVCVIuvZ.js
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
