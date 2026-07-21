import crypto from "crypto";
import PatientModel from "../models/patientModel";
import { MR_NUMBER_RANDOM_DIGITS } from "../constants/patientConstants";

const generateMrNumber = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  let mrNumber: string;
  let exists: boolean;

  do {
    const randomDigits = crypto
      .randomInt(0, 10 ** MR_NUMBER_RANDOM_DIGITS)
      .toString()
      .padStart(MR_NUMBER_RANDOM_DIGITS, "0");
    mrNumber = `MR-${year}${month}${randomDigits}`;
    exists = await PatientModel.exists({ mrNumber }).then(Boolean);
  } while (exists);

  return mrNumber;
};

export default generateMrNumber;
