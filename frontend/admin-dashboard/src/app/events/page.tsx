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
import type { Event } from "@/types";

function imageSrc(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function EventsPage() {
  const { user } = useAuthGuard();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadEvents() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/events");
      setEvents(response.data.items || []);
    } catch (_error) {
      setError("Unable to load events right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id: number) {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/api/admin/events/${id}`);
      await loadEvents();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete event.");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const columns = [
    {
      key: "event_image",
      label: "Images",
      render: (item: Event) => {
        const cover = item.image_urls?.[0] || (item.event_image?.[0] ? `/uploads/events/${item.event_image[0]}` : null);
        return cover ? (
          <div className="flex items-center gap-2">
            <img alt={item.title} className="h-11 w-11 rounded-lg object-cover" src={imageSrc(cover)} />
            <span className="text-xs text-zar-muted">{item.event_image?.length || 0} </span>
          </div>
        ) : (
          <span className="text-zar-muted">-</span>
        );
      },
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (item: Event) => (
        <div>
          <div className="font-semibold text-black">{item.title}</div>
          {item.description && (
            <p className="text-xs text-zar-muted truncate max-w-[200px]">
              {item.description.replace(/<[^>]*>/g, "").trim()}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
    },
    {
      key: "start_date",
      label: "Start Date",
      sortable: true,
      render: (item: Event) =>
        item.start_date
          ? new Date(item.start_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    {
      key: "end_date",
      label: "End Date",
      sortable: true,
      render: (item: Event) =>
        item.end_date
          ? new Date(item.end_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Event) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold text-white capitalize ${
            item.status === "upcoming" ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Event) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedEvent(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/events/${item.id}`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteEvent(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Upcoming", value: "upcoming" },
        { label: "Past", value: "past" },
      ],
    },
  ];

  return (
    <AdminLayout title="Events">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Exhibitions & Shows</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/events/new"
            >
              Add New Event
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading events...</div>
          ) : (
            <DataTable
              columns={columns}
              data={events}
              searchKeys={["title", "location", "description"]}
              searchPlaceholder="Search events..."
              filters={filters}
              emptyMessage="No events found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-[#eee7dd] pb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">{selectedEvent.title}</h2>
                <p className="text-sm text-zar-muted mt-1">{selectedEvent.location || "No location specified"}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white capitalize ${
                  selectedEvent.status === "upcoming" ? "bg-green-600" : "bg-gray-500"
                }`}
              >
                {selectedEvent.status}
              </span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 bg-[#fdfcfa] p-4 rounded-xl border border-[#eee7dd]">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Start Date</h4>
                <p className="mt-1 text-sm font-medium text-black">
                  {selectedEvent.start_date
                    ? new Date(selectedEvent.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">End Date</h4>
                <p className="mt-1 text-sm font-medium text-black">
                  {selectedEvent.end_date
                    ? new Date(selectedEvent.end_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            {/* Image Gallery */}
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">Event Images</h4>
              {selectedEvent.event_image && selectedEvent.event_image.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedEvent.event_image.map((img, idx) => {
                    const url = selectedEvent.image_urls?.[idx] || `/uploads/events/${img}`;
                    return (
                      <a
                        key={idx}
                        href={imageSrc(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square rounded-lg border border-[#eee7dd] overflow-hidden bg-gray-50 flex items-center justify-center hover:opacity-90 transition"
                      >
                        <img
                          alt={`${selectedEvent.title} - ${idx + 1}`}
                          src={imageSrc(url)}
                          className="h-full w-full object-cover"
                        />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zar-muted">No images uploaded.</p>
              )}
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Description</h4>
                <div
                  className="mt-1 text-sm text-black rich-editor-content prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                />
              </div>
            )}

            {/* Event URL */}
            {selectedEvent.event_url && (
              <div className="pt-2 border-t border-[#eee7dd]">
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-1">Event Link</h4>
                <a
                  href={selectedEvent.event_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-zar-gold hover:underline"
                >
                  Visit Event Website &rarr;
                </a>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
