"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="layout-shell">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Desktop sidebar - no close button */}
      <div className="sidebar desktop-sidebar">
        <Sidebar />
      </div>
      {/* Mobile sidebar - with close button */}
      <div className={`sidebar mobile-sidebar${sidebarOpen ? " open" : ""}`}>
        <MobileSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Main */}
      <main className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        {children}
      </main>
    </div>
  );
}
