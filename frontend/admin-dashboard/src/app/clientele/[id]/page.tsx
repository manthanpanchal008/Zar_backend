"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ClienteleForm } from "@/components/clientele/ClienteleForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Clientele } from "@/types";

export default function EditClientelePage() {
  const { id } = useParams();
  const [clientele, setClientele] = useState<Clientele | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/api/admin/clientele/${id}`)
      .then((response) => {
        setClientele(response.data.clientele);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load clientele details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Edit Clientele">
        <div className="text-center py-8 text-zar-muted">Loading clientele details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Clientele">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Clientele</h2>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : clientele ? (
            <ClienteleForm clientele={clientele} />
          ) : (
            <p className="text-zar-muted">Clientele not found.</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
