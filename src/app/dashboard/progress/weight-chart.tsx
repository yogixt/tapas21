"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function WeightChart({
  records,
  latestWeight,
  startWeight,
}: {
  records: { date: string; weightKg: number }[];
  latestWeight: number | null;
  startWeight: number;
}) {
  if (records.length < 1) {
    return (
      <div className="card">
        <h3 className="text-sm font-semibold text-[#1F2937] mb-3">Weight</h3>
        <div className="flex h-40 items-center justify-center text-sm text-[#9CA3AF]">
          Log your weight to see the trend
        </div>
      </div>
    );
  }

  const chartData = [
    { date: "Start", weight: startWeight },
    ...records.map((r) => ({
      date: r.date.slice(5),
      weight: r.weightKg,
    })),
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1F2937]">Weight</h3>
        <div className="text-right">
          <p className="text-sm text-[#6B7280]">
            {startWeight} kg → {latestWeight} kg
          </p>
          <p className="text-xs text-[#22C55E]">
            {latestWeight && startWeight
              ? `${(startWeight - latestWeight).toFixed(1)} kg lost`
              : ""}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.15} />
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
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#FFF",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 12,
              color: "#1F2937",
            }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#FF6B35"
            strokeWidth={2.5}
            fill="url(#weightGrad)"
            dot={{ fill: "#FF6B35", stroke: "#FFF", strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
