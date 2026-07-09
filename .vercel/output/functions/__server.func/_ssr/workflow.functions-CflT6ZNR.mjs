import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CURrBV8R.mjs";
import { a as objectType, i as numberType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflow.functions-CflT6ZNR.js
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
export { peTransferSuggestion as a, notifyNewSuggestion as i, deptStartImplementation as n, peVerify as o, deptSubmitEvidence as r, deptDecide as t };
