import SymptomRecord from '../models/symptomRecord.model.js';
import Patient       from '../models/patient.model.js';

export const createSymptomRecord = async (doctorId, patientId, body) => {

  // Make sure patient belongs to this doctor
  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    const err = new Error('The patient not exist');
    err.status = 404;
    throw err;
  }

  const {
    // General symptoms
    fatigue,
    weightChange,
    coldHeatIntolerance,

    // Physical signs
    hairLoss,
    drySkin,
    neckSwelling,

    // Neurological sliders
    anxiety,
    moodSwings,
    concentrationDifficulty,

    additionalNotes,
  } = body;

  const symptomRecord = await SymptomRecord.create({
    patient: patientId,
    generalSymptoms: {
      fatigue:             fatigue             || 'none',
      weightChange:        weightChange        || 'none',
      coldHeatIntolerance: coldHeatIntolerance || 'none',
    },
    physicalSigns: {
      hairLoss:     hairLoss     || false,
      drySkin:      drySkin      || false,
      neckSwelling: neckSwelling || false,
    },
    neurologicalSymptoms: {
      anxiety:                 anxiety                 || 0,
      moodSwings:              moodSwings              || 0,
      concentrationDifficulty: concentrationDifficulty || 0,
    },
    additionalNotes: additionalNotes || null,
    recordedAt: new Date(),
  });

  return symptomRecord;
};

export const getSymptomsByPatient = async (doctorId, patientId) => {

  // Make sure patient belongs to this doctor
  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    const err = new Error('The patient not exist');
    err.status = 404;
    throw err;
  }

  const symptoms = await SymptomRecord.find({ patient: patientId })
    .sort({ recordedAt: -1 });

  return symptoms;
};