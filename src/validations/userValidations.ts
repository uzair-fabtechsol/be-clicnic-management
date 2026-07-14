import { z } from "zod";
import { RESOURCES, ACTIONS } from "@src/constants/userConstants";

const permissionSchema = z.object({
  resource: z.enum(RESOURCES),
  actions: z.array(z.enum(ACTIONS)).default([]),
});

const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "receptionist"]),
  permissions: z.array(permissionSchema).default([]),
});

const updateUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").optional(),
  email: z.email("Invalid email address").trim().toLowerCase().optional(),
  role: z.enum(["admin", "receptionist"]).optional(),
  permissions: z.array(permissionSchema).optional(),
});

const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  role: z.enum(["admin", "receptionist"]).optional(),
});

const setUserActiveStatusSchema = z.object({
  active: z.boolean(),
});

export {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  setUserActiveStatusSchema,
};
