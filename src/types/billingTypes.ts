import type { z } from "zod";
import type {
  getBillingsQuerySchema,
  refundBillingSchema,
} from "@src/validations/billingValidations";

type GetBillingsQuery = z.infer<typeof getBillingsQuerySchema>;
type RefundBillingBody = z.infer<typeof refundBillingSchema>;

export type { GetBillingsQuery, RefundBillingBody };
