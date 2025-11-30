'use client';

import { useState, useEffect } from 'react';

// Sample staff data
const staffData = [
  { id: 'EMP-001', name: 'Ayesha Khan', dept: 'Science', role: 'Teacher' },
  { id: 'EMP-002', name: 'Ali Raza', dept: 'Mathematics', role: 'Teacher' },
  { id: 'EMP-003', name: 'Sara Ahmed', dept: 'Administration', role: 'Clerk' },
  { id: 'EMP-004', name: 'Hassan Ali', dept: 'English', role: 'Teacher' },
  { id: 'EMP-005', name: 'Bilal Ahmed', dept: 'Accounts', role: 'Accountant' },
  { id: 'EMP-006', name: 'Fatima Noor', dept: 'Library', role: 'Librarian' },
  { id: 'EMP-007', name: 'Umer Farooq', dept: 'Transport', role: 'Driver' },
  { id: 'EMP-008', name: 'Maryam', dept: 'Administration', role: 'Peon' },
];

type AttendanceStatus = '' | 'present' | 'absent' | 'leave' | 'late';

interface StaffAttendance {
  id: string;
  name: string;
  dept: string;
  role: string;
  status: AttendanceStatus;
  inTime: string;
  outTime: string;
  remarks: string;
  selected: boolean;
}

