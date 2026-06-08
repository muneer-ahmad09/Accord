"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import { Plus, Search } from "lucide-react";

const clients = [
  { name: "Sarah J.", status: "Active",  company: "ABC Corp", country: "USA", billed: "$10,000", balance: "$2,000",  statusKey: "ACTIVE" },
  { name: "David K.", status: "Sent",    company: "XYZ Ltd",  country: "UK",  billed: "$5,000",  balance: "$0",      statusKey: "SENT" },
  { name: "Priya M.", status: "Active",  company: "InnoTech", country: "IN",  billed: "$18,500", balance: "$4,200",  statusKey: "ACTIVE" },
  { name: "James W.", status: "Pending", company: "Orion LLC", country: "CA", billed: "$7,200",  balance: "$7,200",  statusKey: "PENDING" },
  { name: "Lena S.",  status: "Active",  company: "Craft Co", country: "DE",  billed: "$22,000", balance: "$1,100",  statusKey: "ACTIVE" },
  { name: "Omar A.",  status: "Sent",    company: "FutureTec",country: "AE",  billed: "$9,400",  balance: "$0",      statusKey: "SENT" },
];

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  ACTIVE:  { color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.3)" },
  SENT:    { color: "#4f7eff", bg: "rgba(79,126,255,0.08)",  border: "rgba(79,126,255,0.3)" },
  PENDING: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)" },
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Topbar placeholder="Search clients..." />
      <div style={{ padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>Clients</h1>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{clients.length} total clients</p>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #4f7eff, #3b5eff)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "11px 20px", fontSize: 14, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(79,126,255,0.4)"
          }}>
            <Plus size={16} /> New Client
          </button>
        </div>

        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "10px 16px", marginBottom: 16, maxWidth: 360,
        }}>
          <Search size={14} color="var(--text-3)" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Filter clients..."
            style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "var(--text-1)", fontFamily: "inherit", width: "100%" }}
          />
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-dim)" }}>
                {["Client Name", "Company", "Country", "Total Billed", "Outstanding Balance", "Status"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const ss = statusStyle[c.statusKey];
                return (
                  <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-dim)" : "none", transition: "background 0.12s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text-1)", fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(79,126,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
                          {c.name[0]}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text-2)" }}>{c.company}</td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text-2)" }}>{c.country}</td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text-1)", fontWeight: 500 }}>{c.billed}</td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: c.balance === "$0" ? "var(--text-3)" : "var(--text-1)", fontWeight: 500 }}>{c.balance}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                        padding: "4px 12px", borderRadius: 20,
                        color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`
                      }}>
                        {c.statusKey}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
              No clients found for "{search}"
            </div>
          )}
        </div>
      </div>
    </>
  );
}
