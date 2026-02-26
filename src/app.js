
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/doctor.route.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);


// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `المسار ${req.originalUrl} غير موجود` });
});


// Global error handler
app.use(errorHandler);


export default app;