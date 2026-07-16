import { model, models, Schema, type InferSchemaType } from "mongoose";
import { GENDERS, BLOOD_GROUPS } from "../constants/patientConstants";

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
    fatherName: {
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
    dateOfBirth: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: BLOOD_GROUPS,
    },
    emergencyContact: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type PatientType = InferSchemaType<typeof patientSchema>;

const PatientModel =
  models.Patient || model<PatientType>("Patient", patientSchema);

export default PatientModel;
export type { PatientType };
