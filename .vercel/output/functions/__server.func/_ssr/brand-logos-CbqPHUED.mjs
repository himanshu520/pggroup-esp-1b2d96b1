import { o as __toESM } from "../_runtime.mjs";
import { n as pg_logo_png_asset_default, t as esp_logo_png_asset_default } from "./pg-logo.png.asset-BiUWTVCG.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-logos-CbqPHUED.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* PG + ESP brand logos with normalized fade/scale-in animation.
* - Respects prefers-reduced-motion (handled in styles.css).
* - Reserves aspect-ratio space to prevent layout shift/flicker on refresh.
* - Shows a subtle skeleton until each image finishes decoding.
* - Uses a ref callback that checks `img.complete` so the animation still
*   runs when the image was already served from cache / preload (where
*   `onLoad` fires before React attaches the listener).
* - Memoized: props are shallow-stable strings, so re-renders are skipped.
*/
function BrandLogosImpl({ className, imgClassName, gapClassName = "gap-4" }) {
	const [pgLoaded, setPgLoaded] = (0, import_react.useState)(false);
	const [espLoaded, setEspLoaded] = (0, import_react.useState)(false);
	const pgRef = (0, import_react.useCallback)((el) => {
		if (el && el.complete && el.naturalWidth > 0) setPgLoaded(true);
	}, []);
	const espRef = (0, import_react.useCallback)((el) => {
		if (el && el.complete && el.naturalWidth > 0) setEspLoaded(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center", gapClassName, className),
		role: "img",
		"aria-label": "PG Group — Employee Suggestion Portal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative inline-block",
			children: [!pgLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute inset-0 rounded-md bg-muted/60 animate-pulse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: pgRef,
				src: pg_logo_png_asset_default.url,
				alt: "PG Group company logo",
				width: 192,
				height: 64,
				decoding: "async",
				fetchPriority: "high",
				onLoad: () => setPgLoaded(true),
				className: cn("brand-logo w-auto", pgLoaded && "is-loaded", imgClassName)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative inline-block",
			children: [!espLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute inset-0 rounded-md bg-muted/60 animate-pulse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: espRef,
				src: esp_logo_png_asset_default.url,
				alt: "Employee Suggestion Portal logo",
				width: 192,
				height: 64,
				decoding: "async",
				fetchPriority: "high",
				onLoad: () => setEspLoaded(true),
				className: cn("brand-logo brand-logo-delay w-auto", espLoaded && "is-loaded", imgClassName)
			})]
		})]
	});
}
var BrandLogos = (0, import_react.memo)(BrandLogosImpl);
//#endregion
export { BrandLogos as t };
