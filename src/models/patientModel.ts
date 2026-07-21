import { model, models, Schema, type InferSchemaType } from "mongoose";
import { GENDERS, AGE_UNITS } from "../constants/patientConstants";

const patientSchema = new Schema(
  {
    mrNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    guardianName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: GENDERS,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    ageUnit: {
      type: String,
      enum: AGE_UNITS,
      required: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    cnic: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type PatientType = InferSchemaType<typeof patientSchema>;

const PatientModel =
  models.Patient || model<PatientType>("Patient", patientSchema);

export default PatientModel;
export type { PatientType };
