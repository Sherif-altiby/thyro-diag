import mongoose from 'mongoose';

/**
 * Patient Model
 * Source screens:
 *   - Screen 8:  إضافة مريض جديد (Add New Patient) → fullName, age, gender, phone, email, clinicalHistory
 *   - Screen 5:  تعديل بيانات المريض (Edit Patient)  → fullName, age, gender, clinicalHistory
 *   - Screen 7:  Patient Profile                     → bloodType, conditionStatus, photo
 *   - Screen 9:  Patient List                        → conditionStatus filter chips
 */
const patientSchema = new mongoose.Schema(
  {
    doctor:     { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },

    // ── Identity ────────────────────────────────────────────────────────────
    fileNumber: { type: String, required: true, unique: true, trim: true }, // e.g. #12345
    fullName:   { type: String, required: true, trim: true },
    age:        { type: Number, required: true, min: 0, max: 130 },
    gender:     { type: String, enum: ['male', 'female'], required: true },  // ذكر / أنثى
    bloodType:  { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null], default: null },

    // ── Contact (from screen 8) ─────────────────────────────────────────────
    phone:      { type: String, trim: true, default: null },  // رقم الهاتف
    email:      { type: String, lowercase: true, trim: true, default: null }, // البريد الإلكتروني

    // ── Medical ──────────────────────────────────────────────────────────────
    clinicalHistory: { type: String, default: null }, // التاريخ الطبي المختصر

    // Drives filter chips on Patient List screen (9): الكل / قصور الغدة / فرط نشاط الغدة / طبيعي
    conditionStatus: {
      type: String,
      enum: ['normal', 'hypothyroidism', 'hyperthyroidism', 'unknown'],
      default: 'unknown',
      index: true,
    },

    photoUrl:  { type: String, default: null },
    deletedAt: { type: Date, default: null }, // soft delete
  },
  { timestamps: true }
);

// Auto-exclude soft-deleted patients
patientSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) this.where({ deletedAt: null });
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
