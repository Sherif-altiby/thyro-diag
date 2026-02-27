import { Router } from 'express';
import { body }   from 'express-validator';
import { getPatients, createPatient } from '../controllers/patient.controller.js';
import { protect, validate }          from '../middlewares/error.middleware.js';

const router = Router();

const createPatientRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('الاسم الكامل مطلوب')
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),

  body('age')
    .notEmpty().withMessage('العمر مطلوب')
    .isInt({ min: 0, max: 130 }).withMessage('العمر يجب أن يكون رقماً صحيحاً'),

  body('gender')
    .notEmpty().withMessage('الجنس مطلوب')
    .isIn(['male', 'female']).withMessage('الجنس يجب أن يكون male أو female'),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('رقم الهاتف غير صحيح'),

  body('email')
    .optional()
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),

  body('clinicalHistory')
    .optional()
    .trim(),
];

router.use(protect);

router.get('/',  getPatients);
router.post('/', validate(createPatientRules), createPatient);

export default router;