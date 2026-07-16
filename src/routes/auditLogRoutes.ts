import { Router } from "express";
import { getAuditLogs, getAuditLog } from "../controllers/auditLogController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import { getAuditLogsQuerySchema } from "../validations/auditLogValidations";

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
