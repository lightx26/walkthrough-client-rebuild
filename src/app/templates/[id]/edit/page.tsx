"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui";
import { useTemplate } from "@/hooks/use-templates";
import { TemplateForm } from "@/components/templates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTemplatePage({ params }: PageProps) {
  const { id } = use(params);
  const { data, isLoading } = useTemplate(id);

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        {isLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : data?.data ? (
          <TemplateForm mode="edit" initial={data.data} />
        ) : (
          <p className="text-sm text-gray-500 text-center py-12">
            Template not found.
          </p>
        )}
      </main>
    </DashboardLayout>
  );
}
