"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <AdminLayout title="Settings">
      <Card>
        <CardHeader><h2 className="font-bold text-zar-title">Settings</h2></CardHeader>
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-1 block text-sm font-semibold text-zar-title">Brand Accent</span>
              <input className="form-input" readOnly value="#D0B480" />
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-zar-title">API Base URL</span>
              <input className="form-input" readOnly value={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"} />
            </label>
          </div>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
