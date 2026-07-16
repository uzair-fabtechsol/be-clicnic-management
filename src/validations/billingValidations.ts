import { z } from "zod";
import { PAYMENT_STATUSES } from "../constants/billingConstants";
import { PAYMENT_METHODS } from "../constants/opdSlipConstants";

const getBillingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  search: z.string().trim().optional(),
});

const refundBillingSchema = z.object({
  refundMethod: z.enum(PAYMENT_METHODS),
  refundReason: z.string().trim().min(1, "Refund reason is required"),
});

export { getBillingsQuerySchema, refundBillingSchema };
