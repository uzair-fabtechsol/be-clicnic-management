import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../utils/appError";

// Admins bypass this check entirely. Receptionists must have an explicit
// { resource, actions } entry granting the given action on the given
// resource — see docs/requestLifecycle.md for the authorization pattern
// followed by every resource (users, patients, doctors, etc.).
const hasPermissionMiddleware = (
  resource: string,
  action: string
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      next(
        new AppError(401, "You are not signed in. Please sign in to get access")
      );
      return;
    }

    if (user.role === "admin") {
      next();
      return;
    }

    const hasAccess = user.permissions.some(
      (permission) =>
        permission.resource === resource && permission.actions.includes(action)
    );

    if (!hasAccess) {
      next(
        new AppError(403, "You do not have permission to perform this action")
      );
      return;
    }

    next();
  };
};

export default hasPermissionMiddleware;
