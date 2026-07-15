import { model, models, Schema, type InferSchemaType } from "mongoose";

const clinicInformationSchema = new Schema(
  {
    clinicName: {
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

type ClinicInformationType = InferSchemaType<typeof clinicInformationSchema>;

const ClinicInformationModel =
  models.ClinicInformation ||
  model<ClinicInformationType>("ClinicInformation", clinicInformationSchema);

export default ClinicInformationModel;
export type { ClinicInformationType };
