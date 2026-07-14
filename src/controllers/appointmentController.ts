import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  cancelAppointmentService,
} from "@src/services/appointmentServices";
import type {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  GetAppointmentsQuery,
} from "@src/types/appointmentTypes";

const createAppointment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateAppointmentBody;

    const data = await createAppointmentService(body);

    sendResponse(res, 201, {
      status: "success",
      message: "Appointment created successfully",
      data,
    });
  }
);

const getAppointments = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetAppointmentsQuery;

    const data = await getAppointmentsService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "Appointments fetched successfully",
      data,
    });
  }
);

const getAppointment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const appointmentId = req.params.id as string;

    const data = await getAppointmentByIdService(appointmentId);

    sendResponse(res, 200, {
      status: "success",
      message: "Appointment fetched successfully",
      data,
    });
  }
);

const updateAppointment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const appointmentId = req.params.id as string;
    const body = req.body as UpdateAppointmentBody;

    const data = await updateAppointmentService(appointmentId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "Appointment updated successfully",
      data,
    });
  }
);

const deleteAppointment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const appointmentId = req.params.id as string;

    await deleteAppointmentService(appointmentId);

    sendResponse(res, 200, {
      status: "success",
      message: "Appointment deleted successfully",
      data: null,
    });
  }
);

const cancelAppointment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const appointmentId = req.params.id as string;
    const performedBy = req.user!._id;

    const data = await cancelAppointmentService(appointmentId, performedBy);

    sendResponse(res, 200, {
      status: "success",
      message: "Appointment canceled successfully",
      data,
    });
  }
);

export {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
};
