"use client";
import { ArrowDownToLine, Building, TrendingUp, TrendingDown, Minus } from "lucide-react";

const transactions = [
  { date: "07 Jun 2026", desc: "Invoice Payment (XYZ Ltd)",  amount: "+₹78,000",   statusKey: "SETTLED",    positive: true },
  { date: "06 Jun 2026", desc: "Payout (HDFC Bank)",         amount: "-₹1,50,000", statusKey: "PROCESSING", positive: false },
  { date: "05 Jun 2026", desc: "Platform Fee",               amount: "-₹1,560",    statusKey: "SETTLED",    positive: false },
  { date: "04 Jun 2026", desc: "Invoice Payment (ABC Corp)", amount: "+₹1,20,000", statusKey: "SETTLED",    positive: true },
  { date: "03 Jun 2026", desc: "Payout (SBI Bank)",          amount: "-₹80,000",   statusKey: "SETTLED",    positive: false },
  { date: "02 Jun 2026", desc: "Invoice Payment (InnoTech)", amount: "+₹45,000",   statusKey: "PENDING",    positive: true },
  { date: "01 Jun 2026", desc: "Platform Fee",               amount: "-₹1,560",    statusKey: "SETTLED",    positive: false },
];

const statusColor: Record<string, string> = {
  SETTLED: "#22c55e", PROCESSING: "#f59e0b", PENDING: "#4f7eff", FAILED: "#ef4444",
};

export default function WalletPage() {
  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>Wallet Overview</h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Manage your funds and transactions</p>
      </div>

      <div className="wallet-balance-grid">
        {/* Main balance */}
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "28px", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Wallet Balance</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: "var(--text-1)", fontFamily: "Syne, sans-serif", letterSpacing: "-1px", marginBottom: 6 }}>₹3,12,000</p>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}>
            Available Funds: <span style={{ color: "var(--text-1)", fontWeight: 600 }}>₹2,95,000</span>
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "linear-gradient(135deg, #4f7eff, #3b5eff)", color: "#fff",
              border: "none", borderRadius: 8, padding: "10px 18px",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(79,126,255,0.35)",
            }}>
              <ArrowDownToLine size={14} /> Withdraw Funds
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "transparent", color: "var(--accent)",
              border: "1px solid var(--accent)", borderRadius: 8,
              padding: "10px 18px", fontSize: 13, fontWeight: 600,
              fontFamily: "inherit", cursor: "pointer",
            }}>
              <Building size={14} /> Manage Banks
            </button>
          </div>
        </div>

        {/* Pending payouts */}
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "28px", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pending USD Payouts</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: "var(--text-1)", fontFamily: "Syne, sans-serif", letterSpacing: "-1px" }}>$950</p>
          <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(245,158,11,0.07)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)" }}>
            <p style={{ fontSize: 12, color: "#f59e0b" }}>⏳ Estimated settlement: 2–3 business days</p>
          </div>
        </div>
      </div>

      {/* Transaction activity */}
      <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-dim)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>Transaction Activity</h2>
        </div>
        <div className="table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-dim)", background: "var(--bg)" }}>
                {["Date","Description","Amount","Status"].map(h => (
                  <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const color = statusColor[t.statusKey];
                const Icon = t.positive ? TrendingUp : t.desc.includes("Fee") ? Minus : TrendingDown;
                return (
                  <tr key={i}
                    style={{ borderBottom: i < transactions.length - 1 ? "1px solid var(--border-dim)" : "none", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "15px 24px", fontSize: 12, color: "var(--text-2)", fontFamily: "DM Mono, monospace", whiteSpace: "nowrap" }}>{t.date}</td>
                    <td style={{ padding: "15px 24px", fontSize: 14, color: "var(--text-1)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} color={t.positive ? "var(--green)" : "var(--red)"} />
                        </div>
                        {t.desc}
                      </div>
                    </td>
                    <td style={{ padding: "15px 24px", fontSize: 13, fontWeight: 700, fontFamily: "DM Mono, monospace", color: t.positive ? "var(--green)" : "var(--red)", whiteSpace: "nowrap" }}>{t.amount}</td>
                    <td style={{ padding: "15px 24px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color }}>{t.statusKey.charAt(0) + t.statusKey.slice(1).toLowerCase()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
