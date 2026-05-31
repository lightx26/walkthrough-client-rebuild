'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { Template } from '@/types/template';
import { LayoutTemplate, Lock, Plus, Sparkles } from 'lucide-react';

import { DashboardLayout } from '@/components/layout';
import { BuiltInTemplatesDialog, TemplateCard } from '@/components/templates';
import { Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useTemplates } from '@/hooks/use-templates';

export default function TemplatesPage() {
  const router = useRouter();
  const { data, isLoading } = useTemplates();
  const [showBuiltins, setShowBuiltins] = useState(false);

  const templates: Template[] = data?.data?.items ?? [];
  const { myTemplates, builtinTemplates } = useMemo(() => {
    const builtin: Template[] = [];
    const mine: Template[] = [];
    for (const t of templates) {
      if (t.isBuiltin) builtin.push(t);
      else mine.push(t);
    }
    return { myTemplates: mine, builtinTemplates: builtin };
  }, [templates]);

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h1 className="mb-1 text-[22px] font-bold text-gray-900">Templates</h1>
              <p className="text-sm text-gray-500">
                Reusable chapter structures to skip the blank-slate setup when creating a
                walkthrough.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/templates/new')}
            className="shrink-0 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Create template
          </Button>
        </div>

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">My templates</h2>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
              {myTemplates.length}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : myTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-violet-400" />
              <p className="mb-1 text-sm font-medium text-gray-600">No personal templates yet</p>
              <p className="mb-4 text-xs text-gray-400">
                Create one from scratch, or duplicate a built-in to start with an editable copy.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/templates/new')}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBuiltins(true)}
                  className="gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Browse built-in templates
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {myTemplates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-semibold text-gray-900">Built-in templates</h2>
              <Lock className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
              {builtinTemplates.length}
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-500">
            Provided by the system. Read-only — duplicate to create an editable copy.
          </p>

          <Button
            variant="primarySoft"
            size="none"
            onClick={() => setShowBuiltins(true)}
            disabled={isLoading || builtinTemplates.length === 0}
            className="border-primary-soft w-full gap-2 rounded-xl border py-4 text-sm font-medium"
          >
            <Lock className="h-4 w-4" />
            Browse built-in templates
          </Button>
        </section>

        <BuiltInTemplatesDialog
          open={showBuiltins}
          templates={builtinTemplates}
          onClose={() => setShowBuiltins(false)}
        />
      </main>
    </DashboardLayout>
  );
}
