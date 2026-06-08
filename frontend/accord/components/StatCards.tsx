"use client";
import { TrendingUp } from "lucide-react";

export default function StatCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
      {/* Total Sales - gradient card */}
      <div style={{
        background: "linear-gradient(135deg, #3ecf8e 0%, #20c997 50%, #4dabf7 100%)",
        borderRadius: 16,
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(32, 201, 151, 0.3)",
      }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", opacity: 0.15 }}>
          <svg viewBox="0 0 200 100" style={{ width: "100%", height: "100%" }}>
            <polyline points="0,80 30,60 60,70 90,40 120,50 160,20 200,10"
              fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", marginBottom: 10 }}>Total Sales</p>
        <p style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>$15,738</p>
      </div>

      {/* New Customers */}
      <div style={{
        background: "var(--card-bg)", borderRadius: 16, padding: "22px 24px",
        boxShadow: "var(--shadow)", border: "1px solid var(--border)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>New Customers</p>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #e8f7ff, #d0f2e8)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <TrendingUp size={16} color="#20c997" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <p style={{ fontSize: 30, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>30.36%</p>
          <span style={{
            fontSize: 13, fontWeight: 600, color: "#20c997",
            display: "flex", alignItems: "center", gap: 2
          }}>▲</span>
        </div>
      </div>

      {/* Active Projects */}
      <div style={{
        background: "var(--card-bg)", borderRadius: 16, padding: "22px 24px",
        boxShadow: "var(--shadow)", border: "1px solid var(--border)"
      }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 14 }}>Active Projects</p>
        <p style={{ fontSize: 30, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>3222</p>
      </div>
    </div>
  );
}
