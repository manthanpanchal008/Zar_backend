"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Coins, Home, Layers, LogOut, Sparkles, UserCheck, 
  Users, Hammer, MessageSquare, Briefcase, Mail, ChevronDown, ChevronRight, Gem 
} from "lucide-react";
import { clearAuth } from "@/lib/auth";
import type { AdminUser } from "@/types";
import toast from "react-hot-toast";

interface SidebarProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [catalogExpanded, setCatalogExpanded] = useState(false);

  // Group 1 Collapsible Dropdown Items
  const catalogItems = [
    { href: "/goldtype", label: "GoldType", icon: Coins },
    { href: "/category", label: "Category", icon: Layers },
    { href: "/collectiontype", label: "CollectionType", icon: Gem }, // TASK 10: Gem icon for collection type
    { href: "/products", label: "Products", icon: Sparkles },
  ];

  const standaloneItems = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/inquiry", label: "Inquiry", icon: Mail },
    { href: "/clientele", label: "Clientele", icon: UserCheck },
    { href: "/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/careers", label: "Careers", icon: Briefcase },
    { href: "/users", label: "Users", icon: Users, adminOnly: true },
  ];

  // Auto-expand catalog dropdown if any child page is active on mount/navigation
  useEffect(() => {
    const isCatalogChildActive = catalogItems.some(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (isCatalogChildActive) {
      setCatalogExpanded(true);
    }
  }, [pathname]);

  const isCatalogActive = catalogItems.some(item => 
    pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white px-4 py-5 border-r border-[#eee7dd]">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center gap-3 px-2" onClick={onClose}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zar-bg border border-[#eee7dd]">
            <img src="/Zar_backend/icon-1.png" alt="Zar jewels logo" className="h-7 w-7 object-contain" />
          </span>
          <span className="text-lg font-bold text-black">Zar jewels</span>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden rounded-lg p-2 hover:bg-zar-bg text-zar-muted transition"
          aria-label="Close menu"
        >
          <span className="text-2xl font-light">&times;</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {/* Render Dashboard (always top) */}
        {(() => {
          const active = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
          return (
            <Link
              href="/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                active ? "bg-zar-gold text-black" : "text-zar-muted hover:bg-zar-bg hover:text-black"
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          );
        })()}

        {/* Collapsible Dropdown for Catalog */}
        <div>
          <button
            onClick={() => setCatalogExpanded(!catalogExpanded)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition ${
              isCatalogActive 
                ? "bg-zar-bg text-black border border-[#eee7dd]/50" 
                : "text-zar-muted hover:bg-zar-bg hover:text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Catalog</span>
            </div>
            {catalogExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Smooth height expand animation */}
          <AnimatePresence initial={false}>
            {catalogExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4 mt-1 space-y-1"
              >
                {catalogItems.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        active ? "bg-zar-gold text-black" : "text-zar-muted hover:bg-zar-bg hover:text-black"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Standalone Items */}
        {standaloneItems.map((item) => {
          if (item.adminOnly && user?.role !== "admin") return null;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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

      {/* Logout Button (Pinned bottom without overlay issue) */}
      <div className="pt-4 border-t border-[#eee7dd] mt-auto">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-zar-muted hover:bg-zar-bg hover:text-black transition"
          onClick={() => {
            clearAuth();
            toast.success("Logged out successfully.");
            setTimeout(() => {
              window.location.assign("/Zar_backend/login");
            }, 800);
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[#eee7dd] bg-white lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (with Framer Motion animations) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop/Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            {/* Sliding Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden h-full"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
