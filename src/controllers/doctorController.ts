import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  createDoctorService,
  getDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
} from "@src/services/doctorServices";
import type {
  CreateDoctorBody,
  UpdateDoctorBody,
  GetDoctorsQuery,
} from "@src/types/doctorTypes";

const createDoctor = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateDoctorBody;
    const performedBy = req.user!._id;

    const data = await createDoctorService(body, performedBy);

    sendResponse(res, 201, {
      status: "success",
      message: "Doctor created successfully",
      data,
    });
  }
);

const getDoctors = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetDoctorsQuery;

    const data = await getDoctorsService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "Doctors fetched successfully",
      data,
    });
  }
);

const getDoctor = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const doctorId = req.params.id as string;

    const data = await getDoctorByIdService(doctorId);

    sendResponse(res, 200, {
      status: "success",
      message: "Doctor fetched successfully",
      data,
    });
  }
);

const updateDoctor = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const doctorId = req.params.id as string;
    const body = req.body as UpdateDoctorBody;

    const data = await updateDoctorService(doctorId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "Doctor updated successfully",
      data,
    });
  }
);

const deleteDoctor = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const doctorId = req.params.id as string;

    await deleteDoctorService(doctorId);

    sendResponse(res, 200, {
      status: "success",
      message: "Doctor deleted successfully",
      data: null,
    });
  }
);

export { createDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };
