"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ViewModal } from "@/components/common/ViewModal";
import { API_BASE_URL, api } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { Product } from "@/types";

function imageSrc(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function ProductsPage() {
  const { user } = useAuthGuard();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/products");
      setProducts(response.data.items || []);
    } catch (_error) {
      setError("Unable to load products right now.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      await loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete product.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const columns = [
    {
      key: "product_images",
      label: "Image",
      render: (item: Product) => {
        const cover = item.product_images?.[0];
        return cover ? (
          <img alt={item.title} className="h-14 w-14 rounded-lg object-cover border border-[#eee7dd]" src={imageSrc(cover)} />
        ) : (
          <span className="text-zar-muted">-</span>
        );
      },
    },
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (item: Product) => <span className="font-mono text-xs font-semibold text-zar-title">{item.sku || "-"}</span>,
    },
    {
      key: "title",
      label: "Product Title",
      sortable: true,
      render: (item: Product) => <span className="font-semibold text-black">{item.title || "-"}</span>,
    },
    {
      key: "category_name",
      label: "Category",
      sortable: true,
      render: (item: Product) => <span>{item.category_name || "-"}</span>,
    },
    {
      key: "gold_type_name",
      label: "Gold Type",
      sortable: true,
      render: (item: Product) => <span>{item.gold_type_name || "-"}</span>,
    },
    {
      key: "collection_type_name",
      label: "Collection Type",
      sortable: true,
      render: (item: Product) => <span>{item.collection_type_name || "-"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Product) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedProduct(item)}>
            View
          </Button>
          {isAdmin && (
            <>
              <Link
                className="rounded-lg bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-black hover:bg-zar-gold transition"
                href={`/products/${item.id}/edit`}
              >
                Edit
              </Link>
              <Button variant="danger" className="px-3 py-2" onClick={() => deleteProduct(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Products">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Product Catalog</h2>
          {isAdmin && (
            <Link
              className="rounded-lg bg-zar-gold px-4 py-2 text-sm font-semibold text-black hover:bg-[#c4a46e] transition"
              href="/products/new"
            >
              Add Product
            </Link>
          )}
        </CardHeader>
        <CardBody>
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="text-center py-8 text-zar-muted">Loading products...</div>
          ) : (
            <DataTable
              columns={columns}
              data={products}
              searchKeys={["title", "category_name", "gold_type_name", "collection_type_name", "sku"]}
              searchPlaceholder="Search products"
              emptyMessage="No products found."
            />
          )}
        </CardBody>
      </Card>

      <ViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Product Title and SKU */}
            <div className="border-b border-[#eee7dd] pb-4">
              <h2 className="text-xl font-bold text-black">{selectedProduct.title}</h2>
              <p className="text-xs text-zar-muted font-mono mt-1">SKU: {selectedProduct.sku || "-"}</p>
            </div>

            {/* Images */}
            <div>
              <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">Product Images</h4>
              {selectedProduct.product_images && selectedProduct.product_images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedProduct.product_images.map((img, idx) => (
                    <a
                      key={idx}
                      href={imageSrc(img)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-lg border border-[#eee7dd] overflow-hidden bg-gray-50 flex items-center justify-center hover:opacity-90 transition"
                    >
                      <img
                        alt={`${selectedProduct.title} - ${idx + 1}`}
                        src={imageSrc(img)}
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zar-muted">No images uploaded.</p>
              )}
            </div>

            {/* Grid of basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#fdfcfa] p-4 rounded-xl border border-[#eee7dd]">
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Category</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedProduct.category_name || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Gold Type</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedProduct.gold_type_name || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Collection Type</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedProduct.collection_type_name || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Number of Pieces</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedProduct.number_of_pcs || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Display Finish</h4>
                <p className="mt-1 text-sm font-medium text-black">{selectedProduct.display_finish || "-"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Product URL</h4>
                {selectedProduct.product_url ? (
                  <a
                    href={selectedProduct.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm font-medium text-zar-gold hover:underline truncate"
                  >
                    View External Link
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-zar-muted">-</p>
                )}
              </div>
            </div>

            {/* Descriptions */}
            {selectedProduct.short_description && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Short Description</h4>
                <div
                  className="mt-1 text-sm text-black rich-editor-content prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.short_description }}
                />
              </div>
            )}

            {selectedProduct.manufacturing_support && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider">Manufacturing Support</h4>
                <div
                  className="mt-1 text-sm text-black rich-editor-content prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.manufacturing_support }}
                />
              </div>
            )}

            {/* Weight Specifications */}
            {selectedProduct.weight_specifications && selectedProduct.weight_specifications.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">Weight Specifications</h4>
                <div className="overflow-x-auto rounded-lg border border-[#eee7dd]">
                  <table className="min-w-full divide-y divide-[#eee7dd] text-left text-sm">
                    <thead className="bg-[#fdfcfa]">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-zar-title">Label</th>
                        <th className="px-4 py-2 font-semibold text-zar-title">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee7dd] bg-white">
                      {selectedProduct.weight_specifications.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 font-medium text-black">{spec.label}</td>
                          <td className="px-4 py-2 text-zar-muted">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            {selectedProduct.technical_specifications && selectedProduct.technical_specifications.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zar-muted uppercase tracking-wider mb-2">Technical Specifications</h4>
                <div className="overflow-x-auto rounded-lg border border-[#eee7dd]">
                  <table className="min-w-full divide-y divide-[#eee7dd] text-left text-sm">
                    <thead className="bg-[#fdfcfa]">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-zar-title">Feature</th>
                        <th className="px-4 py-2 font-semibold text-zar-title">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee7dd] bg-white">
                      {selectedProduct.technical_specifications.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 font-medium text-black">{spec.feature}</td>
                          <td className="px-4 py-2 text-zar-muted">{spec.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </AdminLayout>
  );
}
