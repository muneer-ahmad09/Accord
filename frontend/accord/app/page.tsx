import Topbar from "@/components/Topbar";
import StatCards from "@/components/StatCards";
import RevenueChart from "@/components/RevenueChart";
import TrafficSources from "@/components/TrafficSources";
import RecentTransactions from "@/components/RecentTransactions";

export default function Dashboard() {
  return (
    <>
      <Topbar placeholder="Search clients, invoices..." />
      <div style={{ padding: "28px 32px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>Project Overview</h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Company Dashboard</p>
        </div>
        <StatCards />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <RevenueChart />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <TrafficSources />
            <RecentTransactions />
          </div>
        </div>
      </div>
    </>
  );
}
