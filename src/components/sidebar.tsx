"use client";

import {
  Home,
  Target,
  Calendar,
  TrendingUp,
  Brain,
  BookOpen,
  Scale,
  Medal,
  Bell,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/dashboard/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/entries", label: "Today's Mission", icon: Target },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/coach", label: "AI Coach", icon: Brain },
  { href: "/dashboard/study", label: "Study", icon: BookOpen },
  { href: "/dashboard/weight", label: "Weight", icon: Scale },
  { href: "/dashboard/achievements", label: "Achievements", icon: Medal },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar({ userName, dayNumber }: { userName: string; dayNumber: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-col border-r border-[#E5E7EB] bg-white lg:flex">
      <div className="flex items-center gap-2.5 border-b border-[#E5E7EB] px-6 py-5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B35]" />
        <span className="text-lg font-semibold tracking-tight text-[#1F2937]">
          tapas21
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
          Navigation
        </p>
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#FFF0E8] text-[#FF6B35]"
                    : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1F2937]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#E5E7EB] px-3 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#FFF0E8] px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-[#1F2937]">{userName}</p>
            <p className="text-xs text-[#9CA3AF]">
              {dayNumber > 0
                ? `Day ${Math.min(dayNumber, 21)} of 21`
                : "Ready to begin!"}
            </p>
          </div>
        </div>
        <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
            1 break = Day 1 again
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
