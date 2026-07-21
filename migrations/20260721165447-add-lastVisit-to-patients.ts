import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db
      .collection("patients")
      .updateMany({ lastVisit: { $exists: false } }, { $set: { lastVisit: null } });
  },

  async down(db: Db): Promise<void> {
    await db.collection("patients").updateMany({}, { $unset: { lastVisit: "" } });
  },
};
