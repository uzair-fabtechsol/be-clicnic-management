import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import AppError from "../utils/appError";

// Express 5 makes `req.query` a read-only getter, so a validated query
// object cannot be reassigned onto `req.query`. It is stored on
// `req.validatedQuery` instead — controllers should read from there when
// the route validates a query schema.
const validationMiddleware = (
  schema: z.ZodType,
  target: "body" | "query" = "body"
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const source = target === "body" ? req.body : req.query;
    const result = schema.safeParse(source);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      next(new AppError(400, "Validation failed", { errors }));
      return;
    }

    if (target === "body") {
      req.body = result.data;
    } else {
      req.validatedQuery = result.data;
    }

    next();
  };
};

export default validationMiddleware;
