import { AdminLayout } from "@/components/layout/AdminLayout";
import { EventForm } from "@/components/events/EventForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewEventPage() {
  return (
    <AdminLayout title="Add Event">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Exhibition / Show Details</h2>
        </CardHeader>
        <CardBody>
          <EventForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
