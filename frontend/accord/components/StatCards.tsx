"use client";
import { TrendingUp } from "lucide-react";

export default function StatCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, #3b5eff 0%, #4f7eff 50%, #38d9a9 100%)",
        borderRadius: "var(--radius)", padding: "24px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 4px 24px rgba(79,126,255,0.3)",
      }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", opacity: 0.12 }}>
          <svg viewBox="0 0 200 100" style={{ width: "100%", height: "100%" }}>
            <polyline points="0,80 30,60 60,70 90,40 120,50 160,20 200,10"
              fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.75)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Sales</p>
        <p style={{ fontSize: 34, fontWeight: 700, color: "#fff", fontFamily: "Syne, sans-serif", letterSpacing: "-1px" }}>$15,738</p>
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: "var(--text-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>New Customers</p>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(79,126,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={14} color="var(--accent)" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <p style={{ fontSize: 30, fontWeight: 700, fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>30.36%</p>
          <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>▲ +4.2%</span>
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", border: "1px solid var(--border)" }}>
        <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>Active Projects</p>
        <p style={{ fontSize: 30, fontWeight: 700, fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>3,222</p>
      </div>
    </div>
  );
}
