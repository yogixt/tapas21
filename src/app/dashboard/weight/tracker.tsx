"use client";

import { useState, useActionState, useMemo } from "react";
import { saveWeightAction } from "./actions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function WeightTracker({
  records,
  startWeight,
  goalWeight,
}: {
  records: { date: string; weightKg: number }[];
  startWeight: number;
  goalWeight: number;
}) {
  const [newWeight, setNewWeight] = useState("");
  const [state, action, pending] = useActionState(saveWeightAction, {
    error: "",
    success: false,
  });

  const latestWeight = records[0]?.weightKg ?? startWeight;
  const lost = startWeight - latestWeight;
  const totalToLose = startWeight - goalWeight;
  const progressPct = totalToLose > 0 ? Math.min((lost / totalToLose) * 100, 100) : 0;

  const chartData = useMemo(
    () => [
      { date: "Start", weight: startWeight },
      ...records.toReversed().map((r) => ({
        date: r.date.slice(5),
        weight: r.weightKg,
      })),
    ],
    [records, startWeight]
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-xs font-medium text-[#9CA3AF]">Start</p>
          <p className="text-xl font-bold text-[#1F2937]">{startWeight} kg</p>
        </div>
        <div className="card text-center">
          <p className="text-xs font-medium text-[#9CA3AF]">Current</p>
          <p className="text-xl font-bold text-[#FF6B35]">{latestWeight} kg</p>
        </div>
        <div className="card text-center">
          <p className="text-xs font-medium text-[#9CA3AF]">Goal</p>
          <p className="text-xl font-bold text-[#22C55E]">{goalWeight} kg</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-[#6B7280]">
            Progress to goal
          </p>
          <p className="text-sm font-semibold text-[#1F2937]">
            {Math.round(progressPct)}%
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#22C55E] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-[#6B7280]">
          {lost > 0
            ? `${lost.toFixed(1)} kg lost — keep going!`
            : "Start your journey today!"}
        </p>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-[#1F2937] mb-3">Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#wg)"
                dot={{ fill: "#FF6B35", stroke: "#FFF", strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log Weight Form */}
      <div className="card">
        <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
          Log Weight
        </h3>
        <form action={action} className="flex items-center gap-3">
          <input
            type="number"
            name="weightKg"
            step="0.1"
            min="30"
            max="200"
            required
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Weight in kg"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={pending}
            className="btn-primary disabled:opacity-50"
          >
            {pending ? "..." : "Log"}
          </button>
        </form>
        {state.success && (
          <p className="mt-2 text-sm text-[#22C55E]">Weight logged!</p>
        )}
        {state.error && (
          <p className="mt-2 text-sm text-red-500">{state.error}</p>
        )}
      </div>
    </div>
  );
}
