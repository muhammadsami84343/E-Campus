'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudentReport {
  id: string;
  name: string;
  cls: string;
  gender: string;
  attendance: number;
  marks: number;
  grade: string;
  rank: number;
}

export default function StudentReportsPage() {
  const [qClass, setQClass] = useState('');
  const [qSubject, setQSubject] = useState('');
  const [qPerformance, setQPerformance] = useState('');
  const [qAttendance, setQAttendance] = useState('');
  const [qGender, setQGender] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);

  const PAGE_SIZE = 8;

  const studentReports: StudentReport[] = [
    { id: '22014', name: 'Ayesha Khan', cls: 'Seven-A', gender: 'Female', attendance: 96.5, marks: 85.2, grade: 'A', rank: 3 },
    { id: '22015', name: 'Ali Raza', cls: 'Six-B', gender: 'Male', attendance: 92.3, marks: 80.1, grade: 'B', rank: 8 },
    { id: '22016', name: 'Sara Ahmed', cls: 'Eight-A', gender: 'Female', attendance: 98.7, marks: 89.4, grade: 'A+', rank: 1 },
    { id: '22017', name: 'Hassan Ali', cls: 'Five-C', gender: 'Male', attendance: 88.9, marks: 71.8, grade: 'B', rank: 12 },
    { id: '21045', name: 'Bilal Ahmed', cls: 'Nine-Sci', gender: 'Male', attendance: 95.2, marks: 88.8, grade: 'A+', rank: 2 },
    { id: '21087', name: 'Fatima Noor', cls: 'Eight-B', gender: 'Female', attendance: 97.1, marks: 86.2, grade: 'A', rank: 5 },
    { id: '21102', name: 'Umer Farooq', cls: 'Seven-A', gender: 'Male', attendance: 85.4, marks: 68.3, grade: 'C', rank: 18 },
    { id: '20988', name: 'Maryam', cls: 'Ten-Arts', gender: 'Female', attendance: 94.8, marks: 82.7, grade: 'A', rank: 7 },
    { id: '21150', name: 'Zainab', cls: 'Eight-A', gender: 'Female', attendance: 93.6, marks: 79.5, grade: 'B', rank: 9 },
    { id: '21200', name: 'Usman', cls: 'Nine-Sci', gender: 'Male', attendance: 90.2, marks: 75.6, grade: 'B', rank: 11 }
  ];

  const [filtered, setFiltered] = useState<StudentReport[]>(studentReports);

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

  const performanceBadge = (marks: number) => {
    if (marks >= 90) return 'bg-emerald-100 text-emerald-800';
    if (marks >= 75) return 'bg-green-100 text-green-800';
    if (marks >= 60) return 'bg-amber-100 text-amber-800';
    return 'bg-rose-100 text-rose-800';
  };

  const attendanceBadge = (attendance: number) => {
    if (attendance >= 95) return 'bg-emerald-100 text-emerald-800';
    if (attendance >= 85) return 'bg-green-100 text-green-800';
    if (attendance >= 70) return 'bg-amber-100 text-amber-800';
    return 'bg-rose-100 text-rose-800';
  };

  const applyFilters = () => {
    const newFiltered = studentReports.filter(r => {
      const matchesClass = !qClass || r.cls.toLowerCase().replace('-', '') === qClass;
      const matchesGender = !qGender || r.gender.toLowerCase() === qGender;
      
      let matchesPerformance = true;
      if (qPerformance) {
        if (qPerformance === 'excellent') matchesPerformance = r.marks >= 90;
        else if (qPerformance === 'good') matchesPerformance = r.marks >= 75 && r.marks < 90;
        else if (qPerformance === 'average') matchesPerformance = r.marks >= 60 && r.marks < 75;
        else if (qPerformance === 'poor') matchesPerformance = r.marks < 60;
      }
      
      let matchesAttendance = true;
      if (qAttendance) {
        if (qAttendance === 'excellent') matchesAttendance = r.attendance >= 95;
        else if (qAttendance === 'good') matchesAttendance = r.attendance >= 85 && r.attendance < 95;
        else if (qAttendance === 'average') matchesAttendance = r.attendance >= 70 && r.attendance < 85;
        else if (qAttendance === 'poor') matchesAttendance = r.attendance < 70;
      }
      
      return matchesClass && matchesGender && matchesPerformance && matchesAttendance;
    });
    setFiltered(newFiltered);
    setPage(1);
  };

  const clearFilters = () => {
    setQClass('');
    setQSubject('');
    setQPerformance('');
    setQAttendance('');
    setQGender('');
    setFiltered(studentReports);
    setPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const start = (page - 1) * PAGE_SIZE;
    const rowsOnPage = filtered.slice(start, start + PAGE_SIZE);
    const newSelected = new Set(selected);
    rowsOnPage.forEach(r => {
      if (checked) newSelected.add(r.id);
      else newSelected.delete(r.id);
    });
    setSelected(newSelected);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selected);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelected(newSelected);
  };

  const handleView = (student: StudentReport) => {
    toast(`Viewing detailed report for ${student.name}`, 'info');
  };

  const handleReport = (student: StudentReport) => {
    toast(`Generating report card for ${student.name}`, 'info');
  };

  const handleGenerate = () => {
    toast('Generating comprehensive student report...', 'info');
  };

  const handleExport = () => {
    if (selected.size > 0) {
      toast(`Exporting ${selected.size} selected student reports...`, 'info');
    } else {
      toast('Exporting all student reports...', 'info');
    }
  };

  const handlePrint = () => {
    if (selected.size > 0) {
      toast(`Printing ${selected.size} selected student reports...`, 'info');
    } else {
      toast('Printing all student reports...', 'info');
      window.print();
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedReports = filtered.slice(start, start + PAGE_SIZE);

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

  // Chart data
  const performanceChartData = {
    labels: ['A+', 'A', 'B', 'C', 'F'],
    datasets: [{
      label: 'Number of Students',
      data: [87, 245, 312, 187, 42],
      backgroundColor: [
        'rgb(16, 185, 129)',
        'rgb(34, 197, 94)',
        'rgb(245, 158, 11)',
        'rgb(249, 115, 22)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 0
    }]
  };

  const performanceChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  const attendanceChartData = {
    labels: ['Five-C', 'Six-B', 'Seven-A', 'Eight-A', 'Eight-B', 'Nine-Sci', 'Ten-Arts'],
    datasets: [{
      label: 'Attendance %',
      data: [92.3, 94.1, 95.7, 96.2, 95.8, 93.9, 94.5],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      pointRadius: 3,
      tension: 0.3,
      fill: true
    }]
  };

  const attendanceChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 80,
        max: 100,
        ticks: { callback: (value: any) => value + '%' },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: { grid: { display: false } }
    }
  };

  // Sync selectAll with current page
  useEffect(() => {
    const rowsOnPage = paginatedReports;
    if (rowsOnPage.length === 0) {
      setSelectAll(false);
      return;
    }
    const allChecked = rowsOnPage.every(r => selected.has(r.id));
    setSelectAll(allChecked);
  }, [page, filtered, selected]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-slate-700">Dashboard</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6"/>
          </svg>
          <span className="hover:text-slate-700">Reports</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6"/>
          </svg>
          <span className="text-slate-700">Student Reports</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Student Reports</h1>
            <p className="text-slate-600 mt-1">Comprehensive student performance analytics</p>
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
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Total Students</div>
            <div className="text-2xl font-bold mt-1">1,248</div>
            <div className="text-sm text-slate-500 mt-1">+32 this month</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Average Attendance</div>
            <div className="text-2xl font-bold mt-1">94.2%</div>
            <div className="text-sm text-slate-500 mt-1">Above target (90%)</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Top Performers</div>
            <div className="text-2xl font-bold mt-1">87</div>
            <div className="text-sm text-slate-500 mt-1">A+ grade students</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Needs Improvement</div>
            <div className="text-2xl font-bold mt-1">42</div>
            <div className="text-sm text-slate-500 mt-1">Below 60% marks</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">Class</label>
              <select
                value={qClass}
                onChange={(e) => setQClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Classes</option>
                <option value="fivec">Five-C</option>
                <option value="sixb">Six-B</option>
                <option value="sevena">Seven-A</option>
                <option value="eighta">Eight-A</option>
                <option value="eightb">Eight-B</option>
                <option value="ninesci">Nine-Sci</option>
                <option value="tenarts">Ten-Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Subject</label>
              <select
                value={qSubject}
                onChange={(e) => setQSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="english">English</option>
                <option value="science">Science</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Performance</label>
              <select
                value={qPerformance}
                onChange={(e) => setQPerformance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="excellent">Excellent (90-100%)</option>
                <option value="good">Good (75-89%)</option>
                <option value="average">Average (60-74%)</option>
                <option value="poor">Poor (Below 60%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Attendance</label>
              <select
                value={qAttendance}
                onChange={(e) => setQAttendance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="excellent">Excellent (95-100%)</option>
                <option value="good">Good (85-94%)</option>
                <option value="average">Average (70-84%)</option>
                <option value="poor">Poor (Below 70%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Gender</label>
              <select
                value={qGender}
                onChange={(e) => setQGender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
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
              Showing <span>{filtered.length}</span> of <span>{studentReports.length}</span> students
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Performance Distribution</h3>
              <select className="text-sm px-2 py-1 border border-slate-300 rounded">
                <option>Midterm Exams</option>
                <option>Final Exams</option>
                <option>Unit Tests</option>
              </select>
            </div>
            <div className="mt-4">
              <Bar data={performanceChartData} options={performanceChartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Attendance by Class</h3>
              <select className="text-sm px-2 py-1 border border-slate-300 rounded">
                <option>Current Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="mt-4">
              <Line data={attendanceChartData} options={attendanceChartOptions} />
            </div>
          </div>
        </div>

        {/* Student Reports Table */}
        <div className="bg-white rounded-2xl shadow">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Student Reports</h3>
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
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
                  <th className="py-2 pr-4">Adm No</th>
                  <th className="py-2 pr-4">Student Name</th>
                  <th className="py-2 pr-4">Class</th>
                  <th className="py-2 pr-4">Gender</th>
                  <th className="py-2 pr-4 text-center">Attendance %</th>
                  <th className="py-2 pr-4 text-center">Avg. Marks %</th>
                  <th className="py-2 pr-4 text-center">Grade</th>
                  <th className="py-2 pr-4 text-center">Rank</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedReports.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-3">
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={(e) => handleRowSelect(r.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-900">{r.id}</td>
                    <td className="py-2 pr-4">{r.name}</td>
                    <td className="py-2 pr-4">{r.cls}</td>
                    <td className="py-2 pr-4">{r.gender}</td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${attendanceBadge(r.attendance)} text-xs`}>
                        {r.attendance.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${performanceBadge(r.marks)} text-xs`}>
                        {r.marks.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`font-medium ${gradeColor(r.grade)}`}>{r.grade}</span>
                    </td>
                    <td className="py-2 pr-4 text-center">#{r.rank}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleView(r)}
                          className="px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleReport(r)}
                          className="px-2 py-1 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">
          © 2025 eCampus — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
