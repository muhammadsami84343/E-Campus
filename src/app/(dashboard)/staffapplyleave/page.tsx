'use client';

import { useState, useEffect, useRef } from 'react';

interface LeaveFormData {
  staffMember: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  altPhone: string;
  altEmail: string;
  awayAddress: string;
}

interface LeaveRequest {
  reqId: string;
  staffName: string;
  leaveType: string;
  dates: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function StaffApplyLeave() {
  const [formData, setFormData] = useState<LeaveFormData>({
    staffMember: '',
    department: '',
    leaveType: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    altPhone: '',
    altEmail: '',
    awayAddress: '',
  });

  const [halfDay, setHalfDay] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' | 'error' } | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([
    { reqId: 'LR-1009', staffName: 'Ayesha Khan', leaveType: 'Casual', dates: '2025-09-22 → 2025-09-23', days: 2, status: 'Approved' },
    { reqId: 'LR-1008', staffName: 'Ali Raza', leaveType: 'Sick', dates: '2025-09-18 → 2025-09-19', days: 2, status: 'Pending' },
    { reqId: 'LR-1007', staffName: 'Sara Ahmed', leaveType: 'Half Day', dates: '2025-09-15', days: 0.5, status: 'Rejected' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Leave balances (could be fetched from API)
  const [leaveBalances, setLeaveBalances] = useState({
    casual: 10,
    sick: 12,
    earned: 15,
    unpaid: Infinity,
    maternity: 90,
    paternity: 7,
    halfday: 5,
  });

  // Show toast notification
  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Check if date is weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Calculate business days between two dates
  const businessDaysInclusive = (start: Date, end: Date, excludeWeekends: boolean) => {
    if (!start || !end || end < start) return 0;
    
    let count = 0;
    const current = new Date(start);
    
    while (current <= end) {
      if (!excludeWeekends || !isWeekend(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  // Calculate total days
  useEffect(() => {
    if (halfDay) {
      setTotalDays(0.5);
      setFormData(prev => ({ ...prev, endDate: prev.startDate }));
    } else {
      const start = new Date(formData.startDate + 'T00:00:00');
      const end = new Date(formData.endDate + 'T00:00:00');
      
      if (formData.startDate && formData.endDate) {
        const days = businessDaysInclusive(start, end, excludeWeekends);
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    }
  }, [formData.startDate, formData.endDate, halfDay, excludeWeekends]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        showToast('File exceeds 2MB limit', 'warn');
        return;
      }
      setAttachment(file);
    }
  };

  // Get available balance for selected leave type
  const getAvailableBalance = () => {
    if (!formData.leaveType) return '—';
    const balance = leaveBalances[formData.leaveType as keyof typeof leaveBalances];
    return balance === Infinity ? 'Unlimited' : balance;
  };

  // Get remaining balance
  const getRemainingBalance = () => {
    if (!formData.leaveType) return '—';
    const balance = leaveBalances[formData.leaveType as keyof typeof leaveBalances];
    if (balance === Infinity) return 'Unlimited';
    return Math.max(balance - totalDays, 0);
  };

  // Get leave type label
  const getLeaveTypeLabel = () => {
    const leaveTypes: { [key: string]: string } = {
      casual: 'Casual Leave',
      sick: 'Sick Leave',
      earned: 'Earned/Annual Leave',
      unpaid: 'Unpaid Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      halfday: 'Half Day',
    };
    return leaveTypes[formData.leaveType] || '—';
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.staffMember || !formData.leaveType || !formData.startDate || !formData.reason) {
      showToast('Please complete all required fields.', 'warn');
      return;
    }

    if (!halfDay && !formData.endDate) {
      showToast('Please provide end date.', 'warn');
      return;
    }

    if (totalDays <= 0) {
      showToast('Invalid duration. Check dates/half-day option.', 'warn');
      return;
    }

    // Check balance
    const available = leaveBalances[formData.leaveType as keyof typeof leaveBalances];
    if (available !== Infinity && totalDays > available) {
      showToast('Requested days exceed available balance.', 'error');
      return;
    }

    // Reason validation
    if (formData.reason.length < 20) {
      showToast('Please provide a detailed reason (min 20 characters).', 'warn');
      return;
    }

    // Create new leave request
    const [empId, staffName] = formData.staffMember.split('|');
    const reqId = 'LR-' + Math.floor(1000 + Math.random() * 9000);
    const dates = halfDay ? formData.startDate : `${formData.startDate} → ${formData.endDate}`;

    const newRequest: LeaveRequest = {
      reqId,
      staffName: staffName || empId,
      leaveType: getLeaveTypeLabel(),
      dates,
      days: totalDays,
      status: 'Pending',
    };

    // Add to history
    setLeaveHistory(prev => [newRequest, ...prev]);

    // Update balance
    if (available !== Infinity) {
      setLeaveBalances(prev => ({
        ...prev,
        [formData.leaveType]: Math.max(prev[formData.leaveType as keyof typeof prev] as number - totalDays, 0),
      }));
    }

    console.log('Leave Request Submitted:', {
      ...formData,
      totalDays,
      halfDay,
      excludeWeekends,
      attachment: attachment?.name,
    });

    showToast('Leave request submitted for approval!', 'success');

    // Optional: Reset form
    // setFormData({ ...initial state });
    // setHalfDay(false);
    // setAttachment(null);
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      staffMember: '',
      department: '',
      leaveType: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
      altPhone: '',
      altEmail: '',
      awayAddress: '',
    });
    setHalfDay(false);
    setExcludeWeekends(false);
    setAttachment(null);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
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
          <a href="#" className="hover:text-slate-700">Staff</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-slate-700">Apply Leaves</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Apply Leave (Staff)</h1>
          <div className="flex gap-2">
            <button
              onClick={() => showToast(formData.leaveType ? 'Balance updated on the right panel.' : 'Choose a leave type to view balance.', 'info')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              My Balance
            </button>
            <button
              onClick={() => showToast('Refer to school HR policy for detailed rules.', 'info')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h9l5 5v13H6zM8 8h8v2H8zm0 4h8v2H8z" />
              </svg>
              Leave Policy
            </button>
          </div>
        </div>

        {/* Form + Side Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold">Leave Request</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Staff Info */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                    Staff Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="staffMember" className="block text-sm font-medium text-slate-700 mb-2">
                        Staff Member *
                      </label>
                      <select
                        id="staffMember"
                        name="staffMember"
                        value={formData.staffMember}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        required
                      >
                        <option value="">Select staff</option>
                        <option value="EMP-001|Ayesha Khan">Ayesha Khan (EMP-001)</option>
                        <option value="EMP-002|Ali Raza">Ali Raza (EMP-002)</option>
                        <option value="EMP-003|Sara Ahmed">Sara Ahmed (EMP-003)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                        Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                      >
                        <option value="">Select department</option>
                        <option>Administration</option>
                        <option>Science</option>
                        <option>Mathematics</option>
                        <option>English</option>
                        <option>Urdu</option>
                        <option>Computer Science</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Leave Details */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                    Leave Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="leaveType" className="block text-sm font-medium text-slate-700 mb-2">
                        Leave Type *
                      </label>
                      <select
                        id="leaveType"
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="casual">Casual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="earned">Earned/Annual Leave</option>
                        <option value="unpaid">Unpaid Leave</option>
                        <option value="maternity">Maternity Leave</option>
                        <option value="paternity">Paternity Leave</option>
                        <option value="halfday">Half Day</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="excludeWeekends"
                        type="checkbox"
                        checked={excludeWeekends}
                        onChange={(e) => setExcludeWeekends(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <label htmlFor="excludeWeekends" className="text-sm text-slate-700">
                        Exclude weekends (Sat/Sun)
                      </label>
                    </div>

                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">
                          End Date *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="halfDay"
                            type="checkbox"
                            checked={halfDay}
                            onChange={(e) => setHalfDay(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                          />
                          <label htmlFor="halfDay" className="text-xs text-slate-600">
                            Half day
                          </label>
                        </div>
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        disabled={halfDay}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:bg-slate-100"
                        required={!halfDay}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Days</label>
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {totalDays}
                        </div>
                        <p className="text-sm text-slate-500">
                          {halfDay
                            ? 'Half-day selected.'
                            : excludeWeekends
                            ? 'Weekends excluded from calculation.'
                            : 'Includes weekends.'}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-2">
                        Reason *
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        placeholder="Provide a brief reason (min 20 characters)..."
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">{formData.reason.length} / 20 characters minimum</p>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="attachment" className="block text-sm font-medium text-slate-700 mb-2">
                        Attachment (optional)
                      </label>
                      <input
                        ref={fileInputRef}
                        id="attachment"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2.5 border border-dashed border-slate-300 rounded-lg bg-slate-50 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-700 file:hover:bg-slate-300"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {attachment
                          ? `Selected: ${attachment.name} (${(attachment.size / (1024 * 1024)).toFixed(2)} MB)`
                          : 'Accepted: PDF, JPG, PNG • Max 2MB'}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contact While Away */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                    Contact While Away
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="altPhone" className="block text-sm font-medium text-slate-700 mb-2">
                        Alternate Phone
                      </label>
                      <input
                        type="tel"
                        id="altPhone"
                        name="altPhone"
                        value={formData.altPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div>
                      <label htmlFor="altEmail" className="block text-sm font-medium text-slate-700 mb-2">
                        Alternate Email
                      </label>
                      <input
                        type="email"
                        id="altEmail"
                        name="altEmail"
                        value={formData.altEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="awayAddress" className="block text-sm font-medium text-slate-700 mb-2">
                        Address While On Leave
                      </label>
                      <textarea
                        id="awayAddress"
                        name="awayAddress"
                        value={formData.awayAddress}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </section>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 inline-flex items-center"
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
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold">Leave Balance</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Type</div>
                  <div className="text-slate-900 font-semibold">{getLeaveTypeLabel()}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Available</div>
                  <div className="text-slate-900 font-semibold">{getAvailableBalance()}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Days Applied</div>
                  <div className="text-slate-900 font-semibold">{totalDays}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Remaining</div>
                  <div className="text-slate-900 font-semibold">{getRemainingBalance()}</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {formData.leaveType
                  ? 'Balance estimated; final approval may vary.'
                  : 'Select staff and leave type to view balance.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold">Notes</h3>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-slate-600">
                <li>Half-day counts as 0.5 day.</li>
                <li>Weekend exclusion applies only if selected.</li>
                <li>Medical proof required for Sick leave over 2 days.</li>
                <li>Approval workflow: HOD → Principal.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl shadow mt-6">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Recent Leave Requests</h3>
            <button
              onClick={() => showToast('Export functionality coming soon', 'info')}
              className="text-sm text-indigo-600 hover:underline"
            >
              Export
            </button>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Req ID</th>
                  <th className="py-2 pr-4">Staff</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Dates</th>
                  <th className="py-2 pr-4">Days</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaveHistory.map((request) => (
                  <tr key={request.reqId}>
                    <td className="py-2 pr-4">{request.reqId}</td>
                    <td className="py-2 pr-4">{request.staffName}</td>
                    <td className="py-2 pr-4">{request.leaveType}</td>
                    <td className="py-2 pr-4">{request.dates}</td>
                    <td className="py-2 pr-4">{request.days}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${getStatusBadgeColor(request.status)}`}>
                        {request.status}
                      </span>
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
    </div>
  );
}
