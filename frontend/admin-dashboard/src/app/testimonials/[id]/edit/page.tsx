"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Testimonial } from "@/types";

export default function EditTestimonialPage() {
  const params = useParams<{ id: string }>();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      api.get(`/api/testimonials/${params.id}`)
        .then((response) => setTestimonial(response.data.item))
        .catch(() => setError("Failed to load testimonial details."));
    }
  }, [params.id]);

  return (
    <AdminLayout title="Edit Testimonial">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit Testimonial</h2>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : testimonial ? (
            <TestimonialForm testimonial={testimonial} />
          ) : (
            <p className="text-zar-muted">Loading testimonial details...</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
