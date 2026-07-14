import type { z } from "zod";
import type {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  setUserActiveStatusSchema,
} from "@src/validations/userValidations";

type CreateUserBody = z.infer<typeof createUserSchema>;
type UpdateUserBody = z.infer<typeof updateUserSchema>;
type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
type SetUserActiveStatusBody = z.infer<typeof setUserActiveStatusSchema>;

export type {
  CreateUserBody,
  UpdateUserBody,
  GetUsersQuery,
  SetUserActiveStatusBody,
};
