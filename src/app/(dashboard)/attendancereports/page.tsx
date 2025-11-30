'use client';

import { useState, useEffect } from 'react';
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

interface AttendanceRecord {
  id: string;
  name: string;
  cls: string;
  gender: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  status: 'present' | 'absent' | 'late' | 'leave';
}

export default function AttendanceReportsPage() {
  const [qClass, setQClass] = useState('');
  const [qFrom, setQFrom] = useState('');
  const [qTo, setQTo] = useState('');
  const [qLevel, setQLevel] = useState('');
  const [qGender, setQGender] = useState('');
  const [qStatus, setQStatus] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);

  const PAGE_SIZE = 8;

  const attendanceData: AttendanceRecord[] = [
    { id: '22014', name: 'Ayesha Khan', cls: 'Seven-A', gender: 'Female', total: 30, present: 29, absent: 1, late: 0, leave: 0, status: 'present' },
    { id: '22015', name: 'Ali Raza', cls: 'Six-B', gender: 'Male', total: 30, present: 28, absent: 2, late: 1, leave: 0, status: 'present' },
    { id: '22016', name: 'Sara Ahmed', cls: 'Eight-A', gender: 'Female', total: 30, present: 30, absent: 0, late: 0, leave: 0, status: 'present' },
    { id: '22017', name: 'Hassan Ali', cls: 'Five-C', gender: 'Male', total: 30, present: 25, absent: 4, late: 1, leave: 1, status: 'absent' },
    { id: '21045', name: 'Bilal Ahmed', cls: 'Nine-Sci', gender: 'Male', total: 30, present: 28, absent: 1, late: 1, leave: 0, status: 'present' },
    { id: '21087', name: 'Fatima Noor', cls: 'Eight-B', gender: 'Female', total: 30, present: 29, absent: 0, late: 1, leave: 0, status: 'present' },
    { id: '21102', name: 'Umer Farooq', cls: 'Seven-A', gender: 'Male', total: 30, present: 22, absent: 6, late: 2, leave: 1, status: 'absent' },
    { id: '20988', name: 'Maryam', cls: 'Ten-Arts', gender: 'Female', total: 30, present: 27, absent: 2, late: 1, leave: 0, status: 'present' },
    { id: '21150', name: 'Zainab', cls: 'Eight-A', gender: 'Female', total: 30, present: 28, absent: 1, late: 1, leave: 0, status: 'present' },
    { id: '21200', name: 'Usman', cls: 'Nine-Sci', gender: 'Male', total: 30, present: 26, absent: 3, late: 1, leave: 0, status: 'present' }
  ];

  const [filtered, setFiltered] = useState<AttendanceRecord[]>(attendanceData);

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

  const calculateAttendance = (record: AttendanceRecord) => {
    return ((record.present / record.total) * 100).toFixed(1);
  };

  const attendanceBadge = (percentage: string) => {
    const pct = parseFloat(percentage);
    if (pct >= 95) return 'bg-emerald-100 text-emerald-800';
    if (pct >= 85) return 'bg-green-100 text-green-800';
    if (pct >= 70) return 'bg-amber-100 text-amber-800';
    return 'bg-rose-100 text-rose-800';
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      present: 'bg-emerald-100 text-emerald-800',
      absent: 'bg-rose-100 text-rose-800',
      late: 'bg-amber-100 text-amber-800',
      leave: 'bg-blue-100 text-blue-800'
    };
    const labels: Record<string, string> = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      leave: 'On Leave'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${map[status] || 'bg-slate-100 text-slate-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const applyFilters = () => {
    const newFiltered = attendanceData.filter(r => {
      const matchesClass = !qClass || r.cls.toLowerCase().replace('-', '') === qClass;
      const matchesGender = !qGender || r.gender.toLowerCase() === qGender;
      const matchesStatus = !qStatus || r.status === qStatus;
      
      let matchesLevel = true;
      if (qLevel) {
        const percentage = parseFloat(calculateAttendance(r));
        if (qLevel === 'excellent') matchesLevel = percentage >= 95;
        else if (qLevel === 'good') matchesLevel = percentage >= 85 && percentage < 95;
        else if (qLevel === 'average') matchesLevel = percentage >= 70 && percentage < 85;
        else if (qLevel === 'poor') matchesLevel = percentage < 70;
      }
      
      return matchesClass && matchesGender && matchesStatus && matchesLevel;
    });
    setFiltered(newFiltered);
    setPage(1);
  };

  const clearFilters = () => {
    setQClass('');
    setQFrom('');
    setQTo('');
    setQLevel('');
    setQGender('');
    setQStatus('');
    setFiltered(attendanceData);
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

  const handleGenerate = () => {
    toast('Generating comprehensive attendance report...', 'info');
  };

  const handleExport = () => {
    if (selected.size > 0) {
      toast(`Exporting ${selected.size} selected attendance records...`, 'info');
    } else {
      toast('Exporting all attendance records...', 'info');
    }
  };

  const handlePrint = () => {
    if (selected.size > 0) {
      toast(`Printing ${selected.size} selected attendance records...`, 'info');
    } else {
      toast('Printing all attendance records...', 'info');
      window.print();
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedRecords = filtered.slice(start, start + PAGE_SIZE);

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
  const trendChartData = {
    labels: Array.from({length:12},(_,i)=>`Wk ${i+1}`),
    datasets: [{
      label: 'Attendance %',
      data: [91,92,93,90,94,95,92,93,96,94,95,97],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      pointRadius: 3,
      tension: 0.3,
      fill: true
    }]
  };

  const trendChartOptions = {
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

  const classChartData = {
    labels: ['Five-C', 'Six-B', 'Seven-A', 'Eight-A', 'Eight-B', 'Nine-Sci', 'Ten-Arts'],
    datasets: [{
      label: 'Attendance %',
      data: [82.3, 94.1, 95.7, 96.2, 95.8, 93.9, 94.5],
      backgroundColor: 'rgb(79, 70, 229)',
      borderRadius: 4,
      borderSkipped: false
    }]
  };

  const classChartOptions = {
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
    const rowsOnPage = paginatedRecords;
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
          <span className="text-slate-700">Attendance Reports</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Attendance Reports</h1>
            <p className="text-slate-600 mt-1">Comprehensive attendance analytics and insights</p>
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
            <div className="text-slate-500">Overall Attendance</div>
            <div className="text-2xl font-bold mt-1">94.2%</div>
            <div className="text-sm text-slate-500 mt-1">+1.2% from last month</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Perfect Attendance</div>
            <div className="text-2xl font-bold mt-1">387</div>
            <div className="text-sm text-slate-500 mt-1">100% attendance students</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Needs Attention</div>
            <div className="text-2xl font-bold mt-1">42</div>
            <div className="text-sm text-slate-500 mt-1">Below 80% attendance</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-slate-500">Most Absent Class</div>
            <div className="text-2xl font-bold mt-1">Five-C</div>
            <div className="text-sm text-slate-500 mt-1">82.3% average attendance</div>
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
              <label className="block text-sm text-slate-600 mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={qFrom}
                  onChange={(e) => setQFrom(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={qTo}
                  onChange={(e) => setQTo(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="To"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Attendance Level</label>
              <select
                value={qLevel}
                onChange={(e) => setQLevel(e.target.value)}
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
            <div>
              <label className="block text-sm text-slate-600 mb-2">Status</label>
              <select
                value={qStatus}
                onChange={(e) => setQStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="leave">On Leave</option>
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
              Showing <span>{filtered.length}</span> of <span>{attendanceData.length}</span> records
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Attendance Trend (Last 12 Weeks)</h3>
              <select className="text-sm px-2 py-1 border border-slate-300 rounded">
                <option>All Classes</option>
                <option>Seven-A</option>
                <option>Eight-A</option>
                <option>Nine-Sci</option>
              </select>
            </div>
            <div className="mt-4">
              <Line data={trendChartData} options={trendChartOptions} />
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
              <Bar data={classChartData} options={classChartOptions} />
            </div>
          </div>
        </div>

        {/* Attendance Reports Table */}
        <div className="bg-white rounded-2xl shadow">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Attendance Records</h3>
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
                  <th className="py-2 pr-4 text-center">Total Days</th>
                  <th className="py-2 pr-4 text-center">Present</th>
                  <th className="py-2 pr-4 text-center">Absent</th>
                  <th className="py-2 pr-4 text-center">Late</th>
                  <th className="py-2 pr-4 text-center">Leave</th>
                  <th className="py-2 pr-4 text-center">Attendance %</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedRecords.map((r) => {
                  const percentage = calculateAttendance(r);
                  return (
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
                      <td className="py-2 pr-4 text-center">{r.total}</td>
                      <td className="py-2 pr-4 text-center">{r.present}</td>
                      <td className="py-2 pr-4 text-center">{r.absent}</td>
                      <td className="py-2 pr-4 text-center">{r.late}</td>
                      <td className="py-2 pr-4 text-center">{r.leave}</td>
                      <td className="py-2 pr-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${attendanceBadge(percentage)}`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="py-2">{statusBadge(r.status)}</td>
                    </tr>
                  );
                })}
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
