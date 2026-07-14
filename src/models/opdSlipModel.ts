import { model, models, Schema, type InferSchemaType } from "mongoose";
import { VISIT_TYPES, PAYMENT_METHODS } from "@src/constants/opdSlipConstants";

const opdSlipSchema = new Schema(
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
    visitType: {
      type: String,
      required: true,
      enum: VISIT_TYPES,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: PAYMENT_METHODS,
    },
    symptomsAndRemarks: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type OpdSlipType = InferSchemaType<typeof opdSlipSchema>;

const OpdSlipModel =
  models.OpdSlip || model<OpdSlipType>("OpdSlip", opdSlipSchema);

export default OpdSlipModel;
export type { OpdSlipType };
