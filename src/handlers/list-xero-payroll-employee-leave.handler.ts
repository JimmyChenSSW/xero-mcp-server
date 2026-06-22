import { xeroClient } from "../clients/xero-client.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { LeaveApplication } from "xero-node/dist/gen/model/payroll-au/leaveApplication.js";

interface FetchEmployeeLeaveParams {
  employeeId?: string;
}

/**
 * Internal function to fetch employee leave from Xero
 *
 * AU Payroll (1.0) has no per-employee leave endpoint. Query leave
 * applications filtered server-side to this employee (auto-paginating in case
 * the employee has more than one page of applications).
 */
async function fetchEmployeeLeave({ employeeId }: FetchEmployeeLeaveParams): Promise<LeaveApplication[] | null> {
  await xeroClient.authenticate();

  if (!employeeId) {
    throw new Error("Employee ID is required to fetch employee leave");
  }

  // Validate as a GUID before interpolating into the Xero where-clause filter.
  // A strict GUID cannot contain the filter language's metacharacters
  // (" ( ) = ! |), which closes any filter/query injection vector.
  const guidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!guidPattern.test(employeeId)) {
    throw new Error("Invalid employee ID: expected a GUID");
  }

  const where = `EmployeeID==Guid("${employeeId}")`;
  const allApplications: LeaveApplication[] = [];
  let currentPage = 1;

  while (true) {
    const response = await xeroClient.payrollAUApi.getLeaveApplications(
      xeroClient.tenantId,
      undefined, // ifModifiedSince
      where,
      undefined, // order
      currentPage,
      getClientHeaders(),
    );

    const applications = response.body.leaveApplications ?? [];
    allApplications.push(...applications);

    if (applications.length < 100) {
      break;
    }
    currentPage++;
  }

  return allApplications;
}

/**
 * List employee leave from Xero Payroll
 * @param employeeId The ID of the employee to retrieve leave for
 */
export async function listXeroPayrollEmployeeLeave(
  employeeId: string,
): Promise<XeroClientResponse<LeaveApplication[]>> {
  try {
    const leave = await fetchEmployeeLeave({ employeeId });

    if (!leave) {
      return {
        result: [],
        isError: false,
        error: null,
      };
    }

    return {
      result: leave,
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
