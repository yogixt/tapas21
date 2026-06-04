"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  prev: { error: string; redirectTo: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = prev.redirectTo;

  if (!email || !password) {
    return { error: "Email and password are required", redirectTo };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: "Invalid email or password", redirectTo };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password", redirectTo };
  }

  await createSession(user.id);
  redirect(redirectTo);
}
