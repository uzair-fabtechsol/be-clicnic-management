import mongoose from "mongoose";
import AuditLogModel from "@src/models/auditLogModel";
import AppError from "@src/utils/appError";
import type { GetAuditLogsQuery } from "@src/types/auditLogTypes";
import type { Pagination } from "@src/utils/sendResponse";

const lookupPerformedByStages = [
  {
    $lookup: {
      from: "users",
      localField: "performedBy",
      foreignField: "_id",
      as: "performedByDetails",
    },
  },
  { $unwind: "$performedByDetails" },
  { $project: { performedBy: 0, "performedByDetails.password": 0 } },
];

const getAuditLogsService = async (query: GetAuditLogsQuery) => {
  const { page, limit, action, performedBy } = query;
  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = {};

  if (action) {
    match.action = action;
  }

  if (performedBy) {
    match.performedBy = new mongoose.Types.ObjectId(performedBy);
  }

  const [result] = await AuditLogModel.aggregate([
    { $match: match },
    {
      $facet: {
        auditLogs: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          ...lookupPerformedByStages,
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

  return { auditLogs: result.auditLogs, pagination };
};

const getAuditLogByIdService = async (auditLogId: string) => {
  const [auditLog] = await AuditLogModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(auditLogId) } },
    ...lookupPerformedByStages,
  ]);

  if (!auditLog) {
    throw new AppError(404, "Audit log not found");
  }

  return { auditLog };
};

export { getAuditLogsService, getAuditLogByIdService };
