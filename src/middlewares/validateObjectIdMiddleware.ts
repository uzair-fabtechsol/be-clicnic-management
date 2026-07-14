import { NextFunction, Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import AppError from "@src/utils/appError";

const validateObjectIdMiddleware = (paramName = "id"): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const value = req.params[paramName];

    if (typeof value !== "string" || !mongoose.Types.ObjectId.isValid(value)) {
      next(new AppError(400, `Invalid ${paramName}`));
      return;
    }

    next();
  };
};

export default validateObjectIdMiddleware;
