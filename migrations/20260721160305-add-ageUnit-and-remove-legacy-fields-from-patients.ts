import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db
      .collection("patients")
      .updateMany({ ageUnit: { $exists: false } }, { $set: { ageUnit: "years" } });

    await db
      .collection("patients")
      .updateMany(
        {},
        { $unset: { dateOfBirth: "", bloodGroup: "", emergencyContact: "" } }
      );
  },

  async down(db: Db): Promise<void> {
    await db.collection("patients").updateMany({}, { $unset: { ageUnit: "" } });
  },
};
