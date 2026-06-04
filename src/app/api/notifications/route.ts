import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .then((r) => r[0]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    notifyMorning: user.notifyMorning ?? 1,
    notifyStudy: user.notifyStudy ?? 1,
    notifyWalk: user.notifyWalk ?? 0,
    notifyReflection: user.notifyReflection ?? 1,
    notifyNoJunkFood: user.notifyNoJunkFood ?? 1,
    notifyYogicLife: user.notifyYogicLife ?? 1,
  });
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allowed = [
    "notifyMorning", "notifyStudy", "notifyWalk", "notifyReflection",
    "notifyNoJunkFood", "notifyYogicLife",
  ] as const;

  const updates: Record<string, boolean> = {};
  for (const key of allowed) {
    if (typeof body[key] === "boolean") {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid settings" }, { status: 400 });
  }

  await db
    .update(users)
    .set({
      notifyMorning: updates.notifyMorning ? 1 : 0,
      notifyStudy: updates.notifyStudy ? 1 : 0,
      notifyWalk: updates.notifyWalk ? 1 : 0,
      notifyReflection: updates.notifyReflection ? 1 : 0,
      notifyNoJunkFood: updates.notifyNoJunkFood ? 1 : 0,
      notifyYogicLife: updates.notifyYogicLife ? 1 : 0,
    } as any)
    .where(eq(users.id, session.userId));

  return NextResponse.json({ ok: true });
}
