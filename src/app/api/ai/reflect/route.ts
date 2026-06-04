import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { generateSummary, REFLECT_PROMPT } from "@/lib/gemini";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { wentWell, improve, grateful } = await request.json();

    const prompt = `${REFLECT_PROMPT}\n\nWhat went well: ${wentWell}\nWhat could improve: ${improve}\nGrateful for: ${grateful}`;

    const summary = await generateSummary(prompt);

    if (!summary) {
      return NextResponse.json({
        summary:
          "Beautiful reflection. You're building awareness and growth every day.",
      });
    }

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({
      summary: "Every reflection makes you stronger. Keep journaling!",
    });
  }
}
