import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { i as Outlet } from "./Match-DMdQhVV6.mjs";
import { u as AppShell } from "./app-shell-uI3AfMIW.mjs";
import { t as ADMIN_NAV } from "./admin-nav-ipU9T7Tj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B-N_87WO.js
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
