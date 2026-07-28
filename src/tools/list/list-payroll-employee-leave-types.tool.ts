import { z } from "zod";
import { listXeroPayrollEmployeeLeaveTypes } from "../../handlers/list-xero-payroll-employee-leave-types.handler.js";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";
import { LeaveLine } from "../../types/payroll-au-types.js";

const ListPayrollEmployeeLeaveTypesTool = CreateXeroTool(
  "list-payroll-employee-leave-types",
  "List all leave types available for a specific employee in Xero. This shows detailed information about the types of leave an employee can take, including schedule of accrual, leave type name, and entitlement.",
  {
    employeeId: z
      .string()
      .describe("The Xero employee ID to fetch leave types for"),
  },
  async ({ employeeId }) => {
    const response = await listXeroPayrollEmployeeLeaveTypes(employeeId);
    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error listing employee leave types: ${response.error}`,
          },
        ],
      };
    }

    const leaveTypes = response.result;

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${leaveTypes?.length || 0} leave types for employee ${employeeId}:`,
        },
        ...(leaveTypes?.map((leaveLine: LeaveLine) => ({
          type: "text" as const,
          text: [
            `Leave Type ID: ${leaveLine.leaveTypeID || "Unknown"}`,
            leaveLine.calculationType
              ? `Calculation Type: ${leaveLine.calculationType}`
              : null,
            leaveLine.numberOfUnits != null
              ? `Number Of Units: ${leaveLine.numberOfUnits}`
              : null,
            leaveLine.annualNumberOfUnits != null
              ? `Annual Number Of Units: ${leaveLine.annualNumberOfUnits}`
              : null,
            leaveLine.fullTimeNumberOfUnitsPerPeriod != null
              ? `Full-time Units Per Period: ${leaveLine.fullTimeNumberOfUnitsPerPeriod}`
              : null,
          ]
            .filter(Boolean)
            .join("\n"),
        })) || []),
      ],
    };
  },
);

export default ListPayrollEmployeeLeaveTypesTool;
