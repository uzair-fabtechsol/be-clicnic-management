import crypto from "crypto";
import type { Db } from "mongodb";

const NUMBER_DIGITS = 8;

const generateUniqueOpdSlipNumber = async (db: Db): Promise<string> => {
  let opdSlipNumber: string;
  let exists: boolean;

  do {
    const randomDigits = crypto
      .randomInt(0, 10 ** NUMBER_DIGITS)
      .toString()
      .padStart(NUMBER_DIGITS, "0");
    opdSlipNumber = `OPD-${randomDigits}`;
    exists = (await db.collection("opdslips").findOne({ opdSlipNumber })) !== null;
  } while (exists);

  return opdSlipNumber;
};

module.exports = {
  async up(db: Db): Promise<void> {
    const opdSlips = await db
      .collection("opdslips")
      .find({ opdSlipNumber: { $exists: false } })
      .toArray();

    for (const opdSlip of opdSlips) {
      const opdSlipNumber = await generateUniqueOpdSlipNumber(db);
      await db
        .collection("opdslips")
        .updateOne({ _id: opdSlip._id }, { $set: { opdSlipNumber } });
    }
  },

  async down(db: Db): Promise<void> {
    await db.collection("opdslips").updateMany({}, { $unset: { opdSlipNumber: "" } });
  },
};
