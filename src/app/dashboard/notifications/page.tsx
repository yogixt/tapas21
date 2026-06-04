"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Sun, BookOpen, Footprints, Moon, Ban, Heart, Check, Copy, ExternalLink, Loader2 } from "lucide-react";

const DB_KEY_MAP: Record<string, string> = {
  morningReminder: "notifyMorning",
  studyReminder: "notifyStudy",
  walkReminder: "notifyWalk",
  nightReflection: "notifyReflection",
  noJunkFood: "notifyNoJunkFood",
  yogicLife: "notifyYogicLife",
};

const defaultSettings = {
  morningReminder: true,
  studyReminder: true,
  walkReminder: false,
  nightReflection: true,
  noJunkFood: true,
  yogicLife: true,
};

export default function NotificationsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [connectCode, setConnectCode] = useState<string | null>(null);
  const [botUsername, setBotUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load settings from DB on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          morningReminder: data.notifyMorning ?? true,
          studyReminder: data.notifyStudy ?? true,
          walkReminder: data.notifyWalk ?? false,
          nightReflection: data.notifyReflection ?? true,
          noJunkFood: data.notifyNoJunkFood ?? true,
          yogicLife: data.notifyYogicLife ?? true,
        });
      }
    } catch {}
  };

  const saveSettings = async (next: typeof settings) => {
    const payload: Record<string, boolean> = {};
    for (const [localKey, dbKey] of Object.entries(DB_KEY_MAP)) {
      payload[dbKey] = next[localKey as keyof typeof next];
    }
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
  };

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/telegram/status");
      const data = await res.json();
      setTelegramConnected(data.connected);
    } catch {}
    setCheckingStatus(false);
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Poll for connection after showing code
  useEffect(() => {
    if (!connectCode || telegramConnected) return;
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [connectCode, telegramConnected, checkStatus]);

  const toggleSetting = (key: keyof typeof settings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveSettings(next);
    localStorage.setItem("tapas21_notification_settings", JSON.stringify(next));
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/connect");
      const data = await res.json();
      if (data.code) {
        setConnectCode(data.code);
        setBotUsername(data.botUsername);
      }
    } catch {}
    setLoading(false);
  };

  const handleCopy = () => {
    if (connectCode) {
      navigator.clipboard.writeText(connectCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reminders = [
    {
      key: "morningReminder" as const,
      label: "Morning Reminder",
      desc: "Wake up reminder at 5 AM",
      icon: Sun,
    },
    {
      key: "studyReminder" as const,
      label: "Study Reminder",
      desc: "Time to study notification",
      icon: BookOpen,
    },
    {
      key: "walkReminder" as const,
      label: "Walk Reminder",
      desc: "Walk 45 minutes reminder",
      icon: Footprints,
    },
    {
      key: "nightReflection" as const,
      label: "Night Reflection",
      desc: "Reflect on your day at 10 PM",
      icon: Moon,
    },
    {
      key: "noJunkFood" as const,
      label: "No Junk Food",
      desc: "You are a yogi — no junk food, only sattvic",
      icon: Ban,
    },
    {
      key: "yogicLife" as const,
      label: "Yogic Life",
      desc: "Remind yourself: your goal is yogic life",
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Notifications
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Manage your reminder settings
        </p>
      </section>

      {/* Reminder Toggles */}
      <div className="space-y-2">
        {reminders.map(({ key, label, desc, icon: Icon }) => (
          <label
            key={key}
            className="card-sm flex cursor-pointer items-center gap-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E8]">
              <Icon className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1F2937]">{label}</p>
              <p className="text-xs text-[#9CA3AF]">{desc}</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => toggleSetting(key)}
                className="sr-only peer"
              />
              <div className="h-6 w-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] transition-colors peer-checked:bg-[#FF6B35] peer-checked:border-[#FF6B35]" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
            </div>
          </label>
        ))}
      </div>

      {/* Telegram Integration */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-[#FF6B35]" />
          <h3 className="text-sm font-semibold text-[#1F2937]">
            Telegram Integration
          </h3>
          {checkingStatus ? (
            <Loader2 className="ml-auto h-4 w-4 animate-spin text-[#9CA3AF]" />
          ) : telegramConnected ? (
            <span className="ml-auto rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
              Connected
            </span>
          ) : null}
        </div>

        {telegramConnected ? (
          <p className="text-sm text-[#6B7280]">
            Your Telegram account is connected. You will receive reminders
            based on your toggles above.
          </p>
        ) : connectCode ? (
          <div className="space-y-3">
            <p className="text-sm text-[#6B7280]">
              Send this code to{" "}
              <strong className="text-[#1F2937]">@{botUsername}</strong> on
              Telegram:
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-3 font-mono text-lg font-bold tracking-wider text-[#FF6B35] text-center">
                {connectCode}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-[#22C55E]" />
                ) : (
                  <Copy className="h-4 w-4 text-[#6B7280]" />
                )}
              </button>
            </div>
            <a
              href={`https://t.me/${botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Telegram Bot
            </a>
            <p className="text-xs text-[#9CA3AF] text-center">
              Send the code as{" "}
              <span className="font-mono">/start {connectCode}</span> — the
              page will update automatically once connected
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-[#6B7280]">
              Connect your Telegram account to receive real-time reminders and
              daily summaries directly on your phone.
            </p>
            <button
              type="button"
              onClick={handleConnect}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Generating..." : "Connect with Telegram"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
