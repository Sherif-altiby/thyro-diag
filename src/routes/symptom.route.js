import { Router } from 'express';
import { body }   from 'express-validator';
import { createSymptom, getSymptoms } from '../controllers/symptom.controller.js';
import { protect, validate }          from '../middlewares/error.middleware.js';

const router = Router({ mergeParams: true }); // mergeParams to access :patientId

const SEVERITY = ['none', 'mild', 'moderate', 'severe'];

const symptomRules = [
  // General symptoms
  body('fatigue')
    .optional()
    .isIn(SEVERITY).withMessage('قيمة خمول غير صحيحة: none, mild, moderate, severe'),

  body('weightChange')
    .optional()
    .isIn(SEVERITY).withMessage('قيمة تغير الوزن غير صحيحة: none, mild, moderate, severe'),

  body('coldHeatIntolerance')
    .optional()
    .isIn(SEVERITY).withMessage('قيمة عدم تحمل البرد غير صحيحة: none, mild, moderate, severe'),

  // Physical signs
  body('hairLoss')
    .optional()
    .isBoolean().withMessage('تساقط الشعر يجب أن يكون true أو false'),

  body('drySkin')
    .optional()
    .isBoolean().withMessage('جفاف الجلد يجب أن يكون true أو false'),

  body('neckSwelling')
    .optional()
    .isBoolean().withMessage('تضخم الرقبة يجب أن يكون true أو false'),

  // Neurological sliders 0-100
  body('anxiety')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('قيمة القلق يجب أن تكون بين 0 و 100'),

  body('moodSwings')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('قيمة تقلبات المزاج يجب أن تكون بين 0 و 100'),

  body('concentrationDifficulty')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('قيمة صعوبة التركيز يجب أن تكون بين 0 و 100'),

  body('additionalNotes')
    .optional()
    .trim(),
];

router.use(protect);

router.get('/',  getSymptoms);
router.post('/', validate(symptomRules), createSymptom);

export default router;