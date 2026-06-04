"use server";

import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { weightRecords } from "@/db/schema";
import { format } from "date-fns";

export async function saveWeightAction(
  prev: { error: string; success: boolean },
  formData: FormData
) {
  const session = await requireAuth();
  const weightKg = parseFloat(formData.get("weightKg") as string);

  if (!weightKg || weightKg < 30 || weightKg > 200) {
    return { error: "Please enter a valid weight (30-200 kg)", success: false };
  }

  await db.insert(weightRecords).values({
    id: crypto.randomUUID(),
    userId: session.userId,
    date: format(new Date(), "yyyy-MM-dd"),
    weightKg,
  });

  return { error: "", success: true };
}
