import AuditLogModel from "../models/auditLogModel";
import type { AUDIT_LOG_ACTIONS } from "../constants/auditLogConstants";

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
