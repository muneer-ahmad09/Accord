"use client";
import { User } from "lucide-react";

const transactions = [
  { name: "Customer Name", role: "Customer", amount: "$100.00", positive: true },
  { name: "Amiya Srath", role: "Customer", amount: "$10.00", positive: true },
  { name: "James Wilson", role: "Enterprise", amount: "$520.00", positive: true },
  { name: "Sara Lee", role: "Customer", amount: "$45.00", positive: false },
  { name: "Dev Partners", role: "Business", amount: "$1,200.00", positive: true },
];

export default function RecentTransactions() {
  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: 16, padding: "22px 24px",
      boxShadow: "var(--shadow)", border: "1px solid var(--border)"
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
        Top Recent Transactions
      </h3>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        paddingBottom: 10, borderBottom: "1px solid var(--border)",
        marginBottom: 6
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>CUSTOMER</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>AMOUNT</span>
      </div>

      {/* Rows */}
      {transactions.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 0",
          borderBottom: i < transactions.length - 1 ? "1px solid #f3f6fb" : "none"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #e8f4ff, #e0faf2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <User size={15} color="#4dabf7" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{t.name}</p>
              <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.role}</p>
            </div>
          </div>
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: t.positive ? "var(--text-primary)" : "#ff6b6b"
          }}>
            {t.positive ? "" : "−"}{t.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
