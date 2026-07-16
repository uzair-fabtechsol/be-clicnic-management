import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .preprocess(
      (val) =>
        typeof val === "string" ? val.trim().replace(/^"(.*)"$/, "$1") : val,
      z.enum(["development", "production", "test"])
    )
    .default("development"),
  PORT: z.coerce.number().default(5000),
  APP_NAME: z.string(),
  DB_USER_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_CONNECTION_STRING: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
});

export const env = envSchema.parse(process.env);
