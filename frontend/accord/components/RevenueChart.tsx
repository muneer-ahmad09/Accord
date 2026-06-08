"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 120, profit: 80 },
  { month: "Feb", revenue: 200, profit: 140 },
  { month: "Mar", revenue: 180, profit: 220 },
  { month: "Apr", revenue: 260, profit: 190 },
  { month: "May", revenue: 300, profit: 250 },
  { month: "Jun", revenue: 340, profit: 310 },
  { month: "Jul", revenue: 380, profit: 360 },
  { month: "Aug", revenue: 420, profit: 400 },
  { month: "Sep", revenue: 460, profit: 430 },
  { month: "Oct", revenue: 490, profit: 460 },
  { month: "Nov", revenue: 520, profit: 500 },
  { month: "Dec", revenue: 570, profit: 545 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#1e2330", border: "1px solid #2a3045", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
        <p style={{ fontWeight: 600, marginBottom: 4, color: "#f0f3ff" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [filter, setFilter] = useState("All 7 Months");
  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>Revenue Growth</h3>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{
          appearance: "none", background: "var(--bg-card2)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 24px 6px 12px", fontSize: 12, fontWeight: 500,
          fontFamily: "inherit", color: "var(--text-1)", cursor: "pointer"
        }}>
          {["All 7 Months","Last 3 Months","This Year"].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f7eff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f7eff" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38d9a9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38d9a9" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#1f2535" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#4e587a", fontFamily: "DM Sans" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#4e587a", fontFamily: "DM Sans" }} ticks={[0,100,200,300,400,500,600]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4f7eff" strokeWidth={2.5} fill="url(#gR)" />
          <Area type="monotone" dataKey="profit" name="Profit" stroke="#38d9a9" strokeWidth={2.5} fill="url(#gP)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
