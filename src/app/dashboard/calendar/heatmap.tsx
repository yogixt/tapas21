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
    const map = new Map<string, number>();
    for (const e of entries) {
      const checks = [
        e.wakeUp5am, e.yogaPranayama, e.walkSwim,
        e.caloriesUnderTarget, e.proteinGoalHit, e.sleepBefore1030pm,
      ];
      map.set(e.date, checks.filter(Boolean).length);
    }
    return map;
  }, [entries]);

  const weeks = useMemo(() => {
    const today = new Date();
    const days: { date: Date; score: number }[] = [];
    for (let i = 55; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({ date: d, score: dayMap.get(d.toISOString().slice(0, 10)) ?? 0 });
    }
    const w: typeof days[] = [];
    let cur: typeof days = [];
    for (const day of days) {
      cur.push(day);
      if (day.date.getDay() === 6) {
        w.push(cur);
        cur = [];
      }
    }
    if (cur.length > 0) w.push(cur);
    return w;
  }, [dayMap]);

  const getColor = (score: number) => {
    if (score === 0) return "bg-[#F3F4F6]";
    if (score <= 2) return "bg-[#FFE8DB]";
    if (score <= 4) return "bg-[#FFB58A]";
    return "bg-[#FF6B35]";
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          <div className="mr-1 flex flex-col gap-0.5 pt-3">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((l, i) => (
              <div key={i} className="h-3 text-[9px] leading-3 text-[#9CA3AF]">
                {l}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`h-3 w-3 rounded-sm ${getColor(day.score)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
