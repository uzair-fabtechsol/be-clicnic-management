import type { z } from "zod";
import type { getAuditLogsQuerySchema } from "@src/validations/auditLogValidations";

type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>;

export type { GetAuditLogsQuery };
