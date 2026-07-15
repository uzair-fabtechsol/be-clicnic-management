import { z } from "zod";

const getReportsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

const getReportStatsQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export { getReportsQuerySchema, getReportStatsQuerySchema };
