import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    await db
      .collection("patients")
      .updateMany({ fatherName: { $exists: true } }, { $rename: { fatherName: "guardianName" } });

    await db
      .collection("patients")
      .updateMany(
        { registrationDate: { $exists: false } },
        [{ $set: { registrationDate: "$createdAt" } }]
      );
  },

  async down(db: Db): Promise<void> {
    await db
      .collection("patients")
      .updateMany({ guardianName: { $exists: true } }, { $rename: { guardianName: "fatherName" } });

    await db.collection("patients").updateMany({}, { $unset: { registrationDate: "" } });
  },
};
