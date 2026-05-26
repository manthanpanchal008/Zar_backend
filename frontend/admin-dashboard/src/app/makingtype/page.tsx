"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { API_BASE_URL, api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { MakingType } from "@/types";

function imageSrc(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function MakingTypesPage() {
  const { user } = useAuthGuard();
  const [items, setItems] = useState<MakingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadMakingTypes() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/making-types");
      setItems(response.data.items || []);
    } catch (_error) {
      setError("Unable to load making types.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMakingType(id: number) {
    if (!window.confirm("Delete this making type?")) return;
    try {
      await api.delete(`/api/admin/making-types/${id}`);
      await loadMakingTypes();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete making type.");
    }
  }

  async function toggleStatus(id: number) {
    try {
      await api.put(`/api/admin/making-types/${id}/toggle`);
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
    loadMakingTypes();
  }, []);

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item: MakingType) => {
        const cover = item.image_url || (item.image ? `/uploads/makingtypes/${item.image}` : null);
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
      render: (item: MakingType) => <span className="font-semibold text-black">{item.name}</span>,
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (item: MakingType) => (
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
            render: (item: MakingType) => (
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                  href={`/makingtype/${item.id}`}
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={() => deleteMakingType(item.id)}>
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
    <AdminLayout title="Making Types">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Making Types</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/makingtype/new"
            >
              Add Making Type
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading making types...</div>
          ) : (
            <DataTable
              columns={columns}
              data={items}
              searchKeys={["name"]}
              searchPlaceholder="Search making types..."
              filters={filters}
              emptyMessage="No making types found."
            />
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
