import type { z } from "zod";
import type {
  createDoctorSchema,
  updateDoctorSchema,
  getDoctorsQuerySchema,
} from "../validations/doctorValidations";

type CreateDoctorBody = z.infer<typeof createDoctorSchema>;
type UpdateDoctorBody = z.infer<typeof updateDoctorSchema>;
type GetDoctorsQuery = z.infer<typeof getDoctorsQuerySchema>;

export type { CreateDoctorBody, UpdateDoctorBody, GetDoctorsQuery };
