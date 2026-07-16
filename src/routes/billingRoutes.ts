import { Router } from "express";
import {
  getBillings,
  getBilling,
  refundBilling,
  getBillingStats,
} from "../controllers/billingController";
import validationMiddleware from "../middlewares/validationMiddleware";
import protectMiddleware from "../middlewares/protectMiddleware";
import hasPermissionMiddleware from "../middlewares/hasPermissionMiddleware";
import validateObjectIdMiddleware from "../middlewares/validateObjectIdMiddleware";
import {
  getBillingsQuerySchema,
  refundBillingSchema,
} from "../validations/billingValidations";

const billingRouter = Router();

billingRouter.get(
  "/",
  protectMiddleware,
  hasPermissionMiddleware("billing", "view"),
  validationMiddleware(getBillingsQuerySchema, "query"),
  getBillings
);

billingRouter.get(
  "/stats",
  protectMiddleware,
  hasPermissionMiddleware("billing", "view"),
  getBillingStats
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
  validationMiddleware(refundBillingSchema),
  refundBilling
);

export default billingRouter;
