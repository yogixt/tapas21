"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";

type Message = { role: "user" | "coach"; text: string };

const suggestions = [
  "How am I doing?",
  "I skipped my walk today",
  "Motivate me!",
  "What should I improve?",
  "Help me plan my day",
];

export default function CoachPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      text: "Hey! I'm your AI coach. How's your day going?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "coach" ? "model" as const : "user" as const,
        text: m.text,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "coach", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "Keep going! Every small step counts toward your transformation.",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          AI Coach
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Your personal transformation guide
        </p>
      </section>

      <div className="card">
        <div className="mb-4 flex h-80 flex-col gap-4 overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user" ? "bg-[#1F2937]" : "bg-[#FFF0E8]"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-[#FF6B35]" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1F2937] text-white"
                    : "bg-[#F9FAFB] text-[#4B5563]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF0E8]">
                <Bot className="h-4 w-4 text-[#FF6B35]" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-[#F9FAFB] px-4 py-2.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]" style={{ animationDelay: "0.2s" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              disabled={loading}
              className="rounded-full border border-[#E5E7EB] px-3.5 py-1.5 text-xs text-[#6B7280] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:opacity-50"
            >
              <Sparkles className="mr-1 inline h-3 w-3" />
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
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Chat with your coach..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => handleSend(input)}
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-white transition-all hover:bg-[#E55A2B] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
