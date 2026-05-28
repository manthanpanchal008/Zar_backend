"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type ResetPasswordValues = {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    defaultValues: {
      email: emailParam,
      resetToken: tokenParam,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (emailParam) setValue("email", emailParam);
    if (tokenParam) setValue("resetToken", tokenParam);
  }, [emailParam, tokenParam, setValue]);

  const newPassword = watch("password");

  async function onSubmit(values: ResetPasswordValues) {
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/api/auth/reset-password", {
        email: values.email,
        resetToken: values.resetToken,
        password: values.password,
      });
      setSuccess(response.data.message || "Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. Please request a new OTP.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-[#eee7dd] bg-white p-8 shadow-panel">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zar-bg">
          <img src="/Zar_backend/icon-1.png" alt="Zar Jewels logo" className="h-12 w-12 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-black">Zar Jewels</h1>
        <p className="mt-1 text-sm text-zar-muted">Reset Password</p>
      </div>

      {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div> : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden inputs to capture credentials */}
        <input type="hidden" {...register("email")} />
        <input type="hidden" {...register("resetToken")} />

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">New Password</span>
          <input
            className="form-input"
            placeholder="Min 6 characters"
            type="password"
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Password must be at least 6 characters long" }
            })}
          />
          {errors.password ? <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Confirm Password</span>
          <input
            className="form-input"
            placeholder="Confirm new password"
            type="password"
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: (value) => value === newPassword || "Passwords do not match"
            })}
          />
          {errors.confirmPassword ? <span className="mt-1 block text-xs text-red-600">{errors.confirmPassword.message}</span> : null}
        </label>

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Resetting password..." : "Reset Password"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-zar-muted hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen bg-zar-bg">
      <div className="flex w-full flex-col lg:flex-row">
        {/* Left Side Container */}
        <section className="flex flex-1 items-center justify-center bg-zar-bg px-4 py-12 lg:px-8 xl:px-12">
          <Suspense fallback={<div className="text-zar-muted">Loading...</div>}>
            <ResetPasswordContent />
          </Suspense>
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
