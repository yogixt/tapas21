"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

export function AIInsights() {
  const [insights, setInsights] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ai/insights");
        const data = await res.json();
        setInsights(data.insights);
      } catch {
        setInsights(["Stay consistent and trust the process."]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="card">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-[#FF6B35] animate-pulse" />
          <p className="text-sm font-semibold text-[#1F2937]">AI Insights</p>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-[#F3F4F6]" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[#F3F4F6]" />
        </div>
      </section>
    );
  }

  if (!insights || insights.length === 0) return null;

  return (
    <section className="card bg-[#FFF0E8] border-[#FF6B35]/20">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-[#FF6B35]" />
        <p className="text-sm font-semibold text-[#1F2937]">AI Insights</p>
      </div>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563]">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]" />
            {insight}
          </li>
        ))}
      </ul>
    </section>
  );
}
