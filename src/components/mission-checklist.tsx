"use client";

import { useActionState } from "react";
import { saveEntryAction } from "@/app/dashboard/entries/actions";
import { Check } from "lucide-react";
import { useState } from "react";

type EntryData = {
  id: string | null;
  date: string;
  wakeUp5am: boolean;
  yogaPranayama: boolean;
  studyHours: number;
  walkSwim: boolean;
  caloriesUnderTarget: boolean;
  proteinGoalHit: boolean;
  sleepBefore1030pm: boolean;
  actualCalories: number;
  actualProtein: number;
  actualWaterL: number;
  notes: string;
};

const habits = [
  { name: "wakeUp5am", label: "Wake Up 5 AM", time: "05:00" },
  { name: "yogaPranayama", label: "Yoga / Pranayama", time: "06:00" },
  { name: "walkSwim", label: "Walk 45 Minutes", time: "20:00" },
  { name: "caloriesUnderTarget", label: "Calories Under 1500", time: "" },
  { name: "proteinGoalHit", label: "Protein Goal", time: "" },
  { name: "sleepBefore1030pm", label: "Sleep Before 10:30 PM", time: "22:30" },
] as const;

export function MissionChecklist({ entry }: { entry: EntryData }) {
  const [state, action, pending] = useActionState(
    saveEntryAction,
    { success: false, id: entry.id }
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={entry.id ?? ""} />
      <input type="hidden" name="date" value={entry.date} />

      <div className="space-y-2">
        {habits.map(({ name, label, time }) => (
          <ChecklistCard
            key={name}
            name={name}
            label={label}
            time={time}
            defaultChecked={entry[name as keyof typeof entry] as boolean}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-medium text-[#4B5563]">Study Hours</p>
        <input
          type="number"
          name="studyHours"
          step="0.5"
          min="0"
          max="12"
          defaultValue={entry.studyHours}
          className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-center text-lg font-bold text-[#1F2937] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
        />
      </div>

      <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-medium text-[#4B5563]">Nutrition</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-[#6B7280]">Calories</label>
            <input
              type="number"
              name="actualCalories"
              min="0"
              defaultValue={entry.actualCalories}
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 text-sm text-[#1F2937] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#6B7280]">Protein (g)</label>
            <input
              type="number"
              name="actualProtein"
              step="0.1"
              min="0"
              defaultValue={entry.actualProtein}
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 text-sm text-[#1F2937] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#6B7280]">Water (L)</label>
            <input
              type="number"
              name="actualWaterL"
              step="0.1"
              min="0"
              defaultValue={entry.actualWaterL}
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 text-sm text-[#1F2937] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-medium text-[#4B5563]">Notes</p>
        <textarea
          name="notes"
          rows={3}
          defaultValue={entry.notes}
          placeholder="How was your day?"
          className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
        />
      </div>

      {state.success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Saved successfully
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-saffron font-semibold text-white shadow-lg shadow-saffron/25 transition-all hover:bg-saffron-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Saving...
          </span>
        ) : (
          "Save Progress"
        )}
      </button>
    </form>
  );
}

function ChecklistCard({
  name,
  label,
  time,
  defaultChecked,
}: {
  name: string;
  label: string;
  time: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 shadow-sm transition-all active:scale-[0.99] ${
        checked
          ? "border-saffron/20 bg-saffron/5"
          : "border-[#F3F4F6] bg-white"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="peer sr-only"
        value="true"
      />
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
          checked
            ? "border-saffron bg-saffron"
            : "border-[#D1D5DB] bg-white"
        }`}
      >
        <Check
          className={`h-4 w-4 transition-all ${
            checked ? "scale-100 text-white" : "scale-0 text-white"
          }`}
        />
      </div>
      <div className="flex-1">
        <span
          className={`text-sm font-medium transition-colors ${
            checked ? "text-saffron" : "text-[#1F2937]"
          }`}
        >
          {label}
        </span>
      </div>
      {time && (
        <span className="text-xs text-[#9CA3AF]">{time}</span>
      )}
    </label>
  );
}
