import { z } from "zod";
import { PAYMENT_STATUSES } from "@src/constants/billingConstants";

const getBillingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
});

export { getBillingsQuerySchema };
