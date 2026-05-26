"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Coins, Home, Layers, LogOut, Sparkles, UserCheck, Users, Hammer } from "lucide-react";
import { clearAuth } from "@/lib/auth";
import type { AdminUser } from "@/types";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/goldtype", label: "GoldType", icon: Coins },
  { href: "/category", label: "Category", icon: Layers },
  { href: "/makingtype", label: "MakingType", icon: Hammer },
  { href: "/products", label: "Products", icon: Sparkles },
  { href: "/clientele", label: "Clientele", icon: UserCheck },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
];

export function Sidebar({ user }: { user: AdminUser | null }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[#eee7dd] bg-white px-4 py-5 lg:block">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zar-bg border border-[#eee7dd]">
          <img src="/icon-1.png" alt="Zar jewels logo" className="h-7 w-7 object-contain" />
        </span>
        <span className="text-lg font-bold text-black">Zar jewels</span>
      </Link>

      <nav className="space-y-1">
        {items
          .filter((item) => !item.adminOnly || user?.role === "admin")
          .map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  active ? "bg-zar-gold text-black" : "text-zar-muted hover:bg-zar-bg hover:text-black"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <button
        className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-zar-muted hover:bg-zar-bg hover:text-black"
        onClick={() => {
          clearAuth();
          window.location.assign("/login");
        }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
