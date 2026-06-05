import { requireAuth, getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { YogicReminder } from "@/components/yogic-reminder";
import { redirect } from "next/navigation";

function todayIST() {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split("T")[0];
}

function getStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = todayIST();

  // Must have today OR yesterday to maintain streak
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  if (!session) redirect("/login");

  const [user, entries] = await Promise.all([
    getCurrentUser(),
    db.query.dailyEntries.findMany({
      where: eq(dailyEntries.userId, session.userId),
      columns: { date: true },
    }),
  ]);

  const dates = entries.map((e) => e.date);
  const dayNumber = getStreak(dates);

  return (
    <div className="flex min-h-dvh pb-20 lg:pb-0">
      <Sidebar userName={user?.name ?? "User"} dayNumber={dayNumber} />
      <main className="min-h-dvh flex-1 overflow-auto bg-[#FAFAFA]">
        <div className="mx-auto max-w-3xl px-5 py-6 lg:px-8 lg:py-10">
          <YogicReminder />
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
