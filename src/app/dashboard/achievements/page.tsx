import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Flame, Zap, Trophy, BookOpen, Scale, Sparkles } from "lucide-react";

export default async function AchievementsPage() {
  const session = await requireAuth();

  const entries = await db.query.dailyEntries.findMany({
    where: eq(dailyEntries.userId, session.userId),
    orderBy: [desc(dailyEntries.date)],
  });

  const dayNumber = entries.length;

  let streak = 0;
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  for (const entry of sorted) {
    if (entry.wakeUp5am) streak++;
    else break;
  }

  const totalStudy = entries.reduce((sum, e) => sum + (e.studyHours ?? 0), 0);

  const achievements = [
    {
      icon: Flame,
      label: "First 7 Days",
      desc: "Complete your first week",
      unlocked: dayNumber >= 7,
      color: "text-[#FF6B35]",
      bg: "bg-[#FFF0E8]",
    },
    {
      icon: Zap,
      label: "14 Day Streak",
      desc: "Maintain a 14-day streak",
      unlocked: streak >= 14,
      color: "text-[#FFD93D]",
      bg: "bg-yellow-50",
    },
    {
      icon: Trophy,
      label: "Challenge Complete",
      desc: "Complete all 21 days",
      unlocked: dayNumber >= 21,
      color: "text-[#FF6B35]",
      bg: "bg-[#FFF0E8]",
    },
    {
      icon: BookOpen,
      label: "100 Study Hours",
      desc: "Log 100 hours of study",
      unlocked: totalStudy >= 100,
      color: "text-[#22C55E]",
      bg: "bg-green-50",
    },
    {
      icon: Scale,
      label: "Lost 5 Kg",
      desc: "Lose 5 kg from start weight",
      unlocked: false, // computed from weight data
      color: "text-[#3B82F6]",
      bg: "bg-blue-50",
    },
    {
      icon: Sparkles,
      label: "Perfect Week",
      desc: "Complete all habits for 7 days",
      unlocked: false,
      color: "text-[#A78BFA]",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Achievements
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Milestones on your transformation journey
        </p>
      </section>

      {/* Level */}
      <div className="card text-center">
        <p className="text-sm font-medium text-[#6B7280] mb-1">Current Level</p>
        <p className="text-lg font-bold text-[#1F2937]">
          {dayNumber >= 21
            ? "Tapas Master"
            : dayNumber >= 14
            ? "Warrior"
            : dayNumber >= 7
            ? "Consistent"
            : dayNumber >= 3
            ? "Disciplined"
            : "Beginner"}
        </p>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(({ icon: Icon, label, desc, unlocked, color, bg }) => (
          <div
            key={label}
            className={`card-sm ${
              unlocked ? "" : "opacity-50"
            }`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className={`text-sm font-semibold ${unlocked ? "text-[#1F2937]" : "text-[#9CA3AF]"}`}>
              {label}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
