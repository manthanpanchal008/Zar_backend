"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";

export function useAuthGuard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !getToken()) {
      router.replace("/login");
    }
  }, [loading, router]);

  return { user, loading };
}
