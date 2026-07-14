import { z } from "zod";
import mongoose from "mongoose";
import { PAYMENT_METHODS, VISIT_TYPES } from "@src/constants/opdSlipConstants";

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid id",
  });

const   createOpdSlipSchema = z.object({
  patient: objectIdSchema,
  doctor: objectIdSchema,
  paymentMethod: z.enum(PAYMENT_METHODS),
  symptomsAndRemarks: z.string().trim().min(1).optional(),
});

const updateOpdSlipSchema = z.object({
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  symptomsAndRemarks: z.string().trim().min(1).optional(),
});

const getOpdSlipsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  patient: objectIdSchema.optional(),
  doctor: objectIdSchema.optional(),
  visitType: z.enum(VISIT_TYPES).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
});

export { createOpdSlipSchema, updateOpdSlipSchema, getOpdSlipsQuerySchema };
