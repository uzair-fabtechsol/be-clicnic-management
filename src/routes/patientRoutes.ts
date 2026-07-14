import { Router } from "express";
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "@src/controllers/patientController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "@src/middlewares/validateObjectIdMiddleware";
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
} from "@src/validations/patientValidations";

const patientRouter = Router();

patientRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("patients", "view"),
  validationMiddleware(getPatientsQuerySchema, "query"),
  getPatients
);

patientRouter.post(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("patients", "create"),
  validationMiddleware(createPatientSchema),
  createPatient
);

patientRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("patients", "view"),
  validateObjectIdMiddleware(),
  getPatient
);

patientRouter.patch(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("patients", "edit"),
  validateObjectIdMiddleware(),
  validationMiddleware(updatePatientSchema),
  updatePatient
);

patientRouter.delete(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("patients", "delete"),
  validateObjectIdMiddleware(),
  deletePatient
);

export default patientRouter;
