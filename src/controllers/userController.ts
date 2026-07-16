import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  setUserActiveStatusService,
} from "../services/userServices";
import type {
  CreateUserBody,
  UpdateUserBody,
  GetUsersQuery,
  SetUserActiveStatusBody,
  UpdateProfileBody,
} from "../types/userTypes";

const createUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateUserBody;

    const data = await createUserService(body);

    sendResponse(res, 201, {
      status: "success",
      message: "User created successfully",
      data,
    });
  },
);

const getUsers = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetUsersQuery;

    const data = await getUsersService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "Users fetched successfully",
      data,
    });
  },
);

const getUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;

    const data = await getUserByIdService(userId);

    sendResponse(res, 200, {
      status: "success",
      message: "User fetched successfully",
      data,
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    const body = req.body as UpdateUserBody;

    const data = await updateUserService(userId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "User updated successfully",
      data,
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;

    await deleteUserService(userId);

    sendResponse(res, 200, {
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  },
);

const setUserActiveStatus = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const requestingAdminId = req.user!._id;
    const userId = req.params.id as string;
    const { active } = req.body as SetUserActiveStatusBody;

    const data = await setUserActiveStatusService(
      requestingAdminId,
      userId,
      active,
    );

    sendResponse(res, 200, {
      status: "success",
      message: `User ${active ? "activated" : "deactivated"} successfully`,
      data,
    });
  },
);

const updateProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const body = req.body as UpdateProfileBody;

    const data = await updateUserService(userId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "Profile updated successfully",
      data,
    });
  },
);

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setUserActiveStatus,
  updateProfile,
};
