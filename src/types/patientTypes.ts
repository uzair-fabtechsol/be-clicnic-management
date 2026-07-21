import type { z } from "zod";
import type {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
  bulkCreatePatientItemSchema,
} from "../validations/patientValidations";

type CreatePatientBody = z.infer<typeof createPatientSchema>;
type UpdatePatientBody = z.infer<typeof updatePatientSchema>;
type GetPatientsQuery = z.infer<typeof getPatientsQuerySchema>;
type BulkCreatePatientItem = z.infer<typeof bulkCreatePatientItemSchema>;

export type {
  CreatePatientBody,
  UpdatePatientBody,
  GetPatientsQuery,
  BulkCreatePatientItem,
};
