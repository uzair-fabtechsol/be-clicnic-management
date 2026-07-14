import { model, models, Schema, type InferSchemaType } from "mongoose";
import { APPOINTMENT_STATUSES } from "@src/constants/appointmentConstants";

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: "scheduled",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type AppointmentType = InferSchemaType<typeof appointmentSchema>;

const AppointmentModel =
  models.Appointment || model<AppointmentType>("Appointment", appointmentSchema);

export default AppointmentModel;
export type { AppointmentType };
