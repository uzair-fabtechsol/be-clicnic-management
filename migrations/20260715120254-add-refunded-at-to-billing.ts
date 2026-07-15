import type { Db } from "mongodb";

module.exports = {
  async up(db: Db): Promise<void> {
    // Backfill refundedAt: for already-refunded billings, best-effort use their
    // updatedAt (the moment the refund mutation was saved); everyone else gets null.
    await db.collection("billings").updateMany(
      { refundedAt: { $exists: false } },
      [
        {
          $set: {
            refundedAt: {
              $cond: [{ $eq: ["$paymentStatus", "refund"] }, "$updatedAt", null],
            },
          },
        },
      ]
    );
  },

  async down(db: Db): Promise<void> {
    await db.collection("billings").updateMany({}, { $unset: { refundedAt: "" } });
  },
};
