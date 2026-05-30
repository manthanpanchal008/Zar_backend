"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zar-bg text-zar-muted">
      Redirecting to dashboard...
    </div>
  );
}
