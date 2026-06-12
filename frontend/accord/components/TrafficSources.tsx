"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useApi } from "@/lib/useApi";
import { analyticsApi, TrafficSource } from "@/lib/api";

const SOURCE_COLORS: Record<string, string> = {
  DIRECT: "#4f7eff",
  SOCIAL: "#74c0fc",
  REFERRAL: "#38d9a9",
  OUTBOUND: "#ff922b",
  WEBSITE: "#f783ac",
};

export default function TrafficSources() {
  const { data, loading } = useApi<TrafficSource[]>(() =>
    analyticsApi.getTrafficSources(),
  );

  const sources = data ?? [];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius)",
        padding: "22px 24px",
        border: "1px solid var(--border)",
      }}
    >
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--text-1)",
          marginBottom: 14,
        }}
      >
        Traffic Sources
      </h3>

      {loading ? (
        <div
          style={{
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              border: "3px solid var(--border)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sources.map((source, index) => (
                    <Cell
                      key={index}
                      fill={SOURCE_COLORS[source.sourceName] ?? "#adb5bd"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`]}
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "DM Sans",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginTop: 8,
            }}
          >
            {sources.map((source) => (
              <div
                key={source.sourceName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: SOURCE_COLORS[source.sourceName] ?? "#adb5bd",
                  }}
                />

                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-2)",
                  }}
                >
                  {source.sourceName.charAt(0) + source.sourceName.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
