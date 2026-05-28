"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { motion } from "framer-motion";

export default function InquiryPage() {
  return (
    <AdminLayout title="Inquiry">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <h2 className="font-bold text-zar-title">Inquiry</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-semibold text-black">Coming soon</p>
              <p className="text-sm text-zar-muted mt-2">Inquiry is currently under development.</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}
