import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, dailyEntries } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { understandMessage } from "@/lib/telegram-chat";

const TG_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN || ""}`;

async function tgSend(chatId: number | string, text: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  await fetch(`${TG_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {});
}

function todayStr() {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split("T")[0];
}

export async function POST(request: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ ok: false });
  }

  try {
    const body = await request.json();
    const msg = body.message;
    if (!msg?.text) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = (msg.text as string).trim();

    // Find user by telegram chat id
    let user = await db.query.users.findFirst({
      where: eq(users.telegramChatId, String(chatId)),
    });

    // Handle commands
    if (text.startsWith("/start ")) {
      const code = text.replace("/start ", "").trim();
      const pendingUser = await db.query.users.findFirst({
        where: eq(users.telegramCode, code),
      });
      if (pendingUser) {
        await db
          .update(users)
          .set({ telegramChatId: String(chatId), telegramCode: null })
          .where(eq(users.id, pendingUser.id));
        await tgSend(chatId, "✅ Connected! You'll now receive reminders from TAPAS21.\n\nAb aap mujhe bata sakte ho — kya kiya aaj? Jaise: '2 hours study kiya' ya 'walk hua' ya 'soya 10:30 pe'. Main sab track karunga 😊");
      } else {
        await tgSend(chatId, "❌ Invalid or expired code. Generate a new one from the dashboard.");
      }
      return NextResponse.json({ ok: true });
    }

    if (text === "/start") {
      await tgSend(chatId, "Welcome to TAPAS21!\n\nTo connect:\n1. Dashboard → Notifications\n2. Click 'Connect with Telegram'\n3. Send the code here with /start CODE");
      return NextResponse.json({ ok: true });
    }

    if (text === "/status") {
      await tgSend(chatId, user ? `✅ Connected to ${user.name}'s TAPAS21.\n\nKuch update karna hai? Batao kya kiya aaj!` : "❌ Not connected.");
      return NextResponse.json({ ok: true });
    }

    // Not connected yet — guide to connect
    if (!user) {
      await tgSend(chatId, "Pehle connect karo! Dashboard → Notifications mein code lo aur /start CODE bhejo.");
      return NextResponse.json({ ok: true });
    }

    // === Chat mode: understand message with AI ===
    const today = todayStr();
    const todayEntry = await db.query.dailyEntries.findFirst({
      where: and(eq(dailyEntries.userId, user.id), eq(dailyEntries.date, today)),
    });

    let history: { role: "user" | "assistant"; text: string }[] = [];
    try {
      history = JSON.parse(user.botHistory || "[]");
    } catch {}

    const entryData = todayEntry ? Object.fromEntries(Object.entries(todayEntry).filter(([k]) => !["id", "userId", "date", "createdAt"].includes(k))) : null;
    const result = await understandMessage(text, entryData, history);

    if (result && Object.keys(result.updates).length > 0) {
      const entryId = todayEntry?.id;
      const updateData: Record<string, any> = {};

      for (const [field, value] of Object.entries(result.updates)) {
        if (value !== null && value !== undefined) {
          // Map field names to DB column names
          const colMap: Record<string, string> = {
            wakeUp5am: "wake_up_5am",
            yogaPranayama: "yoga_pranayama",
            studyHours: "study_hours",
            walkSwim: "walk_swim",
            caloriesUnderTarget: "calories_under_target",
            proteinGoalHit: "protein_goal_hit",
            sleepBefore1030pm: "sleep_before_1030pm",
            actualCalories: "actual_calories",
            actualProtein: "actual_protein",
            actualWaterL: "actual_water_l",
            notes: "notes",
          };
          const col = colMap[field];
          if (col) {
            if (typeof value === "boolean") {
              (updateData as any)[col] = value ? 1 : 0;
            } else {
              (updateData as any)[col] = value;
            }
          }
        }
      }

      if (entryId && Object.keys(updateData).length > 0) {
        await db.update(dailyEntries).set(updateData).where(eq(dailyEntries.id, entryId));
      } else if (Object.keys(updateData).length > 0) {
        await db.insert(dailyEntries).values({
          id: crypto.randomUUID(),
          userId: user.id,
          date: today,
          ...updateData,
        });
      }

      await tgSend(chatId, result.reply);
    } else if (result) {
      await tgSend(chatId, result.reply);
    } else {
      await tgSend(chatId, "Samajh gaya! Kuch aur batao? 😊");
    }

    // Update conversation history
    history.push({ role: "user", text });
    if (result?.reply) {
      history.push({ role: "assistant", text: result.reply });
    }
    if (history.length > 20) history = history.slice(-20);
    await db.update(users).set({ botHistory: JSON.stringify(history) }).where(eq(users.id, user.id));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return NextResponse.json({ ok: true });
  }
}
