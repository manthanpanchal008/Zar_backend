"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { API_BASE_URL, api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { CategoryNew } from "@/types";

function imageSrc(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function CategoriesPage() {
  const { user } = useAuthGuard();
  const [items, setItems] = useState<CategoryNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadCategories() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/categories");
      setItems(response.data.items || []);
    } catch (_error) {
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      await loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete category.");
    }
  }

  async function toggleStatus(id: number) {
    try {
      await api.put(`/api/admin/categories/${id}/toggle`);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_active: item.is_active ? 0 : 1, isActive: !item.isActive } : item
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item: CategoryNew) => {
        const cover = item.image_url || (item.image ? `/uploads/categories/${item.image}` : null);
        return cover ? (
          <img alt={item.name} className="h-11 w-11 rounded-lg object-cover border border-[#eee7dd]" src={imageSrc(cover)} />
        ) : (
          <span className="text-zar-muted">-</span>
        );
      },
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item: CategoryNew) => <span className="font-semibold text-black">{item.name}</span>,
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (item: CategoryNew) => (
        <button
          onClick={() => toggleStatus(item.id)}
          disabled={!isAdmin}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition ${
            item.isActive
              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (item: CategoryNew) => (
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                  href={`/category/${item.id}`}
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={() => deleteCategory(item.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const filters = [
    {
      key: "isActive",
      label: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  return (
    <AdminLayout title="Categories">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Categories</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/category/new"
            >
              Add Category
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading categories...</div>
          ) : (
            <DataTable
              columns={columns}
              data={items}
              searchKeys={["name", "slug"]}
              searchPlaceholder="Search categories..."
              filters={filters}
              emptyMessage="No categories found."
            />
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
