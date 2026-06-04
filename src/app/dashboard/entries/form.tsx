"use client";

import { useState, useActionState } from "react";
import { saveEntryAction } from "./actions";
import { Circle, CircleCheck } from "lucide-react";

type TodayEntry = {
  id: string;
  date: string;
  wakeUp5am: boolean | null;
  yogaPranayama: boolean | null;
  studyHours: number | null;
  walkSwim: boolean | null;
  caloriesUnderTarget: boolean | null;
  proteinGoalHit: boolean | null;
  sleepBefore1030pm: boolean | null;
  actualCalories: number | null;
  actualProtein: number | null;
  actualWaterL: number | null;
  notes: string | null;
};

const habits = [
  { key: "wakeUp5am", label: "Wake Up 5 AM", desc: "Early riser" },
  { key: "yogaPranayama", label: "Yoga / Pranayama", desc: "Mind & body" },
  { key: "walkSwim", label: "Walk 45 Minutes", desc: "Active body" },
  { key: "caloriesUnderTarget", label: "Calories Under 1500", desc: "Diet control" },
  { key: "proteinGoalHit", label: "Protein 90g+", desc: "Nutrition goal" },
  { key: "sleepBefore1030pm", label: "Sleep Before 10:30 PM", desc: "Rest & recovery" },
] as const;

export function MissionForm({
  todayEntry,
  todayDate,
}: {
  todayEntry: TodayEntry | null;
  todayDate: string;
}) {
  const [state, action, pending] = useActionState(saveEntryAction, {
    success: false,
    id: todayEntry?.id ?? null,
  });

  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const h of habits) {
      initial[h.key] = todayEntry
        ? Boolean(todayEntry[h.key as keyof TodayEntry])
        : false;
    }
    return initial;
  });

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={todayEntry?.id ?? ""} />
      <input type="hidden" name="date" value={todayDate} />

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-[#6B7280]">Completion</p>
          <p className="text-sm font-semibold text-[#1F2937]">
            {checkedCount} / {habits.length}
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#22C55E] transition-all duration-500"
            style={{ width: `${(checkedCount / habits.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Habit Checklist */}
      <div className="space-y-2">
        {habits.map(({ key, label, desc }) => (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-4 card-sm transition-all ${
              checklist[key]
                ? "border-[#22C55E]/30 bg-[#F0FDF4]"
                : ""
            }`}
          >
            <input
              type="checkbox"
              name={key}
              checked={checklist[key]}
              onChange={(e) =>
                setChecklist((p) => ({ ...p, [key]: e.target.checked }))
              }
              className="sr-only peer"
              value="true"
            />
            {checklist[key] ? (
              <CircleCheck className="h-6 w-6 text-[#22C55E]" />
            ) : (
              <Circle className="h-6 w-6 text-[#D1D5DB]" />
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  checklist[key] ? "text-[#22C55E] line-through" : "text-[#1F2937]"
                }`}
              >
                {label}
              </p>
              <p className="text-xs text-[#9CA3AF]">{desc}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Study & Nutrition */}
      <div className="card">
        <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
          Study & Nutrition
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#6B7280] w-20">Study Hours</label>
            <input
              type="number"
              name="studyHours"
              step="0.5"
              min="0"
              max="12"
              defaultValue={todayEntry?.studyHours ?? 0}
              className="input-field flex-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">Calories</label>
              <input
                type="number"
                name="actualCalories"
                min="0"
                defaultValue={todayEntry?.actualCalories ?? 0}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">Protein (g)</label>
              <input
                type="number"
                name="actualProtein"
                step="0.1"
                min="0"
                defaultValue={todayEntry?.actualProtein ?? 0}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">Water (L)</label>
              <input
                type="number"
                name="actualWaterL"
                step="0.1"
                min="0"
                defaultValue={todayEntry?.actualWaterL ?? 0}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <textarea
        name="notes"
        rows={3}
        defaultValue={todayEntry?.notes ?? ""}
        placeholder="How was your day? Any thoughts..."
        className="input-field resize-none pt-3"
      />

      {state.success && (
        <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
          <p className="text-sm text-green-700">
            Saved! Keep up the great work.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Today"}
      </button>
    </form>
  );
}
