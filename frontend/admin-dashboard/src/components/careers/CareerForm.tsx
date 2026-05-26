"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type { Career } from "@/types";

type CareerFormValues = {
  position: string;
  experience: string;
  location: string;
  jobDescription: string;
};

export function CareerForm({ career }: { career?: Career }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CareerFormValues>({
    defaultValues: {
      position: career?.position || "",
      experience: career?.experience || "",
      location: career?.location || "",
      jobDescription: career?.jobDescription || "",
    },
  });

  async function onSubmit(values: CareerFormValues) {
    setError("");
    const payload = {
      position: values.position.trim(),
      experience: values.experience.trim(),
      location: values.location.trim(),
      jobDescription: values.jobDescription.trim(),
    };

    try {
      if (career) {
        await api.put(`/api/careers/${career.id}`, payload);
      } else {
        await api.post("/api/careers", payload);
      }
      router.push("/careers");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save career post.");
    }
  }

  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <label className="block">
         <span className="mb-1 block text-sm font-semibold text-zar-title">Job Position *</span>
         <input
           className="form-input"
           placeholder="e.g. Senior QA Engineer"
           {...register("position", { required: "Job position is required" })}
         />
         {errors.position ? <span className="text-xs text-red-600">{errors.position.message}</span> : null}
      </label>

      <label className="block">
         <span className="mb-1 block text-sm font-semibold text-zar-title">Experience Required *</span>
         <input
           className="form-input"
           placeholder="e.g. 5+ Years"
           {...register("experience", { required: "Experience is required" })}
         />
         {errors.experience ? <span className="text-xs text-red-600">{errors.experience.message}</span> : null}
      </label>

      <label className="block">
         <span className="mb-1 block text-sm font-semibold text-zar-title">Location *</span>
         <input
           className="form-input"
           placeholder="e.g. Mumbai, India (On-site)"
           {...register("location", { required: "Location is required" })}
         />
         {errors.location ? <span className="text-xs text-red-600">{errors.location.message}</span> : null}
      </label>

      <div className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Job Description *</span>
        <Controller
          control={control}
          name="jobDescription"
          rules={{ required: "Job description is required" }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Detailed job description, responsibilities, and requirements..."
            />
          )}
        />
        {errors.jobDescription ? <span className="text-xs text-red-600">{errors.jobDescription.message}</span> : null}
      </div>

      <div className="flex gap-2 pt-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save Career"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/careers")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
