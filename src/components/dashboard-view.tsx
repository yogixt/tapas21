"use client";

import { useState, useMemo } from "react";
import { useActionState } from "react";
import { saveEntryAction } from "@/app/dashboard/entries/actions";
import { saveWeightAction } from "@/app/dashboard/weight/actions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TodayEntry = {
  id: string;
  date: string;
  wakeUp5am: boolean;
  yogaPranayama: boolean;
  studyHours: number;
  walkSwim: boolean;
  caloriesUnderTarget: boolean;
  proteinGoalHit: boolean;
  sleepBefore1030pm: boolean;
  actualCalories: number;
  actualProtein: number;
  actualWaterL: number;
  notes: string;
};

type Props = {
  todayDate: string;
  dayNumber: number;
  streak: number;
  totalStudy: number;
  score: number;
  latestWeight: number | null;
  startWeight: number;
  todayEntry: TodayEntry | null;
  completedToday: number;
  entries: { date: string; studyHours: number | null; wakeUp5am: boolean | null; yogaPranayama: boolean | null; walkSwim: boolean | null; caloriesUnderTarget: boolean | null; proteinGoalHit: boolean | null; sleepBefore1030pm: boolean | null; actualCalories: number | null; actualProtein: number | null; actualWaterL: number | null; notes: string | null }[];
  weightRecords: { date: string; weightKg: number }[];
};

const habits = [
  { name: "wakeUp5am", label: "wake up 5am", icon: "sun" },
  { name: "yogaPranayama", label: "yoga / pranayama", icon: "lotus" },
  { name: "walkSwim", label: "walk 45 min", icon: "walk" },
  { name: "caloriesUnderTarget", label: "calories under 1500", icon: "apple" },
  { name: "proteinGoalHit", label: "protein 90g+", icon: "drumstick" },
  { name: "sleepBefore1030pm", label: "sleep by 10:30pm", icon: "moon" },
] as const;

function HabitIcon({ icon }: { icon: string }) {
  const cls = "h-4 w-4";
  switch (icon) {
    case "sun": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
    case "lotus": return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2C12 2 8 8 8 12C8 15 10 17 12 18C14 17 16 15 16 12C16 8 12 2 12 2Z"/>
        <path d="M12 18V22M8 20L12 18L16 20"/>
      </svg>
    );
    case "walk": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round"><path d="M13 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"/><path d="M4 21l4-6 3 2 3-6 3 3"/><path d="M15 7l-3 1-2-3"/></svg>;
    case "apple": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2"><path d="M12 7c-2-4-6-4-6 0s2 5 6 5 6-1 6-5-4-4-6 0Z"/><path d="M12 12v7"/></svg>;
    case "drumstick": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round"><path d="M18 7a3 3 0 0 0-5-2.2C10 7 9 12 9 14c0 2 2 4 4 4 0 0 2-1 5-5 .8-.8 1-1.9 0-3"/><path d="M5 16l4-4"/></svg>;
    case "moon": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    default: return null;
  }
}

