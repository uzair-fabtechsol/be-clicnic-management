import { Router } from "express";
import {
  getBillings,
  getBilling,
  refundBilling,
} from "@src/controllers/billingController";
import validationMiddleware from "@src/middlewares/validationMiddleware";
import protectMiddleware from "@src/middlewares/protectMiddleware";
import hasPermissionMiddleware from "@src/middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "@src/middlewares/validateObjectIdMiddleware";
import { getBillingsQuerySchema } from "@src/validations/billingValidations";

const billingRouter = Router();

billingRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("billing", "view"),
  validationMiddleware(getBillingsQuerySchema, "query"),
  getBillings
);

billingRouter.get(
  "/:id",
  protectMiddleware,
  hasPermissionMiddleware("billing", "view"),
  validateObjectIdMiddleware(),
  getBilling
);

billingRouter.patch(
  "/:id/refund",
  protectMiddleware,
  hasPermissionMiddleware("billing", "edit"),
  validateObjectIdMiddleware(),
  refundBilling
);

export default billingRouter;
