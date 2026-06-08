"use client";
import { BarChart2, LineChart, Users, FileText, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: BarChart2, label: "Dashboard", active: true },
  { icon: LineChart, label: "Analytics" },
  { icon: Users, label: "Users" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "28px 0",
      gap: 4,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 22px 28px" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "linear-gradient(135deg, #4dabf7 0%, #38d9a9 100%)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <BarChart2 size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.2 }}>Admin</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.2 }}>Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
        {navItems.map(({ icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: isActive ? "linear-gradient(135deg, #e8f4ff 0%, #e0faf2 100%)" : "transparent",
                color: isActive ? "#2b8be0" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                fontFamily: "inherit",
                transition: "all 0.15s",
                borderLeft: isActive ? "3px solid #4dabf7" : "3px solid transparent",
                textAlign: "left",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
