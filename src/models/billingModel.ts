import { model, models, Schema, type InferSchemaType } from "mongoose";
import { PAYMENT_STATUSES } from "@src/constants/billingConstants";

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
