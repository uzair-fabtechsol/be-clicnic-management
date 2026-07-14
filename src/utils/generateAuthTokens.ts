import jwt from "jsonwebtoken";
import { env } from "@src/config/env";

const generateAccessToken = (userId: string): string =>
  jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

const generateRefreshToken = (userId: string): string =>
  jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

export { generateAccessToken, generateRefreshToken };
