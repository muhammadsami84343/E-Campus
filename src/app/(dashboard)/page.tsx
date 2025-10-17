// // app/(dashboard)/page.tsx  OR  src/app/(dashboard)/page.tsx
// import { getDashboardStats } from "@/lib/dashboard";

// export const metadata = { title: "Dashboard" };

// function formatDate(d?: Date) {
//   if (!d) return "";
//   try {
//     // YYYY-MM-DD like your table
//     return new Date(d).toISOString().slice(0,10);
//   } catch {
//     return "";
//   }
// }

// export default async function DashboardPage() {
//   const data = await getDashboardStats();

//   return (<>
//     <section className="space-y-6">
//       <h1 className="text-2xl font-bold">Dashboard</h1>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <div className="text-slate-500 text-sm">Total Students</div>
//           <div className="mt-1 text-2xl font-semibold">{data.studentCount}</div>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <div className="text-slate-500 text-sm">Staff</div>
//           <div className="mt-1 text-2xl font-semibold">{data.staffCount}</div>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <div className="text-slate-500 text-sm">Fees Collected (M)</div>
//           <div className="mt-1 text-2xl font-semibold">₨ {data.collectedTotal.toLocaleString()}</div>
//           <div className="text-xs text-slate-500 mt-1">Add Finance collections to populate</div>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <div className="text-slate-500 text-sm">Unpaid Dues</div>
//           <div className="mt-1 text-2xl font-semibold">{data.unpaidCount}</div>
//           <div className="text-xs text-slate-500 mt-1">Add Finance collections to populate</div>
//         </div>
//       </div>

//       {/* (Optional) Upcoming section can stay static for now, like your HTML */}      

//       {/* Recent Admissions (matches your HTML table) */}
//       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
//         <div className="px-4 py-3 border-b border-slate-200 font-medium flex items-center justify-between">
//           <span>Recent Admissions</span>
//           <a>#View all</a>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-slate-50 text-slate-600">
//               <tr>
//                 <th className="text-left px-4 py-2">Adm No</th>
//                 <th className="text-left px-4 py-2">Name</th>
//                 <th className="text-left px-4 py-2">Class</th>
//                 <th className="text-left px-4 py-2">Phone</th>
//                 <th className="text-left px-4 py-2">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.recentAdmissions.map(s => (
//                 <tr key={s._id} className="odd:bg-white even:bg-slate-50">
//                   <td className="px-4 py-2">{s.admissionNumber}</td>
//                   <td className="px-4 py-2">{s.firstName} {s.lastName}</td>
//                   <td className="px-4 py-2">{s.classLabel}</td>
//                   <td className="px-4 py-2">{s.phone ?? "-"}</td>
//                   <td className="px-4 py-2">{formatDate(s.createdAt)}</td>
//                 </tr>
//               ))}
//               {!data.recentAdmissions.length && (
//                 <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No admissions yet.</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//    </>
//   );
// }

import DashboardClientPage from "./_components/DashboardClientPage";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardClientPage />;
}
