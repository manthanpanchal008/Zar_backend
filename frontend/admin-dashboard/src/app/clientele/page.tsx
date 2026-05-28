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
import type { Clientele } from "@/types";

function imageSrc(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function ClientelePage() {
  const { user } = useAuthGuard();
  const [clientele, setClientele] = useState<Clientele[]>([]);
  const [selectedClient, setSelectedClient] = useState<Clientele | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadClientele() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/clientele");
      setClientele(response.data.items || []);
    } catch (_error) {
      setError("Unable to load clientele right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteClientele(id: number) {
    if (!window.confirm("Delete this clientele item?")) return;
    try {
      await api.delete(`/api/admin/clientele/${id}`);
      await loadClientele();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete clientele item.");
    }
  }

  useEffect(() => {
    loadClientele();
  }, []);

  const columns = [
    {
      key: "clientele_image",
      label: "Image",
      render: (item: Clientele) => {
        const cover = item.image_url || (item.clientele_image ? `/uploads/clientele/${item.clientele_image}` : null);
        return cover ? (
          <img alt={item.clientele_title} className="h-11 w-11 rounded-lg object-cover border border-[#eee7dd]" src={imageSrc(cover)} />
        ) : (
          <span className="text-zar-muted">-</span>
        );
      },
    },
    {
      key: "clientele_title",
      label: "Title",
      sortable: true,
      render: (item: Clientele) => <span className="font-semibold text-black">{item.clientele_title}</span>,
    },
    {
      key: "country",
      label: "Country",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Clientele) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedClient(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/clientele/${item.id}`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteClientele(item.id)}>
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
      key: "country",
      label: "Country",
      options: [
        { label: "India", value: "India" },
        { label: "UAE", value: "UAE" },
      ],
    },
  ];

  return (
    <AdminLayout title="Clientele">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Clientele</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/clientele/new"
            >
              Add Clientele
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading clientele...</div>
          ) : (
            <DataTable
              columns={columns}
              data={clientele}
              searchKeys={["clientele_title", "country"]}
              searchPlaceholder="Search clientele..."
              filters={filters}
              emptyMessage="No clientele found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        title="Clientele Details"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Clientele Image */}
              <div className="flex-shrink-0">
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">Image</h4>
                {selectedClient.image_url || selectedClient.clientele_image ? (
                  <div className="h-40 w-40 rounded-xl overflow-hidden border border-[#eee7dd] bg-gray-50 flex items-center justify-center">
                    <img
                      alt={selectedClient.clientele_title}
                      src={imageSrc(selectedClient.image_url || `/uploads/clientele/${selectedClient.clientele_image}`)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 rounded-xl border border-dashed border-[#eee7dd] bg-[#fdfcfa] flex items-center justify-center text-zar-muted">
                    No Image
                  </div>
                )}
              </div>

              {/* Clientele Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Title</h4>
                  <p className="mt-1 text-base font-bold text-black">{selectedClient.clientele_title}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Country</h4>
                  <p className="mt-1 text-sm font-medium text-black">{selectedClient.country || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
