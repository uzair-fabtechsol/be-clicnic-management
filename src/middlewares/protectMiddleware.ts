import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import UserModel from "../models/userModel";
import { env } from "../config/env";

const protectMiddleware = catchAsync(
  async (req: Request, _res: Response, next): Promise<void> => {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
      next(
        new AppError(
          401,
          "You are not signed in. Please sign in to get access",
        ),
      );
      return;
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };
    } catch {
      next(new AppError(401, "Invalid or expired token. Please sign in again"));
      return;
    }

    const currentUser = await UserModel.findById(decoded.id);

    if (!currentUser) {
      next(
        new AppError(401, "The user belonging to this token no longer exists"),
      );
      return;
    }

    req.user = {
      _id: currentUser._id.toString(),
      role: currentUser.role,
      permissions: currentUser.permissions,
    };

    next();
  },
);

export default protectMiddleware;
