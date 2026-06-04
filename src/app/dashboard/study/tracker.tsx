"use client";

import { useState, useEffect } from "react";
import { Code, ExternalLink, Loader2 } from "lucide-react";

type Subject = {
  key: string;
  label: string;
  color: string;
};

const subjects: Subject[] = [
  { key: "dsa", label: "DSA", color: "#FF6B35" },
  { key: "leetcode", label: "LeetCode", color: "#FFA116" },
  { key: "ml", label: "Machine Learning", color: "#22C55E" },
  { key: "deepLearning", label: "Deep Learning", color: "#A78BFA" },
  { key: "llm", label: "LLMs / Gen AI", color: "#3B82F6" },
  { key: "systemDesign", label: "System Design", color: "#F472B6" },
  { key: "mlops", label: "MLOps / Production", color: "#1F2937" },
];

type LeetCodeStats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
} | null;

const LC_USER_KEY = "tapas21_leetcode_username";

export function StudyTracker() {
  const [hours, setHours] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const s of subjects) initial[s.key] = 0;
    return initial;
  });

  const [lcUsername, setLcUsername] = useState("");
  const [lcInput, setLcInput] = useState("");
  const [lcStats, setLcStats] = useState<LeetCodeStats>(null);
  const [lcLoading, setLcLoading] = useState(false);
  const [lcError, setLcError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LC_USER_KEY);
    if (saved) {
      setLcUsername(saved);
      setLcInput(saved);
      fetchLeetCodeStats(saved);
    }
  }, []);

  const fetchLeetCodeStats = async (username: string) => {
    setLcLoading(true);
    setLcError("");
    try {
      const res = await fetch("/api/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) {
        setLcError("User not found");
        return;
      }
      const data = await res.json();
      setLcStats({
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved,
      });
    } catch {
      setLcError("Failed to fetch LeetCode stats");
    }
    setLcLoading(false);
  };

  const handleLcConnect = () => {
    const name = lcInput.trim();
    if (!name) return;
    localStorage.setItem(LC_USER_KEY, name);
    setLcUsername(name);
    fetchLeetCodeStats(name);
  };

  const total = Object.values(hours).reduce((a, b) => a + b, 0);
  const weeklyTarget = 12;

  return (
    <div className="space-y-4">
      {/* LeetCode Section */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Code className="h-4 w-4 text-[#FFA116]" />
          <h3 className="text-sm font-semibold text-[#1F2937]">LeetCode</h3>
          {lcUsername && (
            <a
              href={`https://leetcode.com/u/${lcUsername}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#FFA116]"
            >
              @{lcUsername} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {!lcUsername ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={lcInput}
              onChange={(e) => setLcInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLcConnect()}
              placeholder="Your LeetCode username"
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={handleLcConnect}
              disabled={!lcInput.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Connect
            </button>
          </div>
        ) : lcLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Fetching stats...
          </div>
        ) : lcError ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-500">{lcError}</p>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(LC_USER_KEY);
                setLcUsername("");
                setLcStats(null);
              }}
              className="text-xs text-[#6B7280] underline"
            >
              Reset
            </button>
          </div>
        ) : lcStats ? (
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg bg-[#F9FAFB] p-2.5 text-center">
              <p className="text-lg font-bold text-[#1F2937">{lcStats.totalSolved}</p>
              <p className="text-[10px] text-[#9CA3AF]">Total</p>
            </div>
            <div className="rounded-lg bg-[#F0FDF4] p-2.5 text-center">
              <p className="text-lg font-bold text-[#22C55E]">{lcStats.easySolved}</p>
              <p className="text-[10px] text-[#9CA3AF]">Easy</p>
            </div>
            <div className="rounded-lg bg-[#FFF7ED] p-2.5 text-center">
              <p className="text-lg font-bold text-[#FFA116]">{lcStats.mediumSolved}</p>
              <p className="text-[10px] text-[#9CA3AF]">Medium</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2.5 text-center">
              <p className="text-lg font-bold text-red-500">{lcStats.hardSolved}</p>
              <p className="text-[10px] text-[#9CA3AF]">Hard</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Tutedude Section */}
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F5E9] text-xs font-bold text-[#22C55E]">
            T
          </div>
          <h3 className="text-sm font-semibold text-[#1F2937]">Tutedude</h3>
          <a
            href="https://upskill.tutedude.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#22C55E]"
          >
            upskill.tutedude.com <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="text-xs text-[#9CA3AF]">
          DSA & Full Stack courses — track your course hours below
        </p>
      </div>

      {/* Weekly Total */}
      <div className="card">
        <div className="flex items-end justify-between mb-2">
          <p className="text-sm font-medium text-[#6B7280]">This Week</p>
          <p className="text-3xl font-bold text-[#1F2937]">
            {total}
            <span className="text-base font-normal text-[#9CA3AF]">
              {" "}/ {weeklyTarget}h
            </span>
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#FF6B35] transition-all"
            style={{ width: `${Math.min((total / weeklyTarget) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Subject Grid */}
      <div className="space-y-2">
        {subjects.map(({ key, label, color }) => (
          <div key={key} className="card-sm flex items-center gap-4">
            <div
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="flex-1 text-sm font-medium text-[#1F2937]">
              {label}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setHours((p) => ({
                    ...p,
                    [key]: Math.max(0, (p[key] ?? 0) - 0.5),
                  }))
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
              >
                &minus;
              </button>
              <span className="w-8 text-center text-sm font-semibold text-[#1F2937]">
                {hours[key] ?? 0}
              </span>
              <button
                type="button"
                onClick={() =>
                  setHours((p) => ({
                    ...p,
                    [key]: (p[key] ?? 0) + 0.5,
                  }))
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
