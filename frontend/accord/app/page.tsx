"use client";

import StatCards from "@/components/StatCards";
import RevenueChart from "@/components/RevenueChart";
import TrafficSources from "@/components/TrafficSources";
import RecentTransactions from "@/components/RecentTransactions";
import { useWalletSummary } from "@/hooks/useWalletSummary";

export default function Dashboard() {
  const { data, isLoading } = useWalletSummary();
  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>
          Project Overview
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
          Company Dashboard
        </p>
      </div>
      <StatCards walletSummmary={data ?? undefined} />
      <div className="main-chart-grid">
        <RevenueChart />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <TrafficSources />
          <RecentTransactions walletSummary={data ?? undefined} />
        </div>
      </div>
    </div>
  );
}
