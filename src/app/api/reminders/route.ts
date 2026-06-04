import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendReminder } from "@/lib/telegram";

type ReminderType = "morning" | "wakeCheck" | "study" | "lunch" | "studyCheck" | "walk" | "snack" | "phoneCheck" | "afternoonCheck" | "yogicLife" | "reflection";

const SCHEDULE: { hour: number; minute: number; type: ReminderType; dbKey: string }[] = [
  { hour: 5,  minute: 0,  type: "morning",        dbKey: "notifyMorning" },
  { hour: 6,  minute: 30, type: "wakeCheck",      dbKey: "notifyMorning" },
  { hour: 8,  minute: 0,  type: "phoneCheck",     dbKey: "notifyMorning" },
  { hour: 9,  minute: 0,  type: "study",          dbKey: "notifyStudy" },
  { hour: 12, minute: 30, type: "lunch",          dbKey: "notifyNoJunkFood" },
  { hour: 14, minute: 0,  type: "afternoonCheck", dbKey: "notifyStudy" },
  { hour: 17, minute: 0,  type: "walk",           dbKey: "notifyWalk" },
  { hour: 18, minute: 30, type: "snack",          dbKey: "notifyNoJunkFood" },
  { hour: 20, minute: 0,  type: "yogicLife",      dbKey: "notifyYogicLife" },
  { hour: 22, minute: 0,  type: "reflection",     dbKey: "notifyReflection" },
];

export async function GET() {
  const now = new Date();
  const indiaOffset = 5.5 * 60;
  const indiaMs = now.getTime() + indiaOffset * 60 * 1000;
  const india = new Date(indiaMs);
  const currentHour = india.getUTCHours();
  const currentMinute = india.getUTCMinutes();

  const due = SCHEDULE.find(
    (s) => s.hour === currentHour && Math.abs(s.minute - currentMinute) <= 2
  );

  if (!due) {
    return NextResponse.json({ sent: false, reason: "no reminder due now" });
  }

  const allUsers = await db.select().from(users);

  let sentCount = 0;
  for (const user of allUsers) {
    if (!user.telegramChatId) continue;

    const enabled = (user as any)[due.dbKey];
    if (!enabled) continue;

    await sendReminder(user.telegramChatId, due.type);
    sentCount++;
  }

  return NextResponse.json({
    sent: true,
    reminder: due.type,
    usersNotified: sentCount,
    timeIST: `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`,
  });
}
