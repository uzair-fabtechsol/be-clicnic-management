import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  getBillingsService,
  getBillingByIdService,
  refundBillingService,
  getBillingStatsService,
} from "@src/services/billingServices";
import type {
  GetBillingsQuery,
  RefundBillingBody,
} from "@src/types/billingTypes";

const getBillings = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetBillingsQuery;

    const data = await getBillingsService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "Billings fetched successfully",
      data,
    });
  }
);

const getBilling = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const billingId = req.params.id as string;

    const data = await getBillingByIdService(billingId);

    sendResponse(res, 200, {
      status: "success",
      message: "Billing entry fetched successfully",
      data,
    });
  }
);

const refundBilling = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const billingId = req.params.id as string;
    const body = req.body as RefundBillingBody;

    const data = await refundBillingService(billingId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "Billing entry refunded successfully",
      data,
    });
  }
);

const getBillingStats = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getBillingStatsService();

    sendResponse(res, 200, {
      status: "success",
      message: "Billing stats fetched successfully",
      data,
    });
  }
);

export { getBillings, getBilling, refundBilling, getBillingStats };
