import { z } from "zod";
import mongoose from "mongoose";
import { AUDIT_LOG_ACTIONS } from "@src/constants/auditLogConstants";

const getAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  action: z.enum(AUDIT_LOG_ACTIONS).optional(),
  performedBy: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid id",
    })
    .optional(),
});

export { getAuditLogsQuerySchema };
