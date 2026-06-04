"use client";

import { Weight, BookOpen, CheckCircle, PenLine } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    href: "/dashboard/progress",
    label: "Add Weight",
    icon: Weight,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    href: "/dashboard/progress",
    label: "Log Study",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    href: "/dashboard/mission",
    label: "Complete Habit",
    icon: CheckCircle,
    color: "text-saffron",
    bg: "bg-saffron/5",
  },
  {
    href: "/dashboard/reflection",
    label: "Daily Reflection",
    icon: PenLine,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm lg:p-6">
      <h2 className="mb-1 text-base font-semibold text-[#1F2937]">
        Quick Actions
      </h2>
      <p className="mb-4 text-sm text-[#6B7280]">
        Log your progress in one tap
      </p>

      <div className="grid grid-cols-4 gap-2">
        {actions.map(({ href, label, icon: Icon, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-[#FAFAFA] active:scale-95"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <span className="text-center text-[10px] font-medium leading-tight text-[#4B5563]">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
