"use client";
import { useApi } from "@/lib/useApi";
import { walletApi, WalletSummary } from "@/lib/api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function Skeleton() {
  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "22px 24px", border: "1px solid var(--border)" }}>
      <div style={{ height: 16, width: 140, background: "var(--bg-card2)", borderRadius: 6, marginBottom: 14 }} />
      {[1,2,3,4].map(i => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-dim)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-card2)" }} />
            <div>
              <div style={{ height: 11, width: 90, background: "var(--bg-card2)", borderRadius: 4, marginBottom: 5 }} />
              <div style={{ height: 9, width: 55, background: "var(--bg-card2)", borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ height: 11, width: 50, background: "var(--bg-card2)", borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

export default function RecentTransactions() {
  const { data, loading, error } = useApi<WalletSummary>(() => walletApi.getSummary());

  if (loading) return <Skeleton />;

  const transactions = data?.recentActivity ?? [
    // Static fallback while backend is being wired
    { id: "1", date: "", description: "Invoice Payment (ABC Corp)", amount: 100,    currency: "USD", type: "INVOICE_PAYMENT" as const, status: "SETTLED" as const, partyName: "ABC Corp" },
    { id: "2", date: "", description: "Invoice Payment (XYZ Ltd)",  amount: 520,    currency: "USD", type: "INVOICE_PAYMENT" as const, status: "SETTLED" as const, partyName: "XYZ Ltd" },
    { id: "3", date: "", description: "Payout (HDFC Bank)",         amount: -1500,  currency: "INR", type: "PAYOUT" as const, status: "PROCESSING" as const, partyName: "HDFC Bank" },
    { id: "4", date: "", description: "Platform Fee",               amount: -45,    currency: "USD", type: "PLATFORM_FEE" as const, status: "SETTLED" as const },
    { id: "5", date: "", description: "Invoice Payment (Dev Corp)", amount: 1200,   currency: "USD", type: "INVOICE_PAYMENT" as const, status: "SETTLED" as const, partyName: "Dev Corp" },
  ];

  const statusColor: Record<string, string> = { SETTLED: "var(--green)", PROCESSING: "var(--yellow)", PENDING: "var(--accent)", FAILED: "var(--red)" };

  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "22px 24px", border: "1px solid var(--border)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 14 }}>Recent Transactions</h3>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, borderBottom: "1px solid var(--border-dim)", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em" }}>TRANSACTION</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em" }}>AMOUNT</span>
      </div>
      {error && <p style={{ fontSize: 12, color: "var(--text-3)", padding: "12px 0" }}>Could not load transactions</p>}
      {transactions.slice(0, 5).map((t, i) => {
        const positive = t.amount > 0;
        const Icon = positive ? TrendingUp : t.type === "PLATFORM_FEE" ? Minus : TrendingDown;
        const absAmount = Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const currency = t.currency === "INR" ? "₹" : "$";
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < transactions.length - 1 ? "1px solid var(--border-dim)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} color={positive ? "var(--green)" : "var(--red)"} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.partyName ?? t.description}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-3)" }}>{t.status.charAt(0) + t.status.slice(1).toLowerCase()}</p>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: positive ? "var(--green)" : "var(--red)", flexShrink: 0, marginLeft: 8, fontFamily: "DM Mono, monospace" }}>
              {positive ? "+" : "−"}{currency}{absAmount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
