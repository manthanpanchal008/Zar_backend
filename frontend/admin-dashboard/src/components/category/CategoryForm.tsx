"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { CategoryNew } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

type CategoryFormValues = {
  name: string;
  slug: string;
  is_active: boolean;
  image: FileList;
  goldTypeId: string;
};

export function CategoryForm({ category }: { category?: CategoryNew }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [goldTypes, setGoldTypes] = useState<Array<{ id: number; name: string }>>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      is_active: category ? !!category.is_active : true,
      goldTypeId: category?.goldTypeId ? String(category.goldTypeId) : "",
    },
  });

  const name = watch("name");
  const watchImage = watch("image");
  const hasNewImage = watchImage && watchImage.length > 0;

  useEffect(() => {
    api.get("/api/admin/gold-type-options")
      .then((res) => {
        setGoldTypes(res.data.items || []);
      })
      .catch((err) => {
        console.error("Failed to load gold types:", err);
      });
  }, []);

  const onInvalid = () => {
    toast.error("Please fill in all required fields.");
  };

  // Auto-generate slug from name on change
  useEffect(() => {
    if (category) return; // Do not auto-overwrite slug on edit unless user explicitly edits it
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [name, setValue, category]);

  async function onSubmit(values: CategoryFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("slug", values.slug.trim());
    formData.append("is_active", values.is_active ? "1" : "0");
    formData.append("goldTypeId", values.goldTypeId);

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (category) {
        await api.put(`/api/admin/categories/${category.id}`, formData, uploadConfig());
        toast.success("Category updated successfully.");
      } else {
        await api.post("/api/admin/categories", formData, uploadConfig());
        toast.success("Category created successfully.");
      }
      router.push("/category");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save category.");
    }
  }

  const imageUrl = category?.image_url || (category?.image ? `/uploads/categories/${category.image}` : null);

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
          <span className="mb-1 block text-sm font-semibold text-zar-title">Gold Type *</span>
          <select
            className="form-input"
            {...register("goldTypeId", { required: "Gold Type is required" })}
          >
            <option value="">Select Gold Type</option>
            {goldTypes.map((gt) => (
              <option key={gt.id} value={gt.id}>
                {gt.name}
              </option>
            ))}
          </select>
          {errors.goldTypeId ? <span className="text-xs text-red-600">{errors.goldTypeId.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Category Name *</span>
          <input
            className="form-input"
            placeholder="e.g. Bangles, Ring, Mangalsutra"
            {...register("name", { required: "Category name is required" })}
          />
          {errors.name ? <span className="text-xs text-red-600">{errors.name.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Slug *</span>
          <input
            className="form-input"
            placeholder="e.g. bangles"
            {...register("slug", { required: "Slug is required" })}
          />
          {errors.slug ? <span className="text-xs text-red-600">{errors.slug.message}</span> : null}
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
          <span className="mb-1 block text-sm font-semibold text-zar-title">Image {category ? "" : "*"}</span>
          <Controller
            control={control}
            name="image"
            rules={{ required: category ? false : "Image is required" }}
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
              alt="Category preview"
              className="h-20 w-20 object-cover rounded-lg border border-[#eee7dd]"
            />
          </div>
        )}

        <div className="flex gap-2 pt-2 md:col-span-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Category"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/category")}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
