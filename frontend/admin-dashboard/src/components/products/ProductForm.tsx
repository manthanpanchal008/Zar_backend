"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { Product } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

type ProductFormValues = {
  category_id: string;
  gold_type_id: string;
  making_type_id: string;
  sku: string;
  title: string;
  collection_name: string;
  short_description: string;
  number_of_pcs: string;
  display_finish: string;
  manufacturing_support: string;
  product_url: string;
  images: FileList;
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [goldTypes, setGoldTypes] = useState<any[]>([]);
  const [makingTypes, setMakingTypes] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [weightRows, setWeightRows] = useState<Array<{ label: string; value: string }>>(
    product?.weight_specifications || [{ label: "", value: "" }]
  );
  const [techRows, setTechRows] = useState<Array<{ feature: string; details: string }>>(
    product?.technical_specifications || [{ feature: "", details: "" }]
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    (product?.product_images || []).map((img) => img.replace("/uploads/products/", ""))
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      category_id: product?.category_id ? String(product.category_id) : "",
      gold_type_id: product?.gold_type_id ? String(product.gold_type_id) : "",
      making_type_id: product?.making_type_id ? String(product.making_type_id) : "",
      sku: product?.sku || "",
      title: product?.title || "",
      collection_name: product?.collection_name || "",
      short_description: product?.short_description || "",
      number_of_pcs: product?.number_of_pcs ? String(product.number_of_pcs) : "",
      display_finish: product?.display_finish || "",
      manufacturing_support: product?.manufacturing_support || "",
      product_url: product?.product_url || "",
    },
  });

  const categoryId = watch("category_id");
  const goldTypeId = watch("gold_type_id");
  const makingTypeId = watch("making_type_id");

  useEffect(() => {
    api.get("/api/admin/category-options").then((res) => setCategories(res.data.categories || []));
    api.get("/api/admin/gold-type-options").then((res) => setGoldTypes(res.data.items || []));
    api.get("/api/admin/making-type-options").then((res) => setMakingTypes(res.data.items || []));
  }, []);

  // Watch dropdown selections and auto-generate SKU
  useEffect(() => {
    if (categoryId && goldTypeId && makingTypeId) {
      const prodQuery = product ? `&product_id=${product.id}` : "";
      api.get(`/api/admin/products/generate-sku?category_id=${categoryId}&gold_type_id=${goldTypeId}&making_type_id=${makingTypeId}${prodQuery}`)
        .then((res) => {
          setValue("sku", res.data.sku || "");
        })
        .catch((err) => {
          console.error("Failed to generate SKU", err);
          setValue("sku", "");
        });
    } else {
      setValue("sku", "");
    }
  }, [categoryId, goldTypeId, makingTypeId, product, setValue]);

  const handleAddWeightRow = () => {
    setWeightRows((prev) => [...prev, { label: "", value: "" }]);
  };

  const handleRemoveWeightRow = (idx: number) => {
    setWeightRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleWeightRowChange = (idx: number, field: "label" | "value", val: string) => {
    setWeightRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );
  };

  const handleAddTechRow = () => {
    setTechRows((prev) => [...prev, { feature: "", details: "" }]);
  };

  const handleRemoveTechRow = (idx: number) => {
    setTechRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTechRowChange = (idx: number, field: "feature" | "details", val: string) => {
    setTechRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );
  };

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  async function onSubmit(values: ProductFormValues) {
    setError("");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "images") formData.append(key, (value as string) || "");
    });

    formData.append("existing_images", JSON.stringify(existingImages));

    // Append weight rows
    weightRows.forEach((row) => {
      formData.append("weight_label", row.label);
      formData.append("weight_value", row.value);
    });

    // Append technical specs
    techRows.forEach((row) => {
      formData.append("technical_feature", row.feature);
      formData.append("technical_detail", row.details);
    });

    // Append new uploaded files
    Array.from(values.images || []).forEach((file) => formData.append("images", file));

    try {
      if (product) {
        await api.put(`/api/admin/products/${product.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/admin/products", formData, uploadConfig());
      }
      router.push("/products");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save product.");
    }
  }

  return (
    <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</div> : null}

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Category *</span>
        <select className="form-input" {...register("category_id", { required: "Category is required" })}>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category_id ? <span className="text-xs text-red-600">{errors.category_id.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Gold Type *</span>
        <select className="form-input" {...register("gold_type_id", { required: "Gold Type is required" })}>
          <option value="">Select Gold Type</option>
          {goldTypes.map((gt) => (
            <option key={gt.id} value={gt.id}>{gt.name}</option>
          ))}
        </select>
        {errors.gold_type_id ? <span className="text-xs text-red-600">{errors.gold_type_id.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Making Type *</span>
        <select className="form-input" {...register("making_type_id", { required: "Making Type is required" })}>
          <option value="">Select Making Type</option>
          {makingTypes.map((mt) => (
            <option key={mt.id} value={mt.id}>{mt.name}</option>
          ))}
        </select>
        {errors.making_type_id ? <span className="text-xs text-red-600">{errors.making_type_id.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title font-bold text-[#c4a46e]">SKU (Auto Generated)</span>
        <input
          className="form-input bg-gray-50 border-[#eee7dd] text-zar-title font-semibold"
          placeholder="Select Category, Gold Type & Making Type..."
          readOnly
          {...register("sku")}
        />
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Product Title *</span>
        <input className="form-input" {...register("title", { required: "Product title is required" })} />
        {errors.title ? <span className="text-xs text-red-600">{errors.title.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Collection Name *</span>
        <input className="form-input" {...register("collection_name", { required: "Collection name is required" })} />
        {errors.collection_name ? <span className="text-xs text-red-600">{errors.collection_name.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Number of Pcs *</span>
        <input className="form-input" type="number" {...register("number_of_pcs", { required: "Number of Pcs is required" })} />
        {errors.number_of_pcs ? <span className="text-xs text-red-600">{errors.number_of_pcs.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Display Finish Summary</span>
        <input className="form-input" {...register("display_finish")} />
      </label>

      <div className="md:col-span-2">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Short Description</span>
        <Controller
          control={control}
          name="short_description"
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Short description of the product..."
            />
          )}
        />
      </div>

      {/* Dynamic Weight Rows */}
      <div className="md:col-span-2 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-zar-title">Weight Rows</span>
          <button type="button" onClick={handleAddWeightRow} className="rounded border border-zar-gold px-2.5 py-1 text-xs font-semibold text-black hover:bg-zar-bg transition">
            Add Weight Row
          </button>
        </div>
        <div className="space-y-2">
          {weightRows.map((row, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Label (e.g. Gross Weight)"
                className="form-input flex-1"
                value={row.label}
                onChange={(e) => handleWeightRowChange(idx, "label", e.target.value)}
              />
              <input
                type="text"
                placeholder="Value (e.g. 42.500 grams)"
                className="form-input flex-1"
                value={row.value}
                onChange={(e) => handleWeightRowChange(idx, "value", e.target.value)}
              />
              {weightRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveWeightRow(idx)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Spec Rows */}
      <div className="md:col-span-2 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-zar-title">Technical Specification</span>
          <button type="button" onClick={handleAddTechRow} className="rounded border border-zar-gold px-2.5 py-1 text-xs font-semibold text-black hover:bg-zar-bg transition">
            Add Spec Row
          </button>
        </div>
        <div className="space-y-2">
          {techRows.map((row, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Feature (e.g. Metal Purity)"
                className="form-input flex-1"
                value={row.feature}
                onChange={(e) => handleTechRowChange(idx, "feature", e.target.value)}
              />
              <input
                type="text"
                placeholder="Details (e.g. 22 KT)"
                className="form-input flex-1"
                value={row.details}
                onChange={(e) => handleTechRowChange(idx, "details", e.target.value)}
              />
              {techRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTechRow(idx)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <label className="md:col-span-2">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Manufacturing & Customization Support</span>
        <textarea className="form-input min-h-24" {...register("manufacturing_support")} />
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Product URL</span>
        <input className="form-input" {...register("product_url")} />
      </label>

      <label className="md:col-span-2 block">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Upload Product Images</span>
        <Controller
          control={control}
          name="images"
          rules={{ required: product ? false : "At least one product image is required" }}
          render={({ field }) => (
            <ImageUpload
              onChange={field.onChange}
              multiple
              error={errors.images?.message}
            />
          )}
        />
        <span className="text-xs text-zar-muted mt-1 block">You can select and upload multiple images at the same time.</span>
      </label>

      {existingImages.length > 0 && (
        <div className="md:col-span-2 space-y-2">
          <span className="block text-sm font-semibold text-zar-title">Existing Images</span>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((imgName, idx) => {
              const url = `${API_BASE_URL}/uploads/products/${imgName}`;
              return (
                <div key={imgName} className="relative group rounded-lg overflow-hidden border border-[#eee7dd] h-20 w-20">
                  <img src={url} alt="product" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 md:col-span-2 pt-2">
        <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Saving..." : "Save Product"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/products")}>Cancel</Button>
      </div>
    </form>
  );
}
