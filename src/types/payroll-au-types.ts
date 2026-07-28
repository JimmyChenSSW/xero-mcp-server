// Shim layer for xero-node AU Payroll (payroll.xro/1.0) model types.
//
// xero-node only exposes these through deep `dist/gen/model/...` paths, which
// are not part of its public API surface and shift between major versions.
// Keeping every such import in this one file means an SDK upgrade (e.g. v13 ->
// v15) is a single-file change instead of a sweep across handlers and tools.
//
// This fork is AU-only (see the payrollAUApi conversion), so there is no NZ
// counterpart and no name collisions to disambiguate — types are re-exported
// under their original names.

export { DeductionLine } from "xero-node/dist/gen/model/payroll-au/deductionLine.js";
export { EarningsLine } from "xero-node/dist/gen/model/payroll-au/earningsLine.js";
export { Employee } from "xero-node/dist/gen/model/payroll-au/employee.js";
export { LeaveApplication } from "xero-node/dist/gen/model/payroll-au/leaveApplication.js";
export { LeaveBalance } from "xero-node/dist/gen/model/payroll-au/leaveBalance.js";
export { LeaveLine } from "xero-node/dist/gen/model/payroll-au/leaveLine.js";
export { LeaveType } from "xero-node/dist/gen/model/payroll-au/leaveType.js";
export { PayTemplate } from "xero-node/dist/gen/model/payroll-au/payTemplate.js";
export { SuperLine } from "xero-node/dist/gen/model/payroll-au/superLine.js";
