"use client";
import { TrendingUp, Users, FolderOpen, Loader2 } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { analyticsApi, projectsApi, DashboardSummary } from "@/lib/api";

function SkeletonCard({ gradient = false }: { gradient?: boolean }) {
  return (
    <div style={{
      background: gradient ? "linear-gradient(135deg, #3b5eff44, #4f7eff33)" : "var(--bg-card)",
      borderRadius: "var(--radius)", padding: "24px",
      border: gradient ? "none" : "1px solid var(--border)", animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ height: 12, width: 80, background: "rgba(255,255,255,0.1)", borderRadius: 6, marginBottom: 16 }} />
      <div style={{ height: 32, width: 120, background: "rgba(255,255,255,0.1)", borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 10, width: 60, background: "rgba(255,255,255,0.08)", borderRadius: 6 }} />
    </div>
  );
}

export default function StatCards() {
  const { data: summary, loading } = useApi<DashboardSummary>(() => analyticsApi.getDashboardSummary());

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <div className="stats-grid-3">
        <SkeletonCard gradient />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Fall back to static display values if backend not yet wired
  const totalSales = summary?.totalSales ?? 15738;
  const salesGrowth = summary?.salesGrowthPct ?? 12.4;
  const newCustomersPct = summary?.newCustomersPct ?? 30.36;
  const newCustomersGrowth = summary?.newCustomersGrowthPct ?? 4.2;
  const activeProjects = summary?.activeProjects ?? 3222;

  return (
    <div className="stats-grid-3">
      {/* Total Sales — gradient hero card */}
      <div style={{
        background: "linear-gradient(135deg, #3b5eff 0%, #4f7eff 50%, #38d9a9 100%)",
        borderRadius: "var(--radius)", padding: "24px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 4px 24px rgba(79,126,255,0.3)",
      }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 100" style={{ width: "100%", height: "100%" }}>
            <polyline points="0,80 30,60 60,70 90,40 120,50 160,20 200,10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Sales</p>
        <p style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif", letterSpacing: "-1px" }}>{fmt(totalSales)}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 8 }}>↑ {salesGrowth}% from last month</p>
      </div>

      {/* New Customers */}
      <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", border: "1px solid var(--border)", transition: "background 0.25s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: "var(--text-2)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>New Customers</p>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(79,126,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={14} color="var(--accent)" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>{newCustomersPct.toFixed(2)}%</p>
          <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
            <TrendingUp size={12} /> +{newCustomersGrowth}%
          </span>
        </div>
      </div>

      {/* Active Projects */}
      <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", border: "1px solid var(--border)", transition: "background 0.25s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: "var(--text-2)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Active Projects</p>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(56,217,169,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FolderOpen size={14} color="#38d9a9" />
          </div>
        </div>
        <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "Syne, sans-serif", color: "var(--text-1)" }}>
          {activeProjects.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
