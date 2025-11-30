'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ExamStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
type ExamType = 'Midterm' | 'Final' | 'Quiz' | 'Test';

type Exam = {
  id: number;
  date: string;
  time: string;
  subject: string;
  class: string;
  type: ExamType;
  duration: string;
  room: string;
  status: ExamStatus;
};

const mockExams: Exam[] = [
  { id: 1, date: '2025-01-20', time: '09:00 AM', subject: 'Mathematics', class: 'Nine-Science', type: 'Midterm', duration: '3 hours', room: 'Room 101', status: 'Upcoming' },
  { id: 2, date: '2025-01-20', time: '09:00 AM', subject: 'Physics', class: 'Ten-Science', type: 'Midterm', duration: '3 hours', room: 'Room 102', status: 'Upcoming' },
  { id: 3, date: '2025-01-21', time: '09:00 AM', subject: 'Chemistry', class: 'Nine-Science', type: 'Midterm', duration: '3 hours', room: 'Room 101', status: 'Upcoming' },
  { id: 4, date: '2025-01-21', time: '09:00 AM', subject: 'Biology', class: 'Ten-Science', type: 'Midterm', duration: '3 hours', room: 'Room 103', status: 'Upcoming' },
  { id: 5, date: '2025-01-22', time: '09:00 AM', subject: 'English', class: 'Eight-A', type: 'Midterm', duration: '2 hours', room: 'Room 201', status: 'Upcoming' },
  { id: 6, date: '2025-01-15', time: '02:00 PM', subject: 'Computer Science', class: 'Nine-Science', type: 'Test', duration: '1 hour', room: 'Lab 1', status: 'In Progress' },
  { id: 7, date: '2025-01-15', time: '10:00 AM', subject: 'History', class: 'Seven-A', type: 'Quiz', duration: '30 mins', room: 'Room 301', status: 'In Progress' },
  { id: 8, date: '2025-01-15', time: '11:00 AM', subject: 'Geography', class: 'Eight-A', type: 'Test', duration: '1 hour', room: 'Room 302', status: 'In Progress' },
  { id: 9, date: '2025-01-10', time: '09:00 AM', subject: 'Urdu', class: 'Seven-A', type: 'Midterm', duration: '2 hours', room: 'Room 201', status: 'Completed' },
  { id: 10, date: '2025-01-10', time: '09:00 AM', subject: 'Islamiyat', class: 'Eight-A', type: 'Midterm', duration: '2 hours', room: 'Room 202', status: 'Completed' },
  { id: 11, date: '2025-01-11', time: '09:00 AM', subject: 'Mathematics', class: 'Seven-A', type: 'Midterm', duration: '2 hours', room: 'Room 101', status: 'Completed' },
  { id: 12, date: '2025-01-12', time: '09:00 AM', subject: 'Science', class: 'Seven-A', type: 'Midterm', duration: '2 hours', room: 'Room 102', status: 'Completed' },
  { id: 13, date: '2025-01-13', time: '09:00 AM', subject: 'Social Studies', class: 'Eight-A', type: 'Midterm', duration: '2 hours', room: 'Room 301', status: 'Completed' },
  { id: 14, date: '2025-01-23', time: '02:00 PM', subject: 'Art', class: 'Seven-A', type: 'Final', duration: '2 hours', room: 'Art Room', status: 'Upcoming' },
  { id: 15, date: '2025-01-24', time: '09:00 AM', subject: 'Physical Education', class: 'Eight-A', type: 'Quiz', duration: '1 hour', room: 'Gym', status: 'Upcoming' },
];

const PAGE_SIZE = 10;

