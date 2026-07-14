import type { z } from "zod";
import type {
  createOpdSlipSchema,
  updateOpdSlipSchema,
  getOpdSlipsQuerySchema,
} from "@src/validations/opdSlipValidations";

type CreateOpdSlipBody = z.infer<typeof createOpdSlipSchema>;
type UpdateOpdSlipBody = z.infer<typeof updateOpdSlipSchema>;
type GetOpdSlipsQuery = z.infer<typeof getOpdSlipsQuerySchema>;

export type { CreateOpdSlipBody, UpdateOpdSlipBody, GetOpdSlipsQuery };
