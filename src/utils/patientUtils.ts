import type { ClientSession } from "mongoose";
import PatientModel from "../models/patientModel";
import AppError from "./appError";
import { MR_NUMBER_SEQUENCE_DIGITS } from "../constants/patientConstants";

const MAX_RANDOM = 10 ** MR_NUMBER_SEQUENCE_DIGITS;
const MAX_ATTEMPTS = 20;

const generateMrNumber = async (
  date: Date = new Date(),
  session?: ClientSession
): Promise<string> => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const prefix = `MR-${year}${month}`;

  let mrNumber: string;
  let exists: boolean;
  let attempts = 0;

  do {
    if (attempts >= MAX_ATTEMPTS) {
      throw new AppError(
        400,
        `Unable to generate a unique MR number for ${prefix}, please try again`,
      );
    }

    const randomSequence = Math.floor(Math.random() * MAX_RANDOM)
      .toString()
      .padStart(MR_NUMBER_SEQUENCE_DIGITS, "0");
    mrNumber = `${prefix}${randomSequence}`;
    exists = await PatientModel.exists({ mrNumber })
      .session(session ?? null)
      .then(Boolean);
    attempts += 1;
  } while (exists);

  return mrNumber;
};

export default generateMrNumber;
