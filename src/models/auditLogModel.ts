import { model, models, Schema, type InferSchemaType } from "mongoose";
import { AUDIT_LOG_ACTIONS } from "@src/constants/auditLogConstants";

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: AUDIT_LOG_ACTIONS,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type AuditLogType = InferSchemaType<typeof auditLogSchema>;

const AuditLogModel =
  models.AuditLog || model<AuditLogType>("AuditLog", auditLogSchema);

export default AuditLogModel;
export type { AuditLogType };
