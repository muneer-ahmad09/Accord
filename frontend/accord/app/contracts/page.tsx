"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import { Plus, Eye, Download, ArrowLeftRight } from "lucide-react";

const contracts = [
  { name: "Contract Ftvmision Hub", client: "ABC Corp.", type: "Lawery",     statusKey: "ACTIVE" },
  { name: "Contract 2 INV-002",     client: "XYZ Ltd.",  type: "Contractor", statusKey: "SENT" },
  { name: "Contract 1 INV-004",     client: "XYZ Ltd.",  type: "Agency",     statusKey: "SENT" },
  { name: "Contract 1 INV-005",     client: "XYZ Ltd.",  type: "Contractor", statusKey: "DRAFT" },
  { name: "Contract Etvmision h03", client: "ABC Corp.", type: "Agency",     statusKey: "DRAFT" },
  { name: "NDA InnoTech 2026",       client: "InnoTech",  type: "NDA",        statusKey: "REVIEW" },
];

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  ACTIVE: { color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.3)" },
  SENT:   { color: "#4f7eff", bg: "rgba(79,126,255,0.08)",  border: "rgba(79,126,255,0.3)" },
  DRAFT:  { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)" },
  REVIEW: { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.3)" },
};

const stats = [
  { label: "Active Contracts",     value: "12" },
  { label: "Pending Signatures",   value: "3" },
  { label: "NDAs Awaiting Review", value: "5" },
];

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const filtered = contracts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Topbar placeholder="Search contracts..." />
      <div style={{ padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)" }}>Contracts Hub</h1>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #4f7eff, #3b5eff)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "11px 20px", fontSize: 14, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(79,126,255,0.4)"
          }}>
            <Plus size={16} /> Generate New Contract
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "22px 24px", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 10, letterSpacing: "0.04em" }}>{s.label}</p>
              <p style={{ fontSize: 36, fontWeight: 800, color: "var(--text-1)", fontFamily: "Syne, sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-dim)" }}>
                {["Document Name", "Client", "Type", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const ss = statusStyle[c.statusKey];
                return (
                  <tr key={i}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-dim)" : "none", transition: "background 0.12s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text-1)", fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text-2)" }}>{c.client}</td>
                    <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text-2)" }}>{c.type}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", padding: "4px 12px", borderRadius: 20, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}>
                        {c.statusKey.charAt(0) + c.statusKey.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {[Eye, Download, ArrowLeftRight].map((Icon, j) => (
                          <button key={j} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", transition: "color 0.12s" }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-1)")}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-3)")}>
                            <Icon size={16} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
