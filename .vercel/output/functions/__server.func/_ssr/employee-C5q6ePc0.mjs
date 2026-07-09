import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { i as Outlet } from "./Match-DMdQhVV6.mjs";
import { Q as useLocation } from "./app-shell-B-C1Zdxr.mjs";
import { t as EmployeeShell } from "./employee-shell-CwpCDhiJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee-C5q6ePc0.js
var import_jsx_runtime = require_jsx_runtime();
function EmployeeLayout() {
	const loc = useLocation();
	if (loc.pathname === "/employee/login" || loc.pathname.startsWith("/employee/login/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { EmployeeLayout as component };
