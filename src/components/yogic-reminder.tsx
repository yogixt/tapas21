"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const quotes = [
  "Every bite is a choice — choose sattvic.",
  "You are a yogi. Junk food is not your path.",
  "Tapas (discipline) > cravings. Stay strong.",
  "Your body is your temple. Honour it.",
  "50 LPA is a side effect. Yogic life is the goal.",
  "Ahimsa — be kind to your body.",
  "Satvic food = satvic mind = clear DSA solutions.",
  "Junk in = junk out. Pure in = pure out.",
];

export function YogicReminder() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    setQuote(quotes[day % quotes.length]);
  }, []);

  if (!quote) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FDE8D0] bg-[#FFF8F0] px-4 py-3">
      <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B35]" />
      <p className="text-sm leading-relaxed text-[#8B5E3C]">{quote}</p>
    </div>
  );
}
