import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as Outlet, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as EmployeeShell } from "./employee-shell-CcFVNx6P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee-blqqHYe3.js
var import_jsx_runtime = require_jsx_runtime();
function EmployeeLayout() {
	const loc = useLocation();
	if (loc.pathname === "/employee/login" || loc.pathname.startsWith("/employee/login/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { EmployeeLayout as component };
