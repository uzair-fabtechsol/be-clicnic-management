import { Router } from "express";
import {
  getPatientsReport,
  getDoctorsReport,
  getFinancialReport,
  getOpdReport,
  getPatientsReportStats,
  getFinancialReportStats,
  getOpdReportStats,
} from "../controllers/reportController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import {
  getReportsQuerySchema,
  getReportStatsQuerySchema,
} from "../validations/reportValidations";

const reportRouter = Router();

reportRouter.get(
  "/patients/stats",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportStatsQuerySchema, "query"),
  getPatientsReportStats
);

reportRouter.get(
  "/patients",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportsQuerySchema, "query"),
  getPatientsReport
);

reportRouter.get(
  "/doctors",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportsQuerySchema, "query"),
  getDoctorsReport
);

reportRouter.get(
  "/financial/stats",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportStatsQuerySchema, "query"),
  getFinancialReportStats
);

reportRouter.get(
  "/financial",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportsQuerySchema, "query"),
  getFinancialReport
);

reportRouter.get(
  "/opd/stats",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportStatsQuerySchema, "query"),
  getOpdReportStats
);

reportRouter.get(
  "/opd",
  protectMiddleware,
  hasPermissionMiddleware("reports", "view"),
  validationMiddleware(getReportsQuerySchema, "query"),
  getOpdReport
);

export default reportRouter;
