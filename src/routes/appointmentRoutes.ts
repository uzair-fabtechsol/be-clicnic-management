import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "@src/controllers/appointmentController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "@src/middlewares/validateObjectIdMiddleware";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
} from "@src/validations/appointmentValidations";

const appointmentRouter = Router();

appointmentRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "view"),
  validationMiddleware(getAppointmentsQuerySchema, "query"),
  getAppointments
);

appointmentRouter.post(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "create"),
  validationMiddleware(createAppointmentSchema),
  createAppointment
);

appointmentRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "view"),
  validateObjectIdMiddleware(),
  getAppointment
);

appointmentRouter.patch(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "edit"),
  validateObjectIdMiddleware(),
  validationMiddleware(updateAppointmentSchema),
  updateAppointment
);

appointmentRouter.delete(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "delete"),
  validateObjectIdMiddleware(),
  deleteAppointment
);

export default appointmentRouter;
