"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { formatDate } from "@/lib/utils";
import type { ContactInquiry } from "@/types";
import toast from "react-hot-toast";

export default function ContactInquiryPage() {
  const { user } = useAuthGuard();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadInquiries() {
    setLoading(true);
    try {
      const response = await api.get("/api/contact-inquiry");
      setInquiries(response.data.items || []);
    } catch (_err) {
      setError("Unable to load contact inquiries right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteInquiry(id: number) {
    if (!window.confirm("Are you sure you want to delete this contact inquiry?")) return;
    try {
      await api.delete(`/api/contact-inquiry/${id}`);
      toast.success("Contact inquiry deleted successfully.");
      await loadInquiries();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete contact inquiry.");
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  const columns = [
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      render: (item: ContactInquiry) => <span className="font-semibold text-black">{item.fullName}</span>,
    },
    {
      key: "companyName",
      label: "Company",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "contactNumber",
      label: "Contact",
      sortable: true,
    },
    {
      key: "inquiryType",
      label: "Inquiry Type",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (item: ContactInquiry) => {
        return formatDate(item.created_at);
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: ContactInquiry) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedInquiry(item)}>
            View
          </Button>
          {isAdmin && (
            <Button variant="danger" className="px-3 py-2" onClick={() => deleteInquiry(item.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Contact Inquiries">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Contact Inquiries</h2>
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted animate-pulse">Loading inquiries...</div>
          ) : (
            <DataTable
              columns={columns}
              data={inquiries}
              searchKeys={["fullName", "companyName", "email", "contactNumber", "inquiryType"]}
              searchPlaceholder="Search inquiries..."
              emptyMessage="No contact inquiries found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Contact Inquiry Details"
      >
        {selectedInquiry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Full Name</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedInquiry.fullName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Company Name</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedInquiry.companyName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Email</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedInquiry.email}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Contact Number</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedInquiry.contactNumber}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Inquiry Type</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedInquiry.inquiryType}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Message</h4>
              <div className="mt-1 text-sm text-black border border-[#eee7dd] rounded-lg p-3 bg-[#faf9f6] whitespace-pre-line">
                {selectedInquiry.message || "No message provided."}
              </div>
            </div>
            {selectedInquiry.created_at && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Submitted On</h4>
                <p className="mt-1 text-sm text-black font-medium">
                  {formatDate(selectedInquiry.created_at)}
                </p>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
