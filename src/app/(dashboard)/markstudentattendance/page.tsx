'use client';

import { useState, useEffect } from 'react';

interface Student {
  name: string;
  admissionNo: string;
  defaultStatus: 'present' | 'absent' | 'late' | 'leave';
}

interface AttendanceRecord {
  studentName: string;
  admissionNo: string;
  status: string;
}

type StudentData = {
  [year: string]: {
    [cls: string]: {
      [section: string]: Student[];
    };
  };
};

export default function MarkStudentAttendance() {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' | 'error' } | null>(null);

  // Dummy student data (replace with actual API call in production)
  const dummyStudents: StudentData = {
    '2024-2025': {
      'class1': {
        'A': [
          { name: 'Alice Smith', admissionNo: 'S001', defaultStatus: 'present' },
          { name: 'Bob Johnson', admissionNo: 'S002', defaultStatus: 'present' }
        ],
        'B': [
          { name: 'Charlie Brown', admissionNo: 'S003', defaultStatus: 'present' }
        ]
      },
      'class7': {
        'A': [
          { name: 'Ayesha Khan', admissionNo: '22014', defaultStatus: 'present' },
          { name: 'Ali Raza', admissionNo: '22015', defaultStatus: 'present' },
          { name: 'Sara Ahmed', admissionNo: '22016', defaultStatus: 'present' },
          { name: 'Hassan Ali', admissionNo: '22017', defaultStatus: 'present' }
        ],
        'B': [
          { name: 'Fatima Noor', admissionNo: '21087', defaultStatus: 'present' }
        ]
      },
      'class9': {
        'A': [
          { name: 'Bilal Ahmed', admissionNo: '21045', defaultStatus: 'present' }
        ]
      }
    },
    '2023-2024': {
      'class1': {
        'A': [
          { name: 'David Lee', admissionNo: 'S101', defaultStatus: 'present' }
        ]
      }
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Update student list when filters change
  useEffect(() => {
    if (academicYear && selectedClass && selectedSection) {
      const studentList = dummyStudents[academicYear]?.[selectedClass]?.[selectedSection] || [];
      setStudents(studentList);

      // Initialize attendance status for all students
      const initialStatus: { [key: string]: string } = {};
      studentList.forEach(student => {
        initialStatus[student.admissionNo] = student.defaultStatus;
      });
      setAttendanceStatus(initialStatus);
    } else {
      setStudents([]);
      setAttendanceStatus({});
    }
  }, [academicYear, selectedClass, selectedSection]);

  // Handle attendance status change
  const handleStatusChange = (admissionNo: string, status: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [admissionNo]: status
    }));
  };

  // Handle save attendance
  const handleSaveAttendance = () => {
    if (students.length === 0) {
      showToast('Please select a Class, Section, and Date first.', 'warn');
      return;
    }

    const attendanceData: AttendanceRecord[] = students.map(student => ({
      studentName: student.name,
      admissionNo: student.admissionNo,
      status: attendanceStatus[student.admissionNo] || 'present'
    }));

    console.log('Attendance Data Submitted:', attendanceData);
    console.log('Date:', selectedDate);
    console.log('Academic Year:', academicYear);
    console.log('Class:', selectedClass);
    console.log('Section:', selectedSection);

    // In a real application, send this data to the server via API
    showToast('Attendance saved successfully!', 'success');
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'absent':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'late':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'leave':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100] space-y-2">
          <div
            className={`px-4 py-2 rounded-lg shadow text-white flex items-center gap-2 animate-in slide-in-from-right ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'warn'
                ? 'bg-amber-600'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-slate-700">Dashboard</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <a href="#" className="hover:text-slate-700">Students</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-slate-700">Mark Attendance</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Mark Student Attendance</h1>
          {/* Save Attendance Button */}
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Attendance
          </button>
        </div>

        {/* Attendance Filters */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Session</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Academic Year */}
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-slate-700 mb-2">
                Academic Year*
              </label>
              <select
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>

            {/* Class */}
            <div>
              <label htmlFor="attendanceClass" className="block text-sm font-medium text-slate-700 mb-2">
                Class*
              </label>
              <select
                id="attendanceClass"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="">Select Class</option>
                <option value="class1">Class 1</option>
                <option value="class7">Class 7</option>
                <option value="class9">Class 9</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label htmlFor="attendanceSection" className="block text-sm font-medium text-slate-700 mb-2">
                Section*
              </label>
              <select
                id="attendanceSection"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="attendanceDate" className="block text-sm font-medium text-slate-700 mb-2">
                Date*
              </label>
              <input
                type="date"
                id="attendanceDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Student Attendance Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold">
              {selectedClass && selectedSection
                ? `Attendance for Class ${selectedClass.replace('class', '')} - Section ${selectedSection} (${academicYear}) - ${formatDate(selectedDate)}`
                : 'Select Class, Section, and Date'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3 px-4 text-left font-medium text-slate-500">
                    Sr. No.
                  </th>
                  <th scope="col" className="py-3 px-4 text-left font-medium text-slate-500">
                    Student Name
                  </th>
                  <th scope="col" className="py-3 px-4 text-left font-medium text-slate-500">
                    Admission No.
                  </th>
                  <th scope="col" className="py-3 px-4 text-left font-medium text-slate-500">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-slate-500">
                      {selectedClass && selectedSection
                        ? 'No students found for the selected class/section.'
                        : 'Select Class, Section, and Date to load attendance.'}
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student.admissionNo} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">{index + 1}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-slate-700">{student.admissionNo}</td>
                      <td className="py-3 px-4">
                        <select
                          value={attendanceStatus[student.admissionNo] || 'present'}
                          onChange={(e) => handleStatusChange(student.admissionNo, e.target.value)}
                          className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Statistics (if students loaded) */}
        {students.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-sm text-slate-500 mb-1">Total Students</div>
              <div className="text-2xl font-semibold text-slate-900">{students.length}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl shadow p-4">
              <div className="text-sm text-emerald-600 mb-1">Present</div>
              <div className="text-2xl font-semibold text-emerald-700">
                {Object.values(attendanceStatus).filter(s => s === 'present').length}
              </div>
            </div>
            <div className="bg-rose-50 rounded-xl shadow p-4">
              <div className="text-sm text-rose-600 mb-1">Absent</div>
              <div className="text-2xl font-semibold text-rose-700">
                {Object.values(attendanceStatus).filter(s => s === 'absent').length}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl shadow p-4">
              <div className="text-sm text-amber-600 mb-1">Late/Leave</div>
              <div className="text-2xl font-semibold text-amber-700">
                {Object.values(attendanceStatus).filter(s => s === 'late' || s === 'leave').length}
              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-sm text-slate-500 mt-8">
          © 2025 eCampus — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
