import * as symptomService from '../services/symptom.service.js';

// POST /api/patients/:patientId/symptoms
export const createSymptom = async (req, res, next) => {
  try {
    const symptomRecord = await symptomService.createSymptomRecord(
      req.doctor._id,
      req.params.patientId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'All Symptoms are saved Successfully',
      data: { symptomRecord },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:patientId/symptoms
export const getSymptoms = async (req, res, next) => {
  try {
    const symptoms = await symptomService.getSymptomsByPatient(
      req.doctor._id,
      req.params.patientId,
    );

    res.status(200).json({
      success: true,
      count: symptoms.length,
      data: { symptoms },
    });
  } catch (err) {
    next(err);
  }
};