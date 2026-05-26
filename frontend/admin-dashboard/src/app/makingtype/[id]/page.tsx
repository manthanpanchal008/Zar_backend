"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MakingTypeForm } from "@/components/makingtype/MakingTypeForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { MakingType } from "@/types";

export default function EditMakingTypePage() {
  const { id } = useParams();
  const [makingType, setMakingType] = useState<MakingType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/admin/making-types/${id}`).then((res) => {
      setMakingType(res.data.item);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Edit Making Type">
        <div className="text-center py-8 text-zar-muted">Loading making type details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Making Type">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Making Type</h2>
        </CardHeader>
        <CardBody>
          {makingType ? <MakingTypeForm makingType={makingType} /> : <div className="text-red-600">Making type not found.</div>}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
