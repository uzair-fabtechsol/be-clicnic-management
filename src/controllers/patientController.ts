import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  createPatientService,
  getPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
} from "@src/services/patientServices";
import type {
  CreatePatientBody,
  UpdatePatientBody,
  GetPatientsQuery,
} from "@src/types/patientTypes";

const createPatient = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreatePatientBody;

    const data = await createPatientService(body);

    sendResponse(res, 201, {
      status: "success",
      message: "Patient created successfully",
      data,
    });
  }
);

const getPatients = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetPatientsQuery;

    const data = await getPatientsService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "Patients fetched successfully",
      data,
    });
  }
);

const getPatient = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const patientId = req.params.id as string;

    const data = await getPatientByIdService(patientId);

    sendResponse(res, 200, {
      status: "success",
      message: "Patient fetched successfully",
      data,
    });
  }
);

const updatePatient = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const patientId = req.params.id as string;
    const body = req.body as UpdatePatientBody;

    const data = await updatePatientService(patientId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "Patient updated successfully",
      data,
    });
  }
);

const deletePatient = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const patientId = req.params.id as string;

    await deletePatientService(patientId);

    sendResponse(res, 200, {
      status: "success",
      message: "Patient deleted successfully",
      data: null,
    });
  }
);

export {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
