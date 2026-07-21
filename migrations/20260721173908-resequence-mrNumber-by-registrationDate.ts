import type { Db } from "mongodb";

const MR_NUMBER_SEQUENCE_DIGITS = 4;
const MAX_SEQUENCE = 10 ** MR_NUMBER_SEQUENCE_DIGITS - 1;

interface PatientDoc {
  _id: unknown;
  mrNumber: string;
  registrationDate: Date;
}

module.exports = {
  async up(db: Db): Promise<void> {
    const patients = await db
      .collection<PatientDoc>("patients")
      .find({}, { projection: { mrNumber: 1, registrationDate: 1 } })
      .sort({ registrationDate: 1 })
      .toArray();

    const sequenceByPrefix = new Map<string, number>();
    const operations = [];

    for (const patient of patients) {
      const registrationDate = new Date(patient.registrationDate);
      const year = registrationDate.getFullYear().toString().slice(-2);
      const month = (registrationDate.getMonth() + 1).toString().padStart(2, "0");
      const prefix = `MR-${year}${month}`;

      const nextSequence = (sequenceByPrefix.get(prefix) ?? 0) + 1;
      sequenceByPrefix.set(prefix, nextSequence);

      if (nextSequence > MAX_SEQUENCE) {
        throw new Error(
          `Cannot resequence: ${prefix} exceeds monthly capacity of ${MAX_SEQUENCE} patients`
        );
      }

      const mrNumber = `${prefix}${nextSequence
        .toString()
        .padStart(MR_NUMBER_SEQUENCE_DIGITS, "0")}`;

      operations.push({
        updateOne: {
          filter: { _id: patient._id },
          update: { $set: { mrNumber } },
        },
      });
    }

    if (operations.length > 0) {
      await db.collection("patients").bulkWrite(operations);
    }
  },

  async down(): Promise<void> {
    // Irreversible: the original randomly generated mrNumber values are not
    // recoverable once overwritten by this migration.
    throw new Error(
      "This migration cannot be reverted: original mrNumber values were not preserved."
    );
  },
};
