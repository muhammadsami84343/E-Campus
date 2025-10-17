// setup_ecampus.mjs  — mongosh script (no Node imports)
// Creates the "ecampus" DB, applies validators & indexes, and seeds sample data.
// Run with: mongosh "$MONGODB_URI" setup_ecampus.mjs

// === Configuration toggles (edit if needed) ===
const DB_NAME = 'ecampus';
const DROP_FIRST = false; // set to true to drop all existing collections before provisioning

// === Helpers ===
function log(msg) { print(msg); }

function ensureCollection(db, name, jsonSchema) {
  const exists = db.getCollectionInfos({ name }).length > 0;
  if (!exists) {
    db.createCollection(name, jsonSchema ? { validator: { $jsonSchema: jsonSchema } } : {});
    log(`✅ Created collection: ${name}`);
  } else if (jsonSchema) {
    // If collection exists, update validator (ignore if collMod not supported/unchanged)
    const res = db.runCommand({ collMod: name, validator: { $jsonSchema: jsonSchema } });
    if (!res.ok) {
      log(`⚠️ collMod failed for ${name}: ${tojson(res)}`);
    } else {
      log(`ℹ️ Updated validator for: ${name}`);
    }
  }
  return db.getCollection(name);
}

function createIndexes(col, specs) {
  specs.forEach(({ key, options }) => col.createIndex(key, options || {}));
}

function tryInsertMany(col, docs) {
  try {
    col.insertMany(docs, { ordered: false });
  } catch (e) {
    // Ignore duplicate-key errors to keep the script idempotent
    if (e.code !== 11000) {
      throw e;
    }
  }
}

function iso(s) { return ISODate(s); }

// === Start ===
const db = db.getSiblingDB(DB_NAME);
log(`\nUsing DB: ${DB_NAME}`);

if (DROP_FIRST) {
  log('⚠ DROP_FIRST=true → Dropping existing collections…');
  db.getCollectionNames().forEach(n => {
    db.getCollection(n).drop();
    log(`🗑 Dropped: ${n}`);
  });
}

// ===== JSON Schemas =====
const classesSchema = {
  bsonType: 'object',
  required: ['class_id','academic_year','grade'],
  properties: {
    class_id:      { bsonType: 'string' },
    academic_year: { bsonType: 'string' },
    grade:         { bsonType: 'string' }
  }
};

const sectionsSchema = {
  bsonType: 'object',
  required: ['section_id','class_id','strength'],
  properties: {
    section_id: { bsonType: 'string' },
    class_id:   { bsonType: 'string' },
    strength:   { bsonType: ['int','long'] }
  }
};

const subjectsSchema = {
  bsonType: 'object',
  required: ['subject_id','name'],
  properties: {
    subject_id: { bsonType: 'string' },
    name:       { bsonType: 'string' }
  }
};

const teachersSchema = {
  bsonType: 'object',
  required: ['teacher_id','name','cnic'],
  properties: {
    teacher_id:             { bsonType: 'string' },
    name:                   { bsonType: 'string' },
    cnic:                   { bsonType: 'string' },
    qualification:          { bsonType: 'string' },
    subject_specialization: { bsonType: 'string' },
    income:                 { bsonType: ['int','long'] }
  }
};

const studentsSchema = {
  bsonType: 'object',
  required: [
    'admission_id','dob','first_name','last_name','gender','class_id','section_id',
    'admission_date','academic_year','guardian_name','guardian_phone_no','roll_no','monthly_fee'
  ],
  properties: {
    admission_id:       { bsonType: 'string' },
    dob:                { bsonType: 'date' },
    first_name:         { bsonType: 'string' },
    last_name:          { bsonType: 'string' },
    gender:             { bsonType: ['string','int'] },
    blood_group:        { bsonType: 'string' },
    class_id:           { bsonType: 'string' },
    section_id:         { bsonType: 'string' },
    admission_date:     { bsonType: 'date' },
    academic_year:      { bsonType: 'string' },
    guardian_name:      { bsonType: 'string' },
    guardian_phone_no:  { bsonType: 'string' },
    relation:           { bsonType: 'string' },
    std_address:        { bsonType: 'string' },
    profile_pic:        { bsonType: 'string' },
    previous_school:    { bsonType: 'string' },
    medical_info:       { bsonType: 'string' },
    roll_no:            { bsonType: ['int','long'] },
    monthly_fee:        { bsonType: ['int','long','double','string'] }
  }
};

