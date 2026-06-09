"use client";
import { useState } from "react";
import { Plus, Lock, ShieldCheck, Building2, CreditCard, FileText } from "lucide-react";

const invoices = [
  { id: "INV-001", client: "ABC Corp",  amount: "$1,200", due: "15 Jun 2026", statusKey: "PAID" },
  { id: "INV-002", client: "XYZ Ltd",   amount: "$850",   due: "20 Jun 2026", statusKey: "PENDING" },
  { id: "INV-003", client: "InnoTech",  amount: "$3,400", due: "18 Jun 2026", statusKey: "OVERDUE" },
  { id: "INV-004", client: "ABC Corp",  amount: "$1,000", due: "25 Jun 2026", statusKey: "SENT" },
  { id: "INV-005", client: "Craft Co",  amount: "$2,100", due: "30 Jun 2026", statusKey: "PAID" },
  { id: "INV-006", client: "Orion LLC", amount: "$750",   due: "10 Jul 2026", statusKey: "PENDING" },
];

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  PAID:    { color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.3)" },
  SENT:    { color: "#4f7eff", bg: "rgba(79,126,255,0.08)",  border: "rgba(79,126,255,0.3)" },
  PENDING: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)" },
  OVERDUE: { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)" },
};

const invoiceItems = [
  { id: "INV-004", desc: "ABC Corp.",    qty: 1, total: "$1,200" },
  { id: "INV-008", desc: "XYZ Ltd.",     qty: 1, total: "$850" },
  { id: "INV-007", desc: "Web Services", qty: 1, total: "$850" },
];

export default function InvoicesPage() {
  const [selected, setSelected] = useState<string | null>("INV-004");
  const inv = invoices.find(i => i.id === selected);

  return (
    <div className="page-content">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>Invoices</h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Manage and track all invoices</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, #4f7eff, #3b5eff)", color: "#fff",
          border: "none", borderRadius: 10, padding: "11px 20px",
          fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(79,126,255,0.4)",
        }}>
          <Plus size={16} /> New Invoice
        </button>
      </div>

      <div className="invoice-layout-grid">
        {/* Invoice list */}
        <div className="table-wrap" style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-dim)" }}>
                {["Invoice","Client","Amount","Due Date","Status"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const ss = statusStyle[inv.statusKey];
                const isSelected = selected === inv.id;
                return (
                  <tr key={i} onClick={() => setSelected(inv.id)} style={{
                    borderBottom: i < invoices.length - 1 ? "1px solid var(--border-dim)" : "none",
                    background: isSelected ? "rgba(79,126,255,0.07)" : "transparent",
                    cursor: "pointer", transition: "background 0.12s",
                    borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                  }}>
                    <td style={{ padding: "15px 20px", fontSize: 13, fontWeight: 600, color: "var(--accent)", fontFamily: "DM Mono, monospace", whiteSpace: "nowrap" }}>{inv.id}</td>
                    <td style={{ padding: "15px 20px", fontSize: 13, color: "var(--text-1)", whiteSpace: "nowrap" }}>{inv.client}</td>
                    <td style={{ padding: "15px 20px", fontSize: 13, fontWeight: 600, color: "var(--text-1)", whiteSpace: "nowrap" }}>{inv.amount}</td>
                    <td style={{ padding: "15px 20px", fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap" }}>{inv.due}</td>
                    <td style={{ padding: "15px 20px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", padding: "3px 10px", borderRadius: 20, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, whiteSpace: "nowrap" }}>
                        {inv.statusKey}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Payment portal */}
        {inv ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Payment form */}
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={16} color="var(--text-2)" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>Secure Payment Portal</h2>
                </div>
                <ShieldCheck size={16} color="var(--green)" />
              </div>

              <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 4 }}>
                Invoice: <span style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace", fontWeight: 600 }}>{inv.id}</span>
              </p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", fontFamily: "Syne, sans-serif", marginBottom: 20 }}>
                Amount: {inv.amount} USD
              </p>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Credit Card</label>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ background: "#1a1f4e", color: "#4f7eff", fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 3, letterSpacing: "0.1em" }}>VISA</span>
                    <div style={{ width: 20, height: 14, borderRadius: 3, background: "linear-gradient(135deg, #f59e0b, #ef4444)" }} />
                  </div>
                </div>
                <input placeholder="1234 5678 9012 3456" style={{ width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text-1)", outline: "none", fontFamily: "DM Mono, monospace" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Cardholder Name</label>
                  <input placeholder="Full name" style={{ width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text-1)", outline: "none", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Expiry / CVV</label>
                  <input placeholder="MM/YY · CVV" style={{ width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text-1)", outline: "none", fontFamily: "DM Mono, monospace" }} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>Payment Method</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--accent)" }} />
                  <Building2 size={14} color="var(--text-2)" />
                  <span style={{ fontSize: 13, color: "var(--text-1)" }}>ACH Transfer</span>
                </div>
              </div>

              <button style={{
                width: "100%", background: "linear-gradient(135deg, #4f7eff, #3b5eff)",
                color: "#fff", border: "none", borderRadius: 10, padding: "13px",
                fontSize: 15, fontWeight: 700, fontFamily: "Syne, sans-serif",
                cursor: "pointer", boxShadow: "0 4px 20px rgba(79,126,255,0.4)", letterSpacing: "0.02em",
              }}>
                Pay {inv.amount} USD
              </button>
            </div>

            {/* Mini invoice preview */}
            <div style={{ background: "#f8f9fc", borderRadius: "var(--radius)", border: "1px solid #e2e6f0", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#1a1f2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={15} color="#fff" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#1a2035", fontFamily: "Syne, sans-serif", letterSpacing: "0.06em" }}>INVOICE</p>
              </div>
              <div style={{ fontSize: 11, color: "#6b7a99", marginBottom: 14 }}>
                <p>Invoice: {inv.id} · Client: {inv.client}</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                <thead>
                  <tr style={{ background: "#1a1f2e" }}>
                    {["ID","Description","Qty","Total"].map(h => (
                      <th key={h} style={{ padding: "5px 8px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e2e6f0" }}>
                      <td style={{ padding: "6px 8px", fontSize: 10, color: "#4f7eff", fontFamily: "DM Mono, monospace" }}>{item.id}</td>
                      <td style={{ padding: "6px 8px", fontSize: 11, color: "#2a3045" }}>{item.desc}</td>
                      <td style={{ padding: "6px 8px", fontSize: 11, color: "#2a3045" }}>{item.qty}</td>
                      <td style={{ padding: "6px 8px", fontSize: 11, color: "#2a3045", fontWeight: 600 }}>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ borderTop: "2px solid #1a1f2e", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1a2035", fontFamily: "Syne, sans-serif" }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1a2035", fontFamily: "Syne, sans-serif" }}>{inv.amount} USD</span>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ShieldCheck size={11} color="#22c55e" />
                  <span style={{ fontSize: 10, color: "#6b7a99" }}>Secured</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Lock size={11} color="#22c55e" />
                  <span style={{ fontSize: 10, color: "#6b7a99" }}>Approved</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
            <div style={{ textAlign: "center" }}>
              <CreditCard size={32} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>Select an invoice to view payment details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
