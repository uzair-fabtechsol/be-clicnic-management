import type { z } from "zod";
import type { updateClinicInformationSchema } from "../validations/clinicInformationValidations";

type UpdateClinicInformationBody = z.infer<
  typeof updateClinicInformationSchema
>;

export type { UpdateClinicInformationBody };
