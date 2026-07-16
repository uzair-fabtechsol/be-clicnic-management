import type { z } from "zod";
import type {
  signInSchema,
  changePasswordSchema,
} from "../validations/authValidations";

type SignInBody = z.infer<typeof signInSchema>;
type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export type { SignInBody, ChangePasswordBody };
