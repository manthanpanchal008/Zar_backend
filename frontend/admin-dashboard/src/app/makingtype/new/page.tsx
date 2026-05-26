import { AdminLayout } from "@/components/layout/AdminLayout";
import { MakingTypeForm } from "@/components/makingtype/MakingTypeForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewMakingTypePage() {
  return (
    <AdminLayout title="Add Making Type">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Making Type Details</h2>
        </CardHeader>
        <CardBody>
          <MakingTypeForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
