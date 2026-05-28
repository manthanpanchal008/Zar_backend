"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type VerifyOtpValues = {
  email: string;
  otp: string;
};

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpValues>({
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/api/auth/forgot-password", { email: emailParam });
      setSuccess(response.data.message || "A new code has been sent.");
      setCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend code.");
    }
  }

  async function onSubmit(values: VerifyOtpValues) {
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/api/auth/verify-otp", values);
      setSuccess(response.data.message || "Code verified successfully!");
      
      const token = response.data.resetToken;
      setTimeout(() => {
        router.push(
          `/reset-password?email=${encodeURIComponent(values.email)}&token=${encodeURIComponent(token)}`
        );
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Verification failed. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-[#eee7dd] bg-white p-8 shadow-panel">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zar-bg">
          <img src="/Zar_backend/icon-1.png" alt="Zar Jewels logo" className="h-12 w-12 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-black">Zar Jewels</h1>
        <p className="mt-1 text-sm text-zar-muted">Verify Code</p>
      </div>

      {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div> : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Email</span>
          <input
            className="form-input bg-gray-50 cursor-not-allowed"
            type="email"
            readOnly
            {...register("email", { required: "Email is required" })}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Verification Code (OTP)</span>
          <input
            className="form-input text-center tracking-widest font-bold"
            placeholder="123456"
            maxLength={6}
            type="text"
            {...register("otp", { 
              required: "Verification code is required", 
              minLength: { value: 6, message: "Code must be 6 digits" } 
            })}
          />
          {errors.otp ? <span className="mt-1 block text-xs text-red-600">{errors.otp.message}</span> : null}
        </label>

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          type="button"
          className={`font-semibold transition ${
            cooldown > 0 
              ? "text-zar-muted cursor-not-allowed" 
              : "text-[#c4a46e] hover:underline"
          }`}
        >
          {cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Code"}
        </button>
        <Link href="/login" className="font-semibold text-zar-muted hover:underline">
          Cancel
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen bg-zar-bg">
      <div className="flex w-full flex-col lg:flex-row">
        {/* Left Side Container */}
        <section className="flex flex-1 items-center justify-center bg-zar-bg px-4 py-12 lg:px-8 xl:px-12">
          <Suspense fallback={<div className="text-zar-muted">Loading...</div>}>
            <VerifyOtpContent />
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
