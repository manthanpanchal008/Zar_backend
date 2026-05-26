"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GoldTypeForm } from "@/components/goldtype/GoldTypeForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { GoldType } from "@/types";

export default function EditGoldTypePage() {
  const { id } = useParams();
  const [goldType, setGoldType] = useState<GoldType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/admin/gold-types/${id}`).then((res) => {
      setGoldType(res.data.item);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Edit Gold Type">
        <div className="text-center py-8 text-zar-muted">Loading gold type details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Gold Type">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Gold Type</h2>
        </CardHeader>
        <CardBody>
          {goldType ? <GoldTypeForm goldType={goldType} /> : <div className="text-red-600">Gold type not found.</div>}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
