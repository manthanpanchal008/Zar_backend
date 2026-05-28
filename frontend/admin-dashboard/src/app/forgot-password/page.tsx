"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type ForgotPasswordValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>();

  async function onSubmit(values: ForgotPasswordValues) {
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/api/auth/forgot-password", values);
      setSuccess(response.data.message);
      // Wait 1.5 seconds and redirect to verify OTP screen with email query parameter
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
      }, 1500);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Failed to send code. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen bg-zar-bg">
      <div className="flex w-full flex-col lg:flex-row">
        {/* Form Card Container */}
        <section className="flex flex-1 items-center justify-center bg-zar-bg px-4 py-12 lg:px-8 xl:px-12">
          <div className="w-full max-w-md rounded-lg border border-[#eee7dd] bg-white p-8 shadow-panel">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zar-bg">
                <img src="/Zar_backend/icon-1.png" alt="Zar Jewels logo" className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-black">Zar Jewels</h1>
              <p className="mt-1 text-sm text-zar-muted">Forgot Password</p>
            </div>

            {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            {success ? <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div> : null}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-zar-title">Registered Email</span>
                <input
                  className="form-input"
                  placeholder="admin@example.com"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span> : null}
              </label>

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending code..." : "Request Reset OTP"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="font-semibold text-[#c4a46e] hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </section>

        {/* Right side background banner */}
        <section className="hidden lg:block lg:w-1/2 xl:w-3/5 relative">
          <img
            src="/Zar_backend/login-image.jpg"
            alt="Login Banner"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </section>
      </div>
    </main>
  );
}
