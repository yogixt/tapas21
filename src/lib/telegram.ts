const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN || ""}`;

type SendMessageParams = {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "Markdown";
};

export async function sendTelegramMessage({
  chatId,
  text,
  parseMode,
}: SendMessageParams) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return { ok: false };
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode ?? undefined,
      }),
    });
    return res.json();
  } catch {
    return { ok: false };
  }
}

export async function sendReminder(
  chatId: string,
  type: "morning" | "wakeCheck" | "study" | "lunch" | "studyCheck" | "walk" | "snack" | "yogicLife" | "reflection" | "phoneCheck" | "afternoonCheck"
) {
  const reminders: Record<string, string> = {
    morning:
      "🌅 *Beta uth gaye?*\n\nSubah 5:00 AM ho gaye! Aaj ka din banana hai ab.\n\n• Uth gaye ya nahi?\n• Yoga / Pranayama kiya?\n• Aaj ka goal kya hai?\n\nBatao beta, main track kar leti hoon! 💕",

    wakeCheck:
      "🧘‍♂️ *Yoga ho gaya?*\n\nBeta, 6:30 AM ho gaye. Yoga aur pranayama kar liya?\n\nThoda stretching bhi important hai. Body fresh rahegi tabhi padhai mein focus aayega!\n\nBas haan ya nahi bata do 😊",

    phoneCheck:
      "📱 *Phone rakh do beta!*\n\n8:00 AM ho gaye. Subah subah phone kya dekh rahe ho?\n\nJaake naha lo, taiyar ho jao. Phone toh baad mein bhi dekhenge. Time waste mat karo!\n\nAb utho aur ready ho jao ❤️",

    study:
      "📚 *Padhai ka time ho gaya!*\n\nBeta 9:00 AM ho gaye. Aaj kya padhne ka plan hai?\n\n• DSA?\n• Machine Learning?\n• System Design?\n\nKitna time doge aaj? Hours batao — main count kar lungi ✏️",

    lunch:
      "🍛 *Lunch ka time!*\n\nBeta 12:30 PM ho gaye. Khana kha liya?\n\n• Kya khaya? Junk food toh nahi na?\n• Calories count kar rahe ho?\n• Pani piyo, body hydrate rakho\n\nMaa ka khana yaad hai na? Waise hi sattvic khao! 💛",

    afternoonCheck:
      "😴 *Afternoon mein kya kar rahe ho?*\n\nBeta 2 PM ho gaye. Lunch ke baad thoda rest kiya ya seedha padhai?\n\nDhyan rakhna — after lunch 15 min power nap bhi productive hota hai.\n\nPadhai kya chal rahi hai aaj? Update do! 💪",

    walk:
      "🚶‍♂️ *Walk par jaao beta!*\n\nShaam 5:00 PM ho gaye. 45 minute walk zaroor karo.\n\n• Fresh air milegi\n• Mind fresh hoga\n• Body active rahegi\n\nGaye the? Batao beta! 🌿",

    snack:
      "🥗 *Shaam ka nashta?*\n\nBeta 6:30 PM. Kuch healthy khao — fruits, dry fruits, seeds.\n\nJunk food nahi! *Bilkul nahi!* Yaad rakhna — yogi ho tum.\n\nKya khaya aaj? Batao 😊",

    yogicLife:
      "🧘 *Beta aaj ka din kaisa raha?*\n\nShaam 8:00 PM. Thoda ruko aur socho:\n\n• Aaj kya seekha?\n• Kya accha raha?\n• Kya improve karein kal?\n\nDhyan kiya? Thoda meditation bhi karo. Mind shaant rahega.\n\n50 LPA target hai, par yogic life goal hai. Dono saath chalenge! 🌟",

    reflection:
      "🌙 *Sone ka time ho gaya beta!*\n\nRaat 10:00 PM. Aaj ka din complete hua.\n\n• 10:30 tak sojao\n• Kal subah 5:00 AM uthna hai\n• Phone rakh do ab\n• Good night beta!\n\nAaj ka ek sentence mein batao — kaisa raha din? Maa ko batao 😊💤",
  };

  const replyPrompt = "\n\n*Mujhe reply karo* — main samajh kar track kar lungi! 🤖💕";

  return sendTelegramMessage({
    chatId,
    text: (reminders[type] || "") + replyPrompt,
    parseMode: "Markdown",
  });
}

export function getTelegramBotUsername() {
  return process.env.TELEGRAM_BOT_USERNAME || "";
}
