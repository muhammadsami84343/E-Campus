// setup_ecampus.mjs
// Creates the ecampus DB, collections with validators & indexes, and seeds minimal data.

const dbName = "ecampus";
console.log(`Using DB: ${dbName}`);
use(dbName);

// ========== CLASSES ==========
db.createCollection("classes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["academicYear", "grade", "sections", "createdAt"],
      additionalProperties: false,
      properties: {
        _id: {},
        academicYear: { bsonType: "string" },
        grade: { bsonType: "string" },
        sections: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["code", "strength"],
            additionalProperties: false,
            properties: {
              _id: {},
              code: { enum: ["A", "B", "C", "D"] },
              strength: { bsonType: "int", minimum: 0 }
            }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.classes.createIndex({ academicYear: 1, grade: 1 }, { name: "by_year_grade" });

// ========== SUBJECTS ==========
db.createCollection("subjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      additionalProperties: false,
      properties: {
        _id: {},
        name: { bsonType: "string" },
        code: { bsonType: "string" },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.subjects.createIndex({ name: 1 }, { name: "uniq_name", unique: true });

// ========== TEACHERS ==========
db.createCollection("teachers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "cnic", "qualification", "specializations", "income", "createdAt"],
      additionalProperties: false,
      properties: {
        _id: {},
        name: { bsonType: "string" },
        cnic: { bsonType: "string" },
        qualification: { bsonType: "string" },
        specializations: { bsonType: "array", items: { bsonType: "string" } },
        income: { bsonType: ["double", "int", "decimal"] },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.teachers.createIndex({ cnic: 1 }, { name: "uniq_cnic", unique: true });
db.teachers.createIndex({ name: 1 }, { name: "by_name" });

// ========== STUDENTS ==========
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "admissionNumber", "firstName", "lastName", "dob", "gender",
        "classId", "section", "rollNo",
        "admissionDate", "academicYear",
        "guardian", "address", "createdAt"
      ],
      additionalProperties: false,
      properties: {
        _id: {},
        admissionNumber: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        dob: { bsonType: "date" },
        gender: { enum: ["Male", "Female", "Other"] },
        bloodGroup: { enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], bsonType: "string" },
        classId: { bsonType: "objectId" },
        section: { enum: ["A", "B", "C", "D"] },
        rollNo: { bsonType: "int", minimum: 1 },
        admissionDate: { bsonType: "date" },
        academicYear: { bsonType: "string" },
        guardian: {
          bsonType: "object",
          required: ["name", "phone", "relation"],
          additionalProperties: false,
          properties: {
            _id: {},
            name: { bsonType: "string" },
            phone: { bsonType: "string" },
            relation: { bsonType: "string" }
          }
        },
        address: { bsonType: "string" },
        profilePicUrl: { bsonType: "string" },
        previousSchool: { bsonType: "string" },
        medicalInfo: { bsonType: "string" },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.students.createIndex({ admissionNumber: 1 }, { name: "uniq_admissionNumber", unique: true });
db.students.createIndex({ academicYear: 1, classId: 1, section: 1, rollNo: 1 }, { name: "uniq_roll_in_class_year", unique: true });
db.students.createIndex({ classId: 1, section: 1 }, { name: "by_class_section" });
db.students.createIndex({ createdAt: -1 }, { name: "by_created_desc" });

// ========== EXAMS ==========
db.createCollection("exams", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["academicYear", "classId", "section", "weekNo", "date", "createdAt"],
      additionalProperties: false,
      properties: {
        _id: {},
        title: { bsonType: "string" },
        academicYear: { bsonType: "string" },
        classId: { bsonType: "objectId" },
        section: { enum: ["A", "B", "C", "D"] },
        weekNo: { bsonType: "int", minimum: 1 },
        date: { bsonType: "date" },
        subjects: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["subjectId", "totalMarks"],
            additionalProperties: false,
            properties: {
              _id: {},
              subjectId: { bsonType: "objectId" },
              totalMarks: { bsonType: ["int", "double", "decimal"], minimum: 0 }
            }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.exams.createIndex({ academicYear: 1, classId: 1, section: 1, weekNo: 1 }, { name: "by_year_class_section_week", unique: true });
db.exams.createIndex({ date: 1 }, { name: "by_date" });

// ========== RESULTS ==========
db.createCollection("results", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["examId", "studentId", "subjectId", "obtained", "total", "createdAt"],
      additionalProperties: false,
      properties: {
        _id: {},
        examId: { bsonType: "objectId" },
        studentId: { bsonType: "objectId" },
        subjectId: { bsonType: "objectId" },
        obtained: { bsonType: ["int", "double", "decimal"], minimum: 0 },
        total: { bsonType: ["int", "double", "decimal"], minimum: 0 },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.results.createIndex({ examId: 1, studentId: 1, subjectId: 1 }, { name: "uniq_mark", unique: true });
db.results.createIndex({ studentId: 1 }, { name: "by_student" });
db.results.createIndex({ examId: 1 }, { name: "by_exam" });

// ========== ATTENDANCE (STUDENT) ==========
db.createCollection("attendance_student", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date", "studentId", "academicYear", "classId", "section", "status", "createdAt"],
      additionalProperties: false,
      properties: {
        _id: {},
        date: { bsonType: "date" },
        studentId: { bsonType: "objectId" },
        academicYear: { bsonType: "string" },
        classId: { bsonType: "objectId" },
        section: { enum: ["A", "B", "C", "D"] },
        status: { enum: ["Present", "Absent", "Leave"] },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
db.attendance_student.createIndex({ date: 1, studentId: 1 }, { name: "uniq_date_student", unique: true });
db.attendance_student.createIndex({ date: 1, classId: 1, section: 1 }, { name: "by_date_class_section" });

// ================== SEED MINIMAL DATA (SAFE) ==================
print("\nSeeding sample data ...");

try {
  let classSeven = db.classes.findOne({ academicYear: "2025-26", grade: "Seven" });
  let classSevenId = classSeven
    ? classSeven._id
    : db.classes.insertOne({
        academicYear: "2025-26",
        grade: "Seven",
        sections: [{ code: "A", strength: 40 }, { code: "B", strength: 42 }],
        createdAt: new Date()
      }).insertedId;

  let math = db.subjects.findOne({ name: "Mathematics" });
  let mathId = math
    ? math._id
    : db.subjects.insertOne({
        name: "Mathematics",
        code: "MATH",
        createdAt: new Date()
      }).insertedId;

  let student = db.students.findOne({ admissionNumber: "22014" });
  let studentId = student
    ? student._id
    : db.students.insertOne({
        admissionNumber: "22014",
        firstName: "Ayesha",
        lastName: "Khan",
        dob: new Date("2013-03-05"),
        gender: "Female",
        bloodGroup: "B+",
        classId: classSevenId,
        section: "A",
        rollNo: 1,
        admissionDate: new Date("2025-04-01"),
        academicYear: "2025-26",
        guardian: { name: "Admin User", phone: "0301-1234567", relation: "Father" },
        address: "123 Model Town, Lahore",
        profilePicUrl: "",
        previousSchool: "Sunrise School",
        medicalInfo: "",
        createdAt: new Date()
      }).insertedId;

  let exam = db.exams.findOne({ academicYear: "2025-26", classId: classSevenId, weekNo: 41 });
  let examId = exam
    ? exam._id
    : db.exams.insertOne({
        title: "Weekly Test",
        academicYear: "2025-26",
        classId: classSevenId,
        section: "A",
        weekNo: 41,
        date: new Date(),
        subjects: [{ subjectId: mathId, totalMarks: 100 }],
        createdAt: new Date()
      }).insertedId;

  if (!db.results.findOne({ examId, studentId, subjectId: mathId })) {
    db.results.insertOne({
      examId,
      studentId,
      subjectId: mathId,
      obtained: 85,
      total: 100,
      createdAt: new Date()
    });
  }

  if (!db.attendance_student.findOne({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, studentId })) {
    db.attendance_student.insertOne({
      date: new Date(),
      studentId,
      academicYear: "2025-26",
      classId: classSevenId,
      section: "A",
      status: "Present",
      createdAt: new Date()
    });
  }

  print("Seed complete.\n");

  printjson({
    classes: db.classes.countDocuments(),
    subjects: db.subjects.countDocuments(),
    students: db.students.countDocuments(),
    exams: db.exams.countDocuments(),
    results: db.results.countDocuments(),
    attendance: db.attendance_student.countDocuments()
  });
} catch (err) {
  print("Error during seeding:", err);
}
