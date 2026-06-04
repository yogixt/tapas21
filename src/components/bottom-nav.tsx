"use client";

import {
  Home,
  Target,
  Calendar,
  TrendingUp,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/entries", label: "Mission", icon: Target },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/coach", label: "Coach", icon: Brain },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 lg:hidden">
      <div className="flex items-center justify-around rounded-2xl border border-[#E5E7EB] bg-white px-2 py-2 shadow-lg shadow-black/5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive ? "text-[#FF6B35]" : "text-[#9CA3AF]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[#FF6B35]" : "text-[#9CA3AF]"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
