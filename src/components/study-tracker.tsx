"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { BookOpen } from "lucide-react";

type Entry = { date: string; studyHours: number | null };

export function StudyTracker({ entries }: { entries: Entry[] }) {
  const weeklyData = useMemo(() => {
    const days: { day: string; hours: number }[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = entries.find((e) => e.date === key);
      days.push({
        day: dayNames[d.getDay()],
        hours: entry?.studyHours ?? 0,
      });
    }
    return days;
  }, [entries]);

  const totalStudy = entries.reduce(
    (sum, e) => sum + (e.studyHours ?? 0),
    0
  );
  const target = 63;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Total Study
          </p>
          <p className="text-xl font-bold text-[#1F2937]">
            {Math.floor(totalStudy)}
            <span className="text-sm font-normal text-[#9CA3AF]">
              {" "}
              / {target}h
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Daily Avg
          </p>
          <p className="text-xl font-bold text-[#1F2937]">
            {entries.length > 0
              ? (totalStudy / entries.length).toFixed(1)
              : "0.0"}
            <span className="text-sm font-normal text-[#9CA3AF]"> h</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
        <p className="mb-4 text-xs font-medium text-[#6B7280]">
          This Week
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              width={25}
            />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #F3F4F6",
                borderRadius: "12px",
                color: "#1F2937",
                fontSize: "13px",
              }}
            />
            <Bar
              dataKey="hours"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
