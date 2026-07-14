import DoctorModel from "@src/models/doctorModel";
import AppError from "@src/utils/appError";
import escapeRegex from "@src/utils/escapeRegex";
import recordAuditLog from "@src/utils/auditLog";
import type {
  CreateDoctorBody,
  UpdateDoctorBody,
  GetDoctorsQuery,
} from "@src/types/doctorTypes";
import type { Pagination } from "@src/utils/sendResponse";

const createDoctorService = async (
  body: CreateDoctorBody,
  performedBy: string
) => {
  const doctor = await DoctorModel.create(body);

  await recordAuditLog(
    "doctorAdded",
    performedBy,
    doctor.name,
    `Doctor ${doctor.name} (${doctor.specialization}) was added`
  );

  return { doctor };
};

const getDoctorsService = async (query: GetDoctorsQuery) => {
  const { page, limit, search, specialization, active } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (specialization) {
    match.specialization = new RegExp(`^${escapeRegex(specialization)}$`, "i");
  }

  if (active !== undefined) {
    match.active = active;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    match.$or = [
      { name: searchRegex },
      { qualification: searchRegex },
      { email: searchRegex },
    ];
  }

  const [result] = await DoctorModel.aggregate([
    { $match: match },
    {
      $facet: {
        doctors: [
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

  return { doctors: result.doctors, pagination };
};

const getDoctorByIdService = async (doctorId: string) => {
  const doctor = await DoctorModel.findById(doctorId);

  if (!doctor) {
    throw new AppError(404, "Doctor not found");
  }

  return { doctor };
};

const updateDoctorService = async (
  doctorId: string,
  body: UpdateDoctorBody,
) => {
  const doctor = await DoctorModel.findByIdAndUpdate(doctorId, body, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    throw new AppError(404, "Doctor not found");
  }

  return { doctor };
};

const deleteDoctorService = async (doctorId: string): Promise<void> => {
  const doctor = await DoctorModel.findByIdAndDelete(doctorId);

  if (!doctor) {
    throw new AppError(404, "Doctor not found");
  }
};

export {
  createDoctorService,
  getDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
};
