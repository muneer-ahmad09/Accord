"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 13
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [filter, setFilter] = useState("All 7 Months");
  const filters = ["All 7 Months", "Last 3 Months", "This Year"];

  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: 16, padding: "22px 24px",
      boxShadow: "var(--shadow)", border: "1px solid var(--border)", flex: 1
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Revenue Growth</h3>
        <div style={{ position: "relative" }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              appearance: "none",
              background: "#f5f7fa", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 28px 6px 12px",
              fontSize: 12, fontWeight: 500, fontFamily: "inherit",
              color: "var(--text-primary)", cursor: "pointer"
            }}
          >
            {filters.map(f => <option key={f}>{f}</option>)}
          </select>
          <span style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            fontSize: 10, pointerEvents: "none", color: "var(--text-secondary)"
          }}>▼</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4dabf7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38d9a9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38d9a9" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#edf1f7" vertical={false} />
          <XAxis
            dataKey="month" axisLine={false} tickLine={false}
            tick={{ fontSize: 12, fill: "#9aacbf", fontFamily: "DM Sans" }}
          />
          <YAxis
            axisLine={false} tickLine={false}
            tick={{ fontSize: 12, fill: "#9aacbf", fontFamily: "DM Sans" }}
            ticks={[0, 100, 200, 300, 400, 500, 600]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="revenue" name="Revenue"
            stroke="#4dabf7" strokeWidth={2.5}
            fill="url(#gradRevenue)"
          />
          <Area
            type="monotone" dataKey="profit" name="Profit"
            stroke="#38d9a9" strokeWidth={2.5}
            fill="url(#gradProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
