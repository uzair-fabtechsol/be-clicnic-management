import mongoose from "mongoose";
import OpdSlipModel from "@src/models/opdSlipModel";
import AppointmentModel from "@src/models/appointmentModel";
import BillingModel from "@src/models/billingModel";
import PatientModel from "@src/models/patientModel";
import DoctorModel, { type DoctorType } from "@src/models/doctorModel";
import { getBillingStatsService, joinBillingStages } from "@src/services/billingServices";
import getTodayRange from "@src/utils/dashboardUtils";
import { getDayName } from "@src/utils/appointmentUtils";
import { dateToTimeString } from "@src/utils/time";

const RECENT_PATIENTS_LIMIT = 5;
const RECENT_OPD_SLIPS_LIMIT = 5;
const RECENT_DOCTORS_LIMIT = 5;

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date): string =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

//FUNCTION
const getDashboardStatsService = async () => {
  const { start, end } = getTodayRange();

  const [visitTypeCounts, distinctPatientsToday, { totalRevenue }, pendingAppointments] =
    await Promise.all([
      OpdSlipModel.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: "$visitType", count: { $sum: 1 } } },
      ]),
      OpdSlipModel.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: "$patient" } },
        { $count: "count" },
      ]),
      getBillingStatsService(start, end),
      AppointmentModel.countDocuments({ status: "scheduled" }),
    ]);

  const counts = Object.fromEntries(
    visitTypeCounts.map((result: { _id: string; count: number }) => [
      result._id,
      result.count,
    ])
  );

  const newPatients = counts.new ?? 0;
  const returningPatients = counts.followUp ?? 0;

  return {
    totalPatientsToday: distinctPatientsToday[0]?.count ?? 0,
    newPatients,
    returningPatients,
    totalOpdSlips: newPatients + returningPatients,
    todaysRevenue: totalRevenue,
    pendingAppointments,
  };
};

//FUNCTION
const getRevenueLastSevenDaysService = async () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const rows: { createdAt: Date; amount: number }[] = await BillingModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        paymentStatus: "paid",
      },
    },
    ...(joinBillingStages as mongoose.PipelineStage[]),
    {
      $project: {
        _id: 0,
        createdAt: 1,
        amount: "$doctorDetails.consultationFee",
      },
    },
  ]);

  const dailyMap = new Map<string, number>();
  const days: Date[] = [];

  for (
    const cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    dailyMap.set(formatDateKey(cursor), 0);
    days.push(new Date(cursor));
  }

  for (const row of rows) {
    const key = formatDateKey(new Date(row.createdAt));
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + row.amount);
  }

  const revenueLastSevenDays = days.map((day) => ({
    date: formatDisplayDate(day),
    revenue: dailyMap.get(formatDateKey(day)) ?? 0,
  }));

  return { revenueLastSevenDays };
};

//FUNCTION
const getRecentPatientsService = async () => {
  const recentPatients = await PatientModel.find()
    .sort({ createdAt: -1 })
    .limit(RECENT_PATIENTS_LIMIT)
    .select("name mrNumber mobileNumber gender age createdAt");

  return { recentPatients };
};

//FUNCTION
const getRecentOpdSlipsService = async () => {
  const recentOpdSlips = await OpdSlipModel.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: RECENT_OPD_SLIPS_LIMIT },
    {
      $lookup: {
        from: "patients",
        localField: "patient",
        foreignField: "_id",
        as: "patientDetails",
      },
    },
    { $unwind: "$patientDetails" },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $project: {
        _id: 1,
        opdSlipNumber: 1,
        patient: "$patientDetails.name",
        doctor: "$doctorDetails.name",
        visitType: 1,
        paymentMethod: 1,
        createdAt: 1,
      },
    },
  ]);

  return { recentOpdSlips };
};

//FUNCTION
const getDoctorsAvailabilityTodayService = async () => {
  const recentDoctors = await DoctorModel.find()
    .sort({ createdAt: -1 })
    .limit(RECENT_DOCTORS_LIMIT)
    .select("name specialization slots");

  const todayName = getDayName(new Date());

  const doctors = recentDoctors.map((doctor) => {
    const todaySlots = doctor.slots
      .filter((slot: DoctorType["slots"][number]) => slot.day === todayName)
      .map((slot: DoctorType["slots"][number]) => ({
        from: dateToTimeString(slot.from),
        to: dateToTimeString(slot.to),
      }));

    return {
      name: doctor.name,
      specialization: doctor.specialization,
      availableToday: todaySlots.length > 0,
      slots: todaySlots,
    };
  });

  return { doctors };
};

export {
  getDashboardStatsService,
  getRevenueLastSevenDaysService,
  getRecentPatientsService,
  getRecentOpdSlipsService,
  getDoctorsAvailabilityTodayService,
};
