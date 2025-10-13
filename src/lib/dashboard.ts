// src/lib/data/dashboard.ts
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { StudentListItem } from "@/lib/types";

/**
 * Reads summary stats and recent admissions for the dashboard.
 * Uses collections we already created via mongosh: students, teachers.
 * Finance metrics are stubbed (0) until the Finance collections are added.
 */
export async function getDashboardStats() {
  const db = await getDb();
  const students = db.collection("students");
  const teachers = db.collection("teachers");

  const [studentCount, staffCount, recentDocs] = await Promise.all([
    students.countDocuments({}),
    teachers.countDocuments({}),
    students
      .find({})
      .project({
        admissionNumber: 1,
        firstName: 1,
        lastName: 1,
        classId: 1,
        section: 1,
        "guardian.phone": 1,
        createdAt: 1
      })
      .sort({ createdAt: -1 })
      .limit(8) // show top 8
      .toArray()
  ]);

  // Resolve class labels "Seven-A" by looking up class grade for each unique classId.
  const classIdSet = new Set<string>();
  for (const d of recentDocs) {
    if (d.classId) classIdSet.add(String(d.classId));
  }

  let classMap = new Map<string, string>(); // classId -> "Grade-Section"
  if (classIdSet.size) {
    const classes = db.collection("classes");
    const lookups = await classes
      .find({ _id: { $in: Array.from(classIdSet).map(id => new ObjectId(id)) } })
      .project({ grade: 1 })
      .toArray();
    classMap = new Map(lookups.map(doc => [String(doc._id), doc.grade]));
  }

  const recentAdmissions: StudentListItem[] = recentDocs.map(doc => ({
    _id: String(doc._id),
    admissionNumber: doc.admissionNumber,
    firstName: doc.firstName,
    lastName: doc.lastName,
    classLabel: `${classMap.get(String(doc.classId)) ?? "Class"}-${doc.section}`,
    phone: doc.guardian?.phone,
    createdAt: doc.createdAt
  }));

  // TODO (Finance): these require payments/invoices collections
  const collectedTotal = 0;
  const unpaidCount = 0;

  return {
    studentCount,
    staffCount,
    collectedTotal,
    unpaidCount,
    recentAdmissions
  };
}