import BillingModel from "@src/models/billingModel";
import generateUniqueNumber from "@src/utils/generateUniqueNumber";
import { TRANSACTION_ID_DIGITS } from "@src/constants/billingConstants";

const generateTransactionId = (): Promise<string> =>
  generateUniqueNumber("TXN", TRANSACTION_ID_DIGITS, (transactionId) =>
    BillingModel.exists({ transactionId }).then(Boolean)
  );

export default generateTransactionId;
