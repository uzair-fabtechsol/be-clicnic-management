import { z } from "zod";
import mongoose from "mongoose";
import { timeStringToDate } from "../utils/time";
import { APPOINTMENT_STATUSES } from "../constants/appointmentConstants";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid id",
  });

const timeSchema = z
  .string()
  .regex(TIME_REGEX, "Invalid time format, expected HH:mm")
  .transform(timeStringToDate);

const createAppointmentSchema = z.object({
  patient: objectIdSchema,
  doctor: objectIdSchema,
  date: z.coerce.date(),
  time: timeSchema,
  notes: z.string().trim().min(1).optional(),
});

const updateAppointmentSchema = z.object({
  date: z.coerce.date().optional(),
  time: timeSchema.optional(),
  notes: z.string().trim().min(1).optional(),
});

const getAppointmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  patient: objectIdSchema.optional(),
  doctor: objectIdSchema.optional(),
  date: z.coerce.date().optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
});

export {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
};
