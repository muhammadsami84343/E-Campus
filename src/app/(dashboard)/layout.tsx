"use client";

import { useState, type ReactNode } from "react";
import Nav from "./_components/Nav";
import Sidebar from "./_components/Sidebar";
import LoadingProvider from "./_components/LoadingProvider";
import "../globals.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: "56px" }}>
      {/* Sticky Navbar */}
      <Nav onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar + Main Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sticky Sidebar (desktop), overlay (mobile) */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content fills remaining space, no margin */}
        <main
          style={{
            flex: 1,
            padding: "16px",
            minHeight: "calc(100vh - 56px)",
            background: "#f8fafc"
          }}
          className="content"
        >
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </main>
      </div>
    </div>
  );
}
