"use client";

import { useActionState } from "react";
import { saveEntryAction } from "@/app/dashboard/entries/actions";
import { Check } from "lucide-react";

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
  { name: "wakeUp5am", label: "Wake up at 5:00 AM" },
  { name: "yogaPranayama", label: "Yoga / Pranayama" },
  { name: "walkSwim", label: "Walk or Swim (45+ min)" },
  { name: "sleepBefore1030pm", label: "Sleep before 10:30 PM" },
  { name: "caloriesUnderTarget", label: "Calories under 1500" },
  { name: "proteinGoalHit", label: "Protein 90g+" },
] as const;

export function DailyChecklist({ entry }: { entry: EntryData }) {
  const [state, action, pending] = useActionState(
    saveEntryAction,
    { success: false, id: entry.id }
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={entry.id ?? ""} />
      <input type="hidden" name="date" value={entry.date} />

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 lg:p-6">
        <h2 className="mb-1 text-base font-semibold">Daily Scorecard</h2>
        <p className="mb-5 text-xs text-neutral-600">
          Check off each habit as you complete it
        </p>

        <div className="space-y-1">
          {habits.map(({ name, label }) => (
            <label
              key={name}
              className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg px-3 transition-colors hover:bg-neutral-800/50 active:bg-neutral-800"
            >
              <input
                type="checkbox"
                name={name}
                defaultChecked={
                  entry[name as keyof typeof entry] as boolean
                }
                className="peer sr-only"
                value="true"
              />
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-neutral-700 bg-neutral-950 transition-colors peer-checked:border-orange-500 peer-checked:bg-orange-500">
                <Check className="hidden h-3.5 w-3.5 text-black peer-checked:block" />
              </div>
              <span className="text-sm text-neutral-300 peer-checked:text-neutral-100">
                {label}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-neutral-500">
            Study hours
          </label>
          <input
            type="number"
            name="studyHours"
            step="0.5"
            min="0"
            max="12"
            defaultValue={entry.studyHours}
            className="h-11 w-24 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-center text-sm text-neutral-100 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 lg:p-6">
        <h2 className="mb-1 text-base font-semibold">Nutrition</h2>
        <p className="mb-5 text-xs text-neutral-600">
          Log your daily intake
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-500">
              Calories
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="actualCalories"
                min="0"
                defaultValue={entry.actualCalories}
                className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-neutral-100 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <span className="text-xs text-neutral-600">kcal</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-500">
              Protein
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="actualProtein"
                step="0.1"
                min="0"
                defaultValue={entry.actualProtein}
                className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-neutral-100 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <span className="text-xs text-neutral-600">g</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-500">
              Water
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="actualWaterL"
                step="0.1"
                min="0"
                defaultValue={entry.actualWaterL}
                className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-neutral-100 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <span className="text-xs text-neutral-600">L</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 lg:p-6">
        <label className="mb-1 block text-base font-semibold" htmlFor="notes">
          Notes
        </label>
        <p className="mb-4 text-xs text-neutral-600">How was your day?</p>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={entry.notes}
          placeholder="Reflect on your day..."
          className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </section>

      {state.success && (
        <div className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
          Saved successfully
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-orange-500 font-semibold text-black transition-colors hover:bg-orange-400 active:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            Saving...
          </span>
        ) : (
          "Save Today"
        )}
      </button>
    </form>
  );
}
