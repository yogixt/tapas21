import { requireAuth, getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { YogicReminder } from "@/components/yogic-reminder";
import { redirect } from "next/navigation";

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
      columns: { id: true },
    }),
  ]);

  return (
    <div className="flex min-h-dvh pb-20 lg:pb-0">
      <Sidebar userName={user?.name ?? "User"} dayNumber={entries.length} />
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
