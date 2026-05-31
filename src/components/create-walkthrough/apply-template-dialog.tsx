'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { Template } from '@/types/template';
import { ChevronDown, ChevronRight, LayoutTemplate, X } from 'lucide-react';

import { PrTypeBadge } from '@/components/templates/pr-type-badge';
import { Button } from '@/components/ui/button';

import { useTemplates } from '@/hooks/use-templates';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (template: Template) => void;
}

export function ApplyTemplateDialog({ open, onClose, onApply }: Props) {
  const { data, isLoading } = useTemplates();
  const [previewId, setPreviewId] = useState<string | null>(null);

  const myTemplates = useMemo(() => (data?.data.items ?? []).filter((t) => !t.isBuiltin), [data]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-12"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white">
              <LayoutTemplate className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Apply template</h2>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            className="text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 py-4">
          <p className="mb-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            My templates
          </p>

          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-gray-400">Loading templates…</p>
            ) : myTemplates.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                You don&apos;t have any templates yet.
              </p>
            ) : (
              myTemplates.map((tpl) => {
                const count = tpl.chapters?.length ?? 0;
                const isPreview = previewId === tpl.id;
                return (
                  <div key={tpl.id} className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                        <LayoutTemplate className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-gray-900">{tpl.name}</p>
                          <PrTypeBadge prType={tpl.prType} />
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {count} {count === 1 ? 'chapter' : 'chapters'}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          variant="link"
                          size="none"
                          onClick={() => setPreviewId(isPreview ? null : tpl.id)}
                          className="gap-1 text-xs font-medium no-underline hover:no-underline"
                        >
                          {isPreview ? (
                            <>
                              <ChevronDown className="h-3 w-3" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-3 w-3" />
                              Preview
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="xs" onClick={() => onApply(tpl)}>
                          Apply
                        </Button>
                      </div>
                    </div>

                    {tpl.chapters && tpl.chapters.length > 0 && (
                      <div
                        className={cn(
                          'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                          isPreview ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                      >
                        <div className="overflow-hidden">
                          <ul className="space-y-1.5 border-t border-gray-100 px-3 pt-2 pb-3 pl-14">
                            {tpl.chapters.map((c, idx) => (
                              <li key={c.id} className="flex items-start gap-2">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[9px] font-bold text-violet-600">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-900">{c.title}</p>
                                  {c.description && (
                                    <p className="mt-0.5 text-[11px] text-gray-500">
                                      {c.description}
                                    </p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
