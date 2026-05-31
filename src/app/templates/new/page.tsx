'use client';

import { DashboardLayout } from '@/components/layout';
import { TemplateForm } from '@/components/templates';

export default function NewTemplatePage() {
  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <TemplateForm mode="create" />
      </main>
    </DashboardLayout>
  );
}
