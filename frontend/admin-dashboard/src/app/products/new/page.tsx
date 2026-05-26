import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function AddProductPage() {
  return (
    <AdminLayout title="Add Product">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Product Details</h2>
        </CardHeader>
        <CardBody>
          <ProductForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
