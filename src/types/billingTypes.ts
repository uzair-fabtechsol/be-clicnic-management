import type { z } from "zod";
import type { getBillingsQuerySchema } from "@src/validations/billingValidations";

type GetBillingsQuery = z.infer<typeof getBillingsQuerySchema>;

export type { GetBillingsQuery };
