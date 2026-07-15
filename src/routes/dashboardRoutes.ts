import { Router } from "express";
import {
  getDashboardStats,
  getRevenueLastSevenDays,
  getRecentPatients,
  getRecentOpdSlips,
  getDoctorAvailabilityToday,
} from "@src/controllers/dashboardController";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";

const dashboardRouter = Router();

dashboardRouter.get(
  "/stats",
  protectMiddleware,
  hasPermissionMiddleware("dashboard", "view"),
  getDashboardStats
);

dashboardRouter.get(
  "/revenue-last-7-days",
  protectMiddleware,
  hasPermissionMiddleware("dashboard", "view"),
  getRevenueLastSevenDays
);

dashboardRouter.get(
  "/recent-patients",
  protectMiddleware,
  hasPermissionMiddleware("dashboard", "view"),
  getRecentPatients
);

dashboardRouter.get(
  "/recent-opd-slips",
  protectMiddleware,
  hasPermissionMiddleware("dashboard", "view"),
  getRecentOpdSlips
);

dashboardRouter.get(
  "/doctor-availability-today",
  protectMiddleware,
  hasPermissionMiddleware("dashboard", "view"),
  getDoctorAvailabilityToday
);

export default dashboardRouter;
