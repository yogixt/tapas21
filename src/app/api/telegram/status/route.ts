import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: { telegramChatId: true },
  });

  return NextResponse.json({ connected: !!user?.telegramChatId });
}
