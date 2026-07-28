import { xeroClient } from "../clients/xero-client.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { LeaveType } from "../types/payroll-au-types.js";

/**
 * Internal function to fetch leave types from Xero
 *
 * AU Payroll (1.0) exposes the org's leave types as part of the Pay Items
 * collection rather than a dedicated leave-types endpoint.
 */
async function fetchLeaveTypes(): Promise<LeaveType[] | null> {
  await xeroClient.authenticate();

  const response = await xeroClient.payrollAUApi.getPayItems(
    xeroClient.tenantId,
    undefined, // ifModifiedSince
    undefined, // where
    undefined, // order
    undefined, // page
    getClientHeaders(),
  );

  return response.body.payItems?.leaveTypes ?? null;
}

/**
 * List all leave types from Xero Payroll
 */
export async function listXeroPayrollLeaveTypes(): Promise<
  XeroClientResponse<LeaveType[]>
> {
  try {
    const leaveTypes = await fetchLeaveTypes();

    if (!leaveTypes) {
      return {
        result: [],
        isError: false,
        error: null,
      };
    }

    return {
      result: leaveTypes,
      isError: false,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error),
    };
  }
}
