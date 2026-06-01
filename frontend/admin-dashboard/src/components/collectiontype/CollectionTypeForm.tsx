"use client";

import { useEffect, useState } from "react";
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
  goldTypeId: string;
  categoryId: string;
};

export function CollectionTypeForm({ collectionType }: { collectionType?: CollectionType }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [goldTypes, setGoldTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [allCategories, setAllCategories] = useState<Array<{ id: number; name: string; gold_type_id: number }>>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CollectionTypeFormValues>({
    defaultValues: {
      name: collectionType?.name || "",
      is_active: collectionType ? !!collectionType.is_active : true,
      goldTypeId: collectionType?.goldTypeId ? String(collectionType.goldTypeId) : "",
      categoryId: collectionType?.categoryId ? String(collectionType.categoryId) : "",
    },
  });

  const selectedGoldTypeId = watch("goldTypeId");
  const watchImage = watch("image");
  const hasNewImage = watchImage && watchImage.length > 0;

  useEffect(() => {
    api.get("/api/admin/gold-type-options").then((res) => {
      setGoldTypes(res.data.items || []);
    });
    api.get("/api/admin/category-options").then((res) => {
      setAllCategories(res.data.categories || []);
    });
  }, []);

  const filteredCategories = allCategories.filter(
    (cat) => cat.gold_type_id === Number(selectedGoldTypeId)
  );

  // Auto-reset category value if it doesn't belong to the newly selected gold type
  useEffect(() => {
    const currentCatId = watch("categoryId");
    if (currentCatId && selectedGoldTypeId) {
      const belongs = filteredCategories.some((cat) => String(cat.id) === currentCatId);
      if (!belongs) {
        setValue("categoryId", "");
      }
    }
  }, [selectedGoldTypeId, filteredCategories, setValue, watch]);

  const onInvalid = () => {
    toast.error("Please fill in all required fields.");
  };

  async function onSubmit(values: CollectionTypeFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("is_active", values.is_active ? "1" : "0");
    formData.append("goldTypeId", values.goldTypeId);
    formData.append("categoryId", values.categoryId);

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (collectionType) {
        await api.put(`/api/admin/collection-types/${collectionType.id}`, formData, uploadConfig());
        toast.success("Collection type updated successfully.");
      } else {
        await api.post("/api/admin/collection-types", formData, uploadConfig());
        toast.success("Collection type created successfully.");
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
          <span className="mb-1 block text-sm font-semibold text-zar-title">Category *</span>
          <select
            className="form-input"
            disabled={!selectedGoldTypeId}
            {...register("categoryId", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? <span className="text-xs text-red-600">{errors.categoryId.message}</span> : null}
        </label>

        <label className="block md:col-span-2">
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
