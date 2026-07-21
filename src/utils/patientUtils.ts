import PatientModel from "../models/patientModel";
import AppError from "./appError";
import { MR_NUMBER_SEQUENCE_DIGITS } from "../constants/patientConstants";

const MAX_SEQUENCE = 10 ** MR_NUMBER_SEQUENCE_DIGITS - 1;

const generateMrNumber = async (date: Date = new Date()): Promise<string> => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const prefix = `MR-${year}${month}`;

  const lastPatient = await PatientModel.findOne({
    mrNumber: { $regex: `^${prefix}\\d{${MR_NUMBER_SEQUENCE_DIGITS}}$` },
  })
    .sort({ mrNumber: -1 })
    .select("mrNumber")
    .lean();

  let sequence = lastPatient
    ? parseInt(lastPatient.mrNumber.slice(prefix.length), 10) + 1
    : 1;

  let mrNumber: string;
  let exists: boolean;

  do {
    if (sequence > MAX_SEQUENCE) {
      throw new AppError(
        400,
        `Monthly patient registration limit (${MAX_SEQUENCE}) reached for ${prefix}`,
      );
    }

    mrNumber = `${prefix}${sequence.toString().padStart(MR_NUMBER_SEQUENCE_DIGITS, "0")}`;
    exists = await PatientModel.exists({ mrNumber }).then(Boolean);
    sequence += 1;
  } while (exists);

  return mrNumber;
};

export default generateMrNumber;
