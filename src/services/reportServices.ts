import mongoose from "mongoose";
import PatientModel from "@src/models/patientModel";
import OpdSlipModel from "@src/models/opdSlipModel";
import BillingModel from "@src/models/billingModel";
import { getBillingStatsService, joinBillingStages } from "@src/services/billingServices";
import { PAYMENT_METHODS } from "@src/constants/opdSlipConstants";
import resolveDateRange from "@src/utils/reportUtils";
import type { Pagination } from "@src/utils/sendResponse";

//FUNCTION
const getPatientsReportService = async (
  from: Date | undefined,
  to: Date | undefined,
  page: number,
  limit: number
) => {
  const { from: start, to: end } = resolveDateRange(from, to);
  const skip = (page - 1) * limit;

  const [result] = await PatientModel.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $facet: {
        patients: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
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

  return { patients: result.patients, pagination };
};

//FUNCTION
const getDoctorsReportService = async (
  from: Date | undefined,
  to: Date | undefined
) => {
  const { from: start, to: end } = resolveDateRange(from, to);

  const results = await OpdSlipModel.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $lookup: {
        from: "billings",
        localField: "_id",
        foreignField: "opdSlip",
        as: "billingDetails",
      },
    },
    { $unwind: "$billingDetails" },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $group: {
        _id: "$doctor",
        doctor: { $first: "$doctorDetails.name" },
        specialization: { $first: "$doctorDetails.specialization" },
        consultations: { $sum: 1 },
        uniquePatients: {
          $sum: { $cond: [{ $eq: ["$visitType", "new"] }, 1, 0] },
        },
        revenue: {
          $sum: {
            $cond: [
              { $eq: ["$billingDetails.paymentStatus", "paid"] },
              "$doctorDetails.consultationFee",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        doctor: 1,
        specialization: 1,
        consultations: 1,
        uniquePatients: 1,
        revenue: 1,
      },
    },
    { $sort: { consultations: -1 } },
  ]);

  return { doctors: results };
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//FUNCTION
const getFinancialReportService = async (
  from: Date | undefined,
  to: Date | undefined
) => {
  const { from: start, to: end } = resolveDateRange(from, to);

  const rows: {
    createdAt: Date;
    refundedAt: Date | null;
    paymentStatus: "paid" | "refund";
    amount: number;
    paymentMethod: (typeof PAYMENT_METHODS)[number];
  }[] = await BillingModel.aggregate([
    {
      $match: {
        $or: [
          { createdAt: { $gte: start, $lte: end } },
          { refundedAt: { $gte: start, $lte: end } },
        ],
      },
    },
    ...(joinBillingStages as mongoose.PipelineStage[]),
    {
      $project: {
        _id: 0,
        createdAt: 1,
        refundedAt: 1,
        paymentStatus: 1,
        amount: "$doctorDetails.consultationFee",
        paymentMethod: "$opdSlipDetails.paymentMethod",
      },
    },
  ]);

  const dailyMap = new Map<string, { revenue: number; refunds: number }>();
  for (
    const cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    dailyMap.set(formatDateKey(cursor), { revenue: 0, refunds: 0 });
  }

  const breakdownMap = new Map<string, number>(
    PAYMENT_METHODS.map((method) => [method, 0])
  );

  for (const row of rows) {
    if (row.paymentStatus === "paid") {
      const createdAtDate = new Date(row.createdAt);

      if (createdAtDate >= start && createdAtDate <= end) {
        const bucket = dailyMap.get(formatDateKey(createdAtDate));
        if (bucket) {
          bucket.revenue += row.amount;
        }

        breakdownMap.set(
          row.paymentMethod,
          (breakdownMap.get(row.paymentMethod) ?? 0) + row.amount
        );
      }
    } else if (row.paymentStatus === "refund" && row.refundedAt) {
      const refundedAtDate = new Date(row.refundedAt);

      if (refundedAtDate >= start && refundedAtDate <= end) {
        const bucket = dailyMap.get(formatDateKey(refundedAtDate));
        if (bucket) {
          bucket.refunds += row.amount;
        }
      }
    }
  }

  const dailyRevenue = Array.from(dailyMap.entries()).map(
    ([date, { revenue, refunds }]) => ({ date, revenue, refunds })
  );

  const paymentBreakdown = Array.from(breakdownMap.entries()).map(
    ([method, amount]) => ({ method, amount })
  );

  return { dailyRevenue, paymentBreakdown };
};

//FUNCTION
const getOpdReportService = async (
  from: Date | undefined,
  to: Date | undefined
) => {
  const { from: start, to: end } = resolveDateRange(from, to);

  const doctorWiseSlips = await OpdSlipModel.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $group: {
        _id: "$doctor",
        doctor: { $first: "$doctorDetails.name" },
        slips: { $sum: 1 },
      },
    },
    { $project: { _id: 0, doctor: 1, slips: 1 } },
    { $sort: { slips: -1 } },
  ]);

  return { doctorWiseSlips };
};

//FUNCTION
const getPatientsReportStatsService = async (
  from: Date | undefined,
  to: Date | undefined
) => {
  const { from: start, to: end } = resolveDateRange(from, to);

  const results = await OpdSlipModel.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: "$visitType", count: { $sum: 1 } } },
  ]);

  const counts = Object.fromEntries(
    results.map((result: { _id: string; count: number }) => [
      result._id,
      result.count,
    ])
  );

  const newPatients = counts.new ?? 0;
  const returningPatients = counts.followUp ?? 0;

  return {
    newPatients,
    returningPatients,
    totalVisits: newPatients + returningPatients,
  };
};

//FUNCTION
const getFinancialReportStatsService = async (
  from: Date | undefined,
  to: Date | undefined
) => {
  const { from: start, to: end } = resolveDateRange(from, to);

  return getBillingStatsService(start, end);
};

//FUNCTION
const getOpdReportStatsService = async (
  from: Date | undefined,
  to: Date | undefined
) => {
  const { from: start, to: end } = resolveDateRange(from, to);

  const results = await OpdSlipModel.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: "$visitType", count: { $sum: 1 } } },
  ]);

  const counts = Object.fromEntries(
    results.map((result: { _id: string; count: number }) => [
      result._id,
      result.count,
    ])
  );

  const totalOpdSlips = (counts.new ?? 0) + (counts.followUp ?? 0);
  const totalFollowUpVisits = counts.followUp ?? 0;

  return { totalOpdSlips, totalFollowUpVisits };
};

export {
  getPatientsReportService,
  getDoctorsReportService,
  getFinancialReportService,
  getOpdReportService,
  getPatientsReportStatsService,
  getFinancialReportStatsService,
  getOpdReportStatsService,
};
