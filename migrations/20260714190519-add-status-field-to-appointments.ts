import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db
      .collection("appointments")
      .updateMany(
        { status: { $exists: false } },
        { $set: { status: "scheduled" } }
      );
  },

  async down(db: Db): Promise<void> {
    await db.collection("appointments").updateMany({}, { $unset: { status: "" } });
  },
};
