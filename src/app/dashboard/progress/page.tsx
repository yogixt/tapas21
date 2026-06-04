import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries, weightRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { WeightChart } from "./weight-chart";

export default async function ProgressPage() {
  const session = await requireAuth();

  const entries = await db.query.dailyEntries.findMany({
    where: eq(dailyEntries.userId, session.userId),
    orderBy: [desc(dailyEntries.date)],
  });

  const weightData = await db.query.weightRecords.findMany({
    where: eq(weightRecords.userId, session.userId),
    orderBy: [desc(weightRecords.date)],
  });

  const totalStudy = entries.reduce((sum, e) => sum + (e.studyHours ?? 0), 0);

  let totalChecks = 0;
  let doneChecks = 0;
  for (const e of entries) {
    const checks = [
      e.wakeUp5am, e.yogaPranayama, e.walkSwim,
      e.caloriesUnderTarget, e.proteinGoalHit, e.sleepBefore1030pm,
    ];
    totalChecks += checks.length;
    doneChecks += checks.filter(Boolean).length;
  }
  const score = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;

  const latestWeight = weightData[0]?.weightKg ?? null;
  const startWeight = 85;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Progress
        </h1>
        <p className="mt-1 text-[#6B7280]">Track your transformation</p>
      </section>

      {/* Overall Score */}
      <div className="card text-center">
        <p className="text-sm font-medium text-[#6B7280] mb-1">
          Transformation Score
        </p>
        <p className="text-5xl font-bold text-[#FF6B35]">{score}%</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          {score >= 80
            ? "Excellent consistency!"
            : score >= 60
            ? "Good progress, keep going!"
            : "Every day is a new opportunity!"}
        </p>
      </div>

      {/* Weight Chart */}
      <WeightChart
        records={weightData.toReversed()}
        latestWeight={latestWeight}
        startWeight={startWeight}
      />

      {/* Study Stats */}
      <div className="card">
        <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
          Study Progress
        </h3>
        <div className="flex items-end justify-between mb-2">
          <p className="text-3xl font-bold text-[#22C55E]">
            {Math.floor(totalStudy)}
            <span className="text-base font-normal text-[#9CA3AF]"> / 63h</span>
          </p>
          <p className="text-sm text-[#6B7280]">
            {Math.round((totalStudy / 63) * 100)}%
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#22C55E] transition-all"
            style={{ width: `${Math.min((totalStudy / 63) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
