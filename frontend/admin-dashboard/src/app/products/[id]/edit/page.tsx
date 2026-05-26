"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/api/admin/products/${params.id}`).then((response) => setProduct(response.data.product));
  }, [params.id]);

  return (
    <AdminLayout title="Edit Product">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Product</h2>
        </CardHeader>
        <CardBody>{product ? <ProductForm product={product} /> : <p className="text-zar-muted">Loading product...</p>}</CardBody>
      </Card>
    </AdminLayout>
  );
}
