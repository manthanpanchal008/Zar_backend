"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { Testimonial } from "@/types";

type TestimonialFormValues = {
  name: string;
  comment: string;
  position: string;
  companyName: string;
};

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    defaultValues: {
      name: testimonial?.name || "",
      comment: testimonial?.comment || "",
      position: testimonial?.position || "",
      companyName: testimonial?.companyName || "",
    },
  });

  const onInvalid = () => {
    toast.error("Please fill in all required fields.");
  };

  async function onSubmit(values: TestimonialFormValues) {
    setError("");
    const payload = {
      name: values.name.trim(),
      comment: values.comment.trim(),
      position: values.position.trim() || null,
      companyName: values.companyName.trim() || null,
    };

    try {
      if (testimonial) {
        await api.put(`/api/testimonials/${testimonial.id}`, payload);
      } else {
        await api.post("/api/testimonials", payload);
      }
      router.push("/testimonials");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save testimonial.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <form className="grid gap-6 grid-cols-1 md:grid-cols-2" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        {error ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
            {error}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Client Name *</span>
          <input
            className="form-input"
            placeholder="e.g. John Doe"
            {...register("name", { required: "Client name is required" })}
          />
          {errors.name ? <span className="text-xs text-red-600">{errors.name.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Position</span>
          <input
            className="form-input"
            placeholder="e.g. Founder & CEO"
            {...register("position")}
          />
        </label>

        <label className="block md:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Company Name</span>
          <input
            className="form-input"
            placeholder="e.g. Acme Corp"
            {...register("companyName")}
          />
        </label>

        <div className="block md:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Comment *</span>
          <Controller
            control={control}
            name="comment"
            rules={{ required: "Comment is required" }}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="What did they say about our brand?"
              />
            )}
          />
          {errors.comment ? <span className="text-xs text-red-600">{errors.comment.message}</span> : null}
        </div>

        <div className="flex gap-2 pt-2 md:col-span-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Testimonial"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/testimonials")}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
