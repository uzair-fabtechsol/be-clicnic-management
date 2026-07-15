import { Router } from "express";
import {
  getDashboardStats,
  getRevenueLastSevenDays,
  getRecentPatients,
  getRecentOpdSlips,
  getDoctorsAvailabilityToday,
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
  "/doctors-availability-today",
  protectMiddleware,
  hasPermissionMiddleware("dashboard", "view"),
  getDoctorsAvailabilityToday
);

export default dashboardRouter;
