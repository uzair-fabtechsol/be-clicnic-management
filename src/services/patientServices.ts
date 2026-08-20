import mongoose from "mongoose";
import PatientModel from "../models/patientModel";
import AppError from "../utils/appError";
import escapeRegex from "../utils/escapeRegex";
import generateMrNumber from "../utils/patientUtils";
import recordAuditLog from "../utils/auditLog";
import type {
  CreatePatientBody,
  UpdatePatientBody,
  GetPatientsQuery,
  BulkCreatePatientItem,
} from "../types/patientTypes";
import type { Pagination } from "../utils/sendResponse";

//FUNCTION
const createPatientService = async (
  body: CreatePatientBody,
  performedBy: string,
) => {
  const now = new Date();
  const mrNumber = await generateMrNumber(now);

  const patient = await PatientModel.create({
    ...body,
    mrNumber,
    registrationDate: now,
  });

  await recordAuditLog(
    "patientCreated",
    performedBy,
    patient.mrNumber,
    `Patient ${patient.name} was registered with MR number ${patient.mrNumber}`,
  );

  return { patient };
};

//FUNCTION
const findDuplicateCnicErrors = async (
  bodies: BulkCreatePatientItem[],
): Promise<{ index: number; field: string; message: string }[]> => {
  const errors: { index: number; field: string; message: string }[] = [];
  const firstIndexByCnic = new Map<string, number>();

  bodies.forEach((body, index) => {
    if (!body.cnic) return;

    const firstIndex = firstIndexByCnic.get(body.cnic);
    if (firstIndex === undefined) {
      firstIndexByCnic.set(body.cnic, index);
    } else {
      errors.push({
        index,
        field: "cnic",
        message: `CNIC "${body.cnic}" is duplicated with patient at index ${firstIndex} in this request`,
      });
    }
  });

  const cnicsInBatch = [...firstIndexByCnic.keys()];
  if (cnicsInBatch.length > 0) {
    const existingPatients = await PatientModel.find({
      cnic: { $in: cnicsInBatch },
    }).select("cnic");
    const existingCnics = new Set(existingPatients.map((p) => p.cnic));

    bodies.forEach((body, index) => {
      if (body.cnic && existingCnics.has(body.cnic)) {
        errors.push({
          index,
          field: "cnic",
          message: `"${body.cnic}" already exists. Please use a different cnic`,
        });
      }
    });
  }

  return errors.sort((a, b) => a.index - b.index);
};

//FUNCTION
const createPatientsService = async (
  bodies: BulkCreatePatientItem[],
  performedBy: string,
): Promise<{ patients: InstanceType<typeof PatientModel>[] }> => {
  const duplicateCnicErrors = await findDuplicateCnicErrors(bodies);
  if (duplicateCnicErrors.length > 0) {
    throw new AppError(400, "Validation failed", {
      errors: duplicateCnicErrors,
    });
  }

  const session = await mongoose.startSession();
  const patients: InstanceType<typeof PatientModel>[] = [];

  try {
    await session.withTransaction(async () => {
      patients.length = 0;

      for (let index = 0; index < bodies.length; index++) {
        const { registrationDate, ...rest } = bodies[index];

        try {
          const mrNumber = await generateMrNumber(registrationDate, session);

          const [patient] = await PatientModel.create(
            [{ ...rest, mrNumber, registrationDate }],
            { session },
          );

          await recordAuditLog(
            "patientCreated",
            performedBy,
            patient.mrNumber,
            `Patient ${patient.name} was registered with MR number ${patient.mrNumber}`,
            session,
          );

          patients.push(patient);
        } catch (error) {
          if (error instanceof Error) {
            error.message = `Patient at index ${index}: ${error.message}`;
          }
          throw error;
        }
      }
    });
  } finally {
    await session.endSession();
  }

  return { patients };
};

//FUNCTION
const getPatientsService = async (query: GetPatientsQuery) => {
  const { page, limit, search, gender } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (gender) {
    match.gender = gender;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    match.$or = [
      { mrNumber: searchRegex },
      { cnic: searchRegex },
      { name: searchRegex },
    ];
  }

  const [result] = await PatientModel.aggregate([
    { $match: match },
    {
      $facet: {
        patients: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalDocuments: number = result.totalCount[0]?.count ?? 0;
  const totalPages = Math.ceil(totalDocuments / limit) || 0;

  const pagination: Pagination = {
    page,
    limit,
    totalDocuments,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { patients: result.patients, pagination };
};

//FUNCTION
const getPatientByIdService = async (patientId: string) => {
  const patient = await PatientModel.findById(patientId);

  if (!patient) {
    throw new AppError(404, "Patient not found");
  }

  return { patient };
};

//FUNCTION
const updatePatientService = async (
  patientId: string,
  body: UpdatePatientBody,
) => {
  const patient = await PatientModel.findByIdAndUpdate(patientId, body, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    throw new AppError(404, "Patient not found");
  }

  return { patient };
};

//FUNCTION
const deletePatientService = async (patientId: string): Promise<void> => {
  const patient = await PatientModel.findByIdAndDelete(patientId);

  if (!patient) {
    throw new AppError(404, "Patient not found");
  }
};

export {
  createPatientService,
  createPatientsService,
  getPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
};
