import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  getBillingsService,
  getBillingByIdService,
  refundBillingService,
} from "@src/services/billingServices";
import type { GetBillingsQuery } from "@src/types/billingTypes";

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

    const data = await refundBillingService(billingId);

    sendResponse(res, 200, {
      status: "success",
      message: "Billing entry refunded successfully",
      data,
    });
  }
);

export { getBillings, getBilling, refundBilling };
