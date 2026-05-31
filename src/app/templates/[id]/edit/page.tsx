'use client';

import { use } from 'react';

import { DashboardLayout } from '@/components/layout';
import { TemplateForm } from '@/components/templates';
import { Skeleton } from '@/components/ui';

import { useTemplate } from '@/hooks/use-templates';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTemplatePage({ params }: PageProps) {
  const { id } = use(params);
  const { data, isLoading } = useTemplate(id);

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : data?.data ? (
          <TemplateForm mode="edit" initial={data.data} />
        ) : (
          <p className="py-12 text-center text-sm text-gray-500">Template not found.</p>
        )}
      </main>
    </DashboardLayout>
  );
}
