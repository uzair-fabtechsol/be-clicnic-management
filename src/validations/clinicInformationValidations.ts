import { z } from "zod";

const updateClinicInformationSchema = z.object({
  clinicName: z.string().trim().min(1, "Clinic name is required").optional(),
  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .optional(),
  email: z.email("Invalid email address").trim().toLowerCase().optional(),
  address: z.string().trim().min(1, "Address is required").optional(),
});

export { updateClinicInformationSchema };
