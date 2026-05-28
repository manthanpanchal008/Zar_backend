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
import type { Career } from "@/types";

export default function CareersPage() {
  const { user } = useAuthGuard();
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadCareers() {
    setLoading(true);
    try {
      const response = await api.get("/api/careers");
      setCareers(response.data.items || []);
    } catch (_error) {
      setError("Unable to load career listings right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCareer(id: number) {
    if (!window.confirm("Are you sure you want to delete this career post?")) return;
    try {
      await api.delete(`/api/careers/${id}`);
      await loadCareers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete career post.");
    }
  }

  useEffect(() => {
    loadCareers();
  }, []);

  const columns = [
    {
      key: "position",
      label: "Position",
      sortable: true,
      render: (item: Career) => <span className="font-semibold text-black">{item.position}</span>,
    },
    {
      key: "experience",
      label: "Experience",
      sortable: true,
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
    },
    {
      key: "jobDescription",
      label: "Description",
      render: (item: Career) => {
        // Strip HTML tags from description for the summary view
        const cleanText = item.jobDescription ? item.jobDescription.replace(/<[^>]*>/g, "") : "";
        return <span className="text-zar-muted line-clamp-2 max-w-xs">{cleanText || "-"}</span>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Career) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedCareer(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/careers/${item.id}/edit`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteCareer(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Careers">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Careers</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/careers/new"
            >
              Add Job Opening
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading careers...</div>
          ) : (
            <DataTable
              columns={columns}
              data={careers}
              searchKeys={["position", "experience", "location", "jobDescription"]}
              searchPlaceholder="Search careers..."
              emptyMessage="No job openings found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedCareer}
        onClose={() => setSelectedCareer(null)}
        title="Career Details"
      >
        {selectedCareer && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Position</h4>
              <p className="mt-1 text-sm font-medium text-black">{selectedCareer.position}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Experience</h4>
              <p className="mt-1 text-sm font-medium text-black">{selectedCareer.experience}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Location</h4>
              <p className="mt-1 text-sm font-medium text-black">{selectedCareer.location}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Job Description</h4>
              <div
                className="mt-1 text-sm text-black rich-editor-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedCareer.jobDescription }}
              />
            </div>
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
