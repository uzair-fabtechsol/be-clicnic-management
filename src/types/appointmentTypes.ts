import type { z } from "zod";
import type {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
} from "../validations/appointmentValidations";

type CreateAppointmentBody = z.infer<typeof createAppointmentSchema>;
type UpdateAppointmentBody = z.infer<typeof updateAppointmentSchema>;
type GetAppointmentsQuery = z.infer<typeof getAppointmentsQuerySchema>;

export type {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  GetAppointmentsQuery,
};
