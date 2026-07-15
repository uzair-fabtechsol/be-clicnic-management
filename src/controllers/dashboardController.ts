import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  getDashboardStatsService,
  getRevenueLastSevenDaysService,
  getRecentPatientsService,
  getRecentOpdSlipsService,
  getDoctorsAvailabilityTodayService,
} from "@src/services/dashboardServices";

const getDashboardStats = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getDashboardStatsService();

    sendResponse(res, 200, {
      status: "success",
      message: "Dashboard stats fetched successfully",
      data,
    });
  }
);

const getRevenueLastSevenDays = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getRevenueLastSevenDaysService();

    sendResponse(res, 200, {
      status: "success",
      message: "Revenue for the last 7 days fetched successfully",
      data,
    });
  }
);

const getRecentPatients = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getRecentPatientsService();

    sendResponse(res, 200, {
      status: "success",
      message: "Recent patients fetched successfully",
      data,
    });
  }
);

const getRecentOpdSlips = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getRecentOpdSlipsService();

    sendResponse(res, 200, {
      status: "success",
      message: "Recent OPD slips fetched successfully",
      data,
    });
  }
);

const getDoctorsAvailabilityToday = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getDoctorsAvailabilityTodayService();

    sendResponse(res, 200, {
      status: "success",
      message: "Doctors availability for today fetched successfully",
      data,
    });
  }
);

export {
  getDashboardStats,
  getRevenueLastSevenDays,
  getRecentPatients,
  getRecentOpdSlips,
  getDoctorsAvailabilityToday,
};
