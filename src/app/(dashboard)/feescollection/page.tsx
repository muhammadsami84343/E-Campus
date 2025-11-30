'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Student = {
  adm: string;
  name: string;
  class: string;
  parent: string;
  phone: string;
  items: FeeItem[];
  prevBalance: number;
  lateFee: number;
};

type FeeItem = {
  id: string;
  name: string;
  due: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
};

const students: Student[] = [
  {
    adm: '21045',
    name: 'Bilal Ahmed',
    class: 'Nine-Sci',
    parent: 'Ahmed',
    phone: '0300-1112223',
    items: [
      { id: 'OCT-TUI', name: 'Tuition - Oct', due: 12000, status: 'Unpaid' },
      { id: 'OCT-TRN', name: 'Transport - Oct', due: 2500, status: 'Unpaid' },
    ],
    prevBalance: 0,
    lateFee: 0,
  },
  {
    adm: '21087',
    name: 'Fatima Noor',
    class: 'Eight-B',
    parent: 'Noor',
    phone: '0301-2223334',
    items: [
      { id: 'OCT-TUI', name: 'Tuition - Oct', due: 6500, status: 'Partial' },
      { id: 'OCT-EXM', name: 'Exam Fee', due: 1000, status: 'Unpaid' },
    ],
    prevBalance: 300,
    lateFee: 200,
  },
  {
    adm: '22016',
    name: 'Sara Ahmed',
    class: 'Eight-A',
    parent: 'Ahmed',
    phone: '0333-5556667',
    items: [{ id: 'OCT-TUI', name: 'Tuition - Oct', due: 7000, status: 'Unpaid' }],
    prevBalance: 0,
    lateFee: 0,
  },
];

