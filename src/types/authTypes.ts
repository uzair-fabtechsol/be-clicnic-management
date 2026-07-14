import type { z } from "zod";
import type { signInSchema } from "@src/validations/authValidations";

type SignInBody = z.infer<typeof signInSchema>;

export type { SignInBody };
