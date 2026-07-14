import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db.collection("doctors").updateMany({}, { $unset: { __v: "" } });
  },

  async down(db: Db): Promise<void> {
    await db.collection("doctors").updateMany({}, { $set: { __v: 0 } });
  },
};
