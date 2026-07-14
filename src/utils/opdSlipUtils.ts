import OpdSlipModel from "@src/models/opdSlipModel";
import generateUniqueNumber from "@src/utils/generateUniqueNumber";
import { OPD_SLIP_NUMBER_DIGITS } from "@src/constants/opdSlipConstants";

const generateOpdSlipNumber = (): Promise<string> =>
  generateUniqueNumber("OPD", OPD_SLIP_NUMBER_DIGITS, (opdSlipNumber) =>
    OpdSlipModel.exists({ opdSlipNumber }).then(Boolean)
  );

export default generateOpdSlipNumber;
