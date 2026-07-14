const TIME_REFERENCE_DATE = "1970-01-01";

const timeStringToDate = (time: string): Date =>
  new Date(`${TIME_REFERENCE_DATE}T${time}:00.000Z`);

const dateToTimeString = (date: Date): string => date.toISOString().slice(11, 16);

export { timeStringToDate, dateToTimeString };
