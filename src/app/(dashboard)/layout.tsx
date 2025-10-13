"use client";

import { useState, type ReactNode } from "react";
import Nav from "./_components/Nav";
import Sidebar from "./_components/Sidebar";
import "../globals.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Nav onMenuClick={() => setSidebarOpen(true)} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar (controlled) */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: "16px",
            marginLeft: "0",
          }}
          className="content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
