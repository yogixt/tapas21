"use client";

import { TrendingDown, BookOpen, Flame, Target } from "lucide-react";

export function StatsGrid({
  latestWeight,
  startWeight,
  totalStudy,
  streak,
  score,
}: {
  latestWeight: number | null;
  startWeight: number;
  totalStudy: number;
  streak: number;
  score: number;
}) {
  const weightDiff =
    latestWeight !== null ? (startWeight - latestWeight).toFixed(1) : null;
  const targetStudy = 63;

  const stats = [
    {
      icon: TrendingDown,
      label: "Weight",
      value: latestWeight ? `${latestWeight} kg` : "—",
      sub: weightDiff ? `${weightDiff} kg lost` : "Log your weight",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: BookOpen,
      label: "Study",
      value: `${Math.floor(totalStudy)}`,
      sub: `/ ${targetStudy} Hours`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${streak}`,
      sub: `${streak === 1 ? "Day" : "Days"}`,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: Target,
      label: "Transformation Score",
      value: `${score}%`,
      sub: score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Keep going",
      color: "text-saffron",
      bg: "bg-saffron/5",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
        <div
          key={label}
          className="rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-sm"
        >
          <div
            className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            {label}
          </p>
          <p className="mt-0.5 text-xl font-bold text-[#1F2937]">{value}</p>
          <p className="text-xs text-[#9CA3AF]">{sub}</p>
        </div>
      ))}
    </div>
  );
}
