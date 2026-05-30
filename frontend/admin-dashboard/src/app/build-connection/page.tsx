"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { formatDate } from "@/lib/utils";
import type { BuildConnection } from "@/types";

export default function BecomeAPartnerPage() {
  const { user } = useAuthGuard();
  const [connections, setConnections] = useState<BuildConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<BuildConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadConnections() {
    setLoading(true);
    try {
      const response = await api.get("/api/build-connection");
      setConnections(response.data.items || []);
    } catch (_error) {
      setError("Unable to load partner inquiries right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteConnection(id: number) {
    if (!window.confirm("Are you sure you want to delete this partner inquiry?")) return;
    try {
      await api.delete(`/api/build-connection/${id}`);
      await loadConnections();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete partner inquiry.");
    }
  }

  useEffect(() => {
    loadConnections();
  }, []);

  const columns = [
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      render: (item: BuildConnection) => <span className="font-semibold text-black">{item.fullName}</span>,
    },
    {
      key: "companyName",
      label: "Company",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "country",
      label: "Country",
      sortable: true,
    },
    {
      key: "state",
      label: "State",
      sortable: true,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (item: BuildConnection) => {
        return formatDate(item.created_at);
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: BuildConnection) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedConnection(item)}>
            View
          </Button>
          {isAdmin && (
            <Button variant="danger" className="px-3 py-2" onClick={() => deleteConnection(item.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Become a Partner">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Become a Partner Inquiries</h2>
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted animate-pulse">Loading inquiries...</div>
          ) : (
            <DataTable
              columns={columns}
              data={connections}
              searchKeys={["fullName", "companyName", "email", "country", "state", "city", "pincode", "contact", "category"]}
              searchPlaceholder="Search inquiries..."
              emptyMessage="No partner inquiries found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedConnection}
        onClose={() => setSelectedConnection(null)}
        title="Become a Partner Details"
      >
        {selectedConnection && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Full Name</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.fullName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Company Name</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.companyName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Email</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.email}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Contact Number</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.contact}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Country</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.country}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">State</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.state || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">City</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.city || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Pincode</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.pincode}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Category</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.category}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Referred By</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedConnection.referredBy || "-"}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Company Website</h4>
                <p className="mt-1 text-sm font-medium text-black">
                  {selectedConnection.companyWebsite ? (
                    <a
                      href={selectedConnection.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zar-gold hover:underline font-semibold"
                    >
                      {selectedConnection.companyWebsite}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Message</h4>
              <div className="mt-1 text-sm text-black border border-[#eee7dd] rounded-lg p-3 bg-[#faf9f6] whitespace-pre-line">
                {selectedConnection.message || "No message provided."}
              </div>
            </div>
            {selectedConnection.created_at && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Submitted On</h4>
                <p className="mt-1 text-sm text-black font-medium">
                  {formatDate(selectedConnection.created_at)}
                </p>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
