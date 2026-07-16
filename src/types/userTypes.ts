import type { z } from "zod";
import type {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  setUserActiveStatusSchema,
  updateProfileSchema,
} from "../validations/userValidations";

type CreateUserBody = z.infer<typeof createUserSchema>;
type UpdateUserBody = z.infer<typeof updateUserSchema>;
type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
type SetUserActiveStatusBody = z.infer<typeof setUserActiveStatusSchema>;
type UpdateProfileBody = z.infer<typeof updateProfileSchema>;

export type {
  CreateUserBody,
  UpdateUserBody,
  GetUsersQuery,
  SetUserActiveStatusBody,
  UpdateProfileBody,
};
