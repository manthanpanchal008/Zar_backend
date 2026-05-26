"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  async function onSubmit(values: LoginFormValues) {
    setError("");
    try {
      const response = await api.post("/api/auth/login", values);
      setAuth(response.data.token, response.data.user);
      router.replace("/dashboard");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Login failed. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zar-bg px-4">
      <section className="w-full max-w-md rounded-lg border border-[#eee7dd] bg-white p-8 shadow-panel">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zar-bg">
            <img src="/icon-1.png" alt="Zar Jeweller logo" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-black">Zar Jeweller</h1>
          <p className="text-sm text-zar-muted">Admin dashboard login</p>
        </div>

        {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-zar-title">Email</span>
            <input
              className="form-input"
              placeholder="admin@example.com"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-zar-title">Password</span>
            <input
              className="form-input"
              placeholder="Enter password"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password ? <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span> : null}
          </label>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </section>
    </main>
  );
}
