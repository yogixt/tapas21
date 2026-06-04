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

  const code = crypto.randomUUID().slice(0, 8).toUpperCase();

  await db
    .update(users)
    .set({ telegramCode: code })
    .where(eq(users.id, session.userId));

  return NextResponse.json({
    code,
    botUsername: process.env.TELEGRAM_BOT_USERNAME || "",
  });
}
