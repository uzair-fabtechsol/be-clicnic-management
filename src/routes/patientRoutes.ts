import { Router } from "express";
import {
  createPatient,
  createPatients,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
  bulkCreatePatientsSchema,
} from "../validations/patientValidations";

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

patientRouter.post(
  "/bulk",
  protectMiddleware,
  hasPermissionMiddleware("patients", "create"),
  validationMiddleware(bulkCreatePatientsSchema),
  createPatients
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
