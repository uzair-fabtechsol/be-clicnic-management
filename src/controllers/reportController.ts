import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import {
  getPatientsReportService,
  getDoctorsReportService,
  getFinancialReportService,
  getOpdReportService,
  getPatientsReportStatsService,
  getFinancialReportStatsService,
  getOpdReportStatsService,
} from "../services/reportServices";
import type { GetReportsQuery, GetReportStatsQuery } from "../types/reportTypes";

const getPatientsReport = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to, page, limit } = req.validatedQuery as GetReportsQuery;

    const data = await getPatientsReportService(from, to, page, limit);

    sendResponse(res, 200, {
      status: "success",
      message: "Patients report fetched successfully",
      data,
    });
  }
);

const getDoctorsReport = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.validatedQuery as GetReportsQuery;

    const data = await getDoctorsReportService(from, to);

    sendResponse(res, 200, {
      status: "success",
      message: "Doctors report fetched successfully",
      data,
    });
  }
);

const getFinancialReport = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.validatedQuery as GetReportsQuery;

    const data = await getFinancialReportService(from, to);

    sendResponse(res, 200, {
      status: "success",
      message: "Financial report fetched successfully",
      data,
    });
  }
);

const getOpdReport = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.validatedQuery as GetReportsQuery;

    const data = await getOpdReportService(from, to);

    sendResponse(res, 200, {
      status: "success",
      message: "OPD report fetched successfully",
      data,
    });
  }
);

const getPatientsReportStats = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.validatedQuery as GetReportStatsQuery;

    const data = await getPatientsReportStatsService(from, to);

    sendResponse(res, 200, {
      status: "success",
      message: "Patients report stats fetched successfully",
      data,
    });
  }
);

const getFinancialReportStats = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.validatedQuery as GetReportStatsQuery;

    const data = await getFinancialReportStatsService(from, to);

    sendResponse(res, 200, {
      status: "success",
      message: "Financial report stats fetched successfully",
      data,
    });
  }
);

const getOpdReportStats = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.validatedQuery as GetReportStatsQuery;

    const data = await getOpdReportStatsService(from, to);

    sendResponse(res, 200, {
      status: "success",
      message: "OPD report stats fetched successfully",
      data,
    });
  }
);

export {
  getPatientsReport,
  getDoctorsReport,
  getFinancialReport,
  getOpdReport,
  getPatientsReportStats,
  getFinancialReportStats,
  getOpdReportStats,
};
