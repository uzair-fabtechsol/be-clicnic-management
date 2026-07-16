import type { z } from "zod";
import type { getAuditLogsQuerySchema } from "../validations/auditLogValidations";

type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>;

export type { GetAuditLogsQuery };
