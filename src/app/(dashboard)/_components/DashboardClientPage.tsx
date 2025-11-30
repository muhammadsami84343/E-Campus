"use client";

import Script from "next/script";
import { Fragment, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";

// Animated counter hook
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const timeRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = countRef.current;
    const endValue = end;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(current);
      countRef.current = current;

      if (progress < 1) {
        timeRef.current = requestAnimationFrame(animate);
      }
    };

    timeRef.current = requestAnimationFrame(animate);
    return () => {
      if (timeRef.current) cancelAnimationFrame(timeRef.current);
    };
  }, [end, duration]);

  return count;
}

// Static data kept exactly as in your current dashboard
type Admission = {
  admissionNumber: string;
  name: string;
  classLabel: string;
  phone: string;
  date: string;
};

const recentAdmissions: Admission[] = [
  { admissionNumber: "22014", name: "Ayesha Khan",    classLabel: "Seven-A", phone: "0301-1234567", date: "2025-09-21" },
  { admissionNumber: "22015", name: "Ali Raza",       classLabel: "Six-B",   phone: "0300-9876543", date: "2025-09-22" },
  { admissionNumber: "22016", name: "Sara Ahmed",     classLabel: "Eight-A", phone: "0333-1112223", date: "2025-09-23" },
  { admissionNumber: "22017", name: "Hassan Ali",     classLabel: "Five-C",  phone: "0345-5556677", date: "2025-09-26" },
  { admissionNumber: "22018", name: "Zainab Fatima",  classLabel: "Nine-A",  phone: "0321-7778889", date: "2025-10-02" },
  { admissionNumber: "22019", name: "Omar Khan",      classLabel: "Six-A",   phone: "0333-4445556", date: "2025-10-05" },
  { admissionNumber: "22020", name: "Mehwish Azhar",  classLabel: "Seven-B", phone: "0312-8889990", date: "2025-10-08" },
  { admissionNumber: "22021", name: "Ibrahim Shah",   classLabel: "Ten-Sci", phone: "0345-1112223", date: "2025-10-12" },
  { admissionNumber: "22022", name: "Farah Noor",     classLabel: "Eight-B", phone: "0300-3334445", date: "2025-10-14" },
  { admissionNumber: "22023", name: "Usman Ali",      classLabel: "Nine-B",  phone: "0333-6667778", date: "2025-10-15" },
];

type PendingFee = {
  admissionNumber: string;
  name: string;
  classLabel: string;
  amount: string;
  status: "Unpaid" | "Partial" | "Paid";
};

const pendingFees: PendingFee[] = [
  { admissionNumber: "21045", name: "Bilal Ahmed", classLabel: "Nine-Sci",  amount: "₨ 12,000", status: "Unpaid" },
  { admissionNumber: "21087", name: "Fatima Noor", classLabel: "Eight-B",   amount: "₨ 6,500",  status: "Partial" },
  { admissionNumber: "21102", name: "Umer Farooq", classLabel: "Seven-A",   amount: "₨ 4,000",  status: "Unpaid" },
  { admissionNumber: "20988", name: "Maryam",      classLabel: "Ten-Arts",  amount: "₨ 9,200",  status: "Partial" },
];

