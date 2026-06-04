"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Entry = {
  date: string;
  actualCalories: number | null;
  actualProtein: number | null;
  actualWaterL: number | null;
};

export function MealTracker({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-neutral-800 text-neutral-600">
        No meal data yet
      </div>
    );
  }

  const data = entries.map((e) => ({
    date: e.date.slice(5),
    Calories: e.actualCalories ?? 0,
    "Protein (g×10)": (e.actualProtein ?? 0) * 10,
  }));

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
      <h2 className="mb-4 text-lg font-semibold">Last 7 Days</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#737373", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#737373", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "#171717",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#e5e5e5",
            }}
          />
          <Legend />
          <Bar dataKey="Calories" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="Protein (g×10)"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
