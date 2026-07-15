import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db.collection("billings").updateMany(
      { refundMethod: { $exists: false } },
      { $set: { refundMethod: null, refundReason: null } }
    );
  },

  async down(db: Db): Promise<void> {
    await db
      .collection("billings")
      .updateMany({}, { $unset: { refundMethod: "", refundReason: "" } });
  },
};
