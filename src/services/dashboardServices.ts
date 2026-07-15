import OpdSlipModel from "@src/models/opdSlipModel";
import AppointmentModel from "@src/models/appointmentModel";
import { getBillingStatsService } from "@src/services/billingServices";
import getTodayRange from "@src/utils/dashboardUtils";

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
  return {};
};

//FUNCTION
const getRecentPatientsService = async () => {
  return {};
};

//FUNCTION
const getRecentOpdSlipsService = async () => {
  return {};
};

//FUNCTION
const getDoctorAvailabilityTodayService = async () => {
  return {};
};

export {
  getDashboardStatsService,
  getRevenueLastSevenDaysService,
  getRecentPatientsService,
  getRecentOpdSlipsService,
  getDoctorAvailabilityTodayService,
};
