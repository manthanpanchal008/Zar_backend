"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { GoldType } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

type GoldTypeFormValues = {
  name: string;
  purity: string;
  is_active: boolean;
  image: FileList;
};

export function GoldTypeForm({ goldType }: { goldType?: GoldType }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GoldTypeFormValues>({
    defaultValues: {
      name: goldType?.name || "",
      purity: goldType?.purity ? String(goldType.purity) : "",
      is_active: goldType ? !!goldType.is_active : true,
    },
  });

  const watchImage = watch("image");
  const hasNewImage = watchImage && watchImage.length > 0;

  const onInvalid = () => {
    toast.error("Please fill in all required fields.");
  };

  async function onSubmit(values: GoldTypeFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("purity", values.purity.trim());
    formData.append("is_active", values.is_active ? "1" : "0");

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (goldType) {
        await api.put(`/api/admin/gold-types/${goldType.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/admin/gold-types", formData, uploadConfig());
      }
      router.push("/goldtype");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save gold type.");
    }
  }

  const imageUrl = goldType?.image_url || (goldType?.image ? `/uploads/goldtypes/${goldType.image}` : null);

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
          <span className="mb-1 block text-sm font-semibold text-zar-title">Gold Type Name *</span>
          <input
            className="form-input"
            placeholder="e.g. 22K"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name ? <span className="text-xs text-red-600">{errors.name.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Purity (%) *</span>
          <input
            className="form-input"
            placeholder="e.g. 91.6"
            type="number"
            step="0.01"
            {...register("purity", { required: "Purity is required" })}
          />
          {errors.purity ? <span className="text-xs text-red-600">{errors.purity.message}</span> : null}
        </label>

        <label className="flex items-center gap-2 py-1 md:col-span-2">
          <input
            type="checkbox"
            className="rounded border-[#e7dfd3] text-zar-gold focus:ring-zar-gold h-4 w-4"
            {...register("is_active")}
          />
          <span className="text-sm font-semibold text-zar-title">Is Active</span>
        </label>

        <div className="block md:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Image {goldType ? "" : "*"}</span>
          <Controller
            control={control}
            name="image"
            rules={{ required: goldType ? false : "Image is required" }}
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
              alt="Gold type preview"
              className="h-20 w-20 object-cover rounded-lg border border-[#eee7dd]"
            />
          </div>
        )}

        <div className="flex gap-2 pt-2 md:col-span-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Gold Type"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/goldtype")}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
