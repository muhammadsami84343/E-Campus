'use client';

import { useState, useEffect } from 'react';

interface Student {
  name: string;
  admissionNo: string;
  rollNo: number;
  defaultStatus: 'present' | 'absent' | 'late';
}

interface AttendanceRecord {
  studentName: string;
  admissionNo: string;
  rollNo: number;
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
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: 'present' | 'absent' | 'late' }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  // Enhanced dummy student data
  const dummyStudents: StudentData = {
    '2024-2025': {
      'Class 1': {
        'A': [
          { name: 'Alice Smith', admissionNo: 'S001', rollNo: 1, defaultStatus: 'present' },
          { name: 'Bob Johnson', admissionNo: 'S002', rollNo: 2, defaultStatus: 'present' },
          { name: 'Carol White', admissionNo: 'S003', rollNo: 3, defaultStatus: 'present' },
          { name: 'David Brown', admissionNo: 'S004', rollNo: 4, defaultStatus: 'present' },
        ],
        'B': [
          { name: 'Charlie Brown', admissionNo: 'S005', rollNo: 1, defaultStatus: 'present' },
          { name: 'Diana Ross', admissionNo: 'S006', rollNo: 2, defaultStatus: 'present' },
        ]
      },
      'Class 7': {
        'A': [
          { name: 'Ayesha Khan', admissionNo: '22014', rollNo: 1, defaultStatus: 'present' },
          { name: 'Ali Raza', admissionNo: '22015', rollNo: 2, defaultStatus: 'present' },
          { name: 'Sara Ahmed', admissionNo: '22016', rollNo: 3, defaultStatus: 'present' },
          { name: 'Hassan Ali', admissionNo: '22017', rollNo: 4, defaultStatus: 'present' },
          { name: 'Zainab Malik', admissionNo: '22018', rollNo: 5, defaultStatus: 'present' },
          { name: 'Omar Farooq', admissionNo: '22019', rollNo: 6, defaultStatus: 'present' },
        ],
        'B': [
          { name: 'Fatima Noor', admissionNo: '21087', rollNo: 1, defaultStatus: 'present' },
          { name: 'Usman Ahmed', admissionNo: '21088', rollNo: 2, defaultStatus: 'present' },
        ]
      },
      'Class 9': {
        'A': [
          { name: 'Bilal Ahmed', admissionNo: '21045', rollNo: 1, defaultStatus: 'present' },
          { name: 'Hira Khan', admissionNo: '21046', rollNo: 2, defaultStatus: 'present' },
          { name: 'Imran Ali', admissionNo: '21047', rollNo: 3, defaultStatus: 'present' },
        ]
      }
    },
    '2023-2024': {
      'Class 1': {
        'A': [
          { name: 'David Lee', admissionNo: 'S101', rollNo: 1, defaultStatus: 'present' },
          { name: 'Emma Wilson', admissionNo: 'S102', rollNo: 2, defaultStatus: 'present' },
        ]
      }
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const toast = document.createElement('div');
    const colors = {
      info: 'bg-blue-600',
      success: 'bg-emerald-600',
      warn: 'bg-amber-600',
      error: 'bg-rose-600',
    };
    toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${colors[type]} animate-fade-in-down`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Update student list when filters change
  useEffect(() => {
    if (academicYear && selectedClass && selectedSection) {
      const studentList = dummyStudents[academicYear]?.[selectedClass]?.[selectedSection] || [];
      setStudents(studentList);

      // Initialize attendance status for all students as present by default
      const initialStatus: { [key: string]: 'present' | 'absent' | 'late' } = {};
      studentList.forEach(student => {
        initialStatus[student.admissionNo] = 'present';
      });
      setAttendanceStatus(initialStatus);
      setSelectedStudents(new Set());
      setSelectAll(false);
    } else {
      setStudents([]);
      setAttendanceStatus({});
      setSelectedStudents(new Set());
    }
  }, [academicYear, selectedClass, selectedSection]);

  // Handle attendance status change
  const handleStatusChange = (admissionNo: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [admissionNo]: status
    }));
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.admissionNo)));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual checkbox
  const handleSelectStudent = (admissionNo: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(admissionNo)) {
      newSelected.delete(admissionNo);
    } else {
      newSelected.add(admissionNo);
    }
    setSelectedStudents(newSelected);
    setSelectAll(newSelected.size === students.length);
  };

  // Bulk actions
  const markAllPresent = () => {
    const newStatus = { ...attendanceStatus };
    students.forEach(student => {
      newStatus[student.admissionNo] = 'present';
    });
    setAttendanceStatus(newStatus);
    showToast('All students marked as Present', 'success');
  };

  const markSelectedPresent = () => {
    if (selectedStudents.size === 0) {
      showToast('Please select students first', 'warn');
      return;
    }
    const newStatus = { ...attendanceStatus };
    selectedStudents.forEach(admNo => {
      newStatus[admNo] = 'present';
    });
    setAttendanceStatus(newStatus);
    showToast(`${selectedStudents.size} student(s) marked as Present`, 'success');
  };

  const markSelectedAbsent = () => {
    if (selectedStudents.size === 0) {
      showToast('Please select students first', 'warn');
      return;
    }
    const newStatus = { ...attendanceStatus };
    selectedStudents.forEach(admNo => {
      newStatus[admNo] = 'absent';
    });
    setAttendanceStatus(newStatus);
    showToast(`${selectedStudents.size} student(s) marked as Absent`, 'warn');
  };

  // Handle save attendance
  const handleSaveAttendance = () => {
    if (students.length === 0) {
      showToast('Please select Class, Section, and Date first', 'warn');
      return;
    }

    const attendanceData: AttendanceRecord[] = students.map(student => ({
      studentName: student.name,
      admissionNo: student.admissionNo,
      rollNo: student.rollNo,
      status: attendanceStatus[student.admissionNo] || 'present'
    }));

    console.log('Attendance Data Submitted:', attendanceData);
    console.log('Date:', selectedDate);
    console.log('Academic Year:', academicYear);
    console.log('Class:', selectedClass);
    console.log('Section:', selectedSection);

    // Count statistics
    const presentCount = Object.values(attendanceStatus).filter(s => s === 'present').length;
    const absentCount = Object.values(attendanceStatus).filter(s => s === 'absent').length;
    const lateCount = Object.values(attendanceStatus).filter(s => s === 'late').length;

    showToast(`Attendance saved! Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}`, 'success');
  };

  // Get attendance summary
  const getAttendanceSummary = () => {
    const total = students.length;
    const present = Object.values(attendanceStatus).filter(s => s === 'present').length;
    const absent = Object.values(attendanceStatus).filter(s => s === 'absent').length;
    const late = Object.values(attendanceStatus).filter(s => s === 'late').length;
    return { total, present, absent, late };
  };

  const summary = getAttendanceSummary();

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mark Student Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">Record daily attendance for students</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Class & Date</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection('');
              }}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Class</option>
              {academicYear && Object.keys(dummyStudents[academicYear] || {}).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Section</option>
              {selectedClass && Object.keys(dummyStudents[academicYear]?.[selectedClass] || {}).map(sec => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Total Students</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{summary.total}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
            <div className="text-sm text-emerald-700 font-medium">Present</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{summary.present}</div>
          </div>
          <div className="bg-rose-50 rounded-lg border border-rose-200 p-4">
            <div className="text-sm text-rose-700 font-medium">Absent</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{summary.absent}</div>
          </div>
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
            <div className="text-sm text-amber-700 font-medium">Late</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{summary.late}</div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Quick Actions:</span>
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Mark All Present
            </button>
            <button
              onClick={markSelectedPresent}
              disabled={selectedStudents.size === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Mark Selected Present ({selectedStudents.size})
            </button>
            <button
              onClick={markSelectedAbsent}
              disabled={selectedStudents.size === 0}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Mark Selected Absent ({selectedStudents.size})
            </button>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {students.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Admission No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {students.map((student) => (
                  <tr key={student.admissionNo} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(student.admissionNo)}
                        onChange={() => handleSelectStudent(student.admissionNo)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">
                      {student.rollNo}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {student.admissionNo}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-6">
                        {/* Present Radio */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`attendance-${student.admissionNo}`}
                            value="present"
                            checked={attendanceStatus[student.admissionNo] === 'present'}
                            onChange={() => handleStatusChange(student.admissionNo, 'present')}
                            className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-emerald-700 group-hover:text-emerald-800">
                            Present
                          </span>
                        </label>

                        {/* Absent Radio */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`attendance-${student.admissionNo}`}
                            value="absent"
                            checked={attendanceStatus[student.admissionNo] === 'absent'}
                            onChange={() => handleStatusChange(student.admissionNo, 'absent')}
                            className="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-rose-700 group-hover:text-rose-800">
                            Absent
                          </span>
                        </label>

                        {/* Late Radio */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`attendance-${student.admissionNo}`}
                            value="late"
                            checked={attendanceStatus[student.admissionNo] === 'late'}
                            onChange={() => handleStatusChange(student.admissionNo, 'late')}
                            className="w-4 h-4 text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-amber-700 group-hover:text-amber-800">
                            Late
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={() => {
                setSelectedClass('');
                setSelectedSection('');
                setStudents([]);
                showToast('Form reset', 'info');
              }}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleSaveAttendance}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              Save Attendance
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Students Selected</h3>
          <p className="text-slate-500">
            Please select Academic Year, Class, and Section to view students
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 mt-8">
        © 2025 eCampus — All rights reserved.
      </footer>
    </div>
  );
}
