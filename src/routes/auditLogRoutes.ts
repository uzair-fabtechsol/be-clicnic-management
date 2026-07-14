import { Router } from "express";
import { getAuditLogs, getAuditLog } from "@src/controllers/auditLogController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "@src/middlewares/validateObjectIdMiddleware";
import { getAuditLogsQuerySchema } from "@src/validations/auditLogValidations";

const auditLogRouter = Router();

auditLogRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("auditLogs", "view"),
  validationMiddleware(getAuditLogsQuerySchema, "query"),
  getAuditLogs
);

auditLogRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("auditLogs", "view"),
  validateObjectIdMiddleware(),
  getAuditLog
);

export default auditLogRouter;
