import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries, weightRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import Link from "next/link";
import { AIInsights } from "@/components/ai-insights";

export default async function DashboardHome() {
  const session = await requireAuth();
  const userId = session.userId;

  const entries = await db.query.dailyEntries.findMany({
    where: eq(dailyEntries.userId, userId),
    orderBy: [desc(dailyEntries.date)],
  });

  const weightData = await db.query.weightRecords.findMany({
    where: eq(weightRecords.userId, userId),
    orderBy: [desc(weightRecords.date)],
  });

  function todayIST() {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    return ist.toISOString().split("T")[0];
  }

  function getStreak(dates: string[]): number {
    if (dates.length === 0) return 0;
    const sorted = [...new Set(dates)].sort().reverse();
    const today = todayIST();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    if (sorted[0] !== today && sorted[0] !== yStr) return 0;
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }

  const today = todayIST();
  const todayEntry = entries.find((e) => e.date === today);
  const latestWeight = weightData[0]?.weightKg ?? null;
  const startWeight = 85;

  const dayNumber = getStreak(entries.map((e) => e.date));
  const streak = calculateStreak(entries);
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

  const completedToday = todayEntry
    ? [
        todayEntry.wakeUp5am, todayEntry.yogaPranayama, todayEntry.walkSwim,
        todayEntry.caloriesUnderTarget, todayEntry.proteinGoalHit, todayEntry.sleepBefore1030pm,
      ].filter(Boolean).length
    : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          {greeting}, Bijoy
        </h1>
        <p className="mt-1 text-[#6B7280]">
          {streak > 0
            ? `${streak} day streak — keep going!`
            : "Start your transformation today."}
        </p>
      </section>

      {/* Challenge Progress */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Challenge Progress</p>
            <p className="text-2xl font-bold text-[#1F2937]">
              Day {Math.min(dayNumber + 1, 21)}
              <span className="text-base font-normal text-[#9CA3AF]"> / 21</span>
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#FF6B35]/20">
            <span className="text-lg font-bold text-[#FF6B35]">
              {Math.min(Math.round((dayNumber / 21) * 100), 100)}%
            </span>
          </div>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#FF6B35] transition-all duration-700"
            style={{ width: `${Math.min((dayNumber / 21) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-[#6B7280]">
          {completedToday} of 6 habits completed today
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Weight"
          value={latestWeight ? `${latestWeight} kg` : "—"}
          sub={latestWeight ? `${(startWeight - latestWeight).toFixed(1)} kg lost` : "85 kg start"}
          color="text-[#FF6B35]"
        />
        <StatCard
          label="Study"
          value={`${Math.floor(totalStudy)}h`}
          sub="Target: 63h"
          color="text-[#22C55E]"
        />
        <StatCard
          label="Current Streak"
          value={`${streak}`}
          sub={`${streak === 1 ? "Day" : "Days"}`}
          color="text-[#FF6B35]"
        />
        <StatCard
          label="Score"
          value={`${score}%`}
          sub={score >= 80 ? "Excellent!" : "Keep going!"}
          color="text-[#1F2937]"
        />
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Quick Actions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#6B7280] uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction href="/dashboard/entries" label="Today's Mission" desc="Complete habits" />
          <QuickAction href="/dashboard/weight" label="Log Weight" desc="Track progress" />
          <QuickAction href="/dashboard/study" label="Log Study" desc="Track hours" />
          <QuickAction href="/dashboard/reflection" label="Daily Reflection" desc="Journal entry" />
        </div>
      </section>
    </div>
  );
}

function calculateStreak(entries: { date: string; wakeUp5am: boolean | null }[]) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  for (const entry of sorted) {
    if (entry.wakeUp5am) streak++;
    else break;
  }
  return streak;
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-sm text-[#6B7280]">{sub}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="card-sm flex items-center gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E8]">
        <div className="h-2 w-2 rounded-full bg-[#FF6B35]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#1F2937]">{label}</p>
        <p className="text-xs text-[#9CA3AF]">{desc}</p>
      </div>
    </Link>
  );
}
