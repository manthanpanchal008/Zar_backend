"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { Testimonial } from "@/types";

export default function TestimonialsPage() {
  const { user } = useAuthGuard();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadTestimonials() {
    setLoading(true);
    try {
      const response = await api.get("/api/testimonials");
      setTestimonials(response.data.items || []);
    } catch (_error) {
      setError("Unable to load testimonials right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTestimonial(id: number) {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/api/testimonials/${id}`);
      await loadTestimonials();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete testimonial.");
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item: Testimonial) => <span className="font-semibold text-black">{item.name}</span>,
    },
    {
      key: "position",
      label: "Position",
      sortable: true,
      render: (item: Testimonial) => <span>{item.position || "-"}</span>,
    },
    {
      key: "companyName",
      label: "Company",
      sortable: true,
      render: (item: Testimonial) => <span>{item.companyName || "-"}</span>,
    },
    {
      key: "comment",
      label: "Comment",
      render: (item: Testimonial) => (
        <span className="text-zar-muted line-clamp-2 max-w-xs">{item.comment}</span>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (item: Testimonial) => (
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                  href={`/testimonials/${item.id}/edit`}
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={() => deleteTestimonial(item.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <AdminLayout title="Testimonials">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Testimonials</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/testimonials/new"
            >
              Add Testimonial
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading testimonials...</div>
          ) : (
            <DataTable
              columns={columns}
              data={testimonials}
              searchKeys={["name", "position", "companyName", "comment"]}
              searchPlaceholder="Search testimonials..."
              emptyMessage="No testimonials found."
            />
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
