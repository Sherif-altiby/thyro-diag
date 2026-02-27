import { Router } from 'express';
import { body }   from 'express-validator';
import { getPatients, createPatient } from '../controllers/patient.controller.js';
import { protect, validate }          from '../middlewares/error.middleware.js';
import symptomRoutes                  from './symptom.route.js';
import labResultRoutes                from './labResult.route.js';

const router = Router();

const createPatientRules = [
  body('fullName').trim().notEmpty().withMessage('اسم المريض مطلوب')
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),
  body('age').isInt({ min: 0, max: 130 }).withMessage('العمر غير صحيح'),
  body('gender').isIn(['male', 'female']).withMessage('الجنس مطلوب'),
  body('phone').optional().isMobilePhone().withMessage('رقم الهاتف غير صحيح'),
  body('email').optional().isEmail().withMessage('البريد الإلكتروني غير صحيح'),
];

router.use(protect);

router.get('/',  getPatients);
router.post('/', validate(createPatientRules), createPatient);


router.use('/:patientId/symptoms',    symptomRoutes);
router.use('/:patientId/lab-results', labResultRoutes);

export default router;