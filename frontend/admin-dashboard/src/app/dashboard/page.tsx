"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { api } from "@/lib/api";

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
  manufacturing: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/api/admin/dashboard")
      .then((response) => {
        if (response.data?.success) {
          setStats(response.data.stats);
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard statistics:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-black">Welcome back!</h2>
          <p className="text-sm text-zar-muted">Here is the current overview of your Zar Jewels store.</p>
        </div>
        <DashboardCards stats={stats} loading={loading} />
      </div>
    </AdminLayout>
  );
}
