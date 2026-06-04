"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendTelegramMessage } from "@/lib/telegram";

export async function forgotPasswordAction(
  prev: { error: string; success: string; resetCode: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required", success: "", resetCode: "" };

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: "No account found with this email", success: "", resetCode: "" };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await db
    .update(users)
    .set({ resetCode: code, resetCodeExpiresAt: expiresAt })
    .where(eq(users.id, user.id));

  // Send via Telegram if connected
  if (user.telegramChatId) {
    await sendTelegramMessage({
      chatId: user.telegramChatId,
      text: `🔐 *Password Reset Code*\n\nYour reset code is: *${code}*\n\nGo to https://tapas21.vercel.app/reset-password and enter this code to set a new password.\n\nThis code expires in 15 minutes.`,
      parseMode: "Markdown",
    });
  }

  return {
    success: "Reset code sent! Check your Telegram.",
    resetCode: code,
    error: "",
  };
}
