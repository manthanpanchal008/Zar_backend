"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CareerForm } from "@/components/careers/CareerForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Career } from "@/types";

export default function EditCareerPage() {
  const params = useParams<{ id: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      api.get(`/api/careers/${params.id}`)
        .then((response) => setCareer(response.data.item))
        .catch(() => setError("Failed to load career listing details."));
    }
  }, [params.id]);

  return (
    <AdminLayout title="Edit Job Opening">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Job Opening</h2>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : career ? (
            <CareerForm career={career} />
          ) : (
            <p className="text-zar-muted">Loading career listing details...</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
