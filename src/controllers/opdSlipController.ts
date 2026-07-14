import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import sendResponse from "@src/utils/sendResponse";
import {
  createOpdSlipService,
  getOpdSlipsService,
  getOpdSlipByIdService,
  updateOpdSlipService,
  deleteOpdSlipService,
} from "@src/services/opdSlipServices";
import type {
  CreateOpdSlipBody,
  UpdateOpdSlipBody,
  GetOpdSlipsQuery,
} from "@src/types/opdSlipTypes";

const createOpdSlip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateOpdSlipBody;
    const performedBy = req.user!._id;

    const data = await createOpdSlipService(body, performedBy);

    sendResponse(res, 201, {
      status: "success",
      message: "OPD slip created successfully",
      data,
    });
  }
);

const getOpdSlips = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GetOpdSlipsQuery;

    const data = await getOpdSlipsService(query);

    sendResponse(res, 200, {
      status: "success",
      message: "OPD slips fetched successfully",
      data,
    });
  }
);

const getOpdSlip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const opdSlipId = req.params.id as string;

    const data = await getOpdSlipByIdService(opdSlipId);

    sendResponse(res, 200, {
      status: "success",
      message: "OPD slip fetched successfully",
      data,
    });
  }
);

const updateOpdSlip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const opdSlipId = req.params.id as string;
    const body = req.body as UpdateOpdSlipBody;

    const data = await updateOpdSlipService(opdSlipId, body);

    sendResponse(res, 200, {
      status: "success",
      message: "OPD slip updated successfully",
      data,
    });
  }
);

const deleteOpdSlip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const opdSlipId = req.params.id as string;

    await deleteOpdSlipService(opdSlipId);

    sendResponse(res, 200, {
      status: "success",
      message: "OPD slip deleted successfully",
      data: null,
    });
  }
);

export {
  createOpdSlip,
  getOpdSlips,
  getOpdSlip,
  updateOpdSlip,
  deleteOpdSlip,
};
