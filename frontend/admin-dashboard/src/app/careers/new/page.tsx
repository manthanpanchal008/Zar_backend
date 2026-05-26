import { AdminLayout } from "@/components/layout/AdminLayout";
import { CareerForm } from "@/components/careers/CareerForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewCareerPage() {
  return (
    <AdminLayout title="Add Job Opening">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Job Opening Details</h2>
        </CardHeader>
        <CardBody>
          <CareerForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
