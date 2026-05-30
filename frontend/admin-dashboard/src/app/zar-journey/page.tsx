"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
import { API_BASE_URL, api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { ZarJourney } from "@/types";

export default function ZarJourneyPage() {
  const { user } = useAuthGuard();
  const [journeys, setJourneys] = useState<ZarJourney[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<ZarJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadJourneys() {
    setLoading(true);
    try {
      const response = await api.get("/api/zar-journey");
      setJourneys(response.data.items || []);
    } catch (_error) {
      setError("Unable to load journey list right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteJourney(id: number) {
    if (!window.confirm("Are you sure you want to delete this journey milestone?")) return;
    try {
      await api.delete(`/api/zar-journey/${id}`);
      await loadJourneys();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete journey.");
    }
  }

  useEffect(() => {
    loadJourneys();
  }, []);

  const columns = [
    {
      key: "year",
      label: "Year",
      sortable: true,
      render: (item: ZarJourney) => <span className="font-semibold text-black">{item.year}</span>,
    },
    {
      key: "image",
      label: "Image",
      render: (item: ZarJourney) => {
        const imageUrl = item.image_url || (item.image ? `/uploads/zar_journey/${item.image}` : null);
        if (!imageUrl) return "-";
        return (
          <img
            src={imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`}
            alt={`Milestone ${item.year}`}
            className="h-10 w-10 rounded object-cover border border-[#eee7dd]"
          />
        );
      },
    },
    {
      key: "description",
      label: "Description",
      render: (item: ZarJourney) => {
        const cleanText = item.description ? item.description.replace(/<[^>]*>/g, "") : "";
        return <span className="text-zar-muted line-clamp-2 max-w-xs">{cleanText || "-"}</span>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: ZarJourney) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedJourney(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/zar-journey/${item.id}/edit`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteJourney(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="The Zar Journey">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">The Zar Journey</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/zar-journey/new"
            >
              Add Journey Milestone
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted animate-pulse">Loading journeys...</div>
          ) : (
            <DataTable
              columns={columns}
              data={journeys}
              searchKeys={["year", "description"]}
              searchPlaceholder="Search milestones..."
              emptyMessage="No journey milestones found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedJourney}
        onClose={() => setSelectedJourney(null)}
        title="Journey Milestone Details"
      >
        {selectedJourney && (
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Year</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedJourney.year}</p>
              </div>
              {selectedJourney.image && (
                <div>
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-1">Image</h4>
                  <img
                    src={
                      (selectedJourney.image_url || `/uploads/zar_journey/${selectedJourney.image}`).startsWith("http")
                        ? selectedJourney.image_url || `/uploads/zar_journey/${selectedJourney.image}`
                        : `${API_BASE_URL}${selectedJourney.image_url || `/uploads/zar_journey/${selectedJourney.image}`}`
                    }
                    alt={`Milestone ${selectedJourney.year}`}
                    className="h-28 w-28 rounded object-cover border border-[#eee7dd]"
                  />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Description</h4>
              <div
                className="mt-1 text-sm text-black rich-editor-content prose prose-sm max-w-none border border-[#eee7dd] rounded-lg p-3 bg-[#faf9f6]"
                dangerouslySetInnerHTML={{ __html: selectedJourney.description }}
              />
            </div>
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
