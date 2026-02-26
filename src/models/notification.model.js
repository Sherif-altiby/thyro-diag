import mongoose from 'mongoose';

/**
 * Notification Model
 * Source screens:
 *   - Screen 9:  Bell icon with red badge on Patient List
 *   - Screen 10: "آخر النشاطات" (Recent Activities) section on Dashboard
 *
 * Activity feed examples from screen 10:
 *   - "تم إضافة تقرير لتشخيص الغدة الدرقية العلوي"  (type: diagnosis)
 *   - "تم تحديث بيانات مريض مصاب بالغدة الدرقية"    (type: patient_update)
 */
const notificationSchema = new mongoose.Schema(
  {
    doctor:         { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true, index: true },
    relatedPatient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },

    title:  { type: String, required: true, trim: true },
    body:   { type: String, default: null },

    type: {
      type: String,
      enum: ['lab_result', 'appointment', 'diagnosis', 'patient_update', 'system', 'general'],
      default: 'general',
    },

    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ doctor: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
