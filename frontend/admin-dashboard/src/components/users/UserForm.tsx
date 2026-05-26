"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { AdminUser } from "@/types";

type UserFormValues = {
  name: string;
  email: string;
  role: "admin" | "staff";
  password?: string;
};

export function UserForm({ editUser }: { editUser?: AdminUser }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: {
      name: editUser?.name || "",
      email: editUser?.email || "",
      role: editUser?.role || "staff",
      password: "",
    },
  });

  async function onSubmit(values: UserFormValues) {
    setError("");
    const payload: Record<string, any> = {
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
    };

    if (values.password) {
      payload.password = values.password;
    }

    try {
      if (editUser) {
        await api.put(`/api/admin/users/${editUser.id}`, payload);
      } else {
        await api.post("/api/admin/users", payload);
      }
      router.push("/users");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save user.");
    }
  }

  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Full Name *</span>
        <input
          className="form-input"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name ? <span className="text-xs text-red-600">{errors.name.message}</span> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Email Address *</span>
        <input
          className="form-input"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Role *</span>
        <select className="form-input" {...register("role", { required: "Role is required" })}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role ? <span className="text-xs text-red-600">{errors.role.message}</span> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">
          {editUser ? "New Password" : "Password *"}
        </span>
        <input
          className="form-input"
          type="password"
          placeholder={editUser ? "Leave blank to keep current password" : "Min 6 characters"}
          {...register("password", {
            required: editUser ? false : "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
      </label>

      <div className="flex gap-2 pt-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save User"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
