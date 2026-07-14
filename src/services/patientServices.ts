import PatientModel from "@src/models/patientModel";
import AppError from "@src/utils/appError";
import escapeRegex from "@src/utils/escapeRegex";
import generateMrNumber from "@src/utils/patientUtils";
import type {
  CreatePatientBody,
  UpdatePatientBody,
  GetPatientsQuery,
} from "@src/types/patientTypes";
import type { Pagination } from "@src/utils/sendResponse";

const createPatientService = async (body: CreatePatientBody) => {
  const mrNumber = await generateMrNumber();

  const patient = await PatientModel.create({ ...body, mrNumber });

  return { patient };
};

const getPatientsService = async (query: GetPatientsQuery) => {
  const { page, limit, search, gender, bloodGroup } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (gender) {
    match.gender = gender;
  }

  if (bloodGroup) {
    match.bloodGroup = bloodGroup;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    match.$or = [
      { name: searchRegex },
      { fatherName: searchRegex },
      { mrNumber: searchRegex },
      { mobileNumber: searchRegex },
      { cnic: searchRegex },
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

const getPatientByIdService = async (patientId: string) => {
  const patient = await PatientModel.findById(patientId);

  if (!patient) {
    throw new AppError(404, "Patient not found");
  }

  return { patient };
};

const updatePatientService = async (
  patientId: string,
  body: UpdatePatientBody
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
