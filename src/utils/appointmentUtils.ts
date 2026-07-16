import type { DAYS } from "../constants/doctorConstants";
import type { DoctorType } from "../models/doctorModel";
import AppointmentModel from "../models/appointmentModel";
import generateUniqueNumber from "./generateUniqueNumber";
import { APPOINTMENT_NUMBER_DIGITS } from "../constants/appointmentConstants";

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

const generateAppointmentNumber = (): Promise<string> =>
  generateUniqueNumber(
    "APT",
    APPOINTMENT_NUMBER_DIGITS,
    (appointmentNumber) =>
      AppointmentModel.exists({ appointmentNumber }).then(Boolean)
  );

export { getDayName, isDoctorAvailableAtSlot, generateAppointmentNumber };
