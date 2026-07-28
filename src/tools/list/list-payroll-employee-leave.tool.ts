import { z } from "zod";
import { listXeroPayrollEmployeeLeave } from "../../handlers/list-xero-payroll-employee-leave.handler.js";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";
import { LeaveApplication } from "../../types/payroll-au-types.js";

const ListPayrollEmployeeLeaveTool = CreateXeroTool(
  "list-payroll-employee-leave",
  "List all leave records for a specific employee in Xero. This shows all leave transactions including approved, pending, and processed time off. Provide an employee ID to see their leave history.",
  {
    employeeId: z.string().uuid().describe("The Xero employee ID (GUID) to fetch leave records for"),
  },
  async ({ employeeId }) => {
    const response = await listXeroPayrollEmployeeLeave(employeeId);
    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error listing employee leave: ${response.error}`,
          },
        ],
      };
    }

    const leave = response.result;

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${leave?.length || 0} leave records for employee ${employeeId}:`,
        },
        ...(leave?.map((leaveItem: LeaveApplication) => ({
          type: "text" as const,
          text: [
            `Leave ID: ${leaveItem.leaveApplicationID || "Unknown"}`,
            `Leave Type: ${leaveItem.leaveTypeID || "Unknown"}`,
            `Title: ${leaveItem.title || "Untitled"}`,
            `Description: ${leaveItem.description || "No description"}`,
            leaveItem.startDate ? `Start Date: ${leaveItem.startDate}` : null,
            leaveItem.endDate ? `End Date: ${leaveItem.endDate}` : null,
            leaveItem.leavePeriods ? `Periods: ${leaveItem.leavePeriods.length || 0}` : null,
            leaveItem.updatedDateUTC ? `Last Updated: ${leaveItem.updatedDateUTC}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        })) || []),
      ],
    };
  },
);

export default ListPayrollEmployeeLeaveTool;
