import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Doctor from "../models/doctor.model.js"

export const registerDoctor = async ({ fullName, email, password }) => {
  const existing = await Doctor.findOne({ email });
  if (existing) {
    const error = new Error('البريد الإلكتروني مسجل مسبقاً');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const doctor = await Doctor.create({ fullName, email, passwordHash });
  return doctor;
};

export const loginDoctor = async ({ email, password }) => {
  const doctor = await Doctor.findOne({ email }).select('+passwordHash');
  if (!doctor) {
    const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, doctor.passwordHash);
  if (!isMatch) {
    const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  doctor.passwordHash = undefined;
  return { doctor, token };
};

export const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    const error = new Error('الحساب غير موجود');
    error.status = 404;
    throw error;
  }
  return doctor;
};