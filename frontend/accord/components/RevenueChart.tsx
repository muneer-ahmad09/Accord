"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "@/lib/useApi";
import { analyticsApi, MonthlyRevenue } from "@/lib/api";

const STATIC_DATA: MonthlyRevenue[] = [
  { month: "Jan", revenue: 120, profit: 80  }, { month: "Feb", revenue: 200, profit: 140 },
  { month: "Mar", revenue: 180, profit: 220 }, { month: "Apr", revenue: 260, profit: 190 },
  { month: "May", revenue: 300, profit: 250 }, { month: "Jun", revenue: 340, profit: 310 },
  { month: "Jul", revenue: 380, profit: 360 }, { month: "Aug", revenue: 420, profit: 400 },
  { month: "Sep", revenue: 460, profit: 430 }, { month: "Oct", revenue: 490, profit: 460 },
  { month: "Nov", revenue: 520, profit: 500 }, { month: "Dec", revenue: 570, profit: 545 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13, boxShadow: "var(--shadow)" }}>
        <p style={{ fontWeight: 600, marginBottom: 4, color: "var(--text-1)" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>${p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const FILTERS = [
  { label: "Last 3 Months", months: 3 },
  { label: "Last 6 Months", months: 6 },
  { label: "All 12 Months", months: 12 },
];

export default function RevenueChart() {
  const [filterIdx, setFilterIdx] = useState(2);
  const months = FILTERS[filterIdx].months;

  const { data, loading } = useApi<MonthlyRevenue[]>(() => analyticsApi.getRevenueByMonth(months));
  const chartData = (data ?? STATIC_DATA).slice(-months);

  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: "24px", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>Revenue Growth</h3>
        <div style={{ display: "flex", gap: 6 }}>
          {FILTERS.map((f, i) => (
            <button key={f.label} onClick={() => setFilterIdx(i)} style={{
              padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
              fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
              background: filterIdx === i ? "rgba(79,126,255,0.15)" : "var(--bg-card2)",
              border: `1px solid ${filterIdx === i ? "var(--accent)" : "var(--border)"}`,
              color: filterIdx === i ? "var(--accent)" : "var(--text-2)",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 24, height: 24, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
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
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border-dim)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-3)", fontFamily: "DM Sans" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-3)", fontFamily: "DM Sans" }} tickFormatter={v => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4f7eff" strokeWidth={2.5} fill="url(#gR)" />
            <Area type="monotone" dataKey="profit" name="Profit" stroke="#38d9a9" strokeWidth={2.5} fill="url(#gP)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