export function DashboardView({
  todayDate,
  dayNumber,
  streak,
  totalStudy,
  score,
  latestWeight,
  startWeight,
  todayEntry,
  entries,
  weightRecords,
}: Props) {
  const [newWeight, setNewWeight] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "coach"; text: string }[]
  >([
    {
      role: "coach",
      text: "hey ! i'm your coach. how's your day going ?",
    },
  ]);
  const [reflection, setReflection] = useState({ wentWell: "", improve: "", grateful: "" });
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const [entryState, entryAction, entryPending] = useActionState(
    saveEntryAction,
    { success: false, id: todayEntry?.id ?? null }
  );

  const [weightState, weightAction, weightPending] = useActionState(
    saveWeightAction,
    { error: "", success: false }
  );

  const [localChecklist, setLocalChecklist] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const h of habits) {
        initial[h.name] = todayEntry
          ? (todayEntry[h.name as keyof TodayEntry] as boolean)
          : false;
      }
      return initial;
    }
  );

  const checkedCount = Object.values(localChecklist).filter(Boolean).length;
  const progressPct = Math.min((dayNumber / 21) * 100, 100);
  const weightDiff =
    latestWeight !== null ? (startWeight - latestWeight).toFixed(1) : null;

  const suggestions = ["how am i doing ?", "i skipped my walk today", "motivate me !", "what should i improve ?"];

  const handleChatSend = (text: string) => {
    if (!text.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setChatInput("");
    const responses: Record<string, string> = {
      "how am i doing ?": "you're doing great ! your wake-up consistency is solid. let's work on that walk tomorrow.",
      "i skipped my walk today": "no worries ! tomorrow is a fresh day. try 20 minutes — you've got this.",
      "motivate me !": "you're showing up every single day. that's the hardest part. keep going, you're building something amazing !",
      "what should i improve ?": "try sleeping 30 min earlier and adding more protein to your dinner. small tweaks, big results !",
    };
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: responses[text.toLowerCase().trim()] || "keep going ! every small step counts toward your transformation.",
        },
      ]);
    }, 600);
  };

  const handleReflectionSave = () => {
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2500);
  };

  const dayMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      const checks = [e.wakeUp5am, e.yogaPranayama, e.walkSwim, e.caloriesUnderTarget, e.proteinGoalHit, e.sleepBefore1030pm];
      map.set(e.date, checks.filter(Boolean).length);
    }
    return map;
  }, [entries]);

  const weeks = useMemo(() => {
    const today = new Date(todayDate + "T12:00:00");
    const days: { date: Date; score: number }[] = [];
    for (let i = 55; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({ date: d, score: dayMap.get(d.toISOString().slice(0, 10)) ?? 0 });
    }
    const w: typeof days[] = [];
    let cur: typeof days = [];
    for (const day of days) {
      cur.push(day);
      if (day.date.getDay() === 6) { w.push(cur); cur = []; }
    }
    if (cur.length > 0) w.push(cur);
    return w;
  }, [dayMap, todayDate]);

  const [currentTab, setCurrentTab] = useState<"habits" | "progress" | "coach">("habits");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="doodle-border-light bg-white p-5 doodle-rotate">
        <div className="flex items-center gap-2">
          <h1 className="font-hand text-2xl text-doodle-ink lg:text-3xl">hey, bijoy !</h1>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 4 6 4 10c0 3 2 6 8 12 6-6 8-9 8-12 0-4-4-8-8-8Z" fill="#FF6B6B" stroke="#2D2D2D" strokeWidth="1.5"/></svg>
        </div>
        <p className="font-hand text-base text-doodle-muted">
          {streak > 0 ? `${streak} day streak ! keep going !` : "let's start this journey !"}
        </p>
        {/* Doodle squiggle */}
        <svg className="mt-2 h-3 w-full" preserveAspectRatio="none" viewBox="0 0 200 10">
          <path d="M0 5 Q25 0 50 5 T100 5 T150 5 T200 5" fill="none" stroke="#2D2D2D" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3"/>
        </svg>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2">
        {[
          { id: "habits" as const, label: "today" },
          { id: "progress" as const, label: "progress" },
          { id: "coach" as const, label: "coach" },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setCurrentTab(id)}
            className={`flex-1 rounded-xl py-3 font-hand text-base transition-all ${
              currentTab === id
                ? "doodle-border-ink bg-white doodle-shadow-sm font-bold text-doodle-ink"
                : "border-2 border-dashed border-doodle-ink/20 text-doodle-muted hover:border-doodle-ink/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ====== HABITS TAB ====== */}
      {currentTab === "habits" && (
        <>
          {/* Progress ring + stats */}
          <div className="doodle-border-light bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-hand text-sm text-doodle-muted">day</p>
                <p className="font-hand text-2xl font-bold text-doodle-ink">
                  {Math.min(dayNumber + 1, 21)}
                  <span className="text-base font-normal text-doodle-muted"> / 21</span>
                </p>
                <p className="mt-1 font-hand text-sm text-doodle-muted">{checkedCount} / {habits.length} done today</p>
              </div>
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E5E0D0" strokeWidth="3" strokeDasharray="4 3"/>
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#FF6B35" strokeWidth="3" strokeDasharray={`${progressPct} ${100 - progressPct}`} strokeLinecap="round"/>
                </svg>
                <span className="absolute font-hand text-lg font-bold text-doodle-accent">{Math.round(progressPct)}%</span>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full border-2 border-dashed border-doodle-ink/30 bg-doodle-paper">
              <div className="h-full rounded-full bg-doodle-accent transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Habits form */}
          <form action={entryAction} className="space-y-3">
            <input type="hidden" name="id" value={todayEntry?.id ?? ""} />
            <input type="hidden" name="date" value={todayDate} />

            <div className="space-y-2">
              {habits.map(({ name, label, icon }) => (
                <label
                  key={name}
                  className={`flex cursor-pointer items-center gap-3 doodle-border-light p-4 transition-all ${
                    localChecklist[name] ? "bg-doodle-accent/5 border-doodle-accent/40" : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={localChecklist[name]}
                    onChange={(e) => setLocalChecklist((p) => ({ ...p, [name]: e.target.checked }))}
                    className="peer sr-only"
                    value="true"
                  />
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                      localChecklist[name] ? "border-doodle-accent bg-doodle-accent" : "border-doodle-ink/30 bg-white"
                    }`}
                  >
                    <svg className={`h-4 w-4 text-white transition-all ${localChecklist[name] ? "scale-100" : "scale-0"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <HabitIcon icon={icon} />
                  <span className={`flex-1 font-hand text-base ${localChecklist[name] ? "font-bold text-doodle-accent" : "text-doodle-ink"}`}>{label}</span>
                </label>
              ))}
            </div>

            {/* Study + Nutrition inline */}
            <div className="doodle-border-light bg-white p-4">
              <p className="mb-3 font-hand text-sm font-bold text-doodle-ink">study & nutrition</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-hand text-sm text-doodle-muted">study</span>
                <input
                  type="number" name="studyHours" step="0.5" min="0" max="12"
                  defaultValue={todayEntry?.studyHours ?? 0}
                  className="h-10 w-20 rounded-xl border-2 border-dashed border-doodle-ink/30 bg-doodle-paper px-3 text-center font-hand text-base text-doodle-ink focus:border-doodle-ink focus:outline-none"
                />
                <span className="font-hand text-sm text-doodle-muted">hours</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="calories" name="actualCalories" def={todayEntry?.actualCalories ?? 0} />
                <Input label="protein g" name="actualProtein" def={todayEntry?.actualProtein ?? 0} step="0.1" />
                <Input label="water L" name="actualWaterL" def={todayEntry?.actualWaterL ?? 0} step="0.1" />
              </div>
            </div>

            <textarea name="notes" rows={2} defaultValue={todayEntry?.notes ?? ""} placeholder="notes for today..."
              className="doodle-border-light w-full resize-none bg-white px-4 py-3 font-hand text-base text-doodle-ink placeholder-doodle-muted focus:border-doodle-ink focus:outline-none"
            />

            {entryState.success && (
              <div className="doodle-border-ink bg-doodle-teal/10 px-4 py-3">
                <p className="font-hand text-sm text-doodle-teal">saved !</p>
              </div>
            )}

            <button type="submit" disabled={entryPending}
              className="doodle-border-ink doodle-shadow flex h-12 w-full items-center justify-center bg-doodle-yellow font-hand text-lg font-bold text-doodle-ink transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {entryPending ? "saving..." : "save today !"}
            </button>
          </form>

          {/* Quick weight log */}
          <form action={weightAction} className="doodle-border-light bg-white p-4">
            <p className="mb-2 font-hand text-sm font-bold text-doodle-ink">log weight</p>
            <div className="flex items-center gap-3">
              <input type="number" name="weightKg" step="0.1" min="30" max="200" required
                value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
                placeholder="weight in kg"
                className="h-11 flex-1 rounded-xl border-2 border-dashed border-doodle-ink/30 bg-doodle-paper px-4 font-hand text-base text-doodle-ink placeholder-doodle-muted focus:border-doodle-ink focus:outline-none"
              />
              <button type="submit" disabled={weightPending}
                className="doodle-border-ink doodle-shadow-sm flex h-11 items-center bg-doodle-teal px-6 font-hand text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {weightPending ? "..." : "log"}
              </button>
            </div>
            {weightState.success && <p className="mt-2 font-hand text-xs text-doodle-teal">logged !</p>}
          </form>

          {/* Calendar heatmap */}
          <div className="doodle-border-light bg-white p-4">
            <p className="mb-3 font-hand text-sm font-bold text-doodle-ink">consistency</p>
            <div className="overflow-x-auto">
              <div className="inline-flex gap-0.5">
                <div className="mr-1 flex flex-col gap-0.5 pt-3">
                  {["", "mon", "", "wed", "", "fri", ""].map((l, i) => (
                    <div key={i} className="h-3 font-hand text-[8px] leading-3 text-doodle-muted">{l}</div>
                  ))}
                </div>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day, di) => {
                      const c = day.score === 0 ? "#F3F0E8" : day.score <= 2 ? "#FFE8DB" : day.score <= 4 ? "#FFB58A" : "#FF6B35";
                      return <div key={di} className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />;
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 font-hand text-[10px] text-doodle-muted">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{backgroundColor:"#F3F0E8"}} /> miss</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{backgroundColor:"#FFE8DB"}} /> partial</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{backgroundColor:"#FFB58A"}} /> good</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{backgroundColor:"#FF6B35"}} /> perfect</span>
            </div>
          </div>

          {/* Daily reflection */}
          <div className="doodle-border-light bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p className="font-hand text-sm font-bold text-doodle-ink">daily reflection</p>
            </div>
            <div className="space-y-2">
              <ReflectInput label="what went well ?" val={reflection.wentWell} set={(v) => setReflection(p => ({...p, wentWell: v}))} />
              <ReflectInput label="what could improve ?" val={reflection.improve} set={(v) => setReflection(p => ({...p, improve: v}))} />
              <ReflectInput label="grateful for ?" val={reflection.grateful} set={(v) => setReflection(p => ({...p, grateful: v}))} />
            </div>
            {reflectionSaved && <p className="mt-2 font-hand text-xs text-doodle-purple">saved !</p>}
            <button type="button" onClick={handleReflectionSave}
              disabled={!reflection.wentWell || !reflection.improve || !reflection.grateful}
              className="mt-3 doodle-border-ink doodle-shadow-sm flex h-10 w-full items-center justify-center bg-doodle-purple font-hand text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              save reflection
            </button>
          </div>
        </>
      )}

      {/* ====== PROGRESS TAB ====== */}
      {currentTab === "progress" && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <DoodleStat label="weight" value={latestWeight ? `${latestWeight} kg` : "—"} sub={weightDiff ? `${weightDiff} kg lost` : "start: 85kg"} color="text-doodle-coral" bg="bg-doodle-coral/5" />
            <DoodleStat label="study" value={`${Math.floor(totalStudy)}h`} sub="target: 63h" color="text-doodle-blue" bg="bg-doodle-blue/5" />
            <DoodleStat label="streak" value={`${streak}`} sub={`${streak === 1 ? "day" : "days"}`} color="text-doodle-yellow" bg="bg-doodle-yellow/10" />
            <DoodleStat label="score" value={`${score}%`} sub={score >= 80 ? "awesome !" : "keep going !"} color="text-doodle-accent" bg="bg-doodle-accent/5" />
          </div>

          {/* Weight chart */}
          <div className="doodle-border-light bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></svg>
              <p className="font-hand text-sm font-bold text-doodle-ink">weight</p>
              <span className="font-hand text-xs text-doodle-muted">85 kg &rarr; {latestWeight ?? "?"} kg</span>
            </div>
            {weightRecords.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[{ date: "start", weightKg: 85 }, ...weightRecords.map(r => ({ date: r.date.slice(5), weightKg: r.weightKg }))]}>
                  <defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6B35" stopOpacity={0.15}/><stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:"#8B8B8B",fontSize:10,fontFamily:"Nunito"}} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} axisLine={false} tickLine={false} tick={{fill:"#8B8B8B",fontSize:10,fontFamily:"Nunito"}} width={35} />
                  <Tooltip contentStyle={{background:"#FFF",border:"2px dashed #2D2D2D",borderRadius:12,color:"#2D2D2D",fontSize:12,fontFamily:"Nunito"}} />
                  <Area type="monotone" dataKey="weightKg" stroke="#FF6B35" strokeWidth={2.5} fill="url(#w)" dot={{fill:"#FF6B35",stroke:"#FFF",strokeWidth:2,r:4}} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-32 items-center justify-center doodle-border-light bg-doodle-paper">
                <p className="font-hand text-sm text-doodle-muted">log your weight to see the trend !</p>
              </div>
            )}
          </div>

          {/* Study + Achievements */}
          <div className="grid grid-cols-2 gap-3">
            <div className="doodle-border-light bg-white p-4">
              <p className="font-hand text-sm font-bold text-doodle-ink mb-2">study</p>
              <p className="font-hand text-2xl font-bold text-doodle-blue">{Math.floor(totalStudy)}<span className="text-sm text-doodle-muted"> / 63h</span></p>
              <div className="mt-2 h-2 overflow-hidden rounded-full border border-dashed border-doodle-ink/20 bg-doodle-paper">
                <div className="h-full rounded-full bg-doodle-blue transition-all" style={{width:`${Math.min((totalStudy/63)*100,100)}%`}} />
              </div>
            </div>
            <div className="doodle-border-light bg-white p-4">
              <p className="font-hand text-sm font-bold text-doodle-ink mb-2">achievements</p>
              <div className="flex gap-1">
                <MiniBadge unlocked={dayNumber >= 7} label="7d" color="bg-doodle-coral/10" dot="bg-doodle-coral" />
                <MiniBadge unlocked={streak >= 14} label="14d" color="bg-doodle-yellow/10" dot="bg-doodle-yellow" />
                <MiniBadge unlocked={dayNumber >= 21} label="21d" color="bg-doodle-accent/10" dot="bg-doodle-accent" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ====== COACH TAB ====== */}
      {currentTab === "coach" && (
        <div className="doodle-border-light bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <p className="font-hand text-sm font-bold text-doodle-ink">ai coach</p>
          </div>

          <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-hand text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "doodle-border-ink bg-doodle-yellow text-doodle-ink"
                    : "doodle-border-light bg-doodle-paper text-doodle-muted"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => handleChatSend(s)}
                className="rounded-full border-2 border-dashed border-doodle-ink/30 px-3.5 py-1.5 font-hand text-xs text-doodle-muted transition-all hover:border-doodle-accent/50 hover:text-doodle-accent"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(chatInput); }}
              placeholder="chat with your coach..."
              className="h-11 flex-1 rounded-xl border-2 border-dashed border-doodle-ink/30 bg-doodle-paper px-4 font-hand text-base text-doodle-ink placeholder-doodle-muted focus:border-doodle-ink focus:outline-none"
            />
            <button type="button" onClick={() => handleChatSend(chatInput)}
              className="doodle-border-ink doodle-shadow-sm flex h-11 w-11 items-center justify-center bg-doodle-accent text-white transition-all hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, def, step }: { label: string; name: string; def: number; step?: string }) {
  return (
    <div>
      <label className="block font-hand text-xs text-doodle-muted mb-0.5">{label}</label>
      <input type="number" name={name} step={step ?? "1"} min="0" defaultValue={def}
        className="h-10 w-full rounded-xl border-2 border-dashed border-doodle-ink/30 bg-doodle-paper px-3 font-hand text-sm text-doodle-ink focus:border-doodle-ink focus:outline-none"
      />
    </div>
  );
}

