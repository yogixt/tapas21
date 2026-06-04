"use client";

export function MissionProgress({
  habits,
  studyHours,
}: {
  habits: boolean[];
  studyHours: number;
}) {
  const completed = habits.filter(Boolean).length;
  const total = habits.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mb-6 rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            Today's Progress
          </p>
          <p className="text-lg font-bold text-[#1F2937]">
            {completed} / {total} Completed
          </p>
          <p className="text-xs text-[#9CA3AF]">
            Study: {studyHours}h logged
          </p>
        </div>

        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute text-xl font-bold text-saffron">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
    </div>
  );
}
