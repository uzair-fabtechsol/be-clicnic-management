import { z } from "zod";
import { GENDERS, AGE_UNITS } from "../constants/patientConstants";

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const MOBILE_NUMBER_REGEX = /^03\d{2}-\d{7}$/;

const cnicSchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z
    .string()
    .trim()
    .regex(CNIC_REGEX, "Invalid CNIC format, expected XXXXX-XXXXXXX-X")
    .optional()
);

const mobileNumberSchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z
    .string()
    .trim()
    .regex(MOBILE_NUMBER_REGEX, "Invalid mobile number, expected format 03XX-XXXXXXX")
    .optional()
);

const createPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  guardianName: z.string().trim().min(1, "Guardian name is required"),
  gender: z.enum(GENDERS),
  age: z.number().min(1, "Age must be greater than 0").max(150),
  ageUnit: z.enum(AGE_UNITS),
  mobileNumber: mobileNumberSchema,
  cnic: cnicSchema,
  address: z.string().trim().min(1).optional(),
});

const updatePatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  guardianName: z
    .string()
    .trim()
    .min(1, "Guardian name is required")
    .optional(),
  gender: z.enum(GENDERS).optional(),
  age: z.number().int().min(1, "Age must be greater than 0").max(150).optional(),
  ageUnit: z.enum(AGE_UNITS).optional(),
  mobileNumber: mobileNumberSchema,
  cnic: cnicSchema,
  address: z.string().trim().min(1).optional(),
  lastVisit: z.coerce.date().optional(),
});

const bulkCreatePatientItemSchema = createPatientSchema.extend({
  registrationDate: z.coerce.date(),
});

const bulkCreatePatientsSchema = z
  .array(bulkCreatePatientItemSchema)
  .min(1, "At least one patient is required")
  .max(100, "Cannot create more than 100 patients at once");

const getPatientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  gender: z.enum(GENDERS).optional(),
});

export {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
  bulkCreatePatientItemSchema,
  bulkCreatePatientsSchema,
};
