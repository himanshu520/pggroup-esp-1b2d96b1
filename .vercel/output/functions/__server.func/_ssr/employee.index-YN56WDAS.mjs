import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as NotificationsPage } from "./notifications-page-BMOlOoyj.mjs";
import { c as SubmitForm, l as TrackPage, n as ProfilePage, s as Route$4, t as MySuggestions } from "./employee.my-DBZYyIG6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee.index-YN56WDAS.js
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
