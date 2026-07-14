import AuditLogModel from "@src/models/auditLogModel";
import type { AUDIT_LOG_ACTIONS } from "@src/constants/auditLogConstants";

type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[number];

const recordAuditLog = async (
  action: AuditLogAction,
  performedBy: string,
  target: string,
  details: string
): Promise<void> => {
  await AuditLogModel.create({ action, performedBy, target, details });
};

export default recordAuditLog;
export type { AuditLogAction };
