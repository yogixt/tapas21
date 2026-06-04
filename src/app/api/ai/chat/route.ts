import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { chat, COACH_SYSTEM_PROMPT } from "@/lib/gemini";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, history } = await request.json();

    const messages = [
      ...(history || []),
      { role: "user" as const, text: message },
    ];

    const reply = await chat(messages, COACH_SYSTEM_PROMPT);

    if (!reply) {
      return NextResponse.json({
        reply: "Keep going! Every small step counts toward your transformation.",
      });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "You're doing great! Stay consistent and trust the process." },
      { status: 200 }
    );
  }
}
