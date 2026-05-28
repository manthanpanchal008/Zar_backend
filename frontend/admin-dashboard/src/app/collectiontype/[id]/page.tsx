"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CollectionTypeForm } from "@/components/collectiontype/CollectionTypeForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { CollectionType } from "@/types";

export default function EditCollectionTypePage() {
  const { id } = useParams();
  const [collectionType, setCollectionType] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/admin/collection-types/${id}`).then((res) => {
      setCollectionType(res.data.item);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Edit Collection Type">
        <div className="text-center py-8 text-zar-muted">Loading collection type details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Collection Type">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Collection Type</h2>
        </CardHeader>
        <CardBody>
          {collectionType ? <CollectionTypeForm collectionType={collectionType} /> : <div className="text-red-600">Collection type not found.</div>}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
