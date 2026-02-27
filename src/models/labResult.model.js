import mongoose from 'mongoose';

/**
 * LabResult Model
 * Source screens:
 *   - Screen 6:  إضافة تحليل جديد → TSH (mIU/L), Free T4 (pmol/L), Free T3 (pmol/L), testDate, notes, imageUrl
 *   - Screen 7:  Patient Profile   → trend chart (T3, T4 Free, TSH over months)
 *   - Screen 3:  Diagnosis Details → Total T3, Free T4, TSH with status badges
 *
 * ATA 2024 Reference Ranges:
 *   TSH:      0.4 – 4.0  mIU/L
 *   Free T4:  0.8 – 1.8  ng/dL
 *   Free T3:  2.3 – 4.2  pg/mL
 *   Total T3: 80  – 200  ng/dL
 */
const hormoneField = (defaultUnit) => ({
  value:  { type: Number, default: null },
  unit:   { type: String, default: defaultUnit },
  status: { type: String, enum: ['low', 'normal', 'high', null], default: null },
});

const labResultSchema = new mongoose.Schema(
  {
    patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },

    tsh:      hormoneField('mIU/L'),   // هرمون TSH
    freeT4:   hormoneField('pmol/L'),  // T4 الحر (Free T4)
    freeT3:   hormoneField('pmol/L'),  // T3 الحر (Free T3)
    totalT3:  hormoneField('ng/dL'),   // Total T3

    testDate: { type: Date, required: true }, // تاريخ الفحص
    imageUrl: { type: String, default: null }, // رفع صورة التحليل
    notes:    { type: String, default: null }, // ملاحظات إضافية
    deletedAt:{ type: Date, default: null },
  },
  { timestamps: true }
);

// Auto-compute status labels before saving
labResultSchema.pre('save', function () {
  const calc = (val, lo, hi) => val == null ? null : val < lo ? 'low' : val > hi ? 'high' : 'normal';
  this.tsh.status     = calc(this.tsh.value,     0.4,  4.0);
  this.freeT4.status  = calc(this.freeT4.value,  0.8,  1.8);
  this.freeT3.status  = calc(this.freeT3.value,  2.3,  4.2);
  this.totalT3.status = calc(this.totalT3.value, 80,   200);
});

// Index for trend chart queries (sorted by date per patient)
labResultSchema.index({ patient: 1, testDate: -1 });

const LabResult = mongoose.model('LabResult', labResultSchema);
export default LabResult;
