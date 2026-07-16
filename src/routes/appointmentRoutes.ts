import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
} from "../controllers/appointmentController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
} from "../validations/appointmentValidations";

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

appointmentRouter.patch(
  "/:id/cancel",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "delete"),
  validateObjectIdMiddleware(),
  cancelAppointment
);

appointmentRouter.patch(
  "/:id/complete",
  protectMiddleware,
  hasPermissionMiddleware("appointments", "edit"),
  validateObjectIdMiddleware(),
  completeAppointment
);

export default appointmentRouter;
