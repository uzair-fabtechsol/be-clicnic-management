import mongoose from "mongoose";
import BillingModel from "@src/models/billingModel";
import AppError from "@src/utils/appError";
import escapeRegex from "@src/utils/escapeRegex";
import generateTransactionId from "@src/utils/billingUtils";
import { BILLING_TYPE } from "@src/constants/billingConstants";
import type { GetBillingsQuery, RefundBillingBody } from "@src/types/billingTypes";
import type { Pagination } from "@src/utils/sendResponse";

//FUNCTION
const createBillingService = async (opdSlipId: string) => {
  const transactionId = await generateTransactionId();

  const billing = await BillingModel.create({
    transactionId,
    opdSlip: opdSlipId,
  });

  return { billing };
};

const joinBillingStages = [
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
];

const projectBillingStage = {
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
    refundedAt: 1,
    createdAt: 1,
    updatedAt: 1,
  },
};

const shapeBillingStages = [...joinBillingStages, projectBillingStage];

//FUNCTION
const getBillingsService = async (query: GetBillingsQuery) => {
  const { page, limit, paymentStatus, paymentMethod, search } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (paymentStatus) {
    match.paymentStatus = paymentStatus;
  }

  const pipeline: mongoose.PipelineStage[] = [
    { $match: match },
    ...joinBillingStages,
  ] as mongoose.PipelineStage[];

  const postJoinMatch: Record<string, unknown> = {};

  if (paymentMethod) {
    postJoinMatch["opdSlipDetails.paymentMethod"] = paymentMethod;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    postJoinMatch.$or = [
      { transactionId: searchRegex },
      { "opdSlipDetails.opdSlipNumber": searchRegex },
      { "patientDetails.name": searchRegex },
    ];
  }

  if (Object.keys(postJoinMatch).length > 0) {
    pipeline.push({ $match: postJoinMatch });
  }

  pipeline.push({
    $facet: {
      billings: [
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        projectBillingStage,
      ],
      totalCount: [{ $count: "count" }],
    },
  });

  const [result] = await BillingModel.aggregate(pipeline);

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

//FUNCTION
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

//FUNCTION
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
  billing.refundedAt = new Date();
  await billing.save();

  return getBillingByIdService(billingId);
};

//FUNCTION
const getBillingStatsService = async (from?: Date, to?: Date) => {
  const pipeline: mongoose.PipelineStage[] = [];

  if (from && to) {
    pipeline.push({ $match: { createdAt: { $gte: from, $lte: to } } });
  }

  pipeline.push(
    ...(joinBillingStages as mongoose.PipelineStage[]),
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "paid"] },
              "$doctorDetails.consultationFee",
              0,
            ],
          },
        },
        totalRefunds: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "refund"] },
              "$doctorDetails.consultationFee",
              0,
            ],
          },
        },
      },
    },
  );

  const [result] = await BillingModel.aggregate(pipeline);

  return {
    totalRevenue: result?.totalRevenue ?? 0,
    totalRefunds: result?.totalRefunds ?? 0,
  };
};

export {
  createBillingService,
  getBillingsService,
  getBillingByIdService,
  refundBillingService,
  getBillingStatsService,
  joinBillingStages,
};
