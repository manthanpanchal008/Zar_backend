import axios from "axios";
import { clearAuth, getToken } from "./auth";
import toast from "react-hot-toast";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Display a loading toast for POST, PUT, DELETE write operations
  if (config.method && ["post", "put", "delete"].includes(config.method.toLowerCase())) {
    const isLogin = config.url?.includes("/auth/login");
    const loadingMessage = isLogin ? "Signing in..." : "Saving changes...";
    const toastId = toast.loading(loadingMessage);
    config.headers["X-Toast-Id"] = toastId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const toastId = response.config.headers["X-Toast-Id"];
    if (toastId) {
      let msg = "Success!";
      if (response.data?.message) {
        msg = response.data.message;
      } else if (response.config.url?.includes("/auth/login")) {
        msg = "Signed in successfully.";
      } else if (response.config.method?.toLowerCase() === "post") {
        msg = "Created successfully.";
      } else if (response.config.method?.toLowerCase() === "put") {
        msg = "Updated successfully.";
      } else if (response.config.method?.toLowerCase() === "delete") {
        msg = "Deleted successfully.";
      }
      toast.success(msg, { id: toastId });
    }
    return response;
  },
  (error) => {
    const toastId = error.config?.headers?.["X-Toast-Id"];
    const errorMsg = error.response?.data?.error || error.response?.data?.message || "An error occurred.";

    if (toastId) {
      toast.error(errorMsg, { id: toastId });
    } else if (error.response?.status !== 401 && error.config?.method?.toLowerCase() !== "get") {
      toast.error(errorMsg);
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAuth();
      if (!window.location.pathname.startsWith("/Zar_backend/login")) {
        window.location.assign("/Zar_backend/login");
      }
    }

    return Promise.reject(error);
  },
);

export function uploadConfig() {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
}
