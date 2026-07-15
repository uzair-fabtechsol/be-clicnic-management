import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@src/models/userModel";
import AppError from "@src/utils/appError";
import { env } from "@src/config/env";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@src/utils/generateAuthTokens";
import recordAuditLog from "@src/utils/auditLog";
import type { SignInBody, ChangePasswordBody } from "@src/types/authTypes";

const signInService = async (body: SignInBody) => {
  const user = await UserModel.findOne({ email: body.email });

  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw new AppError(401, "Incorrect email or password");
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  await recordAuditLog(
    "userLogin",
    user._id.toString(),
    "System",
    `User ${user.fullName} logged in`
  );

  const { password: _password, ...safeUser } = user.toObject();

  return { user: safeUser, accessToken, refreshToken };
};

const rotateTokenService = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new AppError(401, "Refresh token missing. Please sign in again");
  }

  let decoded: { id: string };
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      id: string;
    };
  } catch {
    throw new AppError(
      401,
      "Invalid or expired refresh token. Please sign in again"
    );
  }

  const user = await UserModel.findById(decoded.id);

  if (!user) {
    throw new AppError(
      401,
      "The user belonging to this token no longer exists"
    );
  }

  const newAccessToken = generateAccessToken(user._id.toString());
  const newRefreshToken = generateRefreshToken(user._id.toString());

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const meService = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const { password: _password, ...safeUser } = user.toObject();

  return { user: safeUser };
};

const changePasswordService = async (
  userId: string,
  body: ChangePasswordBody
): Promise<void> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(
    body.currentPassword,
    user.password
  );

  if (!isCurrentPasswordCorrect) {
    throw new AppError(401, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(body.newPassword, 12);
  await user.save();
};

export { signInService, rotateTokenService, meService, changePasswordService };
