import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "@src/services/userServices";
import type {
  CreateUserBody,
  UpdateUserBody,
  GetUsersQuery,
} from "@src/types/userTypes";

const createUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateUserBody;

    const data = await createUserService(body);

    sendResponse(res, 201, {
      status: "success",
      message: "User created successfully",
      data,
    });
  }
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
  }
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
  }
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
  }
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
  }
);

export { createUser, getUsers, getUser, updateUser, deleteUser };
