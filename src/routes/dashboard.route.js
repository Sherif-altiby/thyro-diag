import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/error.middleware.js';

const router = Router();

// GET /api/dashboard
router.get('/', protect, getDashboard);

export default router;