import { Router } from "express";
import { signIn, rotateToken, me } from "@src/controllers/authController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import { signInSchema } from "@src/validations/authValidations";

const authRouter = Router();

authRouter.post("/signin", validationMiddleware(signInSchema), signIn);
authRouter.post("/rotate-token", rotateToken);
authRouter.get("/me", protectMiddleware, me);

export default authRouter;
