"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
import { API_BASE_URL, api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { formatDate } from "@/lib/utils";
import type { CareerApplication } from "@/types";
import toast from "react-hot-toast";

export default function CareerApplicationPage() {
  const { user } = useAuthGuard();
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadApplications() {
    setLoading(true);
    try {
      const response = await api.get("/api/career-application");
      setApplications(response.data.items || []);
    } catch (_err) {
      setError("Unable to load career applications right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteApplication(id: number) {
    if (!window.confirm("Are you sure you want to delete this career application?")) return;
    try {
      await api.delete(`/api/career-application/${id}`);
      toast.success("Career application deleted successfully.");
      await loadApplications();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete career application.");
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const columns = [
    {
      key: "fullName",
      label: "Applicant",
      sortable: true,
      render: (item: CareerApplication) => <span className="font-semibold text-black">{item.fullName}</span>,
    },
    {
      key: "companyName",
      label: "Current Company",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
    },
    {
      key: "workExperience",
      label: "Experience",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (item: CareerApplication) => {
        return formatDate(item.created_at);
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: CareerApplication) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedApplication(item)}>
            View
          </Button>
          {isAdmin && (
            <Button variant="danger" className="px-3 py-2" onClick={() => deleteApplication(item.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Career Applications">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Career Applications</h2>
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted animate-pulse">Loading applications...</div>
          ) : (
            <DataTable
              columns={columns}
              data={applications}
              searchKeys={["fullName", "companyName", "role", "email", "contactNumber"]}
              searchPlaceholder="Search applications..."
              emptyMessage="No career applications found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title="Career Application Details"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Applicant Name</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedApplication.fullName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Current Company</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedApplication.companyName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Applied Role</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedApplication.role}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Experience</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedApplication.workExperience}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Email Address</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedApplication.email}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Contact Number</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedApplication.contactNumber}</p>
              </div>
              {selectedApplication.cvFile && (
                <div className="col-span-2 border-t border-[#eee7dd] pt-4">
                  <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">CV Attachment</h4>
                  <a
                    href={
                      selectedApplication.cvFile.startsWith("http")
                        ? selectedApplication.cvFile
                        : `${API_BASE_URL}/uploads/cvs/${selectedApplication.cvFile}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-zar-gold px-4 py-2.5 text-sm font-bold text-black hover:bg-[#c4a46e] transition shadow-sm"
                  >
                    Download CV File
                  </a>
                </div>
              )}
            </div>
            {selectedApplication.created_at && (
              <div className="border-t border-[#eee7dd] pt-4">
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Submitted On</h4>
                <p className="mt-1 text-sm text-black font-medium">
                  {formatDate(selectedApplication.created_at)}
                </p>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
