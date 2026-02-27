import { Router } from 'express';
import { body }   from 'express-validator';
import { createLabResult, getLabResults, getLabResultById } from '../controllers/labResult.controller.js';
import { protect, validate } from '../middlewares/error.middleware.js';

const router = Router({ mergeParams: true }); // access :patientId

const labResultRules = [
  body('tsh')
    .optional()
    .isFloat({ min: 0 }).withMessage('قيمة TSH يجب أن تكون رقماً موجباً'),

  body('freeT4')
    .optional()
    .isFloat({ min: 0 }).withMessage('قيمة Free T4 يجب أن تكون رقماً موجباً'),

  body('freeT3')
    .optional()
    .isFloat({ min: 0 }).withMessage('قيمة Free T3 يجب أن تكون رقماً موجباً'),

  body('testDate')
  .optional(),

  body('notes')
    .optional()
    .trim(),

  body('imageUrl')
    .optional()
    .isURL().withMessage('رابط الصورة غير صحيح'),
];

router.use(protect);

router.get('/',        getLabResults);
router.get('/:labId',  getLabResultById);
router.post('/', validate(labResultRules), createLabResult);

export default router;