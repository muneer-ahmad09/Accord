"use client";
import { Search, Bell, ChevronDown, User } from "lucide-react";

export default function Topbar() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 28px 0",
      marginBottom: 24,
    }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
          Project Overview
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>Company Dashboard</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 10, padding: "8px 14px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          <Search size={15} color="#9aacbf" />
          <input
            placeholder="Search..."
            style={{
              border: "none", outline: "none",
              fontSize: 13, color: "var(--text-primary)",
              background: "transparent", width: 160,
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          position: "relative", background: "#fff", border: "1px solid var(--border)",
          borderRadius: 10, width: 38, height: 38, display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          <Bell size={16} color="var(--text-secondary)" />
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 8, height: 8, borderRadius: "50%",
            background: "#ff6b6b", border: "2px solid #fff"
          }} />
        </button>

        {/* User */}
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 10, padding: "7px 12px",
          cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg, #4dabf7, #38d9a9)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <User size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>User profile</span>
          <ChevronDown size={13} color="var(--text-secondary)" />
        </button>
      </div>
    </div>
  );
}
