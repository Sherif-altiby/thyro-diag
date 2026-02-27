import { Router } from 'express';
import { body }   from 'express-validator';
import { register, login, logout, getMe } from '../controllers/doctor.controller.js';
import { validate, protect }              from '../middlewares/error.middleware.js';

const router = Router();

const registerRules = [
  body('fullName').trim().notEmpty().withMessage('FullName is required')
    .isLength({ min: 3 }).withMessage('The name must be 3 letters at least'),
  body('email').trim().isEmail().withMessage('Email is incorrect').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/[A-Z]/).withMessage('يجب أن تحتوي على حرف كبير')
    .matches(/[0-9]/).withMessage('يجب أن تحتوي على رقم'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Email is incorrect').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Public
router.post('/register', validate(registerRules), register);
router.post('/login',    validate(loginRules),    login);
router.post('/logout',                            logout);

// Protected
router.get('/me', protect, getMe);

export default router;