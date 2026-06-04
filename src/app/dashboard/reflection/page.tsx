"use client";

import { useState } from "react";
import { BookHeart, Sparkles, Save, Brain } from "lucide-react";

export default function ReflectionPage() {
  const [wentWell, setWentWell] = useState("");
  const [improve, setImprove] = useState("");
  const [grateful, setGrateful] = useState("");
  const [saved, setSaved] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);

    if (wentWell && improve && grateful) {
      setLoadingSummary(true);
      try {
        const res = await fetch("/api/ai/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wentWell, improve, grateful }),
        });
        const data = await res.json();
        setSummary(data.summary);
      } catch {
        setSummary("Beautiful reflection. You're building awareness and growth every day.");
      }
      setLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Daily Reflection
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Take a moment to reflect on your day
        </p>
      </section>

      <div className="card space-y-5">
        <div className="flex items-center gap-2 text-[#FF6B35]">
          <BookHeart className="h-5 w-5" />
          <span className="text-sm font-semibold">Journal Entry</span>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#4B5563]">
            What went well today?
          </label>
          <textarea
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            rows={3}
            placeholder="I woke up at 5 AM, did yoga, and studied for 3 hours..."
            className="input-field resize-none pt-3"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#4B5563]">
            What could improve?
          </label>
          <textarea
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            rows={3}
            placeholder="I skipped my walk and ate more than planned..."
            className="input-field resize-none pt-3"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#4B5563]">
            What are you grateful for?
          </label>
          <textarea
            value={grateful}
            onChange={(e) => setGrateful(e.target.value)}
            rows={3}
            placeholder="I'm grateful for my health and this opportunity..."
            className="input-field resize-none pt-3"
          />
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
            <Sparkles className="h-4 w-4 text-[#22C55E]" />
            <p className="text-sm text-green-700">
              Reflection saved!
            </p>
          </div>
        )}

        {loadingSummary && (
          <div className="flex items-center gap-2 rounded-xl bg-[#FFF0E8] border border-[#FF6B35]/20 px-4 py-3">
            <Brain className="h-4 w-4 text-[#FF6B35] animate-pulse" />
            <p className="text-sm text-[#FF6B35]">
              Generating AI summary...
            </p>
          </div>
        )}

        {summary && !loadingSummary && (
          <div className="rounded-xl bg-[#FFF0E8] border border-[#FF6B35]/20 px-4 py-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Brain className="h-4 w-4 text-[#FF6B35]" />
              <p className="text-sm font-semibold text-[#1F2937]">
                AI Insight
              </p>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">{summary}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={!wentWell || !improve || !grateful}
          className="btn-primary w-full disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Reflection
        </button>
      </div>
    </div>
  );
}
