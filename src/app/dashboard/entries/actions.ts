"use server";

import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { dailyEntries } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function saveEntryAction(
  prev: { success: boolean; id: string | null },
  formData: FormData
) {
  const session = await requireAuth();
  const userId = session.userId;

  const id = formData.get("id") as string;
  const date = formData.get("date") as string;
  const wakeUp5am = formData.has("wakeUp5am");
  const yogaPranayama = formData.has("yogaPranayama");
  const studyHours = parseFloat((formData.get("studyHours") as string) || "0");
  const walkSwim = formData.has("walkSwim");
  const caloriesUnderTarget = formData.has("caloriesUnderTarget");
  const proteinGoalHit = formData.has("proteinGoalHit");
  const sleepBefore1030pm = formData.has("sleepBefore1030pm");
  const actualCalories = parseInt((formData.get("actualCalories") as string) || "0");
  const actualProtein = parseFloat((formData.get("actualProtein") as string) || "0");
  const actualWaterL = parseFloat((formData.get("actualWaterL") as string) || "0");
  const notes = (formData.get("notes") as string) || "";

  if (id) {
    const existing = await db.query.dailyEntries.findFirst({
      where: and(eq(dailyEntries.id, id), eq(dailyEntries.userId, userId)),
    });
    if (existing) {
      await db
        .update(dailyEntries)
        .set({
          wakeUp5am,
          yogaPranayama,
          studyHours,
          walkSwim,
          caloriesUnderTarget,
          proteinGoalHit,
          sleepBefore1030pm,
          actualCalories,
          actualProtein,
          actualWaterL,
          notes,
        })
        .where(eq(dailyEntries.id, id));
      return { success: true, id };
    }
  }

  const newId = crypto.randomUUID();
  await db.insert(dailyEntries).values({
    id: newId,
    userId,
    date,
    wakeUp5am,
    yogaPranayama,
    studyHours,
    walkSwim,
    caloriesUnderTarget,
    proteinGoalHit,
    sleepBefore1030pm,
    actualCalories,
    actualProtein,
    actualWaterL,
    notes,
  });

  return { success: true, id: newId };
}