export default function FeeCollectionPage() {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState({ adm: '', name: '', class: '' });
  const [results, setResults] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [payment, setPayment] = useState({
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    ref: '',
    remarks: '',
    printReceipt: false,
  });
  const [recentReceipts, setRecentReceipts] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = students.filter(
      (s) =>
        (!searchForm.adm || s.adm.toLowerCase().includes(searchForm.adm.toLowerCase())) &&
        (!searchForm.name || s.name.toLowerCase().includes(searchForm.name.toLowerCase())) &&
        (!searchForm.class || s.class.toLowerCase().includes(searchForm.class.toLowerCase()))
    );
    setResults(filtered);
  };

  const selectStudent = (student: Student) => {
    setCurrentStudent(student);
    setSelectedItems(new Set());
    const outstanding =
      student.items.reduce((a, b) => a + b.due, 0) + student.lateFee + student.prevBalance;
    setPayment({ ...payment, amount: '' });
  };

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    updatePayableAmount(newSelected);
  };

  const selectAllDue = () => {
    if (!currentStudent) return;
    const allIds = new Set(currentStudent.items.map((it) => it.id));
    setSelectedItems(allIds);
    updatePayableAmount(allIds);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
    setPayment({ ...payment, amount: '' });
  };

  const updatePayableAmount = (selected: Set<string>) => {
    if (!currentStudent) return;
    const subtotal = currentStudent.items
      .filter((it) => selected.has(it.id))
      .reduce((a, b) => a + b.due, 0);
    setPayment((prev) => ({ ...prev, amount: subtotal.toString() }));
  };

  const getSubtotal = () => {
    if (!currentStudent) return 0;
    return currentStudent.items.filter((it) => selectedItems.has(it.id)).reduce((a, b) => a + b.due, 0);
  };

  const handleSavePayment = () => {
    if (!currentStudent) {
      showToast('Please select a student', 'warn');
      return;
    }
    if (selectedItems.size === 0) {
      showToast('Select at least one fee item', 'warn');
      return;
    }
    const amount = Number(payment.amount);
    if (!amount || amount <= 0) {
      showToast('Enter receive amount', 'warn');
      return;
    }

    const rid = 'RC' + Math.floor(100000 + Math.random() * 900000);
    const receipt = `${rid} • ${currentStudent.name} • ₨ ${amount.toLocaleString()} • ${payment.method.toUpperCase()}`;
    setRecentReceipts([receipt, ...recentReceipts]);

    showToast('Payment recorded', 'success');
    if (payment.printReceipt) window.print();

    // Reset
    setSelectedItems(new Set());
    setPayment({
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      ref: '',
      remarks: '',
      printReceipt: false,
    });
  };

  const subtotal = getSubtotal();

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
          <span className="text-slate-700">Fee Collection</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Fee Collection</h1>
          <button
            onClick={() => {
              setCurrentStudent(null);
              setSelectedItems(new Set());
              showToast('New receipt started', 'info');
            }}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            New Receipt
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Search + Student + Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Find Student */}
            <div className="bg-white rounded-2xl shadow">
              <div className="px-5 py-4 border-b">
                <h3 className="font-semibold">Find Student</h3>
              </div>
              <div className="p-5">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Adm No</label>
                    <input
                      value={searchForm.adm}
                      onChange={(e) => setSearchForm({ ...searchForm, adm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., 21045"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-600 mb-2">Student Name</label>
                    <input
                      value={searchForm.name}
                      onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., Ayesha Khan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Class</label>
                    <select
                      value={searchForm.class}
                      onChange={(e) => setSearchForm({ ...searchForm, class: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">All</option>
                      <option>Seven-A</option>
                      <option>Eight-B</option>
                      <option>Nine-Sci</option>
                      <option>Ten-Arts</option>
                    </select>
                  </div>
                  <div className="md:col-span-4 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchForm({ adm: '', name: '', class: '' });
                        setResults([]);
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Results</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {results.length === 0 ? (
                      <div className="text-sm text-slate-500">No results. Search to load students.</div>
                    ) : (
                      results.map((s) => (
                        <div key={s.adm} className="p-3 rounded-lg border border-slate-200">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-slate-500">
                            Adm: {s.adm} • {s.class}
                          </div>
                          <button
                            onClick={() => selectStudent(s)}
                            className="mt-3 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Select
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Student */}
            <div className="bg-white rounded-2xl shadow">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Selected Student</h3>
                <span className="text-xs text-slate-500">{currentStudent ? 'Ready' : 'None'}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    IMG
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm w-full">
                    <div className="text-slate-500">Name</div>
                    <div className="font-medium">{currentStudent?.name || '—'}</div>
                    <div className="text-slate-500">Adm No</div>
                    <div className="font-medium">{currentStudent?.adm || '—'}</div>
                    <div className="text-slate-500">Class</div>
                    <div className="font-medium">{currentStudent?.class || '—'}</div>
                    <div className="text-slate-500">Parent</div>
                    <div className="font-medium">{currentStudent?.parent || '—'}</div>
                    <div className="text-slate-500">Phone</div>
                    <div className="font-medium">{currentStudent?.phone || '—'}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="text-xs text-slate-500">Outstanding</div>
                    <div className="text-lg font-semibold">
                      ₨{' '}
                      {currentStudent
                        ? (
                            currentStudent.items.reduce((a, b) => a + b.due, 0) +
                            currentStudent.lateFee +
                            currentStudent.prevBalance
                          ).toLocaleString()
                        : 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="text-xs text-slate-500">Late Fee</div>
                    <div className="text-lg font-semibold">
                      ₨ {currentStudent?.lateFee.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="text-xs text-slate-500">Prev Balance</div>
                    <div className="text-lg font-semibold">
                      ₨ {currentStudent?.prevBalance.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Items */}
            <div className="bg-white rounded-2xl shadow">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Fee Items</h3>
                <div className="text-sm text-slate-600">
                  Cycle:
                  <select className="ml-2 px-2 py-1 rounded-md border border-slate-300">
                    <option>Sep-2025</option>
                    <option selected>Oct-2025</option>
                    <option>Nov-2025</option>
                  </select>
                </div>
              </div>
              <div className="p-5 overflow-x-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="text-left text-slate-500">
                    <tr>
                      <th className="py-2 pr-3 w-8">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                      </th>
                      <th className="py-2 pr-4">Item</th>
                      <th className="py-2 pr-4">Due</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {!currentStudent ? (
                      <tr>
                        <td className="py-3 text-slate-500" colSpan={6}>
                          Select a student to load fee items.
                        </td>
                      </tr>
                    ) : (
                      currentStudent.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 pr-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItem(item.id)}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                          </td>
                          <td className="py-2 pr-4">{item.name}</td>
                          <td className="py-2 pr-4">₨ {item.due.toLocaleString()}</td>
                          <td className="py-2 pr-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                                item.status === 'Unpaid'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4">₨ {item.due.toLocaleString()}</td>
                          <td className="py-2">
                            <input
                              className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs"
                              placeholder="Optional"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAllDue}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Select All Due
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <div className="md:justify-end flex flex-wrap gap-3">
                    <div className="px-3 py-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500">Subtotal:</span>
                      <span className="font-semibold"> ₨ {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-100">
                      <span className="text-slate-600">Payable:</span>
                      <span className="font-semibold"> ₨ {subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow">
              <div className="px-5 py-4 border-b">
                <h3 className="font-semibold">Payment Details</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Payment Method</label>
                    <select
                      value={payment.method}
                      onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Card</option>
                      <option value="wallet">Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Date</label>
                    <input
                      type="date"
                      value={payment.date}
                      onChange={(e) => setPayment({ ...payment, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {payment.method !== 'cash' && (
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Reference / Txn ID</label>
                    <input
                      value={payment.ref}
                      onChange={(e) => setPayment({ ...payment, ref: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., TXN123456"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-600 mb-2">Receive Amount (₨)</label>
                  <input
                    type="number"
                    min="0"
                    value={payment.amount}
                    onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">Remarks</label>
                  <textarea
                    rows={2}
                    value={payment.remarks}
                    onChange={(e) => setPayment({ ...payment, remarks: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                    placeholder="Optional notes..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={payment.printReceipt}
                      onChange={(e) => setPayment({ ...payment, printReceipt: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    Print receipt after save
                  </label>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Payable</div>
                    <div className="text-xl font-semibold">₨ {subtotal.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={handleSavePayment}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Save Payment
                  </button>
                  <button
                    onClick={() =>
                      setPayment({
                        method: 'cash',
                        date: new Date().toISOString().split('T')[0],
                        amount: '',
                        ref: '',
                        remarks: '',
                        printReceipt: false,
                      })
                    }
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Receipts */}
            <div className="bg-white rounded-2xl shadow">
              <div className="px-5 py-4 border-b">
                <h3 className="font-semibold">Recent Receipts</h3>
              </div>
              <div className="p-5 text-sm">
                <ul className="space-y-2 text-slate-600">
                  {recentReceipts.length === 0 ? (
                    <li>No receipts yet.</li>
                  ) : (
                    recentReceipts.map((r, i) => <li key={i}>{r}</li>)
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">© 2025 eCampus — All rights reserved.</footer>
      </div>
    </>
  );
}
