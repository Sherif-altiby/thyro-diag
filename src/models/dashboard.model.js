import mongoose from 'mongoose';

/**
 * DashboardStats Model
 * Source screen: Screen 10 — الرئيسية (Home / Dashboard)
 *
 * Shows aggregated stats for the doctor:
 *   - إجمالي المرضى       → totalPatients:    1,٥٠
 *   - تشخيصات في الانتظار → pendingDiagnoses: ١٥
 *   - مواعيد مع مرضى      → upcomingAppts:    ٤٠+
 *
 * This model caches pre-computed stats to avoid heavy aggregation on every dashboard load.
 * It is recalculated whenever patients, diagnoses, or appointments change.
 */
const dashboardStatsSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, unique: true },

    totalPatients:     { type: Number, default: 0 }, // إجمالي المرضى
    pendingDiagnoses:  { type: Number, default: 0 }, // تشخيصات في الانتظار (status: 'draft')
    upcomingAppointments: { type: Number, default: 0 }, // مواعيد قادمة (status: 'scheduled')

    lastCalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DashboardStats = mongoose.model('DashboardStats', dashboardStatsSchema);
export default DashboardStats;
