import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../utils/appError";

const restrictToMiddleware = (...roles: string[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      next(
        new AppError(403, "You do not have permission to perform this action")
      );
      return;
    }

    next();
  };
};

export default restrictToMiddleware;
