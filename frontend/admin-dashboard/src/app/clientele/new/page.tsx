import { AdminLayout } from "@/components/layout/AdminLayout";
import { ClienteleForm } from "@/components/clientele/ClienteleForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewClientelePage() {
  return (
    <AdminLayout title="Add Clientele">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Clientele Details</h2>
        </CardHeader>
        <CardBody>
          <ClienteleForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
