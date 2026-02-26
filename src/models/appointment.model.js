import mongoose from 'mongoose';

/**
 * Diagnosis Model
 * Source screens:
 *   - Screen 2:  نموذج التشخيص (Diagnosis Form)    → clinicalTags, proposedDiagnosis, confidenceScore, scanImage
 *   - Screen 3:  تفاصيل التشخيص (Diagnosis Details) → finalDiagnosis, confidenceScore, clinicalAnalysis, recommendations
 *   - Screen 7:  Patient Profile                    → سجل التشخيصات (diagnosis history list)
 *
 * Flow:
 *   Doctor fills symptoms + lab results
 *   → AI returns: proposedDiagnosis + confidenceScore + clinicalAnalysis + recommendations  (status: 'draft')
 *   → Doctor reviews and presses "تأكيد التشخيص وحفظه"                                     (status: 'confirmed')
 *   → PDF report can be downloaded or shared via WhatsApp
 */
const recommendationSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: null },
  order:       { type: Number, default: 0 },
});

const diagnosisSchema = new mongoose.Schema(
  {
    patient:       { type: mongoose.Schema.Types.ObjectId, ref: 'Patient',       required: true, index: true },
    labResult:     { type: mongoose.Schema.Types.ObjectId, ref: 'LabResult',     default: null },
    symptomRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'SymptomRecord', default: null },

    // ── AI Output ──────────────────────────────────────────────────────────
    proposedDiagnosis: { type: String, default: null },                   // AI-suggested text
    finalDiagnosis:    { type: String, required: true, trim: true },      // Doctor-confirmed
    confidenceScore:   { type: Number, min: 0, max: 100, default: null }, // e.g. 92 → "92%"

    clinicalAnalysis: { type: String, default: null }, // التحليل السريري (AI explanation)
    treatmentNotes:   { type: String, default: null }, // ملاحظات العلاج وخطة المتابعة

    // Clinical symptom tags shown in diagnosis form (screen 2)
    // e.g. ['إجهاد مستمر', 'زيادة غير مبررة في الوزن', 'حساسية مفرطة للبرد', 'تساقط شعر خفيف']
    clinicalTags: { type: [String], default: [] },

    // Embedded next-step recommendations (الخطوات التالية الموصى بها)
    recommendations: { type: [recommendationSchema], default: [] },

    scanImageUrl: { type: String, default: null }, // مخطط المسح الضوئي الأخير (CT/ultrasound)

    // 'draft'     = AI proposed, not yet confirmed
    // 'confirmed' = Doctor pressed "تأكيد التشخيص وحفظه"
    status: { type: String, enum: ['draft', 'confirmed'], default: 'draft', index: true },

    diagnosedAt: { type: Date, default: Date.now },
    deletedAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

diagnosisSchema.index({ patient: 1, diagnosedAt: -1 });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);
export default Diagnosis;
