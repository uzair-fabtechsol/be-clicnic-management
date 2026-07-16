import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setUserActiveStatus,
  updateProfile,
} from "../controllers/userController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import restrictToMiddleware from "../middlewares/restrictToMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  setUserActiveStatusSchema,
  updateProfileSchema,
} from "../validations/userValidations";

const userRouter = Router();

userRouter.patch(
  "/profile",
  protectMiddleware,
  validationMiddleware(updateProfileSchema),
  updateProfile
);

userRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("users", "view"),
  validationMiddleware(getUsersQuerySchema, "query"),
  getUsers
);

userRouter.post(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("users", "create"),
  validationMiddleware(createUserSchema),
  createUser
);

userRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("users", "view"),
  validateObjectIdMiddleware(),
  getUser
);

userRouter.patch(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("users", "edit"),
  validateObjectIdMiddleware(),
  validationMiddleware(updateUserSchema),
  updateUser
);

userRouter.delete(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("users", "delete"),
  validateObjectIdMiddleware(),
  deleteUser
);

userRouter.patch(
  "/:id/status",
  protectMiddleware,
  restrictToMiddleware("admin"),
  validateObjectIdMiddleware(),
  validationMiddleware(setUserActiveStatusSchema),
  setUserActiveStatus
);

export default userRouter;
