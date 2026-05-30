"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Coins, Home, Layers, LogOut, Sparkles, UserCheck, 
  Users, Briefcase, Mail, ChevronDown, ChevronRight, Gem,
  Milestone, Link2, FileText, MessageSquare
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

  // Collapsible Dropdown States
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [inquiryExpanded, setInquiryExpanded] = useState(false);
  const [careersExpanded, setCareersExpanded] = useState(false);

  // Group 1: Products
  const productItems = [
    { href: "/goldtype", label: "Gold Type", icon: Coins },
    { href: "/category", label: "Category", icon: Layers },
    { href: "/collectiontype", label: "CollectionType", icon: Gem },
    { href: "/products", label: "Products", icon: Sparkles },
  ];

  // Group 2: Inquiry
  const inquiryItems = [
    { href: "/build-connection", label: "Become a Partner", icon: Link2 },
    { href: "/contact-inquiry", label: "Contact Inquiries", icon: Mail },
  ];

  // Group 3: Careers
  const careerItems = [
    { href: "/careers", label: "Careers", icon: Briefcase },
    { href: "/career-application", label: "Career Applications", icon: FileText },
  ];

  // Standalone items
  const standaloneItems = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/zar-journey", label: "The Zar Journey", icon: Milestone },
    { href: "/clientele", label: "Clientele", icon: UserCheck },
    { href: "/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/users", label: "Users", icon: Users, adminOnly: true },
  ];

  // Auto-expand dropdowns if any child page is active
  useEffect(() => {
    const isProductsActive = productItems.some(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (isProductsActive) setProductsExpanded(true);

    const isInquiryActive = inquiryItems.some(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (isInquiryActive) setInquiryExpanded(true);

    const isCareersActive = careerItems.some(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (isCareersActive) setCareersExpanded(true);
  }, [pathname]);

  const isProductsActive = productItems.some(item => 
    pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  const isInquiryActive = inquiryItems.some(item => 
    pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  const isCareersActive = careerItems.some(item => 
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
          const active = pathname === "/dashboard";
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

        {/* Products Dropdown */}
        <div>
          <button
            onClick={() => setProductsExpanded(!productsExpanded)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition ${
              isProductsActive 
                ? "bg-zar-bg text-black border border-[#eee7dd]/50" 
                : "text-zar-muted hover:bg-zar-bg hover:text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Products</span>
            </div>
            {productsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <AnimatePresence initial={false}>
            {productsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4 mt-1 space-y-1"
              >
                {productItems.map((item) => {
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

        {/* Inquiry Dropdown */}
        <div>
          <button
            onClick={() => setInquiryExpanded(!inquiryExpanded)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition ${
              isInquiryActive 
                ? "bg-zar-bg text-black border border-[#eee7dd]/50" 
                : "text-zar-muted hover:bg-zar-bg hover:text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>Inquiry</span>
            </div>
            {inquiryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <AnimatePresence initial={false}>
            {inquiryExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4 mt-1 space-y-1"
              >
                {inquiryItems.map((item) => {
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

        {/* Careers Dropdown */}
        <div>
          <button
            onClick={() => setCareersExpanded(!careersExpanded)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition ${
              isCareersActive 
                ? "bg-zar-bg text-black border border-[#eee7dd]/50" 
                : "text-zar-muted hover:bg-zar-bg hover:text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase size={18} />
              <span>Careers</span>
            </div>
            {careersExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <AnimatePresence initial={false}>
            {careersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4 mt-1 space-y-1"
              >
                {careerItems.map((item) => {
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

      {/* Logout Button */}
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
