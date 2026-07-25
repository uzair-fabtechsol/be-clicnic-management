import { z } from "zod";
import { requiredMobileNumberSchema } from "./commonValidations";

const updateClinicInformationSchema = z.object({
  clinicName: z.string().trim().min(1, "Clinic name is required").optional(),
  contactNumber: requiredMobileNumberSchema.optional(),
  email: z.email("Invalid email address").trim().toLowerCase().optional(),
  address: z.string().trim().min(1, "Address is required").optional(),
});

export { updateClinicInformationSchema };
