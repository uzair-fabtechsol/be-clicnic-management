import type { DAYS } from "@src/constants/doctorConstants";
import type { DoctorType } from "@src/models/doctorModel";

const WEEKDAYS_BY_INDEX = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const getDayName = (date: Date): (typeof DAYS)[number] =>
  WEEKDAYS_BY_INDEX[date.getUTCDay()] as (typeof DAYS)[number];

const isDoctorAvailableAtSlot = (
  slots: DoctorType["slots"],
  date: Date,
  time: Date
): boolean => {
  const dayName = getDayName(date);

  return slots.some(
    (slot) =>
      slot.day === dayName &&
      time.getTime() >= slot.from.getTime() &&
      time.getTime() <= slot.to.getTime()
  );
};

export { getDayName, isDoctorAvailableAtSlot };
