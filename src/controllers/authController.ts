import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import { setAuthCookies } from "@src/utils/cookies";
import {
  signInService,
  rotateTokenService,
  meService,
} from "@src/services/authServices";
import type { SignInBody } from "@src/types/authTypes";

const signIn = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as SignInBody;

    const { user, accessToken, refreshToken } = await signInService(body);

    setAuthCookies(res, accessToken, refreshToken);

    sendResponse(res, 200, {
      status: "success",
      message: "Signed in successfully",
      data: { user },
    });
  }
);

const rotateToken = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    const { accessToken, refreshToken: newRefreshToken } =
      await rotateTokenService(refreshToken);

    setAuthCookies(res, accessToken, newRefreshToken);

    sendResponse(res, 200, {
      status: "success",
      message: "Token rotated successfully",
      data: null,
    });
  }
);

const me = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id;

  const data = await meService(userId);

  sendResponse(res, 200, {
    status: "success",
    message: "Current user fetched successfully",
    data,
  });
});

export { signIn, rotateToken, me };
