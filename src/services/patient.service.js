import Patient   from '../models/patient.model.js';
import LabResult from '../models/labResult.model.js';

export const getAllPatients = async (doctorId, { search, condition, page, limit }) => {

  // ── Build filter ───────────────────────────────────────────────────────
  const filter = { doctor: doctorId };

  // Filter chips: الكل / قصور الغدة / فرط نشاط الغدة / طبيعي
  if (condition && condition !== 'all') {
    filter.conditionStatus = condition;
  }

  // Search by name
  if (search) {
    filter.fullName = { $regex: search, $options: 'i' };
  }

  // ── Pagination ─────────────────────────────────────────────────────────
  const pageNum  = parseInt(page)  || 1;
  const limitNum = parseInt(limit) || 10;
  const skip     = (pageNum - 1) * limitNum;

  // ── Fetch patients ─────────────────────────────────────────────────────
  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('fullName conditionStatus photoUrl updatedAt'),

    Patient.countDocuments(filter),
  ]);

  // ── Attach latest TSH value to each patient ────────────────────────────
  const patientsWithTSH = await Promise.all(
    patients.map(async (patient) => {
      const latestLab = await LabResult.findOne({ patient: patient._id })
        .sort({ testDate: -1 })
        .select('tsh testDate');

      return {
        _id:             patient._id,
        fullName:        patient.fullName,
        initials:        patient.fullName.split(' ').map(w => w[0]).join('').slice(0, 2),
        conditionStatus: patient.conditionStatus,
        photoUrl:        patient.photoUrl,
        updatedAt:       patient.updatedAt,
        latestTSH: latestLab ? {
          value:  latestLab.tsh.value,
          unit:   latestLab.tsh.unit,
          status: latestLab.tsh.status,
        } : null,
      };
    })
  );

  return {
    patients: patientsWithTSH,
    pagination: {
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const createPatient = async (doctorId, body) => {
  const { fullName, age, gender, phone, email, clinicalHistory } = body;

  // Auto-generate file number  TX-00001, TX-00002 ...
  const count = await Patient.countDocuments({ doctor: doctorId });
  const fileNumber = `TX-${String(count + 1).padStart(5, '0')}`;

  const patient = await Patient.create({
    doctor: doctorId,
    fileNumber,
    fullName,
    age,
    gender,
    phone:          phone   || null,
    email:          email   || null,
    clinicalHistory: clinicalHistory || null,
    conditionStatus: 'unknown',
  });

  return patient;
};