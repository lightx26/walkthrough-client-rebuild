"use client";

import { DashboardLayout } from "@/components/layout";
import { TemplateForm } from "@/components/templates";

export default function NewTemplatePage() {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto min-w-0">
        <TemplateForm mode="create" />
      </main>
    </DashboardLayout>
  );
}
