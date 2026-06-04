"use server";

import { createUser, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signupAction(
  prev: { error: string },
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const userId = await createUser(name, email, password);
    await createSession(userId);
  } catch (e) {
    return { error: (e as Error).message };
  }

  redirect("/dashboard");
}
