import { AdminLayout } from "@/components/layout/AdminLayout";
import { ZarJourneyForm } from "@/components/zar-journey/ZarJourneyForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewZarJourneyPage() {
  return (
    <AdminLayout title="Add Journey Milestone">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Journey Milestone Details</h2>
        </CardHeader>
        <CardBody>
          <ZarJourneyForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
