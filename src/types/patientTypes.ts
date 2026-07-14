import type { z } from "zod";
import type {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
} from "@src/validations/patientValidations";

type CreatePatientBody = z.infer<typeof createPatientSchema>;
type UpdatePatientBody = z.infer<typeof updatePatientSchema>;
type GetPatientsQuery = z.infer<typeof getPatientsQuerySchema>;

export type { CreatePatientBody, UpdatePatientBody, GetPatientsQuery };
