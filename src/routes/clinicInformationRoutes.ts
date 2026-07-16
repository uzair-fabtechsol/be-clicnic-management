import { Router } from "express";
import {
  updateClinicInformation,
  getClinicInformation,
} from "../controllers/clinicInformationController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import restrictToMiddleware from "../middlewares/restrictToMiddleware";
import { updateClinicInformationSchema } from "../validations/clinicInformationValidations";

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
