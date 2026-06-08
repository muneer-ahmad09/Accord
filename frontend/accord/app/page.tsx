import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCards from "@/components/StatCards";
import RevenueChart from "@/components/RevenueChart";
import TrafficSources from "@/components/TrafficSources";
import RecentTransactions from "@/components/RecentTransactions";

export default function Dashboard() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--main-bg)"
    }}>
      <Sidebar />

      <main style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}>
        <Topbar />

        <div style={{ padding: "0 28px 28px", flex: 1 }}>
          <StatCards />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
            <RevenueChart />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <TrafficSources />
              <RecentTransactions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
