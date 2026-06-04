"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const prompts = [
  {
    id: "wentWell",
    question: "What went well today?",
    placeholder: "I woke up on time, studied for 2 hours...",
  },
  {
    id: "improve",
    question: "What could improve?",
    placeholder: "I skipped my walk, need to be more consistent...",
  },
  {
    id: "grateful",
    question: "What are you grateful for?",
    placeholder: "My health, the discipline I'm building...",
  },
];

export function DailyReflection() {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const allFilled = prompts.every((p) => (entries[p.id]?.trim() ?? "") !== "");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <p className="text-sm text-purple-700">
          Reflection helps solidify your growth. Take a moment.
        </p>
      </div>

      {prompts.map(({ id, question, placeholder }) => (
        <div
          key={id}
          className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm"
        >
          <label
            htmlFor={id}
            className="mb-3 block text-base font-medium text-[#1F2937]"
          >
            {question}
          </label>
          <textarea
            id={id}
            rows={3}
            value={entries[id] ?? ""}
            onChange={(e) =>
              setEntries((prev) => ({ ...prev, [id]: e.target.value }))
            }
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
          />
        </div>
      ))}

      {saved && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Reflection saved
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!allFilled}
        className="flex h-12 w-full items-center justify-center rounded-full bg-saffron font-semibold text-white shadow-lg shadow-saffron/25 transition-all hover:bg-saffron-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save Reflection
      </button>
    </div>
  );
}
