import { Router } from "express";
import {
  signIn,
  rotateToken,
  me,
  changePassword,
  logout,
} from "../controllers/authController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import {
  signInSchema,
  changePasswordSchema,
} from "../validations/authValidations";

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
