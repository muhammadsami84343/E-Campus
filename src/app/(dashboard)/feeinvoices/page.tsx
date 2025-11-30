'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Invoice = {
  id: string;
  receiptNo: string;
  student: string;
  adm: string;
  class: string;
  amount: number;
  method: string;
  date: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
  cycle: string;
};

const mockInvoices: Invoice[] = [
  {
    id: '1',
    receiptNo: 'RC100451',
    student: 'Bilal Ahmed',
    adm: '21045',
    class: 'Nine-Sci',
    amount: 14500,
    method: 'Cash',
    date: '2025-10-15',
    status: 'Paid',
    cycle: 'Oct-2025',
  },
  {
    id: '2',
    receiptNo: 'RC100452',
    student: 'Fatima Noor',
    adm: '21087',
    class: 'Eight-B',
    amount: 7800,
    method: 'Bank',
    date: '2025-10-18',
    status: 'Partial',
    cycle: 'Oct-2025',
  },
  {
    id: '3',
    receiptNo: 'RC100453',
    student: 'Sara Ahmed',
    adm: '22016',
    class: 'Eight-A',
    amount: 7000,
    method: 'Card',
    date: '2025-10-20',
    status: 'Unpaid',
    cycle: 'Oct-2025',
  },
  {
    id: '4',
    receiptNo: 'RC100454',
    student: 'Ahmed Ali',
    adm: '21120',
    class: 'Ten-Arts',
    amount: 9500,
    method: 'Cash',
    date: '2025-10-22',
    status: 'Paid',
    cycle: 'Oct-2025',
  },
  {
    id: '5',
    receiptNo: 'RC100455',
    student: 'Aisha Khan',
    adm: '22045',
    class: 'Seven-A',
    amount: 6200,
    method: 'Wallet',
    date: '2025-10-25',
    status: 'Paid',
    cycle: 'Oct-2025',
  },
];

