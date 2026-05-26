"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ClienteleForm } from "@/components/clientele/ClienteleForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Clientele } from "@/types";

export default function EditClientelePage() {
  const params = useParams<{ id: string }>();
  const [clientele, setClientele] = useState<Clientele | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      api.get(`/api/admin/clientele/${params.id}`)
        .then((response) => setClientele(response.data.clientele))
        .catch(() => setError("Failed to load clientele details."));
    }
  }, [params.id]);

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
            <p className="text-zar-muted">Loading clientele details...</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
