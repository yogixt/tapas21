import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { CalendarHeatmap } from "./heatmap";

export default async function CalendarPage() {
  const session = await requireAuth();

  const entries = await db.query.dailyEntries.findMany({
    where: eq(dailyEntries.userId, session.userId),
    orderBy: [desc(dailyEntries.date)],
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Calendar
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Your habit consistency over time
        </p>
      </section>

      <CalendarHeatmap entries={entries} />

      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#F3F4F6]" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#FFE8DB]" /> Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#FFB58A]" /> Good
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#FF6B35]" /> Perfect
        </span>
      </div>
    </div>
  );
}
