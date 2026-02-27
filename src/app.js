
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/doctor.route.js';
import { errorHandler } from './middlewares/error.middleware.js';
import dashboardRoutes from "./routes/dashboard.route.js"
import patientRoutes from './routes/patient.route.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes);


app.use('/', (req, res) => {
    res.json({
        message: "That is base URL"
    });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `المسار ${req.originalUrl} غير موجود` });
});


// Global error handler
app.use(errorHandler);


export default app;