import { z } from "zod";
import { DAYS } from "@src/constants/doctorConstants";
import { timeStringToDate } from "@src/utils/time";

// Matches the value emitted by <input type="time">, e.g. "08:00", "13:30".
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const timeSchema = z
  .string()
  .regex(TIME_REGEX, "Invalid time format, expected HH:mm")
  .transform(timeStringToDate);

const slotSchema = z
  .object({
    day: z.enum(DAYS),
    from: timeSchema,
    to: timeSchema,
  })
  .refine((slot) => slot.from.getTime() < slot.to.getTime(), {
    message: "from time must be before to time",
    path: ["to"],
  });

const createDoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  specialization: z.string().trim().min(1, "Specialization is required"),
  qualification: z.string().trim().min(1, "Qualification is required"),
  contactNumber: z.string().trim().min(1, "Contact number is required"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  consultationFee: z.number().min(0, "Consultation fee cannot be negative"),
  active: z.boolean().default(true),
  slots: z.array(slotSchema).default([]),
});

const updateDoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  specialization: z
    .string()
    .trim()
    .min(1, "Specialization is required")
    .optional(),
  qualification: z
    .string()
    .trim()
    .min(1, "Qualification is required")
    .optional(),
  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .optional(),
  email: z.email("Invalid email address").trim().toLowerCase().optional(),
  consultationFee: z
    .number()
    .min(0, "Consultation fee cannot be negative")
    .optional(),
  active: z.boolean().optional(),
  slots: z.array(slotSchema).optional(),
});

const getDoctorsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
});

export {
  createDoctorSchema,
  updateDoctorSchema,
  getDoctorsQuerySchema,
};