export default function StaffMarkAttendancePage() {
  const [date, setDate] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [attendance, setAttendance] = useState<StaffAttendance[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'info' | 'success' | 'warn' | 'error'>('info');

  // Initialize with today's date and staff data
  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
    setAttendance(
      staffData.map((staff) => ({
        ...staff,
        status: '',
        inTime: '',
        outTime: '',
        remarks: '',
        selected: false,
      }))
    );
  }, []);

  const toast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const setStaffStatus = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((staff) => {
        if (staff.id === id) {
          let inTime = staff.inTime;
          let outTime = staff.outTime;

          if (status === 'present') {
            inTime = inTime || '08:00';
            outTime = outTime || '14:00';
          } else if (status === 'late') {
            inTime = '09:15';
            outTime = outTime || '14:00';
          } else if (status === 'leave' || status === 'absent') {
            inTime = '';
            outTime = '';
          }

          return { ...staff, status, inTime, outTime };
        }
        return staff;
      })
    );
  };

  const updateTime = (id: string, field: 'inTime' | 'outTime', value: string) => {
    setAttendance((prev) =>
      prev.map((staff) => (staff.id === id ? { ...staff, [field]: value } : staff))
    );
  };

  const updateRemarks = (id: string, remarks: string) => {
    setAttendance((prev) =>
      prev.map((staff) => (staff.id === id ? { ...staff, remarks } : staff))
    );
  };

  const toggleSelection = (id: string) => {
    setAttendance((prev) =>
      prev.map((staff) => (staff.id === id ? { ...staff, selected: !staff.selected } : staff))
    );
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setAttendance((prev) => prev.map((staff) => ({ ...staff, selected: newValue })));
  };

  const markAllPresent = () => {
    setAttendance((prev) =>
      prev.map((staff) =>
        isVisible(staff)
          ? { ...staff, status: 'present', inTime: '08:00', outTime: '14:00' }
          : staff
      )
    );
    toast('All visible staff marked Present', 'success');
  };

  const markAllAbsent = () => {
    setAttendance((prev) =>
      prev.map((staff) =>
        isVisible(staff) ? { ...staff, status: 'absent', inTime: '', outTime: '' } : staff
      )
    );
    toast('All visible staff marked Absent', 'warn');
  };

  const markSelectedPresent = () => {
    setAttendance((prev) =>
      prev.map((staff) =>
        staff.selected ? { ...staff, status: 'present', inTime: '08:00', outTime: '14:00' } : staff
      )
    );
    toast('Selected staff marked Present', 'success');
  };

  const clearSelected = () => {
    setAttendance((prev) =>
      prev.map((staff) =>
        staff.selected ? { ...staff, status: '', inTime: '', outTime: '' } : staff
      )
    );
    toast('Selected rows cleared', 'info');
  };

  const saveAttendance = () => {
    if (!date) {
      toast('Please select date', 'warn');
      return;
    }

    const payload = attendance.map((staff) => ({
      id: staff.id,
      status: staff.status || null,
      inTime: staff.inTime || null,
      outTime: staff.outTime || null,
      remarks: staff.remarks || null,
      date,
    }));

    console.log('Attendance payload:', payload);
    toast('Attendance saved successfully!', 'success');
  };

  const isVisible = (staff: StaffAttendance) => {
    const matchDept = !filterDept || staff.dept === filterDept;
    const matchRole = !filterRole || staff.role === filterRole;
    const matchSearch =
      !searchQuery ||
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchRole && matchSearch;
  };

  const filteredAttendance = attendance.filter(isVisible);

  const summary = {
    present: attendance.filter((s) => s.status === 'present').length,
    absent: attendance.filter((s) => s.status === 'absent').length,
    leave: attendance.filter((s) => s.status === 'leave').length,
    late: attendance.filter((s) => s.status === 'late').length,
  };

  const statusBadge = (status: AttendanceStatus) => {
    const styles = {
      present: 'bg-emerald-100 text-emerald-700',
      absent: 'bg-rose-100 text-rose-700',
      leave: 'bg-amber-100 text-amber-700',
      late: 'bg-indigo-100 text-indigo-700',
      '': 'bg-slate-100 text-slate-600',
    };
    const labels = {
      present: 'Present',
      absent: 'Absent',
      leave: 'Leave',
      late: 'Late',
      '': '—',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-[100]">
          <div
            className={`px-4 py-2 rounded-lg shadow text-white flex items-center gap-2 ${
              toastType === 'success'
                ? 'bg-emerald-600'
                : toastType === 'warn'
                ? 'bg-amber-600'
                : toastType === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900'
            }`}
          >
            {toastMessage}
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <a href="/" className="hover:text-slate-700">
          Dashboard
        </a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        <a href="#" className="hover:text-slate-700">
          Staff
        </a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span className="text-slate-700">Mark Attendance</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Mark Attendance (Staff)</h1>
        <div className="flex flex-wrap gap-2">
          <div className="hidden sm:flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present:{' '}
              <b>{summary.present}</b>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Absent:{' '}
              <b>{summary.absent}</b>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Leave:{' '}
              <b>{summary.leave}</b>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Late: <b>{summary.late}</b>
            </span>
          </div>
          <button
            onClick={saveAttendance}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-5 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Departments</option>
              <option>Administration</option>
              <option>Science</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Accounts</option>
              <option>Library</option>
              <option>Transport</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Roles</option>
              <option>Teacher</option>
              <option>Clerk</option>
              <option>Accountant</option>
              <option>Librarian</option>
              <option>Driver</option>
              <option>Peon</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm text-slate-600 mb-2">Search</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                  />
                </svg>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Search by name or ID..."
              />
            </div>
          </div>
        </div>

        {/* Bulk actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={markAllPresent}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Mark All Present
          </button>
          <button
            onClick={markAllAbsent}
            className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
          >
            Mark All Absent
          </button>
          <button
            onClick={markSelectedPresent}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Mark Selected Present
          </button>
          <button
            onClick={clearSelected}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Clear Selected
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Staff List</h3>
          <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-slate-300"
            />
            Select All
          </label>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-3 w-10">Sel</th>
                <th className="py-2 pr-4">Emp ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">In</th>
                <th className="py-2 pr-4">Out</th>
                <th className="py-2">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAttendance.map((staff) => (
                <tr key={staff.id}>
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={staff.selected}
                      onChange={() => toggleSelection(staff.id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="py-2 pr-4 font-medium text-slate-900">{staff.id}</td>
                  <td className="py-2 pr-4">{staff.name}</td>
                  <td className="py-2 pr-4">{staff.dept}</td>
                  <td className="py-2 pr-4">{staff.role}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex bg-slate-100 rounded-md overflow-hidden">
                        <button
                          onClick={() => setStaffStatus(staff.id, 'present')}
                          className="px-2 py-1 text-xs hover:bg-emerald-50"
                        >
                          P
                        </button>
                        <button
                          onClick={() => setStaffStatus(staff.id, 'absent')}
                          className="px-2 py-1 text-xs hover:bg-rose-50"
                        >
                          A
                        </button>
                        <button
                          onClick={() => setStaffStatus(staff.id, 'leave')}
                          className="px-2 py-1 text-xs hover:bg-amber-50"
                        >
                          L
                        </button>
                        <button
                          onClick={() => setStaffStatus(staff.id, 'late')}
                          className="px-2 py-1 text-xs hover:bg-indigo-50"
                        >
                          Late
                        </button>
                      </div>
                      {statusBadge(staff.status)}
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="time"
                      value={staff.inTime}
                      onChange={(e) => updateTime(staff.id, 'inTime', e.target.value)}
                      disabled={staff.status !== 'present' && staff.status !== 'late'}
                      className="w-28 px-2 py-1 rounded-md border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="time"
                      value={staff.outTime}
                      onChange={(e) => updateTime(staff.id, 'outTime', e.target.value)}
                      disabled={staff.status !== 'present' && staff.status !== 'late'}
                      className="w-28 px-2 py-1 rounded-md border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      value={staff.remarks}
                      onChange={(e) => updateRemarks(staff.id, e.target.value)}
                      className="w-full min-w-[160px] px-2 py-1 rounded-md border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Optional"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="text-center text-sm text-slate-500 mt-8">
        Made with ❤️ for schools — 2025
      </footer>
    </div>
  );
}
