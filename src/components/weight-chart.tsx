"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Record = { date: string; weightKg: number };

export function WeightChart({ records }: { records: Record[] }) {
  if (records.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-[#F3F4F6] bg-white text-sm text-[#9CA3AF]">
        No weight data yet
      </div>
    );
  }

  const data = [
    { date: "Start", weightKg: 85 },
    ...records.map((r) => ({ date: r.date.slice(5), weightKg: r.weightKg })),
  ];

  return (
    <div className="rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid #F3F4F6",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              color: "#1F2937",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="weightKg"
            stroke="#FF6B35"
            strokeWidth={2}
            fill="url(#weightGrad)"
            dot={{ fill: "#FF6B35", stroke: "#FFFFFF", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#FF6B35", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
