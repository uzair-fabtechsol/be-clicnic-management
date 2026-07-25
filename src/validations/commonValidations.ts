import { z } from "zod";

const MOBILE_NUMBER_REGEX = /^03\d{2}-\d{7}$/;

const mobileNumberSchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z
    .string()
    .trim()
    .regex(MOBILE_NUMBER_REGEX, "Invalid mobile number, expected format 03XX-XXXXXXX")
    .optional()
);

const requiredMobileNumberSchema = z
  .string()
  .trim()
  .regex(MOBILE_NUMBER_REGEX, "Invalid mobile number, expected format 03XX-XXXXXXX");

export { MOBILE_NUMBER_REGEX, mobileNumberSchema, requiredMobileNumberSchema };
