import type { z } from "zod";
import type { updateClinicInformationSchema } from "@src/validations/clinicInformationValidations";

type UpdateClinicInformationBody = z.infer<
  typeof updateClinicInformationSchema
>;

export type { UpdateClinicInformationBody };
