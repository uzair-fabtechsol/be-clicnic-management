import BillingModel from "../models/billingModel";
import generateUniqueNumber from "./generateUniqueNumber";
import { TRANSACTION_ID_DIGITS } from "../constants/billingConstants";

const generateTransactionId = (): Promise<string> =>
  generateUniqueNumber("TXN", TRANSACTION_ID_DIGITS, (transactionId) =>
    BillingModel.exists({ transactionId }).then(Boolean)
  );

export default generateTransactionId;
