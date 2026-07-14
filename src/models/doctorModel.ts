import { model, models, Schema, type InferSchemaType } from "mongoose";
import { DAYS } from "@src/constants/doctorConstants";

const slotSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: DAYS,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    slots: {
      type: [slotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type DoctorType = InferSchemaType<typeof doctorSchema>;

const DoctorModel = models.Doctor || model<DoctorType>("Doctor", doctorSchema);

export default DoctorModel;
export type { DoctorType };