export default function ExamSchedulePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [filtered, setFiltered] = useState<Exam[]>(mockExams);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    class: '',
    type: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const statusBadge = (status: ExamStatus) => {
    const colors = {
      'Upcoming': 'bg-cyan-100 text-cyan-700',
      'In Progress': 'bg-amber-100 text-amber-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const typeBadge = (type: ExamType) => {
    const colors = {
      'Midterm': 'bg-indigo-100 text-indigo-700',
      'Final': 'bg-purple-100 text-purple-700',
      'Quiz': 'bg-pink-100 text-pink-700',
      'Test': 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  const applyFilters = () => {
    const q = filters.search.toLowerCase().trim();
    const cls = filters.class;
    const typ = filters.type;
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;

    const result = exams.filter((exam) => {
      const matchesQ = !q || [exam.subject, exam.class].join(' ').toLowerCase().includes(q);
      const matchesClass = !cls || exam.class === cls;
      const matchesType = !typ || exam.type === typ;
      const examDate = new Date(exam.date + 'T00:00:00');
      const matchesFrom = !from || examDate >= from;
      const matchesTo = !to || examDate <= to;
      return matchesQ && matchesClass && matchesType && matchesFrom && matchesTo;
    });

    setFiltered(result);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', class: '', type: '', dateFrom: '', dateTo: '' });
    setFiltered(exams);
    setPage(1);
  };

  const handleToggleSelect = (id: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleSelectAll = () => {
    const start = (page - 1) * PAGE_SIZE;
    const pageExams = filtered.slice(start, start + PAGE_SIZE);
    const pageIds = pageExams.map((e) => e.id);
    const allSelected = pageIds.every((id) => selected.has(id));

    const newSelected = new Set(selected);
    if (allSelected) {
      pageIds.forEach((id) => newSelected.delete(id));
    } else {
      pageIds.forEach((id) => newSelected.add(id));
    }
    setSelected(newSelected);
  };

  const handleCancelExam = (id: number) => {
    const exam = exams.find((e) => e.id === id);
    if (!exam) return;
    if (confirm(`Cancel ${exam.subject} exam on ${exam.date}?`)) {
      setExams(exams.map((e) => (e.id === id ? { ...e, status: 'Cancelled' as ExamStatus } : e)));
      setFiltered(filtered.map((e) => (e.id === id ? { ...e, status: 'Cancelled' as ExamStatus } : e)));
      showToast('Exam cancelled', 'success');
    }
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) {
      showToast('Select exams first', 'warn');
      return;
    }
    if (confirm(`Delete ${selected.size} selected exam(s)?`)) {
      const remaining = exams.filter((e) => !selected.has(e.id));
      setExams(remaining);
      setFiltered(remaining.filter((e) => filtered.some((f) => f.id === e.id)));
      setSelected(new Set());
      showToast('Selected exams deleted', 'success');
    }
  };

  const getSummary = () => {
    const today = new Date();
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcoming = exams.filter((e) => e.status === 'Upcoming').length;
    const inProgress = exams.filter((e) => e.status === 'In Progress').length;
    const completed = exams.filter((e) => e.status === 'Completed').length;
    const upcomingWeek = exams.filter((e) => {
      const examDate = new Date(e.date);
      return e.status === 'Upcoming' && examDate >= today && examDate <= next7Days;
    }).length;

    return { total: exams.length, upcomingWeek, inProgress, completed };
  };

  if (!isMounted) {
    return null;
  }

  const summary = getSummary();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedExams = filtered.slice(start, start + PAGE_SIZE);

  const allPageSelected =
    paginatedExams.length > 0 && paginatedExams.every((e) => selected.has(e.id));

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100]">
          <div
            className={`px-4 py-2 rounded-lg shadow text-white text-sm ${
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

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/dashboard" className="hover:text-slate-700">
            Dashboard
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="hover:text-slate-700">Academics</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-slate-700">Exam Schedule</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Exam Schedule</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and organize examination timetables</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => showToast('Opening add exam form...', 'info')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
              </svg>
              Add Exam
            </button>
            <button
              onClick={() => showToast('Publishing exam schedule to students...', 'success')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Publish Schedule
            </button>
            <button
              onClick={() => {
                showToast('Preparing print view...', 'info');
                setTimeout(() => window.print(), 500);
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Print
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-2xl p-5 text-white">
            <div className="text-white/90 text-sm">Total Exams</div>
            <div className="text-3xl font-bold mt-1">{summary.total}</div>
            <div className="text-white/70 text-sm mt-1">This semester</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl p-5 text-white">
            <div className="text-white/90 text-sm">Upcoming</div>
            <div className="text-3xl font-bold mt-1">{summary.upcomingWeek}</div>
            <div className="text-white/70 text-sm mt-1">Next 7 days</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
            <div className="text-white/90 text-sm">In Progress</div>
            <div className="text-3xl font-bold mt-1">{summary.inProgress}</div>
            <div className="text-white/70 text-sm mt-1">Currently running</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-600 to-blue-500 rounded-2xl p-5 text-white">
            <div className="text-white/90 text-sm">Completed</div>
            <div className="text-3xl font-bold mt-1">{summary.completed}</div>
            <div className="text-white/70 text-sm mt-1">This semester</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm text-slate-600 mb-2">Search (Subject / Class)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  </svg>
                </span>
                <input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Class</label>
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Classes</option>
                <option>Seven-A</option>
                <option>Eight-A</option>
                <option>Nine-Science</option>
                <option>Ten-Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Exam Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Types</option>
                <option>Midterm</option>
                <option>Final</option>
                <option>Quiz</option>
                <option>Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-between">
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Filter
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
            <div className="text-sm text-slate-600">
              Showing {filtered.length} of {exams.length}
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-2xl shadow">
          <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">Scheduled Exams</h3>
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={allPageSelected}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-slate-300"
              />
              Select All
            </label>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-3 w-10">Sel</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Class</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Duration</th>
                  <th className="py-2 pr-4">Room</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedExams.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-slate-500" colSpan={10}>
                      No exams found
                    </td>
                  </tr>
                ) : (
                  paginatedExams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={selected.has(exam.id)}
                          onChange={() => handleToggleSelect(exam.id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="py-2 pr-4 font-medium text-slate-900">{exam.date}</td>
                      <td className="py-2 pr-4">{exam.time}</td>
                      <td className="py-2 pr-4 font-medium">{exam.subject}</td>
                      <td className="py-2 pr-4">{exam.class}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${typeBadge(exam.type)}`}>
                          {exam.type}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{exam.duration}</td>
                      <td className="py-2 pr-4">{exam.room}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${statusBadge(exam.status)}`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => showToast(`Viewing ${exam.subject} exam details`, 'info')}
                            className="px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-50 text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => showToast(`Editing ${exam.subject} exam`, 'info')}
                            className="px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-50 text-xs"
                          >
                            Edit
                          </button>
                          {exam.status === 'Upcoming' && (
                            <button
                              onClick={() => handleCancelExam(exam.id)}
                              className="px-2 py-1 rounded-md border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (page > 3) pageNum = page - 2 + i;
                      if (page > totalPages - 2) pageNum = totalPages - 4 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg border ${
                          page === pageNum
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">© 2025 eCampus — All rights reserved.</footer>
      </div>
    </>
  );
}
