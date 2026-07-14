import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "@src/controllers/userController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "@src/middlewares/validateObjectIdMiddleware";
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
} from "@src/validations/userValidations";

const userRouter = Router();

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

export default userRouter;
