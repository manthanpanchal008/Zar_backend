"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Gem,
  Calendar,
  MessageSquare,
  Briefcase,
  Hammer,
  Coins,
  Layers,
  UserCheck,
  Users,
  Settings,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

type DashboardStats = {
  products: number;
  categories: number;
  collectionTypes: number;
  goldTypes: number;
  users: number;
  orders: number;
  events: number;
  testimonials: number;
  careers: number;
  manufacturing?: number;
};

type DashboardCardsProps = {
  stats: DashboardStats | null;
  loading: boolean;
};

const cardDefinitions = [
  { key: "goldTypes", label: "Gold Types", icon: Coins, href: "/goldtype", color: "bg-[#fee2e2] text-red-600" },
  { key: "categories", label: "Categories", icon: Layers, href: "/category", color: "bg-[#e0e7ff] text-indigo-600" },
  { key: "collectionTypes", label: "Collection Types", icon: Gem, href: "/collectiontype", color: "bg-[#ffedd5] text-orange-600" },
  { key: "products", label: "Products", icon: Sparkles, href: "/products", color: "bg-[#e0f2fe] text-sky-600" },
  { key: "events", label: "Events", icon: Calendar, href: "/events", color: "bg-[#fef3c7] text-amber-600" },
  { key: "testimonials", label: "Testimonials", icon: MessageSquare, href: "/testimonials", color: "bg-[#dcfce7] text-emerald-600" },
  { key: "careers", label: "Careers", icon: Briefcase, href: "/careers", color: "bg-[#f3e8ff] text-purple-600" },
  { key: "users", label: "Users / Admin Staff", icon: Users, href: "/users", color: "bg-[#f1f5f9] text-slate-600" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
} as const;

export function DashboardCards({ stats, loading }: DashboardCardsProps) {
  const router = useRouter();

  if (loading || !stats) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cardDefinitions.map((_, idx) => (
          <Card key={idx} className="animate-pulse border border-[#eee7dd] bg-white">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="space-y-3 w-2/3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {cardDefinitions.map((card) => {
        const Icon = card.icon;
        const count = stats[card.key as keyof DashboardStats] ?? 0;

        return (
          <motion.div
            key={card.key}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => router.push(card.href)}
            className="cursor-pointer"
          >
            <Card className="h-full border border-[#eee7dd] bg-white hover:shadow-md transition-shadow duration-200">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-semibold text-zar-muted truncate">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold text-black tracking-tight">{count}</p>
                  </div>
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon size={22} />
                  </span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
