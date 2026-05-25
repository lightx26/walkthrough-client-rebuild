"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, LayoutTemplate, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/use-templates";
import type { Template } from "@/types/template";
import { PrTypeBadge } from "@/components/templates/pr-type-badge";

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (template: Template) => void;
}

export function ApplyTemplateDialog({ open, onClose, onApply }: Props) {
  const { data, isLoading } = useTemplates();
  const [previewId, setPreviewId] = useState<string | null>(null);

  const myTemplates = useMemo(
    () => (data?.data.items ?? []).filter((t) => !t.isBuiltin),
    [data],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-12 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500 text-white flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-gray-900 text-base">
              Apply template
            </h2>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            className="text-muted-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            My templates
          </p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Loading templates…
              </p>
            ) : myTemplates.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                You don&apos;t have any templates yet.
              </p>
            ) : (
              myTemplates.map((tpl) => {
                const count = tpl.chapters?.length ?? 0;
                const isPreview = previewId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    className="border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                        <LayoutTemplate className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {tpl.name}
                          </p>
                          <PrTypeBadge prType={tpl.prType} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {count} {count === 1 ? "chapter" : "chapters"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="link"
                          size="none"
                          onClick={() => setPreviewId(isPreview ? null : tpl.id)}
                          className="gap-1 text-xs font-medium no-underline hover:no-underline"
                        >
                          {isPreview ? (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-3 h-3" />
                              Preview
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => onApply(tpl)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {tpl.chapters && tpl.chapters.length > 0 && (
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                          isPreview
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <ul className="px-3 pb-3 pl-14 space-y-1.5 border-t border-gray-100 pt-2">
                            {tpl.chapters.map((c, idx) => (
                              <li key={c.id} className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 text-[9px] font-bold flex items-center justify-center mt-0.5 shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-900">
                                    {c.title}
                                  </p>
                                  {c.description && (
                                    <p className="text-[11px] text-gray-500 mt-0.5">
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
