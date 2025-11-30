'use client';

import { useState, useEffect } from 'react';

interface Student {
  roll: number;
  adm: string;
  name: string;
  marks: number | null;
}

export default function MarksEntryPage() {
  const [selClass, setSelClass] = useState('');
  const [selSubject, setSelSubject] = useState('');
  const [selExamType, setSelExamType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [students, setStudents] = useState<Student[]>([
    { roll: 1, adm: '21001', name: 'Ali Ahmed', marks: null },
    { roll: 2, adm: '21002', name: 'Sara Khan', marks: null },
    { roll: 3, adm: '21003', name: 'Hassan Ali', marks: null },
    { roll: 4, adm: '21004', name: 'Fatima Noor', marks: null },
    { roll: 5, adm: '21005', name: 'Bilal Ahmed', marks: null },
    { roll: 6, adm: '21006', name: 'Ayesha Khan', marks: null },
    { roll: 7, adm: '21007', name: 'Usman Ali', marks: null },
    { roll: 8, adm: '21008', name: 'Zainab Ahmed', marks: null },
    { roll: 9, adm: '21009', name: 'Ibrahim Khan', marks: null },
    { roll: 10, adm: '21010', name: 'Maryam Ali', marks: null }
  ]);
  const [showTable, setShowTable] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTotalMarks, setCurrentTotalMarks] = useState(0);

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const gradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-emerald-100 text-emerald-700',
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-cyan-100 text-cyan-700',
      'C': 'bg-amber-100 text-amber-700',
      'D': 'bg-orange-100 text-orange-700',
      'F': 'bg-rose-100 text-rose-700'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${colors[grade] || 'bg-slate-100 text-slate-700'}`}>
        {grade}
      </span>
    );
  };

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

  const handleLoadStudents = () => {
    if (!selClass || !selSubject || !selExamType || !totalMarks) {
      setShowInfo(true);
      toast('Please fill all required fields', 'warn');
      return;
    }

    setShowInfo(false);
    setCurrentTotalMarks(parseInt(totalMarks));
    
    // Reset all marks
    setStudents(students.map(s => ({ ...s, marks: null })));
    
    setShowTable(true);
    toast('Students loaded successfully', 'success');
  };

  const handleClearSelection = () => {
    setSelClass('');
    setSelSubject('');
    setSelExamType('');
    setTotalMarks('');
    setShowTable(false);
    setShowInfo(true);
    setStudents(students.map(s => ({ ...s, marks: null })));
  };

  const handleMarksChange = (idx: number, value: string) => {
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      const newStudents = [...students];
      newStudents[idx].marks = null;
      setStudents(newStudents);
      return;
    }

    if (numValue < 0) {
      toast('Marks cannot be negative', 'error');
      return;
    }

    if (numValue > currentTotalMarks) {
      toast(`Marks cannot exceed ${currentTotalMarks}`, 'error');
      const newStudents = [...students];
      newStudents[idx].marks = currentTotalMarks;
      setStudents(newStudents);
      return;
    }

    const newStudents = [...students];
    newStudents[idx].marks = numValue;
    setStudents(newStudents);
  };

  const handleSaveMarks = () => {
    const entered = students.filter(s => s.marks !== null).length;
    if (entered === 0) {
      toast('Please enter marks for at least one student', 'warn');
      return;
    }

    setShowSuccess(true);
    toast(`Marks saved for ${entered} student(s)`, 'success');
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleImport = () => {
    toast('Import functionality coming soon', 'info');
  };

  const handleExport = () => {
    toast('Exporting marks data...', 'info');
  };

  // Calculate statistics
  const enteredCount = students.filter(s => s.marks !== null).length;
  const totalCount = students.length;
  
  const classAverage = () => {
    const validMarks = students.filter(s => s.marks !== null);
    if (validMarks.length === 0 || currentTotalMarks === 0) return '-';
    
    const avg = validMarks.reduce((sum, s) => sum + ((s.marks! / currentTotalMarks) * 100), 0) / validMarks.length;
    return avg.toFixed(2);
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
          <span className="text-slate-700">Marks Entry</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Marks Entry</h1>
            <p className="text-sm text-slate-500 mt-1">Enter and manage student examination marks</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleImport}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Import
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Export
            </button>
            <button
              onClick={handleSaveMarks}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save All Marks
            </button>
          </div>
        </div>

        {/* Exam Selection Card */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <h3 className="font-semibold mb-4">Select Exam & Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">Class *</label>
              <select
                value={selClass}
                onChange={(e) => setSelClass(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">Select class</option>
                <option>Seven-A</option>
                <option>Eight-A</option>
                <option>Nine-Science</option>
                <option>Ten-Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Subject *</label>
              <select
                value={selSubject}
                onChange={(e) => setSelSubject(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">Select subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Exam Type *</label>
              <select
                value={selExamType}
                onChange={(e) => setSelExamType(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">Select type</option>
                <option>Midterm</option>
                <option>Final</option>
                <option>Quiz</option>
                <option>Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Total Marks *</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                required
                min="1"
                max="100"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="100"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleLoadStudents}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Load Students
            </button>
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Info Message */}
        {showInfo && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Please select class, subject, exam type, and total marks to load students.
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Marks saved successfully!
            </div>
          </div>
        )}

        {/* Marks Entry Table */}
        {showTable && (
          <div className="bg-white rounded-2xl shadow">
            <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Enter Marks</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Class: <span>{selClass}</span> | Subject: <span>{selSubject}</span> | Total Marks: <span>{currentTotalMarks}</span>
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <span>{enteredCount}</span> of <span>{totalCount}</span> entered
              </div>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Roll No</th>
                    <th className="py-2 pr-4">Adm No</th>
                    <th className="py-2 pr-4">Student Name</th>
                    <th className="py-2 pr-4">Obtained Marks</th>
                    <th className="py-2 pr-4">Percentage</th>
                    <th className="py-2 pr-4">Grade</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student, idx) => {
                    const percentage = student.marks !== null && currentTotalMarks > 0
                      ? ((student.marks / currentTotalMarks) * 100).toFixed(2)
                      : '-';
                    const grade = percentage !== '-' ? calculateGrade(parseFloat(percentage)) : '-';
                    const status = student.marks !== null ? 'Entered' : 'Pending';
                    
                    return (
                      <tr key={student.adm}>
                        <td className="py-2 pr-4 font-medium">{student.roll}</td>
                        <td className="py-2 pr-4">{student.adm}</td>
                        <td className="py-2 pr-4 font-medium text-slate-900">{student.name}</td>
                        <td className="py-2 pr-4">
                          <input
                            type="number"
                            className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
                            min="0"
                            max={currentTotalMarks}
                            value={student.marks !== null ? student.marks : ''}
                            onChange={(e) => handleMarksChange(idx, e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td className="py-2 pr-4">
                          {percentage !== '-' ? `${percentage}%` : '-'}
                        </td>
                        <td className="py-2 pr-4">
                          {grade !== '-' ? gradeBadge(grade) : '-'}
                        </td>
                        <td className="py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            status === 'Entered' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t bg-slate-50 flex justify-between items-center">
              <div className="text-sm text-slate-600">
                <span className="font-medium">Class Average:</span> <span>{classAverage()}</span>%
              </div>
              <button
                onClick={handleSaveMarks}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Save Marks
              </button>
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
