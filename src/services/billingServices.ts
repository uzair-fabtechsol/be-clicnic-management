import mongoose from "mongoose";
import BillingModel from "@src/models/billingModel";
import AppError from "@src/utils/appError";
import generateTransactionId from "@src/utils/billingUtils";
import { BILLING_TYPE } from "@src/constants/billingConstants";
import type { GetBillingsQuery, RefundBillingBody } from "@src/types/billingTypes";
import type { Pagination } from "@src/utils/sendResponse";

const createBillingService = async (opdSlipId: string) => {
  const transactionId = await generateTransactionId();

  const billing = await BillingModel.create({
    transactionId,
    opdSlip: opdSlipId,
  });

  return { billing };
};

const shapeBillingStages = [
  {
    $lookup: {
      from: "opdslips",
      localField: "opdSlip",
      foreignField: "_id",
      as: "opdSlipDetails",
    },
  },
  { $unwind: "$opdSlipDetails" },
  {
    $lookup: {
      from: "patients",
      localField: "opdSlipDetails.patient",
      foreignField: "_id",
      as: "patientDetails",
    },
  },
  { $unwind: "$patientDetails" },
  {
    $lookup: {
      from: "doctors",
      localField: "opdSlipDetails.doctor",
      foreignField: "_id",
      as: "doctorDetails",
    },
  },
  { $unwind: "$doctorDetails" },
  {
    $project: {
      _id: 1,
      transactionId: 1,
      patient: "$patientDetails.name",
      opdSlipNumber: "$opdSlipDetails.opdSlipNumber",
      type: { $literal: BILLING_TYPE },
      paymentMethod: "$opdSlipDetails.paymentMethod",
      paymentAmount: "$doctorDetails.consultationFee",
      paymentStatus: 1,
      refundMethod: 1,
      refundReason: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

const getBillingsService = async (query: GetBillingsQuery) => {
  const { page, limit, paymentStatus } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (paymentStatus) {
    match.paymentStatus = paymentStatus;
  }

  const [result] = await BillingModel.aggregate([
    { $match: match },
    {
      $facet: {
        billings: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          ...shapeBillingStages,
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

  return { billings: result.billings, pagination };
};

const getBillingByIdService = async (billingId: string) => {
  const [billing] = await BillingModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(billingId) } },
    ...shapeBillingStages,
  ]);

  if (!billing) {
    throw new AppError(404, "Billing entry not found");
  }

  return { billing };
};

const refundBillingService = async (
  billingId: string,
  body: RefundBillingBody
) => {
  const billing = await BillingModel.findById(billingId);

  if (!billing) {
    throw new AppError(404, "Billing entry not found");
  }

  if (billing.paymentStatus === "refund") {
    throw new AppError(400, "Billing entry has already been refunded");
  }

  billing.paymentStatus = "refund";
  billing.refundMethod = body.refundMethod;
  billing.refundReason = body.refundReason;
  await billing.save();

  return getBillingByIdService(billingId);
};

export {
  createBillingService,
  getBillingsService,
  getBillingByIdService,
  refundBillingService,
};
