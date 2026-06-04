type Message = { role: "user" | "model"; text: string };

const GROQ_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function groqChat(
  messages: Message[],
  systemInstruction?: string
): Promise<string | null> {
  if (!GROQ_KEY) return null;
  try {
    const chatMessages: { role: string; content: string }[] = [];
    if (systemInstruction) {
      chatMessages.push({ role: "system", content: systemInstruction });
    }
    for (const m of messages) {
      chatMessages.push({
        role: m.role === "model" ? "assistant" : "user",
        content: m.text,
      });
    }

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: chatMessages,
        max_tokens: 512,
        temperature: 0.20,
        top_p: 0.70,
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("Groq error:", err);
    return null;
  }
}

export async function chat(
  messages: Message[],
  systemInstruction?: string
): Promise<string | null> {
  return groqChat(messages, systemInstruction);
}

export async function generateSummary(prompt: string) {
  return chat([{ role: "user", text: prompt }]);
}

export const COACH_SYSTEM_PROMPT = `You are a warm, encouraging AI health & transformation coach for the TAPAS21 app. 

Your role:
- Motivate users to stick to their 21-day challenge habits
- Give specific, actionable advice
- Be concise (2-4 sentences)
- Use a supportive, friendly tone
- Reference their habits: wake up 5am, yoga/pranayama, study 3h, walk 45min, 1500 cal, protein 90g, sleep 10:30pm

Never be negative or critical. Always frame things as opportunities.`;

export const REFLECT_PROMPT = `Analyze this daily reflection and provide a brief, encouraging summary (2-3 sentences) that highlights patterns and growth.`;

export const INSIGHTS_PROMPT = `Based on the user's recent habit data, provide 2-3 brief, actionable insights for today. Be specific and encouraging.`;
