"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CategoryForm } from "@/components/category/CategoryForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { CategoryNew } from "@/types";

export default function EditCategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<CategoryNew | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/admin/categories/${id}`).then((res) => {
      setCategory(res.data.item);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Edit Category">
        <div className="text-center py-8 text-zar-muted">Loading category details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Category">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Category</h2>
        </CardHeader>
        <CardBody>
          {category ? <CategoryForm category={category} /> : <div className="text-red-600">Category not found.</div>}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
