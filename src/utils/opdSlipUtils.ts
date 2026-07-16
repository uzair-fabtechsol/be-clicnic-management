import OpdSlipModel from "../models/opdSlipModel";
import generateUniqueNumber from "./generateUniqueNumber";
import { OPD_SLIP_NUMBER_DIGITS } from "../constants/opdSlipConstants";

const generateOpdSlipNumber = (): Promise<string> =>
  generateUniqueNumber("OPD", OPD_SLIP_NUMBER_DIGITS, (opdSlipNumber) =>
    OpdSlipModel.exists({ opdSlipNumber }).then(Boolean)
  );

export default generateOpdSlipNumber;
