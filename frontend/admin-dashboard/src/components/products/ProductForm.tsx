"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { Product } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

type ProductFormValues = {
  category_id: string;
  gold_type_id: string;
  collection_type_id: string;
  sku: string;
  title: string;
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
  const [collectionTypes, setCollectionTypes] = useState<any[]>([]);
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
      collection_type_id: product?.collection_type_id ? String(product.collection_type_id) : "",
      sku: product?.sku || "",
      title: product?.title || "",
      short_description: product?.short_description || "",
      number_of_pcs: product?.number_of_pcs ? String(product.number_of_pcs) : "",
      display_finish: product?.display_finish || "",
      manufacturing_support: product?.manufacturing_support || "",
      product_url: product?.product_url || "",
    },
  });

  const onInvalid = (formErrors: any) => {
    if (formErrors.gold_type_id) {
      toast.error("Please select Gold Type");
    } else if (formErrors.category_id) {
      toast.error("Please select Category");
    } else if (formErrors.collection_type_id) {
      toast.error("Please select Collection Type");
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const categoryId = watch("category_id");
  const goldTypeId = watch("gold_type_id");
  const collectionTypeId = watch("collection_type_id");

  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/gold-type-options"),
      api.get("/api/admin/category-options"),
      api.get("/api/admin/collection-type-options")
    ])
      .then(([goldRes, catRes, colRes]) => {
        setGoldTypes(goldRes.data.items || []);
        setCategories(catRes.data.categories || []);
        setCollectionTypes(colRes.data.items || []);
        setLoadingOptions(false);
      })
      .catch((err) => {
        console.error("Failed to load options", err);
        setLoadingOptions(false);
      });
  }, []);

  useEffect(() => {
    if (product && !loadingOptions) {
      setValue("gold_type_id", product.gold_type_id ? String(product.gold_type_id) : "");
      setValue("category_id", product.category_id ? String(product.category_id) : "");
      setValue("collection_type_id", product.collection_type_id ? String(product.collection_type_id) : "");
    }
  }, [product, loadingOptions, setValue]);

  const filteredCategories = categories.filter(
    (cat) => cat.gold_type_id === Number(goldTypeId)
  );

  const filteredCollectionTypes = collectionTypes.filter(
    (ct) => ct.gold_type_id === Number(goldTypeId) && ct.category_id === Number(categoryId)
  );

  // Auto-reset child selections on parent selection changes
  useEffect(() => {
    if (loadingOptions) return;
    if (goldTypeId) {
      const belongs = filteredCategories.some((cat) => String(cat.id) === categoryId);
      if (!belongs) {
        setValue("category_id", "");
        setValue("collection_type_id", "");
      }
    } else {
      setValue("category_id", "");
      setValue("collection_type_id", "");
    }
  }, [goldTypeId, filteredCategories, setValue, categoryId, loadingOptions]);

  useEffect(() => {
    if (loadingOptions) return;
    if (categoryId && goldTypeId) {
      const belongs = filteredCollectionTypes.some((ct) => String(ct.id) === collectionTypeId);
      if (!belongs) {
        setValue("collection_type_id", "");
      }
    } else {
      setValue("collection_type_id", "");
    }
  }, [categoryId, goldTypeId, filteredCollectionTypes, setValue, collectionTypeId, loadingOptions]);

  // Watch dropdown selections and auto-generate SKU
  useEffect(() => {
    if (categoryId && goldTypeId && collectionTypeId) {
      const prodQuery = product ? `&product_id=${product.id}` : "";
      api.get(`/api/admin/products/generate-sku?category_id=${categoryId}&gold_type_id=${goldTypeId}&collection_type_id=${collectionTypeId}${prodQuery}`)
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
  }, [categoryId, goldTypeId, collectionTypeId, product, setValue]);

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
          <select className="form-input" {...register("gold_type_id", { required: "Please select Gold Type" })}>
            <option value="">Select Gold Type</option>
            {goldTypes.map((gt) => (
              <option key={gt.id} value={gt.id}>{gt.name}</option>
            ))}
          </select>
          {errors.gold_type_id ? <span className="text-xs text-red-600">{errors.gold_type_id.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Category *</span>
          <select className="form-input" disabled={!goldTypeId} {...register("category_id", { required: "Please select Category" })}>
            <option value="">Select category</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id ? <span className="text-xs text-red-600">{errors.category_id.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Collection Type *</span>
          <select className="form-input" disabled={!categoryId} {...register("collection_type_id", { required: "Please select Collection Type" })}>
            <option value="">Select Collection Type</option>
            {filteredCollectionTypes.map((mt) => (
              <option key={mt.id} value={mt.id}>{mt.name}</option>
            ))}
          </select>
          {errors.collection_type_id ? <span className="text-xs text-red-600">{errors.collection_type_id.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title font-bold text-[#c4a46e]">SKU (Auto Generated)</span>
          <input
            className="form-input bg-gray-50 border-[#eee7dd] text-zar-title font-semibold"
            placeholder="Select Category, Gold Type & Collection Type..."
            readOnly
            {...register("sku")}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Product Title *</span>
          <input className="form-input" {...register("title", { required: "Product title is required" })} />
          {errors.title ? <span className="text-xs text-red-600">{errors.title.message}</span> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Number of Pcs *</span>
          <input className="form-input" type="number" {...register("number_of_pcs", { required: "Number of Pcs is required" })} />
          {errors.number_of_pcs ? <span className="text-xs text-red-600">{errors.number_of_pcs.message}</span> : null}
        </label>

        <label className="block md:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Display Finish Summary</span>
          <input className="form-input" {...register("display_finish")} />
        </label>

        <label className="block md:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Product URL</span>
          <input className="form-input" {...register("product_url")} />
        </label>

        <div className="md:col-span-2 block">
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
        <div className="md:col-span-2 space-y-3 block">
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
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-bold font-mono"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Spec Rows */}
        <div className="md:col-span-2 space-y-3 block">
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
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-bold font-mono"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 block">
          <span className="mb-1 block text-sm font-semibold text-zar-title">Manufacturing & Customization Support</span>
          <Controller
            control={control}
            name="manufacturing_support"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Details about manufacturing & customization support..."
              />
            )}
          />
        </div>

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
          <div className="md:col-span-2 space-y-2 block">
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
    </motion.div>
  );
}
