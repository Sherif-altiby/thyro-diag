import * as doctorService from '../services/doctor.service.js'


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const doctor = await doctorService.registerDoctor(req.body);
    const { doctor: d, token } = await doctorService.loginDoctor({
      email: req.body.email,
      password: req.body.password,
    });

    res.cookie('token', token, cookieOptions);
    res.status(201).json({ success: true, token, data: { doctor: d } });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { doctor, token } = await doctorService.loginDoctor(req.body);

    res.cookie('token', token, cookieOptions);
    res.status(200).json({ success: true, token, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.doctor.id);
    res.status(200).json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};