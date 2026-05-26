import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "@/components/products/ProductForm";
import { api } from "@/lib/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/api", () => ({
  api: {
    get: jest.fn((url: string) => {
      if (url.includes("category-options")) {
        return Promise.resolve({ data: { categories: [{ id: 10, name: "Bangles", slug: "bangles" }] } });
      }
      if (url.includes("gold-type-options")) {
        return Promise.resolve({ data: { items: [{ id: 20, name: "22K", purity: 91.6 }] } });
      }
      if (url.includes("making-type-options")) {
        return Promise.resolve({ data: { items: [{ id: 30, name: "Handmade" }] } });
      }
      if (url.includes("generate-sku")) {
        return Promise.resolve({ data: { sku: "BNG-22K-HM-001" } });
      }
      return Promise.resolve({ data: {} });
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    put: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
  uploadConfig: () => ({ headers: { "Content-Type": "multipart/form-data" } }),
}));

if (typeof window !== "undefined") {
  window.URL.createObjectURL = jest.fn(() => "mock-url");
  window.URL.revokeObjectURL = jest.fn();
}
if (typeof global !== "undefined") {
  (global as any).URL.createObjectURL = jest.fn(() => "mock-url");
  (global as any).URL.revokeObjectURL = jest.fn();
}

describe("Product form", () => {
  test("validates required fields", async () => {
    render(<ProductForm />);

    await userEvent.click(screen.getByRole("button", { name: /save product/i }));

    expect(await screen.findByText(/^category is required$/i)).toBeInTheDocument();
    expect(await screen.findByText(/product title is required/i)).toBeInTheDocument();
  });

  test("submits multipart product data", async () => {
    render(<ProductForm />);

    await waitFor(() => expect(screen.getByRole("option", { name: "Bangles" })).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByLabelText(/^category/i), "10");

    await waitFor(() => expect(screen.getByRole("option", { name: "22K" })).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByLabelText(/^gold type/i), "20");

    await waitFor(() => expect(screen.getByRole("option", { name: "Handmade" })).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByLabelText(/^making type/i), "30");

    await userEvent.type(screen.getByLabelText(/product title/i), "Gold Ring");
    await userEvent.type(screen.getByLabelText(/collection name/i), "Bridal");
    await userEvent.type(screen.getByLabelText(/number of pcs/i), "1");
    await userEvent.upload(screen.getByLabelText(/upload product images/i), new File(["image"], "ring.png", { type: "image/png" }));
    await userEvent.click(screen.getByRole("button", { name: /save product/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith("/api/admin/products", expect.any(FormData), expect.any(Object)));
  });
});