const attendanceSchema = {
  bsonType: 'object',
  required: ['academic_year','class_id','section_id','date','admission_id','status'],
  properties: {
    academic_year: { bsonType: 'string' },
    class_id:      { bsonType: 'string' },
    section_id:    { bsonType: 'string' },
    date:          { bsonType: 'date' },
    admission_id:  { bsonType: 'string' },
    status:        { bsonType: 'string' }
  }
};

const examsSchema = {
  bsonType: 'object',
  required: ['exam_id','class_id','section_id','date','subject_id','marks','week_no'],
  properties: {
    exam_id:    { bsonType: 'string' },
    class_id:   { bsonType: 'string' },
    section_id: { bsonType: 'string' },
    date:       { bsonType: 'date' },
    subject_id: { bsonType: 'string' },
    marks:      { bsonType: ['int','long','double'] },
    week_no:    { bsonType: ['int','long'] }
  }
};

const resultsSchema = {
  bsonType: 'object',
  required: ['result_id','class_id','section_id','admission_id','o_marks','t_marks','week_no','exam_id'],
  properties: {
    result_id:    { bsonType: 'string' },
    class_id:     { bsonType: 'string' },
    section_id:   { bsonType: 'string' },
    admission_id: { bsonType: 'string' },
    o_marks:      { bsonType: ['int','long','double'] },
    t_marks:      { bsonType: ['int','long','double'] },
    week_no:      { bsonType: ['int','long'] },
    exam_id:      { bsonType: 'string' }
  }
};

const teacherAttendanceSchema = {
  bsonType: 'object',
  required: ['date','department','roles','staff_id'],
  properties: {
    date:       { bsonType: 'date' },
    department: { bsonType: 'string' },
    roles:      { bsonType: 'string' },
    staff_id:   { bsonType: ['string','int','long'] }
  }
};

const feeCollectionSchema = {
  bsonType: 'object',
  required: ['admission_no','student_name','payment_method','date','received_amount'],
  properties: {
    admission_no:   { bsonType: ['int','long','string'] },
    student_name:   { bsonType: 'string' },
    payment_method: { bsonType: 'string' },
    date:           { bsonType: 'date' },
    received_amount:{ bsonType: ['int','long','double'] },
    remarks:        { bsonType: 'string' }
  }
};

const pendingDuesSchema = {
  bsonType: 'object',
  required: ['admission_no','class','status','overdue'],
  properties: {
    admission_no: { bsonType: ['int','long','string'] },
    class:        { bsonType: 'string' },
    status:       { bsonType: 'string' },
    overdue:      { bsonType: ['int','long','double','string'] }
  }
};

// Admin (replaces Settings): generic key/value
const adminSchema = {
  bsonType: 'object',
  required: ['key'],
  properties: {
    key:   { bsonType: 'string', description: 'e.g., Profile, Forgot_password' },
    value: {}
  }
};

// ===== Create / Update Collections =====
const classes            = ensureCollection(db, 'classes',            classesSchema);
const sections           = ensureCollection(db, 'sections',           sectionsSchema);
const subjects           = ensureCollection(db, 'subjects',           subjectsSchema);
const teachers           = ensureCollection(db, 'teachers',           teachersSchema);
const students           = ensureCollection(db, 'students',           studentsSchema);
const attendance         = ensureCollection(db, 'attendance',         attendanceSchema);
const exams              = ensureCollection(db, 'exams',              examsSchema);
const results            = ensureCollection(db, 'results',            resultsSchema);
const teacher_attendance = ensureCollection(db, 'teacher_attendance', teacherAttendanceSchema);
const fee_collection     = ensureCollection(db, 'fee_collection',     feeCollectionSchema);
const pending_dues       = ensureCollection(db, 'pending_dues',       pendingDuesSchema);
const admin              = ensureCollection(db, 'admin',              adminSchema);

