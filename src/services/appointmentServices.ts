import mongoose from "mongoose";
import AppointmentModel from "@src/models/appointmentModel";
import PatientModel from "@src/models/patientModel";
import DoctorModel from "@src/models/doctorModel";
import AppError from "@src/utils/appError";
import { isDoctorAvailableAtSlot } from "@src/utils/appointmentUtils";
import type {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  GetAppointmentsQuery,
} from "@src/types/appointmentTypes";
import type { Pagination } from "@src/utils/sendResponse";

const getDayBounds = (date: Date): { start: Date; end: Date } => {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

const ensureDoctorAvailable = async (
  doctorId: string,
  date: Date,
  time: Date,
  excludeAppointmentId?: string
): Promise<void> => {
  const doctor = await DoctorModel.findById(doctorId);

  if (!doctor) {
    throw new AppError(404, "Doctor not found");
  }

  if (!isDoctorAvailableAtSlot(doctor.slots, date, time)) {
    throw new AppError(
      400,
      "Doctor is not available at the selected date and time"
    );
  }

  const { start, end } = getDayBounds(date);

  const conflictQuery: Record<string, unknown> = {
    doctor: doctorId,
    date: { $gte: start, $lt: end },
    time,
    status: { $ne: "canceled" },
  };

  if (excludeAppointmentId) {
    conflictQuery._id = { $ne: excludeAppointmentId };
  }

  const hasConflict = await AppointmentModel.exists(conflictQuery);

  if (hasConflict) {
    throw new AppError(
      409,
      "Doctor already has an appointment at this date and time"
    );
  }
};

const createAppointmentService = async (body: CreateAppointmentBody) => {
  const { patient, doctor, date, time, notes } = body;

  const patientExists = await PatientModel.exists({ _id: patient });

  if (!patientExists) {
    throw new AppError(404, "Patient not found");
  }

  await ensureDoctorAvailable(doctor, date, time);

  const appointment = await AppointmentModel.create({
    patient,
    doctor,
    date,
    time,
    notes,
  });

  return { appointment };
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

const getAppointmentsService = async (query: GetAppointmentsQuery) => {
  const { page, limit, patient, doctor, date, status } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (patient) {
    match.patient = new mongoose.Types.ObjectId(patient);
  }

  if (doctor) {
    match.doctor = new mongoose.Types.ObjectId(doctor);
  }

  if (date) {
    const { start, end } = getDayBounds(date);
    match.date = { $gte: start, $lt: end };
  }

  if (status) {
    match.status = status;
  }

  const [result] = await AppointmentModel.aggregate([
    { $match: match },
    {
      $facet: {
        appointments: [
          { $sort: { date: 1, time: 1 } },
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

  return { appointments: result.appointments, pagination };
};

const getAppointmentByIdService = async (appointmentId: string) => {
  const [appointment] = await AppointmentModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(appointmentId) } },
    ...lookupPatientAndDoctorStages,
  ]);

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  return { appointment };
};

const updateAppointmentService = async (
  appointmentId: string,
  body: UpdateAppointmentBody
) => {
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  if (appointment.status === "canceled") {
    throw new AppError(400, "Cannot update a canceled appointment");
  }

  const nextDate = body.date ?? appointment.date;
  const nextTime = body.time ?? appointment.time;

  if (body.date || body.time) {
    await ensureDoctorAvailable(
      appointment.doctor.toString(),
      nextDate,
      nextTime,
      appointmentId
    );
  }

  appointment.set(body);
  await appointment.save();

  return { appointment };
};

const deleteAppointmentService = async (
  appointmentId: string
): Promise<void> => {
  const appointment = await AppointmentModel.findByIdAndDelete(appointmentId);

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }
};

const cancelAppointmentService = async (appointmentId: string) => {
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  if (appointment.status === "canceled") {
    throw new AppError(400, "Appointment is already canceled");
  }

  appointment.status = "canceled";
  await appointment.save();

  return { appointment };
};

export {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  cancelAppointmentService,
};
