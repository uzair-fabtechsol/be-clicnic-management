import { Router } from "express";
import {
  getDashboardStats,
  getRevenueLastSevenDays,
  getRecentPatients,
  getRecentOpdSlips,
  getDoctorsAvailabilityToday,
} from "../controllers/dashboardController";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";

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
