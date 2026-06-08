"use client";
import { User } from "lucide-react";

const transactions = [
  { name: "Customer Name", role: "Customer",  amount: "$100.00",    positive: true },
  { name: "Amiya Srath",   role: "Customer",  amount: "$10.00",     positive: true },
  { name: "James Wilson",  role: "Enterprise",amount: "$520.00",    positive: true },
  { name: "Sara Lee",      role: "Customer",  amount: "$45.00",     positive: false },
  { name: "Dev Partners",  role: "Business",  amount: "$1,200.00",  positive: true },
];

export default function RecentTransactions() {
  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "22px 24px", border: "1px solid var(--border)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 14 }}>Recent Transactions</h3>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, borderBottom: "1px solid var(--border-dim)", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em" }}>CUSTOMER</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em" }}>AMOUNT</span>
      </div>
      {transactions.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < transactions.length - 1 ? "1px solid var(--border-dim)" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(79,126,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={13} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)" }}>{t.name}</p>
              <p style={{ fontSize: 11, color: "var(--text-3)" }}>{t.role}</p>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.positive ? "var(--green)" : "var(--red)" }}>
            {t.positive ? "+" : "−"}{t.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
