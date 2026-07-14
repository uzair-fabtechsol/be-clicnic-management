import crypto from "crypto";
import PatientModel from "@src/models/patientModel";
import { MR_NUMBER_DIGITS } from "@src/constants/patientConstants";

const generateMrNumber = async (): Promise<string> => {
  let mrNumber: string;
  let exists: boolean;

  do {
    const randomDigits = crypto
      .randomInt(0, 10 ** MR_NUMBER_DIGITS)
      .toString()
      .padStart(MR_NUMBER_DIGITS, "0");
    mrNumber = `MR-${randomDigits}`;
    exists = await PatientModel.exists({ mrNumber }).then(Boolean);
  } while (exists);

  return mrNumber;
};

export default generateMrNumber;
