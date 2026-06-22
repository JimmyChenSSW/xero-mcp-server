import { ToolDefinition } from "../../types/tool-definition.js";
import { ZodRawShapeCompat } from "@modelcontextprotocol/sdk/server/zod-compat.js";

// No delete tools are currently registered (the payroll-timesheet delete tool
// was removed for AU-only payroll). Typed explicitly so the empty array still
// matches the shape the ToolFactory expects.
export const DeleteTools: Array<() => ToolDefinition<ZodRawShapeCompat>> = [];
