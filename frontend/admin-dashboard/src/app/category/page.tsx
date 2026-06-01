"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryNew | null>(null);
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
      key: "goldTypeName",
      label: "Gold Type",
      sortable: true,
      render: (item: CategoryNew) => <span className="text-zar-title">{item.goldTypeName || "-"}</span>,
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
    {
      key: "actions",
      label: "Actions",
      render: (item: CategoryNew) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedCategory(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/category/${item.id}`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteCategory(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
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

      <ViewModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title="Category Details"
      >
        {selectedCategory && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Category Image */}
              <div className="flex-shrink-0">
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">Category Image</h4>
                {selectedCategory.image_url || selectedCategory.image ? (
                  <div className="h-40 w-40 rounded-xl overflow-hidden border border-[#eee7dd] bg-gray-50 flex items-center justify-center">
                    <img
                      alt={selectedCategory.name}
                      src={imageSrc(selectedCategory.image_url || `/uploads/categories/${selectedCategory.image}`)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 rounded-xl border border-dashed border-[#eee7dd] bg-[#fdfcfa] flex items-center justify-center text-zar-muted">
                    No Image
                  </div>
                )}
              </div>

              {/* Category Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Category Name</h4>
                  <p className="mt-1 text-base font-bold text-black">{selectedCategory.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Gold Type</h4>
                  <p className="mt-1 text-sm text-black">{selectedCategory.goldTypeName || "-"}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Slug</h4>
                  <p className="mt-1 text-sm font-mono text-zar-title">{selectedCategory.slug}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Status</h4>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      selectedCategory.isActive
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {selectedCategory.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
