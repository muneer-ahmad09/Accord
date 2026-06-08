"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Direct", value: 42, color: "#4dabf7" },
  { name: "Social", value: 35, color: "#74c0fc" },
  { name: "Referral", value: 23, color: "#38d9a9" },
];

export default function TrafficSources() {
  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: 16, padding: "22px 24px",
      boxShadow: "var(--shadow)", border: "1px solid var(--border)"
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
        Traffic Sources
      </h3>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%"
              innerRadius={48} outerRadius={72}
              paddingAngle={3} dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value}%`, name]}
              contentStyle={{
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 12, fontFamily: "DM Sans"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8 }}>
        {data.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: item.color
            }} />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
