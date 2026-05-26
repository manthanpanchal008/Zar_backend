"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/users/UserForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { AdminUser } from "@/types";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      api.get(`/api/admin/users/${params.id}`)
        .then((response) => setEditUser(response.data.user))
        .catch(() => setError("Failed to load user details."));
    }
  }, [params.id]);

  return (
    <AdminLayout title="Edit User">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Edit User Details</h2>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : editUser ? (
            <UserForm editUser={editUser} />
          ) : (
            <p className="text-zar-muted">Loading user details...</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
