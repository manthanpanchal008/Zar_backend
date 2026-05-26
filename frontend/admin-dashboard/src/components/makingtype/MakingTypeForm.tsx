"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { MakingType } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

type MakingTypeFormValues = {
  name: string;
  is_active: boolean;
  image: FileList;
};

export function MakingTypeForm({ makingType }: { makingType?: MakingType }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MakingTypeFormValues>({
    defaultValues: {
      name: makingType?.name || "",
      is_active: makingType ? !!makingType.is_active : true,
    },
  });

  async function onSubmit(values: MakingTypeFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("is_active", values.is_active ? "1" : "0");

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      if (makingType) {
        await api.put(`/api/admin/making-types/${makingType.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/admin/making-types", formData, uploadConfig());
      }
      router.push("/makingtype");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save making type.");
    }
  }

  const imageUrl = makingType?.image_url || (makingType?.image ? `/uploads/makingtypes/${makingType.image}` : null);

  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Making Type Name *</span>
        <input
          className="form-input"
          placeholder="e.g. Handmade, Plain, Machine Made"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name ? <span className="text-xs text-red-600">{errors.name.message}</span> : null}
      </label>

      <label className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          className="rounded border-[#e7dfd3] text-zar-gold focus:ring-zar-gold"
          {...register("is_active")}
        />
        <span className="text-sm font-semibold text-zar-title">Is Active</span>
      </label>

      <div className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Image {makingType ? "" : "*"}</span>
        <Controller
          control={control}
          name="image"
          rules={{ required: makingType ? false : "Image is required" }}
          render={({ field }) => (
            <ImageUpload
              onChange={field.onChange}
              error={errors.image?.message}
            />
          )}
        />
      </div>

      {imageUrl && (
        <div className="space-y-1">
          <span className="block text-xs font-semibold text-zar-muted">Current Image:</span>
          <img
            src={imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`}
            alt="Making type preview"
            className="h-20 w-20 object-cover rounded-lg border border-[#eee7dd]"
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save Making Type"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/makingtype")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