export default function FeeInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    class: '',
    cycle: 'Oct-2025',
    dateFrom: '',
    dateTo: '',
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Filtering
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      !filters.search ||
      inv.student.toLowerCase().includes(filters.search.toLowerCase()) ||
      inv.adm.includes(filters.search) ||
      inv.receiptNo.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = !filters.status || inv.status === filters.status;
    const matchClass = !filters.class || inv.class === filters.class;
    const matchCycle = !filters.cycle || inv.cycle === filters.cycle;
    const matchDateFrom = !filters.dateFrom || inv.date >= filters.dateFrom;
    const matchDateTo = !filters.dateTo || inv.date <= filters.dateTo;
    return matchSearch && matchStatus && matchClass && matchCycle && matchDateFrom && matchDateTo;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIdx, startIdx + itemsPerPage);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === paginatedInvoices.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginatedInvoices.map((inv) => inv.id)));
    }
  };

  const handleBulkMarkPaid = () => {
    if (selected.size === 0) {
      showToast('No invoices selected', 'warn');
      return;
    }
    setInvoices(
      invoices.map((inv) => (selected.has(inv.id) ? { ...inv, status: 'Paid' as const } : inv))
    );
    setSelected(new Set());
    showToast(`Marked ${selected.size} invoice(s) as Paid`, 'success');
  };

  const handleBulkSMS = () => {
    if (selected.size === 0) {
      showToast('No invoices selected', 'warn');
      return;
    }
    showToast(`Sending SMS to ${selected.size} parent(s)...`, 'info');
    setTimeout(() => {
      showToast('SMS sent successfully', 'success');
    }, 1500);
    setSelected(new Set());
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) {
      showToast('No invoices selected', 'warn');
      return;
    }
    if (!confirm(`Delete ${selected.size} invoice(s)?`)) return;
    setInvoices(invoices.filter((inv) => !selected.has(inv.id)));
    setSelected(new Set());
    showToast('Invoices deleted', 'success');
  };

  const handleExport = (format: string) => {
    showToast(`Exporting ${filteredInvoices.length} invoices as ${format.toUpperCase()}...`, 'info');
    setTimeout(() => {
      showToast(`Export completed (${format.toUpperCase()})`, 'success');
    }, 1000);
  };

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
          <span className="hover:text-slate-700">Finance</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-slate-700">Fee Invoices</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Fee Invoices</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Export Excel
            </button>
            <button
              onClick={() => router.push('/feescollection')}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              New Receipt
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-white shadow">
            <div className="text-slate-500 text-sm mb-1">Total Invoices</div>
            <div className="text-2xl font-semibold">{invoices.length}</div>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50 shadow">
            <div className="text-emerald-700 text-sm mb-1">Paid</div>
            <div className="text-2xl font-semibold text-emerald-700">
              {invoices.filter((inv) => inv.status === 'Paid').length}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-amber-50 shadow">
            <div className="text-amber-700 text-sm mb-1">Partial</div>
            <div className="text-2xl font-semibold text-amber-700">
              {invoices.filter((inv) => inv.status === 'Partial').length}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-rose-50 shadow">
            <div className="text-rose-700 text-sm mb-1">Unpaid</div>
            <div className="text-2xl font-semibold text-rose-700">
              {invoices.filter((inv) => inv.status === 'Unpaid').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow mb-6">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="xl:col-span-2">
                <label className="block text-sm text-slate-600 mb-2">Search</label>
                <input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                  placeholder="Receipt, Student, Adm..."
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Class</label>
                <select
                  value={filters.class}
                  onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All</option>
                  <option>Seven-A</option>
                  <option>Eight-A</option>
                  <option>Eight-B</option>
                  <option>Nine-Sci</option>
                  <option>Ten-Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Cycle</label>
                <select
                  value={filters.cycle}
                  onChange={(e) => setFilters({ ...filters, cycle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                >
                  <option>Sep-2025</option>
                  <option>Oct-2025</option>
                  <option>Nov-2025</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setFilters({ search: '', status: '', class: '', cycle: 'Oct-2025', dateFrom: '', dateTo: '' })
                }
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.size > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="text-indigo-700 font-medium">{selected.size} selected</div>
            <button
              onClick={handleBulkMarkPaid}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Mark Paid
            </button>
            <button
              onClick={handleBulkSMS}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send SMS
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Delete
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Invoices ({filteredInvoices.length})</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-md border border-slate-300 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="py-3 px-5 w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === paginatedInvoices.length && paginatedInvoices.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </th>
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Adm No</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-slate-500" colSpan={10}>
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-5">
                        <input
                          type="checkbox"
                          checked={selected.has(inv.id)}
                          onChange={() => toggleSelect(inv.id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{inv.receiptNo}</td>
                      <td className="py-3 px-4">{inv.student}</td>
                      <td className="py-3 px-4">{inv.adm}</td>
                      <td className="py-3 px-4">{inv.class}</td>
                      <td className="py-3 px-4 font-medium">₨ {inv.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">{inv.method}</td>
                      <td className="py-3 px-4">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : inv.status === 'Partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showToast(`Viewing invoice ${inv.receiptNo}`, 'info')}
                            className="p-1.5 rounded hover:bg-slate-100"
                            title="View"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            onClick={() => showToast(`Printing invoice ${inv.receiptNo}`, 'info')}
                            className="p-1.5 rounded hover:bg-slate-100"
                            title="Print"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                              <path d="M6 14h12v8H6z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete invoice ${inv.receiptNo}?`)) {
                                setInvoices(invoices.filter((i) => i.id !== inv.id));
                                showToast('Invoice deleted', 'success');
                              }
                            }}
                            className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                            title="Delete"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredInvoices.length)} of{' '}
              {filteredInvoices.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) page = currentPage - 2 + i;
                    if (currentPage > totalPages - 2) page = totalPages - 4 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg ${
                        currentPage === page
                          ? 'bg-cyan-600 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">© 2025 eCampus — All rights reserved.</footer>
      </div>
    </>
  );
}
