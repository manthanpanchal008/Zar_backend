"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { Testimonial } from "@/types";

export default function TestimonialsPage() {
  const { user } = useAuthGuard();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
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
    {
      key: "actions",
      label: "Actions",
      render: (item: Testimonial) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedTestimonial(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/testimonials/${item.id}/edit`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteTestimonial(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
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

      <ViewModal
        isOpen={!!selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
        title="Testimonial Details"
      >
        {selectedTestimonial && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Name</h4>
              <p className="mt-1 text-sm font-medium text-black">{selectedTestimonial.name}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Comment</h4>
              <div
                className="mt-1 text-sm text-black rich-editor-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedTestimonial.comment }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Position</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedTestimonial.position || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Company Name</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedTestimonial.companyName || "-"}</p>
              </div>
            </div>
            {selectedTestimonial.created_at && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Created Date</h4>
                <p className="mt-1 text-sm font-medium text-black">
                  {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
