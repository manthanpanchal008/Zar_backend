"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Menu, User as UserIcon } from "lucide-react";
import { clearAuth } from "@/lib/auth";
import type { AdminUser } from "@/types";

export function Navbar({ title, user }: { title: string; user: AdminUser | null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearAuth();
    window.location.assign("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#eee7dd] bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-[#eee7dd] p-2 text-zar-muted lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-zar-title md:text-2xl">{title}</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#eee7dd] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-bg transition"
          >
            <UserIcon size={18} className="text-zar-muted" />
            <span>{user?.name || "Admin"}</span>
            <ChevronDown size={14} className="text-zar-muted" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#eee7dd] bg-white p-2 shadow-panel z-50">
              <div className="px-3 py-2">
                <p className="text-xs text-zar-muted font-medium">Logged in as</p>
                <p className="text-sm font-bold text-black truncate">{user?.email || "admin@zarjewels.com"}</p>
                <p className="text-xs text-zar-gold capitalize font-semibold mt-0.5">{user?.role || "Staff"}</p>
              </div>
              <hr className="my-1 border-[#eee7dd]" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
