"use client";

import { useEffect, useState } from "react";
import { Gem, ShoppingBag, Tags, Users } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { api } from "@/lib/api";

type DashboardStats = {
  products: number;
  categories: number;
  subcategories: number;
  users: number;
  orders: number;
};

const cards = [
  { key: "products", label: "Products", icon: Gem },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "users", label: "Admin Staff", icon: Users },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ products: 0, categories: 0, subcategories: 0, users: 0, orders: 0 });

  useEffect(() => {
    api.get("/api/admin/dashboard").then((response) => setStats(response.data.stats));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zar-muted">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold text-black">{stats[card.key]}</p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f3eadb] text-zar-title">
                    <Icon size={23} />
                  </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
}
