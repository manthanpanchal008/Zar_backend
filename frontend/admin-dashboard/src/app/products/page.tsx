"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { API_BASE_URL, api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { Product } from "@/types";

function imageSrc(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function ProductsPage() {
  const { user } = useAuthGuard();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/products");
      setProducts(response.data.items || []);
    } catch (_error) {
      setError("Unable to load products right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      await loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete product.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const columns = [
    {
      key: "product_images",
      label: "Image",
      render: (item: Product) => {
        const cover = item.product_images?.[0];
        return cover ? (
          <img alt={item.title} className="h-14 w-14 rounded-lg object-cover border border-[#eee7dd]" src={imageSrc(cover)} />
        ) : (
          <span className="text-zar-muted">-</span>
        );
      },
    },
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (item: Product) => <span className="font-mono text-xs font-semibold text-zar-title">{item.sku || "-"}</span>,
    },
    {
      key: "title",
      label: "Product Title",
      sortable: true,
      render: (item: Product) => <span className="font-semibold text-black">{item.title || "-"}</span>,
    },
    {
      key: "collection_name",
      label: "Collection Name",
      sortable: true,
    },
    {
      key: "category_name",
      label: "Category",
      sortable: true,
      render: (item: Product) => <span>{item.category_name || "-"}</span>,
    },
    {
      key: "gold_type_name",
      label: "Gold Type",
      sortable: true,
      render: (item: Product) => <span>{item.gold_type_name || "-"}</span>,
    },
    {
      key: "making_type_name",
      label: "Making Type",
      sortable: true,
      render: (item: Product) => <span>{item.making_type_name || "-"}</span>,
    },
    ...(isAdmin
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (item: Product) => (
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                  href={`/products/${item.id}/edit`}
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={() => deleteProduct(item.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <AdminLayout title="Products">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Product Catalog</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/products/new"
            >
              Add Product
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading products...</div>
          ) : (
            <DataTable
              columns={columns}
              data={products}
              searchKeys={["title", "collection_name", "category_name", "gold_type_name", "making_type_name", "sku"]}
              searchPlaceholder="Search products by title, collection, category, gold type, making type or SKU..."
              emptyMessage="No products found."
            />
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
