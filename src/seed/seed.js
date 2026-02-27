import 'dotenv/config';
import mongoose  from 'mongoose';
import bcrypt    from 'bcrypt';
import connectDB from '../config/db.js';

import Doctor        from '../models/doctor.model.js';
import Patient       from '../models/patient.model.js';
import LabResult     from '../models/labResult.model.js';
import SymptomRecord from '../models/symptomRecord.model.js';
import Diagnosis     from '../models/diagnosis.model.js';
import Appointment   from '../models/appointment.model.js';
import Notification  from '../models/notification.model.js';

// ── Helpers ────────────────────────────────────────────────────────────────
const randomBetween = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const randomInt     = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo       = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysFromNow   = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const SEVERITY    = ['none', 'mild', 'moderate', 'severe'];
const CONDITIONS  = ['hypothyroidism', 'hyperthyroidism', 'normal', 'unknown'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// ── Seed Data ──────────────────────────────────────────────────────────────

const doctorsData = [
  {
    fullName: 'Dr. Mohammed Al-Said',
    email: 'mohammed@thyrodiag.com',
    password: 'Doctor@1234',
    certifications: 'Endocrinology Specialist — Cairo University 2018',
    settings: { language: 'ar', notificationsEnabled: true, biometricEnabled: true },
  },
  {
    fullName: 'Dr. Sarah Hassan',
    email: 'sarah@thyrodiag.com',
    password: 'Doctor@1234',
    certifications: 'Internal Medicine — Ain Shams University 2016',
    settings: { language: 'ar', notificationsEnabled: true, darkModeEnabled: true },
  },
];

const patientsData = [
  {
    fullName: 'أحمد محمود',
    age: 45, gender: 'male',   bloodType: 'O+',
    phone: '01011111111', email: 'ahmed@example.com',
    clinicalHistory: 'يعاني من خمول في الغدة الدرقية منذ عامين. يتابع بانتظام.',
    conditionStatus: 'hypothyroidism',
  },
  {
    fullName: 'سارة أحمد',
    age: 32, gender: 'female', bloodType: 'A+',
    phone: '01022222222', email: 'sara@example.com',
    clinicalHistory: 'فرط نشاط الغدة الدرقية. تتلقى علاجاً منذ 6 أشهر.',
    conditionStatus: 'hyperthyroidism',
  },
  {
    fullName: 'محمد كمال',
    age: 58, gender: 'male',   bloodType: 'B+',
    phone: '01033333333', email: 'mohamed@example.com',
    clinicalHistory: 'تاريخ عائلي مع أمراض الغدة الدرقية. فرط نشاط حديث.',
    conditionStatus: 'hyperthyroidism',
  },
  {
    fullName: 'ليلى ناصر',
    age: 41, gender: 'female', bloodType: 'AB+',
    phone: '01044444444', email: 'laila@example.com',
    clinicalHistory: 'قصور الغدة الدرقية الأولي. تأخذ ليفوثيروكسين.',
    conditionStatus: 'hypothyroidism',
  },
  {
    fullName: 'خالد إبراهيم',
    age: 37, gender: 'male',   bloodType: 'O-',
    phone: '01055555555', email: 'khaled@example.com',
    clinicalHistory: 'لا توجد أمراض مزمنة. فحص دوري.',
    conditionStatus: 'normal',
  },
  {
    fullName: 'منى عبد الله',
    age: 29, gender: 'female', bloodType: 'A-',
    phone: '01066666666', email: 'mona@example.com',
    clinicalHistory: 'أعراض خمول وزيادة وزن. تحت الفحص.',
    conditionStatus: 'unknown',
  },
  {
    fullName: 'يوسف عمر',
    age: 52, gender: 'male',   bloodType: 'B-',
    phone: '01077777777', email: 'yousef@example.com',
    clinicalHistory: 'قصور الغدة بعد جراحة استئصال جزئي.',
    conditionStatus: 'hypothyroidism',
  },
  {
    fullName: 'نور الدين',
    age: 44, gender: 'male',   bloodType: 'AB-',
    phone: '01088888888', email: 'nour@example.com',
    clinicalHistory: 'التهاب الغدة الدرقية هاشيموتو. مستقر على العلاج.',
    conditionStatus: 'hypothyroidism',
  },
  {
    fullName: 'رنا سعيد',
    age: 35, gender: 'female', bloodType: 'O+',
    phone: '01099999999', email: 'rana@example.com',
    clinicalHistory: 'فرط نشاط بعد الولادة. تحت المتابعة.',
    conditionStatus: 'hyperthyroidism',
  },
  {
    fullName: 'عمر فاروق',
    age: 61, gender: 'male',   bloodType: 'A+',
    phone: '01010101010', email: 'omar@example.com',
    clinicalHistory: 'نتائج طبيعية. فحص سنوي روتيني.',
    conditionStatus: 'normal',
  },
];

// ── Lab values per condition ───────────────────────────────────────────────
const labByCondition = {
  hypothyroidism:  () => ({ tsh: randomBetween(5,  20),  freeT4: randomBetween(0.3, 0.7), freeT3: randomBetween(1.5, 2.2), totalT3: randomBetween(50,  79)  }),
  hyperthyroidism: () => ({ tsh: randomBetween(0.01, 0.3), freeT4: randomBetween(2.0, 4.0), freeT3: randomBetween(4.5, 7.0), totalT3: randomBetween(201, 350) }),
  normal:          () => ({ tsh: randomBetween(0.5, 3.5),  freeT4: randomBetween(0.9, 1.7), freeT3: randomBetween(2.5, 4.0), totalT3: randomBetween(90,  180) }),
  unknown:         () => ({ tsh: randomBetween(0.4, 6.0),  freeT4: randomBetween(0.6, 2.0), freeT3: randomBetween(2.0, 5.0), totalT3: randomBetween(70,  220) }),
};

// ── Diagnosis text per condition ───────────────────────────────────────────
const diagnosisByCondition = {
  hypothyroidism: {
    final: 'قصور الغدة الدرقية الأولي (Primary Hypothyroidism)',
    analysis: 'ارتفاع ملحوظ في TSH مع انخفاض في Free T4 يشير بوضوح إلى فشل الغدة الدرقية في إنتاج الهرمونات الكافية.',
    tags: ['إجهاد مستمر', 'زيادة غير مبررة في الوزن', 'حساسية مفرطة للبرد', 'جفاف الجلد'],
    recommendations: [
      { title: 'تحويل إلى أخصائي غدد صماء', description: 'لتحديد الجرعة المناسبة من الليفوثيروكسين.', order: 1 },
      { title: 'إعادة التحاليل المخبرية',   description: 'إعادة فحص TSH بعد 6 أسابيع من بدء العلاج.', order: 2 },
      { title: 'فحص الأجسام المضادة (TPO)', description: 'للتأكد من وجود التهاب الغدة الدرقية هاشيموتو.', order: 3 },
    ],
  },
  hyperthyroidism: {
    final: 'فرط نشاط الغدة الدرقية (Hyperthyroidism)',
    analysis: 'انخفاض حاد في TSH مع ارتفاع في Free T4 و T3 يشير إلى فرط نشاط الغدة الدرقية.',
    tags: ['فقدان الوزن', 'تسارع ضربات القلب', 'التعرق الزائد', 'التوتر والقلق'],
    recommendations: [
      { title: 'بدء علاج مضاد للغدة الدرقية', description: 'ميثيمازول أو بروبيل ثيوراسيل.', order: 1 },
      { title: 'مراقبة وظائف الكبد',          description: 'فحص دوري كل 4 أسابيع.', order: 2 },
      { title: 'تقييم مرض غريفز',             description: 'فحص الأجسام المضادة لمستقبل TSH.', order: 3 },
    ],
  },
  normal: {
    final: 'وظائف الغدة الدرقية طبيعية',
    analysis: 'جميع مؤشرات الغدة الدرقية ضمن النطاق الطبيعي. لا يوجد ما يدعو للقلق.',
    tags: ['لا أعراض'],
    recommendations: [
      { title: 'متابعة سنوية', description: 'فحص دوري سنوي للاطمئنان.', order: 1 },
    ],
  },
  unknown: {
    final: 'تحت التقييم — نتائج غير حاسمة',
    analysis: 'النتائج تحتاج إلى متابعة إضافية وتحاليل تكميلية.',
    tags: ['أعراض غير محددة'],
    recommendations: [
      { title: 'إعادة التحاليل بعد 4 أسابيع', description: 'للحصول على صورة أوضح.', order: 1 },
      { title: 'فحص سريري شامل',              description: 'تقييم الأعراض بشكل تفصيلي.', order: 2 },
    ],
  },
};

// ── Main Seed Function ─────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  // Clear all existing data
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
    LabResult.deleteMany({}),
    SymptomRecord.deleteMany({}),
    Diagnosis.deleteMany({}),
    Appointment.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // ── Create Doctors ───────────────────────────────────────────────────────
  console.log('👨‍⚕️  Creating doctors...');
  const doctors = await Promise.all(
    doctorsData.map(async (d) => {
      const passwordHash = await bcrypt.hash(d.password, 12);
        return Doctor.create({
                fullName:           d.fullName,
                email:          d.email,
                passwordHash,
                certifications: d.certifications,
                settings:       d.settings,
        });
    })
  );
  console.log(`   ✅ ${doctors.length} doctors created`);
  console.log(`   📧 Doctor 1: ${doctorsData[0].email} / ${doctorsData[0].password}`);
  console.log(`   📧 Doctor 2: ${doctorsData[1].email} / ${doctorsData[1].password}`);

  // ── Create Patients (5 per doctor) ───────────────────────────────────────
  console.log('🧑‍🤝‍🧑 Creating patients...');
  const patients = [];

  for (let i = 0; i < patientsData.length; i++) {
    const doctorIndex = i < 5 ? 0 : 1; // first 5 → doctor1, last 5 → doctor2
    const count       = i + 1;
    const fileNumber  = `TX-${String(count).padStart(5, '0')}`;

    const patient = await Patient.create({
      ...patientsData[i],
      doctor:     doctors[doctorIndex]._id,
      fileNumber,
    });
    patients.push(patient);
  }
  console.log(`   ✅ ${patients.length} patients created (5 per doctor)`);

  // ── Create Lab Results (3 per patient = trend data) ───────────────────────
  console.log('🧪 Creating lab results...');
  const labResults = [];

  for (const patient of patients) {
    for (let i = 0; i < 3; i++) {
      const values = labByCondition[patient.conditionStatus]();
      const lab = await LabResult.create({
        patient:  patient._id,
        tsh:      { value: values.tsh,     unit: 'mIU/L'  },
        freeT4:   { value: values.freeT4,  unit: 'ng/dL'  },
        freeT3:   { value: values.freeT3,  unit: 'pmol/L' },
        totalT3:  { value: values.totalT3, unit: 'ng/dL'  },
        testDate: daysAgo(i * 30), // 0, 30, 60 days ago
        notes:    i === 0 ? 'أحدث تحليل' : `تحليل قبل ${i * 30} يوم`,
      });
      labResults.push(lab);
    }
  }
  console.log(`   ✅ ${labResults.length} lab results created (3 per patient)`);

  // ── Create Symptom Records ─────────────────────────────────────────────────
  console.log('📋 Creating symptom records...');

  for (const patient of patients) {
    await SymptomRecord.create({
      patient: patient._id,
      generalSymptoms: {
        fatigue:             SEVERITY[randomInt(0, 3)],
        weightChange:        SEVERITY[randomInt(0, 3)],
        coldHeatIntolerance: SEVERITY[randomInt(0, 3)],
      },
      physicalSigns: {
        hairLoss:     Math.random() > 0.5,
        drySkin:      Math.random() > 0.5,
        neckSwelling: Math.random() > 0.7,
      },
      neurologicalSymptoms: {
        anxiety:                 randomInt(0, 100),
        moodSwings:              randomInt(0, 100),
        concentrationDifficulty: randomInt(0, 100),
      },
      additionalNotes: 'تم تسجيل الأعراض خلال الزيارة الأخيرة.',
      recordedAt: daysAgo(randomInt(1, 10)),
    });
  }
  console.log(`   ✅ ${patients.length} symptom records created`);

  // ── Create Diagnoses ───────────────────────────────────────────────────────
  console.log('🩺 Creating diagnoses...');
  const diagnoses = [];

  for (const patient of patients) {
    const diagData   = diagnosisByCondition[patient.conditionStatus];
    const latestLab  = labResults.find(l => l.patient.toString() === patient._id.toString());
    const confidence = randomInt(75, 97);

    const diagnosis = await Diagnosis.create({
      patient:           patient._id,
      labResult:         latestLab?._id || null,
      proposedDiagnosis: diagData.final,
      finalDiagnosis:    diagData.final,
      confidenceScore:   confidence,
      clinicalAnalysis:  diagData.analysis,
      treatmentNotes:    'يجب متابعة المريض بشكل دوري وضبط الجرعة حسب الاستجابة.',
      clinicalTags:      diagData.tags,
      recommendations:   diagData.recommendations,
      status:            Math.random() > 0.3 ? 'confirmed' : 'draft',
      diagnosedAt:       daysAgo(randomInt(1, 30)),
    });
    diagnoses.push(diagnosis);
  }
  console.log(`   ✅ ${diagnoses.length} diagnoses created`);

  // ── Create Appointments ────────────────────────────────────────────────────
  console.log('📅 Creating appointments...');
  let apptCount = 0;

  for (const patient of patients) {
    const doctor = doctors[patients.indexOf(patient) < 5 ? 0 : 1];

    // 1 past + 1 upcoming appointment per patient
    await Appointment.create({
      doctor:          doctor._id,
      patient:         patient._id,
      appointmentDate: daysAgo(randomInt(10, 30)),
      type:            'new',
      status:          'completed',
      notes:           'الزيارة الأولى — تقييم أولي',
    });

    await Appointment.create({
      doctor:          doctor._id,
      patient:         patient._id,
      appointmentDate: daysFromNow(randomInt(3, 20)),
      type:            'followup',
      status:          'scheduled',
      notes:           'متابعة بعد بدء العلاج',
    });
    apptCount += 2;
  }
  console.log(`   ✅ ${apptCount} appointments created (1 past + 1 upcoming per patient)`);

  // ── Create Notifications ───────────────────────────────────────────────────
  console.log('🔔 Creating notifications...');
  const notifMessages = [
    { title: 'نتائج تحليل جديدة',           type: 'lab_result'     },
    { title: 'تم تأكيد التشخيص',            type: 'diagnosis'      },
    { title: 'موعد قادم غداً',              type: 'appointment'    },
    { title: 'تم تحديث بيانات مريض',        type: 'patient_update' },
    { title: 'تذكير: مراجعة تقارير اليوم', type: 'system'         },
  ];
  let notifCount = 0;

  for (const doctor of doctors) {
    const doctorPatients = patients.filter((_, i) =>
      (doctor === doctors[0] && i < 5) || (doctor === doctors[1] && i >= 5)
    );

    for (let i = 0; i < 5; i++) {
      const msg = notifMessages[i];
      await Notification.create({
        doctor:         doctor._id,
        relatedPatient: doctorPatients[i % doctorPatients.length]._id,
        title:          msg.title,
        body:           `${msg.title} للمريض ${doctorPatients[i % doctorPatients.length].fullName}`,
        type:           msg.type,
        isRead:         i > 2, // first 3 unread
      });
      notifCount++;
    }
  }
  console.log(`   ✅ ${notifCount} notifications created`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed completed successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log(`   Doctors:       ${doctors.length}`);
  console.log(`   Patients:      ${patients.length} (5 per doctor)`);
  console.log(`   Lab Results:   ${labResults.length} (3 per patient)`);
  console.log(`   Symptoms:      ${patients.length}`);
  console.log(`   Diagnoses:     ${diagnoses.length}`);
  console.log(`   Appointments:  ${apptCount}`);
  console.log(`   Notifications: ${notifCount}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑 Login credentials:');
  console.log(`   Doctor 1 → email: ${doctorsData[0].email}  password: ${doctorsData[0].password}`);
  console.log(`   Doctor 2 → email: ${doctorsData[1].email}  password: ${doctorsData[1].password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});