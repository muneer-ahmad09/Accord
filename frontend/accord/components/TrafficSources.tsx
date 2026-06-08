"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Direct",   value: 42, color: "#4f7eff" },
  { name: "Social",   value: 35, color: "#74c0fc" },
  { name: "Referral", value: 23, color: "#38d9a9" },
];

export default function TrafficSources() {
  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "22px 24px", border: "1px solid var(--border)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 14 }}>Traffic Sources</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="value">
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ background: "#1e2330", border: "1px solid #2a3045", borderRadius: 8, fontSize: 12, fontFamily: "DM Sans" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color }} />
            <span style={{ fontSize: 11, color: "var(--text-2)" }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
