"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
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
            <span className="text-xs text-zar-muted">{item.event_image?.length || 0} image(s)</span>
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
    ...(isAdmin
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (item: Event) => (
              <div className="flex gap-2">
                <Link
                  className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                  href={`/events/${item.id}`}
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={() => deleteEvent(item.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
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
    </AdminLayout>
  );
}