// ===== Indexes =====
createIndexes(classes,            [ { key: { class_id: 1 }, options: { unique: true } } ]);
createIndexes(sections,           [
  { key: { section_id: 1 }, options: { unique: true } },
  { key: { class_id: 1 },   options: {} }
]);
createIndexes(subjects,           [ { key: { subject_id: 1 }, options: { unique: true } } ]);
createIndexes(teachers,           [ { key: { teacher_id: 1 }, options: { unique: true } } ]);
createIndexes(students,           [
  { key: { admission_id: 1 },                    options: { unique: true } },
  { key: { class_id: 1, section_id: 1, roll_no: 1 }, options: { unique: true } }
]);
createIndexes(attendance,         [ { key: { date: 1, admission_id: 1 }, options: { unique: true } } ]);
createIndexes(exams,              [ { key: { exam_id: 1 }, options: { unique: true } } ]);
createIndexes(results,            [ { key: { result_id: 1 }, options: { unique: true } } ]);
createIndexes(fee_collection,     [ { key: { admission_no: 1, date: 1 }, options: {} } ]);
createIndexes(pending_dues,       [ { key: { admission_no: 1 }, options: {} } ]);
createIndexes(admin,              [ { key: { key: 1 }, options: { unique: true } } ]);

// ===== Seed Data =====
const CLASS_10 = { class_id: 'C-10', academic_year: '2025-2026', grade: '10' };
const CLASS_9  = { class_id: 'C-09', academic_year: '2025-2026', grade: '9' };
tryInsertMany(classes, [CLASS_10, CLASS_9]);

const SEC_A_10 = { section_id: 'SEC-A-10', class_id: 'C-10', strength: NumberInt(30) };
const SEC_B_10 = { section_id: 'SEC-B-10', class_id: 'C-10', strength: NumberInt(28) };
const SEC_A_09 = { section_id: 'SEC-A-09', class_id: 'C-09', strength: NumberInt(32) };
tryInsertMany(sections, [SEC_A_10, SEC_B_10, SEC_A_09]);

const SUB_MATH_10 = { subject_id: 'SUB-MATH-10', name: 'Mathematics' };
const SUB_ENG_10  = { subject_id: 'SUB-ENG-10',  name: 'English' };
const SUB_SCI_10  = { subject_id: 'SUB-SCI-10',  name: 'Science' };
tryInsertMany(subjects, [SUB_MATH_10, SUB_ENG_10, SUB_SCI_10]);

const T_001 = {
  teacher_id: 'T-001', name: 'Ali Raza', cnic: '35202-1234567-1',
  qualification: 'BS Mathematics', subject_specialization: 'Mathematics',
  income: NumberInt(60000)
};
const T_002 = {
  teacher_id: 'T-002', name: 'Sara Khan', cnic: '35201-9876543-2',
  qualification: 'MA English', subject_specialization: 'English',
  income: NumberInt(65000)
};
tryInsertMany(teachers, [T_001, T_002]);

const STU_1 = {
  admission_id: 'ADM-001',
  dob: iso('2009-05-01T00:00:00Z'),
  first_name: 'Ahsan',
  last_name: 'Khan',
  gender: NumberInt(1),
  blood_group: 'B+',
  class_id: 'C-10',
  section_id: 'SEC-A-10',
  admission_date: iso('2025-08-15T00:00:00Z'),
  academic_year: '2025-2026',
  guardian_name: 'Naveed Khan',
  guardian_phone_no: '+92-300-1111111',
  relation: 'Father',
  std_address: 'Model Town, Lahore',
  profile_pic: 'https://example.com/pic/ahsankhan.jpg',
  previous_school: 'ABCD Middle School',
  medical_info: 'N/A',
  roll_no: NumberInt(1),
  monthly_fee: NumberInt(5000)
};
const STU_2 = {
  admission_id: 'ADM-002',
  dob: iso('2009-11-10T00:00:00Z'),
  first_name: 'Maria',
  last_name: 'Ali',
  gender: NumberInt(0),
  blood_group: 'O+',
  class_id: 'C-10',
  section_id: 'SEC-A-10',
  admission_date: iso('2025-08-15T00:00:00Z'),
  academic_year: '2025-2026',
  guardian_name: 'Ali Raza',
  guardian_phone_no: '+92-333-2222222',
  relation: 'Father',
  std_address: 'Gulberg, Lahore',
  profile_pic: 'https://example.com/pic/mariaali.jpg',
  previous_school: 'XYZ Middle School',
  medical_info: 'Asthma (mild)',
  roll_no: NumberInt(2),
  monthly_fee: NumberInt(5000)
};
tryInsertMany(students, [STU_1, STU_2]);

