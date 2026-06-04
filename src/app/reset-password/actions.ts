"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function resetPasswordAction(
  prev: { error: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;
  const password = formData.get("password") as string;

  if (!email || !code || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) return { error: "User not found" };
  if (!user.resetCode || !user.resetCodeExpiresAt) {
    return { error: "No reset code requested. Go to Forgot Password first." };
  }
  if (user.resetCode !== code) {
    return { error: "Invalid reset code" };
  }
  if (new Date(user.resetCodeExpiresAt) < new Date()) {
    return { error: "Reset code expired. Request a new one." };
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({
      passwordHash,
      resetCode: null,
      resetCodeExpiresAt: null,
    })
    .where(eq(users.id, user.id));

  redirect("/login?reset=success");
}
