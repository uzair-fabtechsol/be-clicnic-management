// Today's calendar-day boundaries in server-local time: 00:00:00.000 to 23:59:59.999.
const getTodayRange = (): { start: Date; end: Date } => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export default getTodayRange;
