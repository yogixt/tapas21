import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateSummary, INSIGHTS_PROMPT } from "@/lib/gemini";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await db.query.dailyEntries.findMany({
      where: eq(dailyEntries.userId, session.userId),
      orderBy: [desc(dailyEntries.date)],
      limit: 7,
    });

    if (entries.length === 0) {
      return NextResponse.json({
        insights: ["Start your first day — every journey begins with a single step."],
      });
    }

    const habitSummary = entries
      .map(
        (e) =>
          `${e.date}: wake5am=${e.wakeUp5am ? "yes" : "no"}, yoga=${e.yogaPranayama ? "yes" : "no"}, walk=${e.walkSwim ? "yes" : "no"}, study=${e.studyHours}h, cal=${e.caloriesUnderTarget ? "under" : "over"}, protein=${e.proteinGoalHit ? "hit" : "miss"}, sleep=${e.sleepBefore1030pm ? "yes" : "no"}`
      )
      .join("\n");

    const prompt = `${INSIGHTS_PROMPT}\n\nRecent habit data:\n${habitSummary}`;
    const insightsText = await generateSummary(prompt);

    if (!insightsText) {
      return NextResponse.json({
        insights: ["Keep showing up — consistency is your superpower."],
      });
    }

    const insights = insightsText
      .split("\n")
      .filter((l: string) => l.trim())
      .slice(0, 3);

    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json({
      insights: ["Stay consistent and trust the process."],
    });
  }
}