function ReflectInput({ label, val, set }: { label: string; val: string; set: (v: string) => void }) {
  return (
    <input type="text" value={val} onChange={(e) => set(e.target.value)}
      placeholder={label}
      className="h-11 w-full rounded-xl border-2 border-dashed border-doodle-ink/20 bg-doodle-paper px-4 font-hand text-sm text-doodle-ink placeholder-doodle-muted focus:border-doodle-ink focus:outline-none"
    />
  );
}

function DoodleStat({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div className={`doodle-border-light ${bg} p-4`}>
      <p className="font-hand text-xs text-doodle-muted mb-1">{label}</p>
      <p className={`font-hand text-2xl font-bold ${color}`}>{value}</p>
      <p className="font-hand text-xs text-doodle-muted mt-0.5">{sub}</p>
    </div>
  );
}

function MiniBadge({ unlocked, label, color, dot }: { unlocked: boolean; label: string; color: string; dot: string }) {
  return (
    <div className={`flex-1 rounded-xl border-2 border-dashed p-2 text-center ${unlocked ? "border-doodle-ink/30" : "border-doodle-ink/10"}`}>
      <div className={`mx-auto mb-1 h-2 w-2 rounded-full ${unlocked ? dot : "bg-doodle-muted/30"}`} />
      <p className={`font-hand text-xs ${unlocked ? "text-doodle-ink" : "text-doodle-muted/50"}`}>{label}</p>
    </div>
  );
}
