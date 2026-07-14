import { model, models, Schema, type InferSchemaType } from "mongoose";
import { RESOURCES, ACTIONS } from "@src/constants/userConstants";

const permissionSchema = new Schema(
  {
    resource: {
      type: String,
      required: true,
      trim: true,
      enum: RESOURCES,
    },
    actions: {
      type: [String],
      enum: ACTIONS,
      default: [],
    },
  },
  {
    _id: false,
  }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "receptionist"],
      required: true,
    },
    permissions: {
      type: [permissionSchema],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

type UserType = InferSchemaType<typeof userSchema>;

const UserModel = models.User || model<UserType>("User", userSchema);

export default UserModel;
export type { UserType };
