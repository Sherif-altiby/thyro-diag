import mongoose from 'mongoose';

/**
 * SymptomRecord Model
 * Source screen: Screen 4 — تسجيل الأعراض (Register Symptoms)
 *
 * Three sections visible in UI:
 *   1. الأعراض العامة     — General Symptoms     (4-level severity buttons)
 *   2. العلامات الجسدية   — Physical Signs       (checkboxes)
 *   3. الأعراض العصبية    — Neurological Symptoms (0–100 sliders)
 */
const SEVERITY = ['none', 'mild', 'moderate', 'severe']; // لا يوجد / خفيف / متوسط / شديد

const symptomRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },

    // ── 1. General Symptoms ────────────────────────────────────────────────
    generalSymptoms: {
      fatigue:             { type: String, enum: SEVERITY, default: 'none' }, // خمول (Fatigue)
      weightChange:        { type: String, enum: SEVERITY, default: 'none' }, // تغير في الوزن
      coldHeatIntolerance: { type: String, enum: SEVERITY, default: 'none' }, // عدم تحمل البرد/الحرارة
    },

    // ── 2. Physical Signs (checkboxes) ────────────────────────────────────
    physicalSigns: {
      hairLoss:     { type: Boolean, default: false }, // تساقط الشعر (Hair loss)
      drySkin:      { type: Boolean, default: false }, // جفاف الجلد (Dry skin)
      neckSwelling: { type: Boolean, default: false }, // تضخم في الرقبة (Neck swelling)
    },

    // ── 3. Neurological / Mood Symptoms (0–100 sliders) ───────────────────
    neurologicalSymptoms: {
      anxiety:                 { type: Number, min: 0, max: 100, default: 0 }, // قلق
      moodSwings:              { type: Number, min: 0, max: 100, default: 0 }, // تقلبات المزاج
      concentrationDifficulty: { type: Number, min: 0, max: 100, default: 0 }, // صعوبة التركيز
    },

    additionalNotes: { type: String, default: null }, // ملاحظات إضافية
    recordedAt:      { type: Date, default: Date.now },
  },
  { timestamps: true }
);

symptomRecordSchema.index({ patient: 1, recordedAt: -1 });

const SymptomRecord = mongoose.model('SymptomRecord', symptomRecordSchema);
export default SymptomRecord;
