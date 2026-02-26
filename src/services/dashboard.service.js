import Patient      from '../models/patient.model.js';
import Diagnosis    from '../models/diagnosis.model.js';
import Appointment  from '../models/appointment.model.js';
import Notification from '../models/notification.model.js';

export const getDashboardData = async (doctorId) => {

  // Run all queries in parallel for performance
  const [
    totalPatients,
    pendingDiagnoses,
    upcomingAppointmentsCount,
    upcomingAppointments,
    recentActivities,
  ] = await Promise.all([

    // ── إجمالي المرضى ──────────────────────────────────────────────────────
    Patient.countDocuments({ doctor: doctorId }),

    // ── تشخيصات في الانتظار ────────────────────────────────────────────────
    Diagnosis.countDocuments({ 
      patient: { $in: await Patient.find({ doctor: doctorId }).distinct('_id') },
      status: 'draft' 
    }),

    // ── مواعيد مع مرضى ────────────────────────────────────────────────────
    Appointment.countDocuments({
      doctor: doctorId,
      status: 'scheduled',
      appointmentDate: { $gte: new Date() },
    }),

    // ── المواعيد القادمة (list) ────────────────────────────────────────────
    Appointment.find({
      doctor: doctorId,
      status: 'scheduled',
      appointmentDate: { $gte: new Date() },
    })
      .sort({ appointmentDate: 1 })
      .limit(5)
      .populate('patient', 'fullName photoUrl conditionStatus'),

    // ── آخر النشاطات ──────────────────────────────────────────────────────
    Notification.find({ doctor: doctorId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('relatedPatient', 'fullName photoUrl'),
  ]);

  return {
    stats: {
      totalPatients,
      pendingDiagnoses,
      upcomingAppointmentsCount,
    },
    upcomingAppointments,
    recentActivities,
  };
};