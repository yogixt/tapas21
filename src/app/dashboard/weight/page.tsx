import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { weightRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { WeightTracker } from "./tracker";

export default async function WeightPage() {
  const session = await requireAuth();

  const records = await db.query.weightRecords.findMany({
    where: eq(weightRecords.userId, session.userId),
    orderBy: [desc(weightRecords.date)],
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Weight Tracker
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Track your weight loss journey
        </p>
      </section>

      <WeightTracker records={records} startWeight={85} goalWeight={70} />
    </div>
  );
}
