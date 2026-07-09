import { o as createLucideIcon } from "./button-yJoTZDYV.mjs";
import { c as createServerFn } from "./createServerFn-BOrDV9mr.mjs";
import { a as objectType, i as numberType, o as requireSupabaseAuth, r as enumType, s as stringType, t as arrayType } from "./types-Bb_8hVAz.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C5hJQa-K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflow.functions-DrKbnaau.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Paperclip = createLucideIcon("paperclip", [["path", {
	d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
	key: "1miecu"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Upload = createLucideIcon("upload", [
	["path", {
		d: "M12 3v12",
		key: "1x0j5s"
	}],
	["path", {
		d: "m17 8-5-5-5 5",
		key: "7q97r8"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}]
]);
var peTransferSuggestion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	target_department_id: stringType().uuid(),
	remarks: stringType().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("6a68985faa316b77c9ec92779e4265d0bb8415b5b711bdfdd658eba1f00c10de"));
var deptDecide = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	decision: enumType([
		"approve",
		"reject",
		"transfer"
	]),
	target_department_id: stringType().uuid().nullable().optional(),
	remarks: stringType().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("ec6702da2ff71c618ad3a90b9521f5f7142ab932a3122e5f0d2c6492b61ada8e"));
var deptStartImplementation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ suggestion_id: stringType().uuid() }).parse(d)).handler(createSsrRpc("bd689f297bc387ab62b358f5fed966bcbcccc9c0b69a5068467a883162270f42"));
var deptSubmitEvidence = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	remarks: stringType().max(2e3).optional(),
	completion_date: stringType().optional(),
	actual_cost: numberType().nullable().optional(),
	benefits_achieved: stringType().optional(),
	attachment_ids: arrayType(stringType().uuid()).max(10).optional(),
	file_names: arrayType(stringType()).max(10).optional()
}).parse(d)).handler(createSsrRpc("ffd4ac5e6116d57652e3dd1d393b77046e9555b3a3ab2e2e63abbe0a3c547304"));
var peVerify = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	suggestion_id: stringType().uuid(),
	outcome: enumType(["implemented", "fake_closure"]),
	remarks: stringType().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("d03f4a6511447cc1958453ff58ce6349b0ba0dfe17a179f083d66848d87b3e89"));
var notifyNewSuggestion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ suggestion_id: stringType().uuid() }).parse(d)).handler(createSsrRpc("abdf06348a919dbf37f418a701325b31e1de0c6c615a481e213d95378f35c8f4"));
//#endregion
export { deptSubmitEvidence as a, peVerify as c, deptStartImplementation as i, Upload as n, notifyNewSuggestion as o, deptDecide as r, peTransferSuggestion as s, Paperclip as t };
