import express      from 'express';
import cookieParser from 'cookie-parser';
import authRoutes      from './routes/doctor.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import patientRoutes   from './routes/patient.route.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients',  patientRoutes);

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `المسار ${req.originalUrl} غير موجود` });
});

// ── Error Handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;