import { AdminLayout } from "@/components/layout/AdminLayout";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewTestimonialPage() {
  return (
    <AdminLayout title="Add Testimonial">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Testimonial Details</h2>
        </CardHeader>
        <CardBody>
          <TestimonialForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
