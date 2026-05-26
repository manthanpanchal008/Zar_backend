"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { api, uploadConfig } from "@/lib/api";
import type { Category } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

type CategoryFormValues = {
  collection_type: "18k" | "22k";
  category: string;
  collection_url: string;
  image: FileList;
};

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>();

  async function load() {
    const response = await api.get("/api/admin/categories");
    setItems(response.data.items);
  }

  async function onSubmit(values: CategoryFormValues) {
    const formData = new FormData();
    formData.append("collection_type", values.collection_type);
    formData.append("category", values.category);
    formData.append("collection_url", values.collection_url || "");
    if (values.image?.[0]) formData.append("image", values.image[0]);
    await api.post("/api/admin/categories", formData, uploadConfig());
    reset();
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout title="Categories">
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><h2 className="font-bold text-zar-title">Add Category</h2></CardHeader>
          <CardBody>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-zar-title">Collection Type</span>
                <select className="form-input" {...register("collection_type", { required: "Collection type is required" })}>
                  <option value="">Select type</option>
                  <option value="18k">18 KT Jewellery</option>
                  <option value="22k">22 KT Jewellery</option>
                </select>
                {errors.collection_type ? <span className="text-xs text-red-600">{errors.collection_type.message}</span> : null}
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-zar-title">Category</span>
                <input className="form-input" {...register("category", { required: "Category is required" })} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-zar-title">Collection URL</span>
                <input className="form-input" {...register("collection_url")} />
              </label>
              <div className="block">
                <span className="mb-1 block text-sm font-semibold text-zar-title">Image</span>
                <Controller
                  control={control}
                  name="image"
                  rules={{ required: "Image is required" }}
                  render={({ field }) => (
                    <ImageUpload
                      onChange={field.onChange}
                      error={errors.image?.message}
                    />
                  )}
                />
              </div>
              <Button disabled={isSubmitting} type="submit">Save Category</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-bold text-zar-title">Collections Jewellery</h2></CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="admin-table w-full min-w-[620px] text-left">
                <thead><tr><th>Category</th><th>Type</th><th>URL</th></tr></thead>
                <tbody>
                  {items.length ? items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.category}</td>
                      <td>{item.collection_type?.toUpperCase()}</td>
                      <td className="text-zar-muted">{item.collection_url || "-"}</td>
                    </tr>
                  )) : <tr><td className="text-center text-zar-muted" colSpan={3}>No categories found.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
