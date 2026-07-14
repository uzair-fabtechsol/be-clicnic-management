import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db
      .collection("users")
      .updateMany({ active: { $exists: false } }, { $set: { active: true } });
  },

  async down(db: Db): Promise<void> {
    await db.collection("users").updateMany({}, { $unset: { active: "" } });
  },
};
