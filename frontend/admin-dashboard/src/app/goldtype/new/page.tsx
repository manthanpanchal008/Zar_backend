import { AdminLayout } from "@/components/layout/AdminLayout";
import { GoldTypeForm } from "@/components/goldtype/GoldTypeForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewGoldTypePage() {
  return (
    <AdminLayout title="Add Gold Type">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Gold Type Details</h2>
        </CardHeader>
        <CardBody>
          <GoldTypeForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
