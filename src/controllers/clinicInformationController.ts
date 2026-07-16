import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import {
  updateClinicInformationService,
  getClinicInformationService,
} from "../services/clinicInformationServices";
import type { UpdateClinicInformationBody } from "../types/clinicInformationTypes";

const updateClinicInformation = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateClinicInformationBody;

    const data = await updateClinicInformationService(body);

    sendResponse(res, 200, {
      status: "success",
      message: "Clinic information updated successfully",
      data,
    });
  }
);

const getClinicInformation = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const data = await getClinicInformationService();

    sendResponse(res, 200, {
      status: "success",
      message: "Clinic information fetched successfully",
      data,
    });
  }
);

export { updateClinicInformation, getClinicInformation };
