import mongoose from 'mongoose';

/**
 * Appointment Model
 * Source screen: Screen 10 — Dashboard "المواعيد القادمة" (Upcoming Appointments)
 *
 * Dashboard shows: patient name, appointment type (قادم / مراجعة), date
 */
const appointmentSchema = new mongoose.Schema(
  {
    doctor:  { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true, index: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },

    appointmentDate: { type: Date,   required: true },
    notes:           { type: String, default: null },

    // قادم = new appointment / مراجعة = follow-up review
    type:   { type: String, enum: ['new', 'followup'], default: 'new' },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled', index: true },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, appointmentDate: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
