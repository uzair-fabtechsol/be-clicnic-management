import { Router } from "express";
import {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import {
  createDoctorSchema,
  updateDoctorSchema,
  getDoctorsQuerySchema,
} from "../validations/doctorValidations";

const doctorRouter = Router();

doctorRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("doctors", "view"),
  validationMiddleware(getDoctorsQuerySchema, "query"),
  getDoctors
);

doctorRouter.post(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("doctors", "create"),
  validationMiddleware(createDoctorSchema),
  createDoctor
);

doctorRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("doctors", "view"),
  validateObjectIdMiddleware(),
  getDoctor
);

doctorRouter.patch(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("doctors", "edit"),
  validateObjectIdMiddleware(),
  validationMiddleware(updateDoctorSchema),
  updateDoctor
);

doctorRouter.delete(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("doctors", "delete"),
  validateObjectIdMiddleware(),
  deleteDoctor
);

export default doctorRouter;
