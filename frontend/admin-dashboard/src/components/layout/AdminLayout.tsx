"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export function AdminLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, loading } = useAuthGuard();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zar-bg text-zar-muted">Loading admin panel...</div>;
  }

  return (
    <div className="min-h-screen bg-zar-bg">
      <Sidebar user={user} />
      <main className="lg:pl-72">
        <Navbar title={title} user={user} />
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
