import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db.collection("patients").updateMany({}, { $unset: { __v: "" } });
  },

  async down(db: Db): Promise<void> {
    await db.collection("patients").updateMany({}, { $set: { __v: 0 } });
  },
};
