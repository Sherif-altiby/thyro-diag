import * as patientService from '../services/patient.service.js';

// GET /api/patients
export const getPatients = async (req, res, next) => {
  try {
    const { search, condition, page, limit } = req.query;

    const data = await patientService.getAllPatients(req.doctor._id, {
      search,
      condition,
      page,
      limit,
    });

    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

// POST /api/patients
export const createPatient = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.doctor._id, req.body);
    res.status(201).json({
      success: true,
      message: 'تم إضافة المريض بنجاح',
      data: { patient },
    });
  } catch (err) {
    next(err);
  }
};