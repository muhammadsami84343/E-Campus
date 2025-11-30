'use client';

import { useState } from 'react';

interface Subject {
  name: string;
  marks: number;
  total: number;
  grade: string;
}

interface ReportCard {
  id: string;
  name: string;
  cls: string;
  exam: string;
  status: 'completed' | 'pending';
  subjects: Subject[];
  totalMarks: number;
  percentage: number;
  overallGrade: string;
  position: string;
}

export default function ReportCardsPage() {
  const [qClass, setQClass] = useState('');
  const [qStudent, setQStudent] = useState('');
  const [qExam, setQExam] = useState('');
  const [qStatus, setQStatus] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  const reportCards: ReportCard[] = [
    { 
      id: '22014', 
      name: 'Ayesha Khan', 
      cls: 'Seven-A', 
      exam: 'Midterm', 
      status: 'completed',
      subjects: [
        { name: 'Mathematics', marks: 85, total: 100, grade: 'A' },
        { name: 'English', marks: 78, total: 100, grade: 'B' },
        { name: 'Science', marks: 92, total: 100, grade: 'A+' },
        { name: 'History', marks: 88, total: 100, grade: 'A' },
        { name: 'Geography', marks: 82, total: 100, grade: 'B' }
      ],
      totalMarks: 425,
      percentage: 85,
      overallGrade: 'A',
      position: '3rd'
    },
    { 
      id: '22015', 
      name: 'Ali Raza', 
      cls: 'Six-B', 
      exam: 'Midterm', 
      status: 'completed',
      subjects: [
        { name: 'Mathematics', marks: 76, total: 100, grade: 'B' },
        { name: 'English', marks: 82, total: 100, grade: 'B' },
        { name: 'Science', marks: 88, total: 100, grade: 'A' },
        { name: 'History', marks: 75, total: 100, grade: 'B' },
        { name: 'Geography', marks: 80, total: 100, grade: 'B' }
      ],
      totalMarks: 401,
      percentage: 80.2,
      overallGrade: 'B',
      position: '8th'
    },
    { 
      id: '22016', 
      name: 'Sara Ahmed', 
      cls: 'Eight-A', 
      exam: 'Midterm', 
      status: 'completed',
      subjects: [
        { name: 'Mathematics', marks: 95, total: 100, grade: 'A+' },
        { name: 'English', marks: 89, total: 100, grade: 'A' },
        { name: 'Science', marks: 91, total: 100, grade: 'A+' },
        { name: 'History', marks: 85, total: 100, grade: 'A' },
        { name: 'Geography', marks: 87, total: 100, grade: 'A' }
      ],
      totalMarks: 447,
      percentage: 89.4,
      overallGrade: 'A+',
      position: '1st'
    },
    { 
      id: '22017', 
      name: 'Hassan Ali', 
      cls: 'Five-C', 
      exam: 'Midterm', 
      status: 'completed',
      subjects: [
        { name: 'Mathematics', marks: 68, total: 100, grade: 'C' },
        { name: 'English', marks: 72, total: 100, grade: 'B' },
        { name: 'Science', marks: 75, total: 100, grade: 'B' },
        { name: 'History', marks: 70, total: 100, grade: 'C' },
        { name: 'Geography', marks: 74, total: 100, grade: 'B' }
      ],
      totalMarks: 359,
      percentage: 71.8,
      overallGrade: 'B',
      position: '12th'
    },
    { 
      id: '21045', 
      name: 'Bilal Ahmed', 
      cls: 'Nine-Sci', 
      exam: 'Midterm', 
      status: 'completed',
      subjects: [
        { name: 'Mathematics', marks: 88, total: 100, grade: 'A' },
        { name: 'English', marks: 85, total: 100, grade: 'A' },
        { name: 'Physics', marks: 92, total: 100, grade: 'A+' },
        { name: 'Chemistry', marks: 89, total: 100, grade: 'A' },
        { name: 'Biology', marks: 90, total: 100, grade: 'A+' }
      ],
      totalMarks: 444,
      percentage: 88.8,
      overallGrade: 'A+',
      position: '2nd'
    },
    { 
      id: '21087', 
      name: 'Fatima Noor', 
      cls: 'Eight-B', 
      exam: 'Midterm', 
      status: 'completed',
      subjects: [
        { name: 'Mathematics', marks: 82, total: 100, grade: 'B' },
        { name: 'English', marks: 88, total: 100, grade: 'A' },
        { name: 'Science', marks: 85, total: 100, grade: 'A' },
        { name: 'History', marks: 90, total: 100, grade: 'A+' },
        { name: 'Geography', marks: 86, total: 100, grade: 'A' }
      ],
      totalMarks: 431,
      percentage: 86.2,
      overallGrade: 'A',
      position: '5th'
    }
  ];

  const toast = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const colors = {
      info: 'bg-slate-900',
      success: 'bg-emerald-600',
      warn: 'bg-amber-600',
      error: 'bg-rose-600'
    };
    
    const toastEl = document.createElement('div');
    toastEl.className = `px-4 py-2 rounded-lg shadow text-white text-sm ${colors[type]}`;
    toastEl.textContent = msg;
    
    let toastHost = document.getElementById('toastHost');
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.id = 'toastHost';
      toastHost.className = 'fixed top-20 right-4 z-[100] space-y-2';
      document.body.appendChild(toastHost);
    }
    
    toastHost.appendChild(toastEl);
    
    setTimeout(() => {
      toastEl.classList.add('opacity-0', 'transition', 'duration-300');
      setTimeout(() => toastEl.remove(), 300);
    }, 2300);
  };

  const gradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'text-emerald-800',
      'A': 'text-green-800',
      'B': 'text-amber-800',
      'C': 'text-orange-800',
      'F': 'text-rose-800'
    };
    return colors[grade] || 'text-slate-800';
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800'
    };
    const labels: Record<string, string> = {
      completed: 'Completed',
      pending: 'Pending'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${map[status] || 'bg-slate-100 text-slate-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const applyFilters = () => {
    const newFiltered = reportCards.filter(r => {
      const matchesClass = !qClass || r.cls.toLowerCase().replace('-', '') === qClass;
      const matchesStudent = !qStudent || r.id === qStudent;
      const matchesExam = !qExam || r.exam.toLowerCase() === qExam;
      const matchesStatus = !qStatus || r.status === qStatus;
      return matchesClass && matchesStudent && matchesExam && matchesStatus;
    });
    setFiltered(newFiltered);
    setPage(1);
  };

  const clearFilters = () => {
    setQClass('');
    setQStudent('');
    setQExam('');
    setQStatus('');
    setFiltered(reportCards);
    setPage(1);
  };

  const handleView = (card: ReportCard) => {
    toast(`Viewing report card for ${card.name}`, 'info');
  };

  const handlePrint = (card: ReportCard) => {
    toast(`Printing report card for ${card.name}`, 'info');
  };

  const handleGenerate = () => {
    toast('Generating report cards...', 'info');
  };

  const handleExport = () => {
    toast('Exporting report cards...', 'info');
  };

  const handlePrintAll = () => {
    toast('Printing all report cards...', 'info');
    window.print();
  };

  const [filtered, setFiltered] = useState<ReportCard[]>(reportCards);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedCards = filtered.slice(start, start + PAGE_SIZE);

  const renderPaginationButtons = () => {
    const buttons = [];
    const windowSize = 5;
    let startPg = Math.max(1, page - Math.floor(windowSize / 2));
    let endPg = Math.min(totalPages, startPg + windowSize - 1);
    if (endPg - startPg < windowSize - 1) startPg = Math.max(1, endPg - windowSize + 1);

    for (let p = startPg; p <= endPg; p++) {
      buttons.push(
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1.5 rounded-lg border ${
            p === page
              ? 'bg-slate-900 text-white border-slate-900'
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {p}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-slate-700">Dashboard</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6"/>
          </svg>
          <span className="hover:text-slate-700">Academics</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6"/>
          </svg>
          <span className="text-slate-700">Report Cards</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Report Cards</h1>
            <p className="text-slate-600 mt-1">Midterm Examination - October 2025</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Generate Report
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Export
            </button>
            <button
              onClick={handlePrintAll}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Print
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">Class</label>
              <select
                value={qClass}
                onChange={(e) => setQClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Classes</option>
                <option value="sevena">Seven-A</option>
                <option value="eighta">Eight-A</option>
                <option value="eightb">Eight-B</option>
                <option value="ninesci">Nine-Sci</option>
                <option value="tenarts">Ten-Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Student</label>
              <select
                value={qStudent}
                onChange={(e) => setQStudent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Students</option>
                <option value="22014">Ayesha Khan (22014)</option>
                <option value="22015">Ali Raza (22015)</option>
                <option value="22016">Sara Ahmed (22016)</option>
                <option value="22017">Hassan Ali (22017)</option>
                <option value="21045">Bilal Ahmed (21045)</option>
                <option value="21087">Fatima Noor (21087)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Exam Type</label>
              <select
                value={qExam}
                onChange={(e) => setQExam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Exams</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="unit-test">Unit Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Status</label>
              <select
                value={qStatus}
                onChange={(e) => setQStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Clear Filters
            </button>
            <div className="ml-auto text-sm text-slate-600">
              Showing <span>{filtered.length}</span> of <span>{reportCards.length}</span> report cards
            </div>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{card.name}</h3>
                    <p className="text-sm text-slate-600">{card.cls} • {card.exam}</p>
                  </div>
                  <div className="text-right">
                    {statusBadge(card.status)}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-sm text-slate-600">Total Marks</div>
                    <div className="font-medium">{card.totalMarks}/500</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Percentage</div>
                    <div className="font-medium">{card.percentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Grade</div>
                    <div className={`font-medium ${gradeColor(card.overallGrade)}`}>{card.overallGrade}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Position</div>
                    <div className="font-medium">{card.position}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Subject-wise Marks</h4>
                  <div className="space-y-2">
                    {card.subjects.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm">{sub.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{sub.marks}/{sub.total}</span>
                          <span className={`text-xs ${gradeColor(sub.grade)} font-medium`}>{sub.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleView(card)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handlePrint(card)}
                    className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Page <span>{page}</span> of <span>{totalPages}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">
          © 2025 eCampus — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
