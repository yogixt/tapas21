type Message = { role: "user" | "assistant"; text: string };

const GROQ_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function groqReply(
  messages: Message[],
  systemPrompt: string
): Promise<string | null> {
  if (!GROQ_KEY) return null;
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.text })),
        ],
        max_tokens: 300,
        temperature: 0.4,
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `You are TAPAS21's Telegram assistant for Bijay's 21-day transformation. You chat casually like a friend/coach.

TODAY'S DATA is the user's current entries for today. Use it to know what's already tracked.

When the user tells you something, figure out which field to update:
- wakeUp5am (boolean) — woke up at 5am
- yogaPranayama (boolean) — did yoga/pranayama
- studyHours (number) — hours studied
- walkSwim (boolean) — walked/swam 45min
- caloriesUnderTarget (boolean) — kept calories under 1500
- proteinGoalHit (boolean) — hit 90g protein
- sleepBefore1030pm (boolean) — slept before 10:30pm
- actualCalories (number) — actual calories consumed
- actualProtein (number) — actual protein in grams
- actualWaterL (number) — actual water in litres
- notes (text) — any notes or reflection

IMPORTANT: Return ONLY valid JSON with NO markdown, NO backticks, NO extra text.
Format: { "updates": { "field1": value1 }, "reply": "Your casual reply here" }

Field names must exactly match the keys above. Use null for fields you're not updating.
The reply should be short, warm, and in Hinglish (Hindi + English mix) or simple English — like a real friend. Be encouraging.`;

type Updates = {
  wakeUp5am?: boolean;
  yogaPranayama?: boolean;
  studyHours?: number;
  walkSwim?: boolean;
  caloriesUnderTarget?: boolean;
  proteinGoalHit?: boolean;
  sleepBefore1030pm?: boolean;
  actualCalories?: number;
  actualProtein?: number;
  actualWaterL?: number;
  notes?: string;
};

export type AiResult = {
  updates: Partial<Updates>;
  reply: string;
};

export async function understandMessage(
  userMessage: string,
  todayEntry: Record<string, any> | null | undefined,
  history: { role: "user" | "assistant"; text: string }[]
): Promise<AiResult | null> {
  const todayData = todayEntry
    ? Object.entries(todayEntry)
        .filter(([_, v]) => v !== null && v !== undefined && v !== 0)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    : "Nothing tracked yet today";

  const contextMessages: Message[] = [
    ...history.slice(-6),
    { role: "user", text: userMessage },
  ];

  const prompt = `${SYSTEM_PROMPT}\n\nTODAY'S DATA: ${todayData}`;
  const raw = await groqReply(contextMessages, prompt);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      updates: parsed.updates || {},
      reply: parsed.reply || "Got it! Keep going 🙌",
    };
  } catch {
    return null;
  }
}
