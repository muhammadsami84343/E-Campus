import type { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import "../globals.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="content">{children}</main>
    </div>
  );
}