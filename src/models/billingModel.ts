import { model, models, Schema, type InferSchemaType } from "mongoose";
import { PAYMENT_STATUSES } from "../constants/billingConstants";
import { PAYMENT_METHODS } from "../constants/opdSlipConstants";

const billingSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    opdSlip: {
      type: Schema.Types.ObjectId,
      ref: "OpdSlip",
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: PAYMENT_STATUSES,
      default: "paid",
    },
    refundMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: null,
    },
    refundReason: {
      type: String,
      trim: true,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type BillingType = InferSchemaType<typeof billingSchema>;

const BillingModel =
  models.Billing || model<BillingType>("Billing", billingSchema);

export default BillingModel;
export type { BillingType };
