import { AdminLayout } from "@/components/layout/AdminLayout";
import { CollectionTypeForm } from "@/components/collectiontype/CollectionTypeForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewCollectionTypePage() {
  return (
    <AdminLayout title="Add Collection Type">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Collection Type Details</h2>
        </CardHeader>
        <CardBody>
          <CollectionTypeForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