tryInsertMany(attendance, [
  { academic_year: '2025-2026', class_id: 'C-10', section_id: 'SEC-A-10', date: iso('2025-09-01T00:00:00Z'), admission_id: 'ADM-001', status: 'Present' },
  { academic_year: '2025-2026', class_id: 'C-10', section_id: 'SEC-A-10', date: iso('2025-09-01T00:00:00Z'), admission_id: 'ADM-002', status: 'Absent' },
  { academic_year: '2025-2026', class_id: 'C-10', section_id: 'SEC-A-10', date: iso('2025-09-02T00:00:00Z'), admission_id: 'ADM-001', status: 'Present' },
  { academic_year: '2025-2026', class_id: 'C-10', section_id: 'SEC-A-10', date: iso('2025-09-02T00:00:00Z'), admission_id: 'ADM-002', status: 'Present' }
]);

const EX_001 = { exam_id: 'EX-001', class_id: 'C-10', section_id: 'SEC-A-10', date: iso('2025-09-05T00:00:00Z'), subject_id: 'SUB-MATH-10', marks: NumberInt(100), week_no: NumberInt(5) };
const EX_002 = { exam_id: 'EX-002', class_id: 'C-10', section_id: 'SEC-A-10', date: iso('2025-09-12T00:00:00Z'), subject_id: 'SUB-ENG-10',  marks: NumberInt(100), week_no: NumberInt(6) };
tryInsertMany(exams, [EX_001, EX_002]);

tryInsertMany(results, [
  { result_id: 'RES-001', class_id: 'C-10', section_id: 'SEC-A-10', admission_id: 'ADM-001', o_marks: NumberInt(85), t_marks: NumberInt(100), week_no: NumberInt(5), exam_id: 'EX-001' },
  { result_id: 'RES-002', class_id: 'C-10', section_id: 'SEC-A-10', admission_id: 'ADM-002', o_marks: NumberInt(72), t_marks: NumberInt(100), week_no: NumberInt(5), exam_id: 'EX-001' },
  { result_id: 'RES-003', class_id: 'C-10', section_id: 'SEC-A-10', admission_id: 'ADM-001', o_marks: NumberInt(90), t_marks: NumberInt(100), week_no: NumberInt(6), exam_id: 'EX-002' },
  { result_id: 'RES-004', class_id: 'C-10', section_id: 'SEC-A-10', admission_id: 'ADM-002', o_marks: NumberInt(78), t_marks: NumberInt(100), week_no: NumberInt(6), exam_id: 'EX-002' }
]);

tryInsertMany(teacher_attendance, [
  { date: iso('2025-09-01T00:00:00Z'), department: 'Academics', roles: 'Teacher', staff_id: 'T-001' },
  { date: iso('2025-09-01T00:00:00Z'), department: 'Academics', roles: 'Teacher', staff_id: 'T-002' }
]);

tryInsertMany(fee_collection, [
  { admission_no: NumberInt(1), student_name: 'Ahsan Khan', payment_method: 'Cash',          date: iso('2025-10-01T00:00:00Z'), received_amount: NumberInt(5000), remarks: 'Oct 2025 fee' },
  { admission_no: NumberInt(2), student_name: 'Maria Ali',  payment_method: 'Bank Transfer', date: iso('2025-10-01T00:00:00Z'), received_amount: NumberInt(2500), remarks: 'Partial payment' }
]);

tryInsertMany(pending_dues, [
  { admission_no: NumberInt(2), class: '10', status: 'Overdue', overdue: NumberInt(2500) }
]);

tryInsertMany(admin, [
  { key: 'Profile',         value: { profile_image_required: false, max_profile_image_mb: NumberInt(2) } },
  { key: 'Forgot_password', value: { token_ttl_minutes: NumberInt(30), max_attempts_per_day: NumberInt(3) } }
]);

log('\n🎉 Ecampus database created/updated and seeded successfully.');
log('Collections: ' + db.getCollectionNames().join(', '));