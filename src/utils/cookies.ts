import { Response } from "express";

const ACCESS_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
};

const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

export { setAuthCookies, clearAuthCookies };
