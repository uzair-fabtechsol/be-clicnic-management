import crypto from "crypto";
import type { Db } from "mongodb";

const NUMBER_DIGITS = 8;

const generateUniqueAppointmentNumber = async (db: Db): Promise<string> => {
  let appointmentNumber: string;
  let exists: boolean;

  do {
    const randomDigits = crypto
      .randomInt(0, 10 ** NUMBER_DIGITS)
      .toString()
      .padStart(NUMBER_DIGITS, "0");
    appointmentNumber = `APT-${randomDigits}`;
    exists =
      (await db.collection("appointments").findOne({ appointmentNumber })) !==
      null;
  } while (exists);

  return appointmentNumber;
};

module.exports = {
  async up(db: Db): Promise<void> {
    const appointments = await db
      .collection("appointments")
      .find({ appointmentNumber: { $exists: false } })
      .toArray();

    for (const appointment of appointments) {
      const appointmentNumber = await generateUniqueAppointmentNumber(db);
      await db
        .collection("appointments")
        .updateOne({ _id: appointment._id }, { $set: { appointmentNumber } });
    }
  },

  async down(db: Db): Promise<void> {
    await db
      .collection("appointments")
      .updateMany({}, { $unset: { appointmentNumber: "" } });
  },
};
