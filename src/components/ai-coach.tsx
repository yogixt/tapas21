"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

const suggestions = [
  "How am I doing today?",
  "I skipped my walk",
  "Give me motivation",
  "What should I improve?",
];

export function AICoach() {
  const [messages, setMessages] = useState<
    { role: "user" | "coach"; text: string }[]
  >([
    {
      role: "coach",
      text: "Namaste, Bijoy. I'm your AI transformation coach. Share how your day is going, and I'll guide you.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    setTimeout(() => {
      const responses: Record<string, string> = {
        "how am i doing today?":
          "You're showing great consistency this week. Your wake-up time has been solid, and your study streak is building. Focus on getting those walks in — even 15 minutes counts.",
        "i skipped my walk":
          "That's okay. One missed walk doesn't break your journey. Tomorrow, try a shorter 20-minute walk to rebuild momentum. What got in the way today?",
        "give me motivation":
          "You're here. You're trying. That already puts you ahead of where you were yesterday. Transformation isn't about perfection — it's about showing up, again and again. You've got this.",
        "what should i improve?":
          "Your sleep consistency could be stronger — try winding down 30 minutes earlier. Also, your protein intake has been slightly under target. A small adjustment there could boost your energy significantly.",
      };

      const reply =
        responses[text.toLowerCase().trim()] ||
        "Thank you for sharing, Bijoy. Keep focusing on your daily habits — each small step builds toward your transformation. Is there a specific habit you'd like help with?";

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "coach", text: reply }]);
      }, 800);
    }, 400);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-saffron/10 bg-saffron/5 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/10">
          <Bot className="h-5 w-5 text-saffron" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#1F2937]">Gemini Coach</p>
          <p className="text-xs text-[#6B7280]">Powered by AI</p>
        </div>
      </div>

      <div className="mb-4 flex-1 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                msg.role === "user" ? "bg-saffron/10" : "bg-saffron/5"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-saffron" />
              ) : (
                <Bot className="h-4 w-4 text-saffron" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-saffron text-white"
                  : "border border-[#F3F4F6] bg-white text-[#4B5563] shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSend(s)}
            className="rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-medium text-[#6B7280] transition-colors hover:border-saffron/30 hover:text-saffron active:scale-95"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(input);
          }}
          placeholder="Ask your coach..."
          className="h-12 flex-1 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm text-[#1F2937] placeholder-[#9CA3AF] transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
        />
        <button
          type="button"
          onClick={() => handleSend(input)}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron text-white shadow-sm transition-all hover:bg-saffron-600 active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
