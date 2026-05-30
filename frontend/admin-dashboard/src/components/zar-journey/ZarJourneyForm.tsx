"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { ZarJourney } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

type ZarJourneyFormValues = {
  year: string;
  description: string;
  image: FileList;
};

export function ZarJourneyForm({ journey }: { journey?: ZarJourney }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ZarJourneyFormValues>({
    defaultValues: {
      year: journey?.year ? String(journey.year) : "",
      description: journey?.description || "",
    },
  });

  const watchImage = watch("image");
  const hasNewImage = watchImage && watchImage.length > 0;

  const onInvalid = () => {
    toast.error("Please fill in all required fields.");
  };

  async function onSubmit(values: ZarJourneyFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("year", values.year.trim());
    formData.append("description", values.description.trim());

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (journey) {
        await api.put(`/api/zar-journey/${journey.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/zar-journey", formData, uploadConfig());
      }
      router.push("/zar-journey");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save journey details.");
    }
  }

  const imageUrl = journey?.image_url || (journey?.image ? `/uploads/zar_journey/${journey.image}` : null);

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
          <span className="mb-1 block text-sm font-semibold text-zar-title">Year *</span>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 2024"
            {...register("year", { 
              required: "Year is required",
              min: { value: 1900, message: "Year must be at least 1900" },
              max: { value: 2100, message: "Year cannot exceed 2100" }
            })}
          />
          {errors.year ? <span className="text-xs text-red-600">{errors.year.message}</span> : null}
        </label>

        <div className="block md:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Image {journey ? "" : "*"}</span>
          <Controller
            control={control}
            name="image"
            rules={{ required: journey ? false : "Image is required" }}
            render={({ field }) => (
              <ImageUpload
                onChange={field.onChange}
                error={errors.image?.message}
              />
            )}
          />
        </div>

        {imageUrl && !hasNewImage && (
          <div className="space-y-1 md:col-span-2">
            <span className="block text-xs font-semibold text-zar-muted">Current Image:</span>
            <img
              src={imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`}
              alt="Journey preview"
              className="h-20 w-20 object-cover rounded-lg border border-[#eee7dd]"
            />
          </div>
        )}

        <div className="block md:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Description *</span>
          <Controller
            control={control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write description about this journey milestone..."
              />
            )}
          />
          {errors.description ? <span className="text-xs text-red-600">{errors.description.message}</span> : null}
        </div>

        <div className="flex gap-2 pt-2 md:col-span-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Journey"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/zar-journey")}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
