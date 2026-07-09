import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { r as useRouter, t as require_react } from "./useRouter-BlhoyacI.mjs";
import { t as isRedirect } from "./redirect-SIDaGvS3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useServerFn-DnQ7jNw3.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
//#endregion
export { useServerFn as t };
