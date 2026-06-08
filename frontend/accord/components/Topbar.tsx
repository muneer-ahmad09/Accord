"use client";
import { Search, Bell, User } from "lucide-react";

interface TopbarProps {
  placeholder?: string;
}

export default function Topbar({ placeholder = "Search..." }: TopbarProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 32px",
      borderBottom: "1px solid var(--border-dim)",
      background: "var(--bg)",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "9px 16px", width: 320,
      }}>
        <Search size={14} color="var(--text-3)" />
        <input placeholder={placeholder} style={{
          border: "none", outline: "none", background: "transparent",
          fontSize: 13, color: "var(--text-1)", width: "100%", fontFamily: "inherit"
        }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={{
          position: "relative", background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 10,
          width: 38, height: 38, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer"
        }}>
          <Bell size={15} color="var(--text-2)" />
          <span style={{
            position: "absolute", top: 8, right: 8, width: 7, height: 7,
            borderRadius: "50%", background: "var(--accent)",
            border: "2px solid var(--bg)"
          }} />
        </button>

        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "7px 14px", cursor: "pointer"
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg, #4f7eff, #38d9a9)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <User size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>Profile</span>
        </button>
      </div>
    </div>
  );
}
