"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Lock, Plus, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/use-templates";
import {
  BuiltInTemplatesDialog,
  TemplateCard,
} from "@/components/templates";
import type { Template } from "@/types/template";

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
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 mb-1">
                Templates
              </h1>
              <p className="text-sm text-gray-500">
                Reusable chapter structures to skip the blank-slate setup when
                creating a walkthrough.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/templates/new")}
            className="gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create template
          </Button>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 text-base">
              My templates
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
              {myTemplates.length}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : myTemplates.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl px-6 py-10 text-center">
              <Sparkles className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium mb-1">
                No personal templates yet
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Create one from scratch, or duplicate a built-in to start with
                an editable copy.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/templates/new")}
                  className="gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBuiltins(true)}
                  className="gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-gray-900 text-base">
                Built-in templates
              </h2>
              <Lock className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
              {builtinTemplates.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Provided by the system. Read-only — duplicate to create an editable
            copy.
          </p>

          <Button
            variant="primarySoft"
            size="none"
            onClick={() => setShowBuiltins(true)}
            disabled={isLoading || builtinTemplates.length === 0}
            className="w-full gap-2 py-4 rounded-xl border border-primary-soft text-sm font-medium"
          >
            <Lock className="w-4 h-4" />
            Browse {builtinTemplates.length} built-in template
            {builtinTemplates.length === 1 ? "" : "s"}
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
