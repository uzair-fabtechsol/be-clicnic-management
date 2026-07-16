import { Router } from "express";
import {
  signIn,
  rotateToken,
  me,
  changePassword,
  logout,
} from "@src/controllers/authController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import {
  signInSchema,
  changePasswordSchema,
} from "@src/validations/authValidations";

const authRouter = Router();

authRouter.post("/signin", validationMiddleware(signInSchema), signIn);
authRouter.post("/rotate-token", rotateToken);
authRouter.get("/me", protectMiddleware, me);
authRouter.post("/logout", protectMiddleware, logout);
authRouter.patch(
  "/change-password",
  protectMiddleware,
  validationMiddleware(changePasswordSchema),
  changePassword
);

export default authRouter;
