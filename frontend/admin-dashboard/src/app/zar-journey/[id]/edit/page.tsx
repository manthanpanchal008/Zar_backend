"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ZarJourneyForm } from "@/components/zar-journey/ZarJourneyForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { ZarJourney } from "@/types";

export default function EditZarJourneyPage() {
  const params = useParams<{ id: string }>();
  const [journey, setJourney] = useState<ZarJourney | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      api.get(`/api/zar-journey/${params.id}`)
        .then((response) => setJourney(response.data.item))
        .catch(() => setError("Failed to load journey milestone details."));
    }
  }, [params.id]);

  return (
    <AdminLayout title="Edit Journey Milestone">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Journey Milestone</h2>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : journey ? (
            <ZarJourneyForm journey={journey} />
          ) : (
            <p className="text-zar-muted animate-pulse">Loading journey milestone details...</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
