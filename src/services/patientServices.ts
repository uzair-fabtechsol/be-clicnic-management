import PatientModel from "../models/patientModel";
import AppError from "../utils/appError";
import escapeRegex from "../utils/escapeRegex";
import generateMrNumber from "../utils/patientUtils";
import recordAuditLog from "../utils/auditLog";
import type {
  CreatePatientBody,
  UpdatePatientBody,
  GetPatientsQuery,
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
const getPatientsService = async (query: GetPatientsQuery) => {
  const { page, limit, search, gender } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (gender) {
    match.gender = gender;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    match.$or = [{ mrNumber: searchRegex }, { cnic: searchRegex }];
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
  getPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
};
