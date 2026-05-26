"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { Career } from "@/types";

export default function CareersPage() {
  const { user } = useAuthGuard();
  const [careers, setCareers] = useState<Career[]>([]);
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
    ...(isAdmin
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (item: Career) => (
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                  href={`/careers/${item.id}/edit`}
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={() => deleteCareer(item.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
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
    </AdminLayout>
  );
}
