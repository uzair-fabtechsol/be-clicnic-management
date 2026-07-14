import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  getAuditLogsService,
  getAuditLogByIdService,
} from "@src/services/auditLogServices";
import type { GetAuditLogsQuery } from "@src/types/auditLogTypes";

const getAuditLogs = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetAuditLogsQuery;

    const data = await getAuditLogsService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "Audit logs fetched successfully",
      data,
    });
  }
);

const getAuditLog = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const auditLogId = req.params.id as string;

    const data = await getAuditLogByIdService(auditLogId);

    sendResponse(res, 200, {
      status: "success",
      message: "Audit log fetched successfully",
      data,
    });
  }
);

export { getAuditLogs, getAuditLog };
