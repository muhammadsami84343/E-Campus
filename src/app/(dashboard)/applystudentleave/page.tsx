'use client';

import { useState, useEffect } from 'react';

// Mock student data
const students: Record<string, { name: string; class: string; section: string }> = {
  '22014': { name: 'Ayesha Khan', class: 'Seven', section: 'A' },
  '22015': { name: 'Ali Raza', class: 'Six', section: 'B' },
  '22016': { name: 'Sara Ahmed', class: 'Eight', section: 'A' },
  '22017': { name: 'Hassan Ali', class: 'Five', section: 'C' },
};

// Recent leave applications data
const recentApplications = [
  { admNo: '22014', student: 'Ayesha Khan', type: 'Sick Leave', duration: '3 days', status: 'Approved' as const },
  { admNo: '22015', student: 'Ali Raza', type: 'Emergency', duration: '1 day', status: 'Pending' as const },
  { admNo: '22016', student: 'Sara Ahmed', type: 'Casual Leave', duration: '2 days', status: 'Rejected' as const },
];

export default function ApplyStudentLeavePage() {
  const [formData, setFormData] = useState({
    admissionNo: '',
    studentName: '',
    studentClass: '',
    studentSection: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    contactNumber: '',
    emergencyContact: '',
    notes: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [totalDays, setTotalDays] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'info' | 'success' | 'warn' | 'error'>('info');

  const toast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Auto-fill student details
  useEffect(() => {
    const student = students[formData.admissionNo];
    if (student) {
      setFormData((prev) => ({
        ...prev,
        studentName: student.name,
        studentClass: student.class,
        studentSection: student.section,
      }));
    } else if (formData.admissionNo) {
      setFormData((prev) => ({
        ...prev,
        studentName: '',
        studentClass: '',
        studentSection: '',
      }));
    }
  }, [formData.admissionNo]);

  // Calculate total days
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diff > 0 ? diff : 0);
    } else {
      setTotalDays(0);
    }
  }, [formData.fromDate, formData.toDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(Array.from(fileList));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.reason.length < 20) {
      toast('Reason must be at least 20 characters long', 'error');
      return;
    }

    if (!students[formData.admissionNo]) {
      toast('Invalid admission number', 'error');
      return;
    }

    // Submit logic here
    console.log('Form Data:', formData);
    console.log('Files:', files);

    toast('Leave application submitted successfully!', 'success');

    // Reset form after 1 second
    setTimeout(() => {
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      admissionNo: '',
      studentName: '',
      studentClass: '',
      studentSection: '',
      leaveType: '',
      fromDate: '',
      toDate: '',
      reason: '',
      contactNumber: '',
      emergencyContact: '',
      notes: '',
    });
    setFiles([]);
    setTotalDays(0);
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  const statusBadge = (status: 'Approved' | 'Pending' | 'Rejected') => {
    const styles = {
      Approved: 'bg-emerald-100 text-emerald-700',
      Pending: 'bg-amber-100 text-amber-700',
      Rejected: 'bg-rose-100 text-rose-700',
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
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
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
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
          Students
        </a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span className="text-slate-700">Apply Leave</span>
      </nav>

      <h1 className="text-2xl font-semibold mb-6">Apply Leave</h1>

      {/* Leave Application Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow">
        {/* Form Header */}
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold">Leave Application Form</h2>
          <p className="text-sm text-slate-500 mt-1">Submit leave requests for students</p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Student Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admission Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="e.g., 22014"
                required
              />
              <p className="mt-1 text-sm text-slate-500">Enter student&apos;s admission number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed"
                placeholder="Auto-filled after entering admission no."
                readOnly
              />
            </div>
          </div>

          {/* Class and Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
              <input
                type="text"
                name="studentClass"
                value={formData.studentClass}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed"
                placeholder="Auto-filled"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Section</label>
              <input
                type="text"
                name="studentSection"
                value={formData.studentSection}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed"
                placeholder="Auto-filled"
                readOnly
              />
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Leave Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            >
              <option value="">Select leave type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="planned">Planned Leave</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                From Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                min={today}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                To Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                min={formData.fromDate || today}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Total Days */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Total Days</span>
              <span className="text-lg font-semibold text-indigo-600">
                {totalDays} {totalDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason for Leave <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              placeholder="Please provide detailed reason for the leave application..."
              required
            />
            <p className="mt-1 text-sm text-slate-500">Minimum 20 characters required</p>
          </div>

          {/* Supporting Documents */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-300 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mx-auto text-slate-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <label htmlFor="fileUpload" className="cursor-pointer">
                <span className="text-sm text-indigo-600 hover:text-indigo-700">
                  Click to upload
                </span>
                <span className="text-sm text-slate-500"> or drag and drop</span>
              </label>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileUpload}
              />
              <p className="text-xs text-slate-500 mt-2">PDF, JPG, PNG up to 10MB</p>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                        <path d="M14 2v6h6" fill="#fff" />
                      </svg>
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-slate-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact During Leave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="03XX-XXXXXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="03XX-XXXXXXX"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              placeholder="Any additional information..."
            />
          </div>
        </div>

        {/* Form Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition order-2 sm:order-1"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition order-1 sm:order-2"
          >
            Submit Application
          </button>
        </div>
      </form>

      {/* Recent Leave Applications */}
      <div className="mt-8 bg-white rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold">Recent Leave Applications</h3>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="pb-3 pr-4">Adm No</th>
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Duration</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentApplications.map((app, index) => (
                <tr key={index}>
                  <td className="py-3 pr-4">{app.admNo}</td>
                  <td className="py-3 pr-4">{app.student}</td>
                  <td className="py-3 pr-4">{app.type}</td>
                  <td className="py-3 pr-4">{app.duration}</td>
                  <td className="py-3 pr-4">{statusBadge(app.status)}</td>
                  <td className="py-3">
                    <button className="text-indigo-600 hover:text-indigo-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="text-center text-sm text-slate-500 mt-8">
        © 2025 eCampus — All rights reserved.
      </footer>
    </div>
  );
}
