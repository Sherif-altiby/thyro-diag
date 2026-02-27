import * as labResultService from '../services/labResult.service.js';

// POST /api/patients/:patientId/lab-results
export const createLabResult = async (req, res, next) => {
  try {
    console.log('req.body →', req.body);      // 👈 check terminal
    console.log('patientId →', req.params.patientId); // 👈 check terminal

    const labResult = await labResultService.createLabResult(
      req.doctor._id,
      req.params.patientId,
      req.body        
    );

    res.status(201).json({
      success: true,
      message: 'تم حفظ نتائج التحليل بنجاح',
      data: { labResult },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:patientId/lab-results
export const getLabResults = async (req, res, next) => {
  try {
    const labResults = await labResultService.getLabResultsByPatient(
      req.doctor._id,
      req.params.patientId,
    );

    res.status(200).json({
      success: true,
      count: labResults.length,
      data: { labResults },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:patientId/lab-results/:labId
export const getLabResultById = async (req, res, next) => {
  try {
    const labResult = await labResultService.getLabResultById(
      req.doctor._id,
      req.params.patientId,
      req.params.labId,
    );

    res.status(200).json({
      success: true,
      data: { labResult },
    });
  } catch (err) {
    next(err);
  }
};