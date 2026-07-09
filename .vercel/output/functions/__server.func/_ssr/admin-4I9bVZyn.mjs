import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as AppShell } from "./app-shell-D3p4__nB.mjs";
import { t as ADMIN_NAV } from "./admin-nav-DqB2FU2P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-4I9bVZyn.js
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		navGroups: ADMIN_NAV,
		title: "Admin Console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { AdminLayout as component };
