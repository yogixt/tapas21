"use client";

import { type LucideIcon, Lock } from "lucide-react";

export function AchievementBadge({
  icon: Icon,
  label,
  unlocked,
  progress,
  color,
  bg,
}: {
  icon: LucideIcon;
  label: string;
  unlocked: boolean;
  progress: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all ${
        unlocked
          ? "border-saffron/20 bg-white"
          : "border-[#F3F4F6] bg-white/50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${unlocked ? color : "text-[#D1D5DB]"}`} />
        </div>
        {!unlocked && <Lock className="h-3.5 w-3.5 text-[#D1D5DB]" />}
      </div>
      <p
        className={`text-sm font-medium ${
          unlocked ? "text-[#1F2937]" : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </p>
      {!unlocked && progress > 0 && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-saffron/40"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
