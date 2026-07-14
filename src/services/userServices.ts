import bcrypt from "bcryptjs";
import UserModel from "@src/models/userModel";
import AppError from "@src/utils/appError";
import escapeRegex from "@src/utils/escapeRegex";
import type {
  CreateUserBody,
  UpdateUserBody,
  GetUsersQuery,
} from "@src/types/userTypes";
import type { Pagination } from "@src/utils/sendResponse";

const createUserService = async (body: CreateUserBody) => {
  const hashedPassword = await bcrypt.hash(body.password, 12);

  const user = await UserModel.create({
    ...body,
    password: hashedPassword,
  });

  const { password: _password, ...safeUser } = user.toObject();

  return { user: safeUser };
};

const getUsersService = async (query: GetUsersQuery) => {
  const { page, limit, search, role } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (role) {
    match.role = role;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    match.$or = [{ fullName: searchRegex }, { email: searchRegex }];
  }

  const [result] = await UserModel.aggregate([
    { $match: match },
    { $project: { password: 0 } },
    {
      $facet: {
        users: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalDocuments: number = result.totalCount[0]?.count ?? 0;
  const totalPages = Math.ceil(totalDocuments / limit) || 0;

  const pagination: Pagination = {
    page,
    limit,
    totalDocuments,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { users: result.users, pagination };
};

const getUserByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return { user };
};

const updateUserService = async (userId: string, body: UpdateUserBody) => {
  const user = await UserModel.findByIdAndUpdate(userId, body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return { user };
};

const deleteUserService = async (userId: string): Promise<void> => {
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }
};

const setUserActiveStatusService = async (
  requestingAdminId: string,
  userId: string,
  active: boolean
) => {
  if (requestingAdminId === userId) {
    throw new AppError(403, "You cannot activate or deactivate your own account");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new AppError(403, "You cannot activate or deactivate another admin");
  }

  user.active = active;
  await user.save();

  const { password: _password, ...safeUser } = user.toObject();

  return { user: safeUser };
};

export {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  setUserActiveStatusService,
};
