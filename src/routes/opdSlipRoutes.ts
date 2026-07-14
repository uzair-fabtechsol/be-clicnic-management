import { Router } from "express";
import {
  createOpdSlip,
  getOpdSlips,
  getOpdSlip,
  updateOpdSlip,
  deleteOpdSlip,
} from "@src/controllers/opdSlipController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "@src/middlewares/validateObjectIdMiddleware";
import {
  createOpdSlipSchema,
  updateOpdSlipSchema,
  getOpdSlipsQuerySchema,
} from "@src/validations/opdSlipValidations";

const opdSlipRouter = Router();

opdSlipRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("opdSlips", "view"),
  validationMiddleware(getOpdSlipsQuerySchema, "query"),
  getOpdSlips
);

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
