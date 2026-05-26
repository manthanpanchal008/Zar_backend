"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { AdminUser } from "@/types";

export default function UsersPage() {
  const { user: currentUser } = useAuthGuard();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/users");
      setUsers(response.data.users || []);
    } catch (_error) {
      setError("Unable to load users right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: number) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item: AdminUser) => <span className="font-semibold text-black">{item.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (item: AdminUser) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
            item.role === "admin"
              ? "bg-[#D0B480]/20 text-[#a38274] border border-[#D0B480]/30"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: AdminUser) => {
        const isSelf = String(item.id) === String(currentUser?.id);
        return (
          <div className="flex gap-2">
            <Link
              className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
              href={`/users/${item.id}`}
            >
              Edit
            </Link>
            {isSelf ? (
              <span className="inline-flex items-center text-xs text-zar-muted font-semibold bg-zar-bg px-3 py-2 rounded-lg border border-[#eee7dd]">
                You
              </span>
            ) : (
              <Button variant="danger" onClick={() => deleteUser(item.id)}>
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout title="Users">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Admin and Staff Accounts</h2>
          <Link
            className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
            href="/users/new"
          >
            Add New User
          </Link>
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading users...</div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              searchKeys={["name", "email", "role"]}
              searchPlaceholder="Search users..."
              emptyMessage="No users found."
            />
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
