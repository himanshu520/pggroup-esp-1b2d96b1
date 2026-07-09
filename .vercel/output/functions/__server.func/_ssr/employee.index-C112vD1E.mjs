import { t as require_jsx_runtime } from "./jsx-runtime-B-4O0YiT.mjs";
import { t as NotificationsPage } from "./notifications-page-DwTiGGRl.mjs";
import { c as SubmitForm, l as TrackPage, n as ProfilePage, s as Route$4, t as MySuggestions } from "./employee.my-DwOJbzOP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.index-C112vD1E.js
var import_jsx_runtime = require_jsx_runtime();
function EmployeeHome() {
	const { section, code } = Route$4.useSearch();
	switch (section) {
		case "my": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MySuggestions, {});
		case "track": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackPage, { initialCode: code });
		case "notifications": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPage, {});
		case "profile": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitForm, {});
	}
}
//#endregion
export { EmployeeHome as component };
