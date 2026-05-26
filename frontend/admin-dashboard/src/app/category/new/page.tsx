import { AdminLayout } from "@/components/layout/AdminLayout";
import { CategoryForm } from "@/components/category/CategoryForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewCategoryPage() {
  return (
    <AdminLayout title="Add Category">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Category Details</h2>
        </CardHeader>
        <CardBody>
          <CategoryForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
