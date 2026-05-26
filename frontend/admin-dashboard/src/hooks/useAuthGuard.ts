"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearAuth, getStoredUser, getToken } from "@/lib/auth";
import type { AdminUser } from "@/types";

export function useAuthGuard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        clearAuth();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return { user, loading };
}
