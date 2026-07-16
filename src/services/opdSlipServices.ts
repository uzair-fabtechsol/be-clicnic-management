import mongoose from "mongoose";
import OpdSlipModel from "../models/opdSlipModel";
import PatientModel from "../models/patientModel";
import DoctorModel from "../models/doctorModel";
import AppError from "../utils/appError";
import generateOpdSlipNumber from "../utils/opdSlipUtils";
import recordAuditLog from "../utils/auditLog";
import { createBillingService } from "./billingServices";
import type {
  CreateOpdSlipBody,
  UpdateOpdSlipBody,
  GetOpdSlipsQuery,
} from "../types/opdSlipTypes";
import type { Pagination } from "../utils/sendResponse";

//FUNCTION
const createOpdSlipService = async (
  body: CreateOpdSlipBody,
  performedBy: string
) => {
  const { patient, doctor, paymentMethod, symptomsAndRemarks } = body;

  const [patientDoc, doctorDoc] = await Promise.all([
    PatientModel.findById(patient),
    DoctorModel.findById(doctor),
  ]);

  if (!patientDoc) {
    throw new AppError(404, "Patient not found");
  }

  if (!doctorDoc) {
    throw new AppError(404, "Doctor not found");
  }

  const previousSlipCount = await OpdSlipModel.countDocuments({ patient });
  const visitType = previousSlipCount === 0 ? "new" : "followUp";
  const opdSlipNumber = await generateOpdSlipNumber();

  const opdSlip = await OpdSlipModel.create({
    opdSlipNumber,
    patient,
    doctor,
    visitType,
    paymentMethod,
    symptomsAndRemarks,
  });

  await createBillingService(opdSlip._id.toString());

  await recordAuditLog(
    "opdSlipGenerated",
    performedBy,
    opdSlip.opdSlipNumber,
    `OPD slip generated for ${patientDoc.name} with ${doctorDoc.name}`
  );

  return { opdSlip };
};

const lookupPatientAndDoctorStages = [
  {
    $lookup: {
      from: "patients",
      localField: "patient",
      foreignField: "_id",
      as: "patientDetails",
    },
  },
  { $unwind: "$patientDetails" },
  {
    $lookup: {
      from: "doctors",
      localField: "doctor",
      foreignField: "_id",
      as: "doctorDetails",
    },
  },
  { $unwind: "$doctorDetails" },
  { $project: { patient: 0, doctor: 0 } },
];

//FUNCTION
const getOpdSlipsService = async (query: GetOpdSlipsQuery) => {
  const { page, limit, patient, doctor, visitType, paymentMethod } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (patient) {
    match.patient = new mongoose.Types.ObjectId(patient);
  }

  if (doctor) {
    match.doctor = new mongoose.Types.ObjectId(doctor);
  }

  if (visitType) {
    match.visitType = visitType;
  }

  if (paymentMethod) {
    match.paymentMethod = paymentMethod;
  }

  const [result] = await OpdSlipModel.aggregate([
    { $match: match },
    {
      $facet: {
        opdSlips: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          ...lookupPatientAndDoctorStages,
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

  return { opdSlips: result.opdSlips, pagination };
};

//FUNCTION
const getOpdSlipByIdService = async (opdSlipId: string) => {
  const [opdSlip] = await OpdSlipModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(opdSlipId) } },
    ...lookupPatientAndDoctorStages,
  ]);

  if (!opdSlip) {
    throw new AppError(404, "OPD slip not found");
  }

  return { opdSlip };
};

//FUNCTION
const updateOpdSlipService = async (
  opdSlipId: string,
  body: UpdateOpdSlipBody
) => {
  const opdSlip = await OpdSlipModel.findByIdAndUpdate(opdSlipId, body, {
    new: true,
    runValidators: true,
  });

  if (!opdSlip) {
    throw new AppError(404, "OPD slip not found");
  }

  return { opdSlip };
};

//FUNCTION
const deleteOpdSlipService = async (opdSlipId: string): Promise<void> => {
  const opdSlip = await OpdSlipModel.findByIdAndDelete(opdSlipId);

  if (!opdSlip) {
    throw new AppError(404, "OPD slip not found");
  }
};

export {
  createOpdSlipService,
  getOpdSlipsService,
  getOpdSlipByIdService,
  updateOpdSlipService,
  deleteOpdSlipService,
};
