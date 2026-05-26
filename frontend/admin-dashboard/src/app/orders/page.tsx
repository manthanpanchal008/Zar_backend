"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const [items, setItems] = useState<unknown[]>([]);

  useEffect(() => {
    api.get("/api/admin/orders").then((response) => setItems(response.data.items));
  }, []);

  return (
    <AdminLayout title="Orders">
      <Card>
        <CardHeader><h2 className="font-bold text-zar-title">Orders</h2></CardHeader>
        <CardBody>
          {items.length ? (
            <pre className="text-sm text-zar-muted">{JSON.stringify(items, null, 2)}</pre>
          ) : (
            <div className="rounded-lg border border-dashed border-[#e7dfd3] p-8 text-center text-zar-muted">
              No orders module is connected yet. This page is ready for the orders API when the table is added.
            </div>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
