"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getStoredUser, getToken, clearAuth } from "@/lib/auth";
import type { AdminUser } from "@/types";

type AuthContextType = {
  user: AdminUser | null;
  loading: boolean;
  setUser: (user: AdminUser | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setLoading(false);
    }

    api
      .get("/api/auth/me")
      .then((response) => {
        setUser(response.data.user);
        window.sessionStorage.setItem("zar_admin_user", JSON.stringify(response.data.user));
      })
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
