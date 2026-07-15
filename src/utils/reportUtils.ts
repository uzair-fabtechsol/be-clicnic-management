// Normalizes an optional from/to range to start-of-day / end-of-day boundaries.
// When either bound is missing, defaults to a trailing 1-month window ending today.
const resolveDateRange = (from?: Date, to?: Date): { from: Date; to: Date } => {
  const resolvedTo = to ? new Date(to) : new Date();

  const resolvedFrom = from
    ? new Date(from)
    : (() => {
        const date = new Date(resolvedTo);
        date.setMonth(date.getMonth() - 1);
        return date;
      })();

  resolvedFrom.setHours(0, 0, 0, 0);
  resolvedTo.setHours(23, 59, 59, 999);

  return { from: resolvedFrom, to: resolvedTo };
};

export default resolveDateRange;
