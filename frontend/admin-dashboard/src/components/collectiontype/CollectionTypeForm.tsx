"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { CollectionType } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

type CollectionTypeFormValues = {
  name: string;
  is_active: boolean;
  image: FileList;
};

export function CollectionTypeForm({ collectionType }: { collectionType?: CollectionType }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CollectionTypeFormValues>({
    defaultValues: {
      name: collectionType?.name || "",
      is_active: collectionType ? !!collectionType.is_active : true,
    },
  });

  const watchImage = watch("image");
  const hasNewImage = watchImage && watchImage.length > 0;

  const onInvalid = () => {
    toast.error("Please fill in all required fields.");
  };

  async function onSubmit(values: CollectionTypeFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("is_active", values.is_active ? "1" : "0");

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (collectionType) {
        await api.put(`/api/admin/collection-types/${collectionType.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/admin/collection-types", formData, uploadConfig());
      }
      router.push("/collectiontype");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save collection type.");
    }
  }

  const imageUrl = collectionType?.image_url || (collectionType?.image ? `/uploads/makingtypes/${collectionType.image}` : null);

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

        <label className="block md:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Collection Type Name *</span>
          <input
            className="form-input"
            placeholder="e.g. Handmade, Plain, Machine Made"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name ? <span className="text-xs text-red-600">{errors.name.message}</span> : null}
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
          <span className="mb-1 block text-sm font-semibold text-zar-title">Image {collectionType ? "" : "*"}</span>
          <Controller
            control={control}
            name="image"
            rules={{ required: collectionType ? false : "Image is required" }}
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
              alt="Collection type preview"
              className="h-20 w-20 object-cover rounded-lg border border-[#eee7dd]"
            />
          </div>
        )}

        <div className="flex gap-2 pt-2 md:col-span-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Collection Type"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/collectiontype")}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
