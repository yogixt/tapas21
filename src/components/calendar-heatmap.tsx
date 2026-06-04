"use client";

import { useMemo } from "react";

type Entry = {
  date: string;
  wakeUp5am: boolean | null;
  yogaPranayama: boolean | null;
  walkSwim: boolean | null;
  caloriesUnderTarget: boolean | null;
  proteinGoalHit: boolean | null;
  sleepBefore1030pm: boolean | null;
};

export function CalendarHeatmap({ entries }: { entries: Entry[] }) {
  const dayMap = useMemo(() => {
    const map = new Map<string, Entry>();
    for (const e of entries) {
      map.set(e.date, e);
    }
    return map;
  }, [entries]);

  const weeks = useMemo(() => {
    const today = new Date();
    const days: { date: Date; score: number }[] = [];

    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      let score = 0;
      if (entry) {
        const checks = [
          entry.wakeUp5am,
          entry.yogaPranayama,
          entry.walkSwim,
          entry.caloriesUnderTarget,
          entry.proteinGoalHit,
          entry.sleepBefore1030pm,
        ];
        score = checks.filter(Boolean).length;
      }
      days.push({ date: d, score });
    }

    const weeks: { date: Date; score: number }[][] = [];
    let currentWeek: { date: Date; score: number }[] = [];

    for (const day of days) {
      currentWeek.push(day);
      if (day.date.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }, [dayMap]);

  const getColor = (score: number) => {
    if (score === 0) return "bg-[#F3F4F6]";
    if (score <= 2) return "bg-[#FFE8DB]";
    if (score <= 4) return "bg-saffron/40";
    return "bg-saffron";
  };

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
      <div className="inline-flex gap-0.5">
        <div className="mr-1 flex flex-col gap-0.5 pt-5">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3 text-[8px] text-[#9CA3AF] leading-3">
              {label}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => (
              <div
                key={di}
                className={`h-3 w-3 rounded-[3px] ${getColor(day.score)}`}
                title={`${day.date.toISOString().slice(0, 10)}: ${day.score}/6`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
