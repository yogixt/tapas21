import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { MissionForm } from "./form";

export default async function MissionPage() {
  const session = await requireAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  const entries = await db.query.dailyEntries.findMany({
    where: eq(dailyEntries.userId, session.userId),
    orderBy: [desc(dailyEntries.date)],
  });

  const todayEntry = entries.find((e) => e.date === today);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Today's Mission
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Complete these habits to transform yourself
        </p>
      </section>

      <MissionForm todayEntry={todayEntry ?? null} todayDate={today} />
    </div>
  );
}
