"use client";

import { useState } from "react";
import { Bell, Sun, BookOpen, Footprints, Moon, MessageCircle } from "lucide-react";

const reminders = [
  { id: "morning", label: "Morning Reminder", time: "5:00 AM", icon: Sun },
  { id: "study", label: "Study Reminder", time: "7:30 AM", icon: BookOpen },
  { id: "walk", label: "Walk Reminder", time: "8:00 PM", icon: Footprints },
  { id: "night", label: "Night Reflection", time: "10:00 PM", icon: Moon },
];

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    morning: true,
    study: true,
    walk: false,
    night: true,
  });

  const toggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-sky-500" />
          <h2 className="text-base font-semibold text-[#1F2937]">
            Telegram Integration
          </h2>
        </div>
        <p className="mb-4 text-sm text-[#6B7280]">
          Connect Telegram to receive daily reminders and motivation
        </p>
        <button
          type="button"
          className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-400 active:scale-95"
        >
          Connect Telegram
        </button>
      </div>

      <div className="space-y-1">
        {reminders.map(({ id, label, time, icon: Icon }) => (
          <label
            key={id}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/5">
              <Icon className="h-4 w-4 text-saffron" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1F2937]">{label}</p>
              <p className="text-xs text-[#6B7280]">{time}</p>
            </div>
            <div
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings[id as keyof typeof settings]
                  ? "bg-saffron"
                  : "bg-[#E5E7EB]"
              }`}
            >
              <input
                type="checkbox"
                checked={settings[id as keyof typeof settings]}
                onChange={() => toggle(id)}
                className="peer sr-only"
              />
              <div
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings[id as keyof typeof settings]
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </div>
          </label>
        ))}
      </div>

      <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-medium text-[#4B5563]">
          Preview Telegram Message
        </p>
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-saffron" />
            <span className="text-xs font-medium text-[#6B7280]">
              TAPAS21 Bot
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#4B5563]">
            Good morning, Bijoy. Today is Day 8 of your transformation.
            Time to wake up, practice gratitude, and take the first step
            toward becoming your best self.
          </p>
        </div>
      </div>
    </div>
  );
}
