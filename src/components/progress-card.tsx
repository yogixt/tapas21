"use client";

export function ProgressCard({
  dayNumber,
  completed,
}: {
  dayNumber: number;
  completed: number;
}) {
  const totalDays = 21;
  const pct = Math.min((dayNumber / totalDays) * 100, 100);

  return (
    <div className="mb-6 rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm lg:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            Challenge Progress
          </p>
          <p className="text-lg font-bold text-[#1F2937]">
            Day {Math.min(dayNumber + 1, totalDays)}
            <span className="text-sm font-normal text-[#9CA3AF]">
              {" "}
              / {totalDays}
            </span>
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center">
          <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
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
            />
          </svg>
          <span className="absolute text-xs font-bold text-saffron">
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
        <div
          className="h-full rounded-full bg-saffron transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {dayNumber > 0 && (
        <p className="mt-3 text-xs text-[#6B7280]">
          {dayNumber === totalDays
            ? "Challenge complete! Well done."
            : `${Math.min(dayNumber + 1, totalDays)} days down, ${totalDays - Math.min(dayNumber + 1, totalDays)} to go.`}
        </p>
      )}
    </div>
  );
}
