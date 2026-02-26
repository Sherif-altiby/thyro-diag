import { getDashboardData } from '../services/dashboard.service.js';

// GET /api/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardData(req.doctor._id);

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          fullName: req.doctor.fullName,
        },
        stats:                data.stats,
        upcomingAppointments: data.upcomingAppointments,
        recentActivities:     data.recentActivities,
      },
    });
  } catch (err) {
    next(err);
  }
};