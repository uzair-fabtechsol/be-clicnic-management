import type { z } from "zod";
import type {
  getReportsQuerySchema,
  getReportStatsQuerySchema,
} from "@src/validations/reportValidations";

type GetReportsQuery = z.infer<typeof getReportsQuerySchema>;
type GetReportStatsQuery = z.infer<typeof getReportStatsQuerySchema>;

export type { GetReportsQuery, GetReportStatsQuery };
