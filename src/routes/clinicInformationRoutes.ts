import { Router } from "express";
import {
  updateClinicInformation,
  getClinicInformation,
} from "@src/controllers/clinicInformationController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import restrictToMiddleware from "@src/middlewares/restrictToMiddleware";
import { updateClinicInformationSchema } from "@src/validations/clinicInformationValidations";

const clinicInformationRouter = Router();

clinicInformationRouter.get("/", protectMiddleware, getClinicInformation);

clinicInformationRouter.patch(
  "/",
  protectMiddleware,
  restrictToMiddleware("admin"),
  validationMiddleware(updateClinicInformationSchema),
  updateClinicInformation
);

export default clinicInformationRouter;