export default function DashboardClientPage() {
  // State for modals
  const [showAllAdmissions, setShowAllAdmissions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Effect to initialize charts when component mounts or when returning to the dashboard
  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Chart) {
        initCharts();
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [isMounted]);
  
  // Export helper function
  const exportPendingFees = () => {
    // Format amount to be consistent
    const formatAmount = (amount: string) => {
      // Remove "₨ " prefix and any commas, then parse the number
      const value = amount.replace("₨ ", "").replace(",", "");
      return parseInt(value, 10);
    };

    // Calculate total pending amount
    const totalAmount = pendingFees
      .filter(fee => fee.status !== "Paid")
      .reduce((sum, fee) => sum + formatAmount(fee.amount), 0);

    // Create CSV content with properly escaped values
    const headers = ['Admission No', 'Name', 'Class', 'Amount (₨)', 'Status'];
    const rows = pendingFees.map(fee => [
      fee.admissionNumber,
      `"${fee.name}"`, // Escape names that might contain commas
      fee.classLabel,
      formatAmount(fee.amount).toString(),
      fee.status
    ]);
    
    const csvContent = [
      // Add a title row with school info
      ['eCampus - Pending Fees Report'],
      ['Generated on: ' + new Date().toLocaleDateString()],
      [''],  // Empty row for spacing
      headers,
      ...rows,
      [''],  // Empty row for spacing
      [`Total Pending Amount: ₨ ${totalAmount.toLocaleString()}`],
      [`Total Pending Students: ${pendingFees.filter(fee => fee.status !== "Paid").length}`]
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ecampus_pending_fees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const initCharts = () => {
    // @ts-ignore
    if (!window.Chart) return;

    // @ts-ignore
    const Chart = window.Chart;

    const text = '#111827';
    const grid = '#e5e7eb';

    // Cleanup existing charts to prevent errors on re-render
    const chartInstances = (window as any).chartInstances || {};
    if (chartInstances.attendanceChart) chartInstances.attendanceChart.destroy();
    if (chartInstances.feeStatusChart) chartInstances.feeStatusChart.destroy();
    if (chartInstances.enrollmentsChart) chartInstances.enrollmentsChart.destroy();

    // Attendance Trend
    const attEl = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (attEl) {
      const weeks = Array.from({ length: 12 }, (_, i) => 'W' + (i + 1));
      const series = [86, 88, 84, 90, 92, 91, 89, 93, 94, 92, 95, 96];
      chartInstances.attendanceChart = new Chart(attEl, {
        type: 'line',
        data: {
          labels: weeks,
          datasets: [{
            label: 'Attendance %',
            data: series,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.15)',
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: text } },
            y: {
              beginAtZero: true,
              min: 0,
              max: 100,
              grid: { color: grid },
              ticks: { color: text, stepSize: 20 }
            }
          }
        }
      });
    }

    // Fee Status
    const feeEl = document.getElementById('feeStatusChart') as HTMLCanvasElement;
    if (feeEl) {
      chartInstances.feeStatusChart = new Chart(feeEl, {
        type: 'doughnut',
        data: {
          labels: ['Paid', 'Partial', 'Unpaid'],
          datasets: [{
            data: [92, 5, 3],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '65%',
          plugins: {
            legend: { position: 'right', labels: { color: text, boxWidth: 16, padding: 12 } },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ctx.label + ': ' + ctx.raw + '%'
              }
            }
          }
        }
      });
    }

    // Enrollments
    const enrEl = document.getElementById('enrollmentsChart') as HTMLCanvasElement;
    if (enrEl) {
      const labels = ['Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
      const values = [34, 40, 28, 36, 31, 24];
      chartInstances.enrollmentsChart = new Chart(enrEl, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Students',
            data: values,
            backgroundColor: '#06b6d4',
            borderRadius: 6
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: text } },
            y: { beginAtZero: true, grid: { color: grid }, ticks: { color: text } }
          }
        }
      });
    }
    (window as any).chartInstances = chartInstances;
  };

  const totalStudents = useCountUp(isMounted ? 567 : 0);
  const totalStaff = useCountUp(isMounted ? 68 : 0);
  const feesCollected = useCountUp(isMounted ? 52000 : 0);
  const totalClasses = useCountUp(isMounted ? 24 : 0);

  if (!isMounted) {
    return (
      <main className="transition-opacity duration-300">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white overflow-hidden">
            <div className="text-white/90">Total Students</div>
            <div className="text-3xl font-bold mt-1">567</div>
            <div className="text-white/70 text-sm">+45 this month</div>
          </div>
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-emerald-600 to-green-500 text-white overflow-hidden">
            <div className="text-white/90">Staff</div>
            <div className="text-3xl font-bold mt-1">68</div>
            <div className="text-white/70 text-sm">+4 this month</div>
          </div>
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden">
            <div className="text-white/90">Fees Collected</div>
            <div className="text-3xl font-bold mt-1">₨ 52000</div>
            <div className="text-white/70 text-sm">95% of target</div>
          </div>
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-rose-500 to-pink-500 text-white overflow-hidden">
            <div className="text-white/90">Classes</div>
            <div className="text-3xl font-bold mt-1">24</div>
            <div className="text-white/70 text-sm">Active sessions</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="transition-opacity duration-300">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      {/* === Stats Cards (unchanged layout & values) === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white overflow-hidden">
          <div className="text-white/90">Total Students</div>
          <div className="text-3xl font-bold mt-1">{totalStudents}</div>
          <div className="text-white/70 text-sm">+45 this month</div>
          <div className="absolute right-4 bottom-3 text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 21a9 9 0 1 1 18 0H3z"></path>
            </svg>
          </div>
        </div>

        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-emerald-600 to-green-500 text-white overflow-hidden">
          <div className="text-white/90">Staff</div>
          <div className="text-3xl font-bold mt-1">{totalStaff}</div>
          <div className="text-white/70 text-sm">+4 this month</div>
          <div className="absolute right-4 bottom-3 text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 7a4 4 0 1 1 8 0 4 4 0 0 1-8 0zM2 21a6 6 0 1 1 12 0H2z"></path>
            </svg>
          </div>
        </div>

        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden">
          <div className="text-white/90">Fees Collected</div>
          <div className="text-3xl font-bold mt-1">₨ {feesCollected.toLocaleString()}</div>
          <div className="text-white/70 text-sm">95% of target</div>
          <div className="absolute right-4 bottom-3 text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3L2 9l10 6 10-6-10-6zM2 9v6l10 6V15L2 9zM22 9v6l-10 6V15l10-6z"></path>
            </svg>
          </div>
        </div>

        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-rose-600 to-red-500 text-white overflow-hidden">
          <div className="text-white/90">Classes</div>
          <div className="text-3xl font-bold mt-1">{totalClasses}</div>
          <div className="text-white/70 text-sm">Active sessions</div>
          <div className="absolute right-4 bottom-3 text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* === Charts Section === */}
      <div className="space-y-4 mt-6">
        {/* Attendance Trend (Last 12 Weeks) - Full Width */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="font-semibold">Attendance Trend (Last 12 Weeks)</h4>
          <div className="mt-3" style={{ height: "240px" }}>
            <canvas id="attendanceChart" style={{ width: "100%", height: "100%" }} />
          </div>
        </section>

        {/* Fee Status and Enrollments - Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fee Status */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="font-semibold">Fee Status</h4>
            <div className="mt-3 flex items-center justify-center" style={{ height: "200px" }}>
              <div style={{ width: "100%", maxWidth: "300px" }}>
                <canvas id="feeStatusChart" style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </section>

          {/* Enrollments by Class */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="font-semibold">Enrollments by Class</h4>
            <div className="mt-3" style={{ height: "200px" }}>
              <canvas id="enrollmentsChart" style={{ width: "100%", height: "100%" }} />
            </div>
          </section>
        </div>
      </div>

      {/* === Row: Upcoming / Recent Admissions === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
        {/* <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="font-semibold">Upcoming</h4>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <div className="font-medium">Midterm Exams Begin</div>
              <div className="text-gray-500">Oct 14 • All classes</div>
            </li>
            <li>
              <div className="font-medium">Parent–Teacher Meeting</div>
              <div className="text-gray-500">Oct 20 • Auditorium</div>
            </li>
            <li>
              <div className="font-medium">Fee Due Date</div>
              <div className="text-gray-500">Oct 25 • Month-end cycle</div>
            </li>
            <li>
              <div className="font-medium">Sports Day</div>
              <div className="text-gray-500">Nov 02 • Main Ground</div>
            </li>
          </ul>
        </section> */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 overflow-x-auto">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Recent Admissions</h4>
            <button
              onClick={() => setShowAllAdmissions(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View all
            </button>
          </div>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-3">Adm No</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Class</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Date</th>
              </tr>
            </thead>
            <tbody className="[&>tr:nth-child(even)]:bg-gray-50">
              {recentAdmissions.slice(0, 4).map((s) => (
                <tr key={s.admissionNumber}>
                  <td className="py-2 pr-3">{s.admissionNumber}</td>
                  <td className="py-2 pr-3">{s.name}</td>
                  <td className="py-2 pr-3">{s.classLabel}</td>
                  <td className="py-2 pr-3">{s.phone}</td>
                  <td className="py-2 pr-3">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* === Pending Fees === */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 mt-6 overflow-x-auto">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Pending Fees</h4>
          <button
            type="button"
            onClick={exportPendingFees}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
            </svg>
            Export
          </button>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-3">Adm No</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Class</th>
              <th className="py-2 pr-3">Amount</th>
              <th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody className="[&>tr:nth-child(even)]:bg-gray-50">
            {pendingFees.map((f) => (
              <tr key={f.admissionNumber}>
                <td className="py-2 pr-3">{f.admissionNumber}</td>
                <td className="py-2 pr-3">{f.name}</td>
                <td className="py-2 pr-3">{f.classLabel}</td>
                <td className="py-2 pr-3">{f.amount}</td>
                <td className="py-2 pr-3">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500">
        Receive Selected Designed with ❤ for eCampus — 2025
      </footer>
      </main>

      {/* View All Admissions Modal */}
      <Transition show={showAllAdmissions} as={Fragment}>
        <Dialog onClose={() => setShowAllAdmissions(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="mx-auto max-w-4xl rounded-xl bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-xl font-semibold">All Recent Admissions</Dialog.Title>
                    <button
                      onClick={() => setShowAllAdmissions(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-3 px-4">Adm No</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Class</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recentAdmissions.map((s) => (
                          <tr key={s.admissionNumber} className="hover:bg-gray-50">
                            <td className="py-3 px-4">{s.admissionNumber}</td>
                            <td className="py-3 px-4">{s.name}</td>
                            <td className="py-3 px-4">{s.classLabel}</td>
                            <td className="py-3 px-4">{s.phone}</td>
                            <td className="py-3 px-4">{s.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Load Chart.js from CDN and initialize charts on load */}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onReady={initCharts}
      />
      {typeof window !== 'undefined' && <div id="chartLoader" className="hidden" />}
    </>
  );
}
