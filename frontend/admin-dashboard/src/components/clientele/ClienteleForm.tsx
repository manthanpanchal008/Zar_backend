"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { Clientele } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

type ClienteleFormValues = {
  clientele_title: string;
  country: string;
  clientele_image: FileList;
};

export function ClienteleForm({ clientele }: { clientele?: Clientele }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ClienteleFormValues>({
    defaultValues: {
      clientele_title: clientele?.clientele_title || "",
      country: clientele?.country || "India",
    },
  });

  async function onSubmit(values: ClienteleFormValues) {
    setError("");
    const formData = new FormData();
    formData.append("clientele_title", values.clientele_title.trim());
    formData.append("country", values.country);

    if (values.clientele_image?.[0]) {
      formData.append("clientele_image", values.clientele_image[0]);
    }

    try {
      if (clientele) {
        await api.put(`/api/admin/clientele/${clientele.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/admin/clientele", formData, uploadConfig());
      }
      router.push("/clientele");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save clientele item.");
    }
  }

  const imageUrl = clientele?.image_url || (clientele?.clientele_image ? `/uploads/clientele/${clientele.clientele_image}` : null);

  return (
    <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Clientele Title *</span>
        <input
          className="form-input"
          {...register("clientele_title", { required: "Clientele title is required" })}
        />
        {errors.clientele_title ? <span className="text-xs text-red-600">{errors.clientele_title.message}</span> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Country *</span>
        <select className="form-input" {...register("country", { required: "Country is required" })}>
          <option value="India">India</option>
          <option value="UAE">UAE</option>
        </select>
        {errors.country ? <span className="text-xs text-red-600">{errors.country.message}</span> : null}
      </label>

      <div className="block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Clientele Image {clientele ? "" : "*"}</span>
        <Controller
          control={control}
          name="clientele_image"
          rules={{ required: clientele ? false : "Clientele image is required" }}
          render={({ field }) => (
            <ImageUpload
              onChange={field.onChange}
              error={errors.clientele_image?.message}
            />
          )}
        />
      </div>

      {imageUrl && (
        <div className="space-y-1">
          <span className="block text-xs font-semibold text-zar-muted">Current Image:</span>
          <img
            src={imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`}
            alt="Clientele logo preview"
            className="h-20 w-20 object-cover rounded-lg border border-[#eee7dd]"
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save Clientele"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/clientele")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
