import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/users/UserForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function NewUserPage() {
  return (
    <AdminLayout title="Add User">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-zar-title">Create User Account</h2>
        </CardHeader>
        <CardBody>
          <UserForm />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
