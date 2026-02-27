import mongoose from 'mongoose';

/**
 * Doctor Model
 * Source screens: Login (11), Register (11), Settings (1), Dashboard (10)
 */
const doctorSchema = new mongoose.Schema(
  {
    fullName:     { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    certifications: { type: String, default: null },  

    settings: {
      notificationsEnabled: { type: Boolean, default: true },  
      darkModeEnabled:      { type: Boolean, default: false },  
      language:             { type: String, enum: ['ar', 'en'], default: 'ar' }, 
      biometricEnabled:     { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
