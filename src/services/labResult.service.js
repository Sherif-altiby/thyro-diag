import LabResult from '../models/labResult.model.js';
import Patient   from '../models/patient.model.js';

export const createLabResult = async (doctorId, patientId, body) => {

  // Debug — check what's coming in
  console.log('doctorId:', doctorId);
  console.log('patientId:', patientId);
  console.log('body:', body);

  // Safety check
  if (!body || typeof body !== 'object') {
    const err = new Error('البيانات مفقودة');
    err.status = 400;
    throw err;
  }

  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const tsh      = body.tsh      ?? null;
  const freeT4   = body.freeT4   ?? null;
  const freeT3   = body.freeT3   ?? null;
  const testDate = body.testDate  || null;
  const notes    = body.notes     || null;
  const imageUrl = body.imageUrl  || null;

  if (!testDate) {
    const err = new Error('تاريخ الفحص مطلوب');
    err.status = 422;
    throw err;
  }

  const labResult = await LabResult.create({
    patient: patientId,
    tsh:     { value: tsh,    unit: 'mIU/L'  },
    freeT4:  { value: freeT4, unit: 'pmol/L' },
    freeT3:  { value: freeT3, unit: 'pmol/L' },
    testDate: new Date(testDate),
    notes,
    imageUrl,
  });

  return labResult;
};

export const getLabResultsByPatient = async (doctorId, patientId) => {

  // Make sure patient belongs to this doctor
  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const labResults = await LabResult.find({ patient: patientId })
    .sort({ testDate: -1 });

  return labResults;
};

export const getLabResultById = async (doctorId, patientId, labId) => {

  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const labResult = await LabResult.findOne({ _id: labId, patient: patientId });
  if (!labResult) {
    const err = new Error('نتيجة التحليل غير موجودة');
    err.status = 404;
    throw err;
  }

  return labResult;
};