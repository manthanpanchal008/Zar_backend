"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { EventForm } from "@/components/events/EventForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Event } from "@/types";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      api.get(`/api/admin/events/${params.id}`)
        .then((response) => setEvent(response.data.event))
        .catch(() => setError("Failed to load event details."));
    }
  }, [params.id]);

  return (
    <AdminLayout title="Edit Event">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Exhibition / Show</h2>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : event ? (
            <EventForm event={event} />
          ) : (
            <p className="text-zar-muted">Loading event details...</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
