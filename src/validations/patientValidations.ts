import { z } from "zod";
import { GENDERS, BLOOD_GROUPS } from "@src/constants/patientConstants";

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

const createPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  fatherName: z.string().trim().min(1, "Father name is required"),
  gender: z.enum(GENDERS),
  age: z.number().int().min(0, "Age cannot be negative").max(150),
  dateOfBirth: z.coerce.date(),
  mobileNumber: z.string().trim().min(1, "Mobile number is required"),
  cnic: z
    .string()
    .trim()
    .regex(CNIC_REGEX, "Invalid CNIC format, expected XXXXX-XXXXXXX-X"),
  bloodGroup: z.enum(BLOOD_GROUPS),
  emergencyContact: z.string().trim().min(1, "Emergency contact is required"),
  address: z.string().trim().min(1, "Address is required"),
});

const updatePatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  fatherName: z.string().trim().min(1, "Father name is required").optional(),
  gender: z.enum(GENDERS).optional(),
  age: z.number().int().min(0, "Age cannot be negative").max(150).optional(),
  dateOfBirth: z.coerce.date().optional(),
  mobileNumber: z.string().trim().min(1, "Mobile number is required").optional(),
  cnic: z
    .string()
    .trim()
    .regex(CNIC_REGEX, "Invalid CNIC format, expected XXXXX-XXXXXXX-X")
    .optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  emergencyContact: z
    .string()
    .trim()
    .min(1, "Emergency contact is required")
    .optional(),
  address: z.string().trim().min(1, "Address is required").optional(),
});

const getPatientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  gender: z.enum(GENDERS).optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
});

export { createPatientSchema, updatePatientSchema, getPatientsQuerySchema };
