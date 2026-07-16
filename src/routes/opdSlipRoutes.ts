import { Router } from "express";
import {
  createOpdSlip,
  getOpdSlips,
  getOpdSlip,
  updateOpdSlip,
  deleteOpdSlip,
} from "../controllers/opdSlipController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import {
  createOpdSlipSchema,
  updateOpdSlipSchema,
  getOpdSlipsQuerySchema,
} from "../validations/opdSlipValidations";

const opdSlipRouter = Router();

opdSlipRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("opdSlips", "view"),
  validationMiddleware(getOpdSlipsQuerySchema, "query"),
  getOpdSlips
);

// api/v1/opd-slips

opdSlipRouter.post(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("opdSlips", "create"),
  validationMiddleware(createOpdSlipSchema),
  createOpdSlip
);

opdSlipRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("opdSlips", "view"),
  validateObjectIdMiddleware(),
  getOpdSlip
);

opdSlipRouter.patch(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("opdSlips", "edit"),
  validateObjectIdMiddleware(),
  validationMiddleware(updateOpdSlipSchema),
  updateOpdSlip
);

opdSlipRouter.delete(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("opdSlips", "delete"),
  validateObjectIdMiddleware(),
  deleteOpdSlip
);

export default opdSlipRouter;
