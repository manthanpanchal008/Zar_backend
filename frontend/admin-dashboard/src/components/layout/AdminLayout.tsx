"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export function AdminLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, loading } = useAuthGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F6F2]">
        <div className="relative flex items-center justify-center">
          {/* Outer glowing/pulsing ring */}
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-[#D0B480]/20 duration-1000" />
          {/* Inner spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#D0B480]/20 border-t-[#D0B480]" />
          {/* Center logo icon */}
          <img src="/Zar_backend/icon-1.png" alt="Loading" className="absolute h-6 w-6 object-contain" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#A38274] animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zar-bg">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:pl-72">
        <Navbar title={title} user={user} onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
