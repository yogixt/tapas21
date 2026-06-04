"use client";

import { useActionState } from "react";
import { saveWeightAction } from "@/app/dashboard/weight/actions";
import { Weight } from "lucide-react";

export function WeightForm() {
  const [state, action, pending] = useActionState(
    saveWeightAction,
    { error: "", success: false }
  );

  return (
    <form action={action} className="rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <Weight className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="weightKg"
            step="0.1"
            min="30"
            max="200"
            required
            placeholder="Enter weight (kg)"
            className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex h-10 items-center rounded-full bg-saffron px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-saffron-600 active:scale-95 disabled:opacity-50"
        >
          {pending ? "..." : "Log"}
        </button>
      </div>
      {state.success && (
        <p className="mt-2 text-xs text-emerald-600">Weight logged!</p>
      )}
      {state.error && (
        <p className="mt-2 text-xs text-red-500">{state.error}</p>
      )}
    </form>
  );
}
